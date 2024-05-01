import { EFFECT_TAG, ELEMENT_TYPE } from "./enum";
import createElement from "./createElement";

/**
 * @description create an element according the fiber tree
 * @param {*} fiber
 * @returns
 */
function createDom(fiber) {
  const dom =
    fiber.type === ELEMENT_TYPE.TEXT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

let wipRoot = null;
let wipFiber = null;
let hookIndex = null;
let currentRoot = null;
let nextUnitOfWork = null;
let deletions = [];

//判断是否是事件, 事件属性key均为 on 开头
const isEvent = (key) => key.startsWith("on");
// 判断是否是属性
const isProperty = (key) => key !== "children" && !isEvent(key);
// 判断是否是新的属性
const isNew = (prev, next) => {
  return (key) => prev[key] !== next[key];
};
// 判断是否是旧的属性
const isGone = (prev, next) => {
  return (key) => !(key in next);
};

/**
 * @description 更新传入的dom, 用新props替换旧props
 * @param {*} dom 需要更新的dom节点
 * @param {*} prevProps // 旧props
 * @param {*} nextProps // 新props
 */
function updateDom(dom, prevProps, nextProps) {
  // 移除 新props不包含的事件 和 其对应回调函数引用不同的事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除 新props中不包含的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => (dom[name] = "")); // TODO: 使用delete

  // 绑定新props的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => (dom[name] = nextProps[name]));

  // 绑定新事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

/**
 * @description
 */
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

/**
 * @description
 * @param {*} fiber
 * @returns
 */
function commitWork(fiber) {
  if (!fiber) return;

  // find the parent of a DOM node
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) domParentFiber = domParentFiber.parent;

  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) domParent.removeChild(fiber.dom);
  else commitDeletion(fiber.child, domParent);
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: { children: [element] },
    alternate: currentRoot,
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
}

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // commit the fiber root to the DOM after all unit of work are cleared
  if (!nextUnitOfWork && wipRoot) commitRoot();

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

/**
 * 在fiber树的某个节点时, 遍历的顺序是 child > sibling > parent
 */
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // search the next unit of work
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }
}

export function useState(initial) {
  // TODO: option chaining
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    // assign value or call a callback
    if (action instanceof Function) hook.state = action(hook.state);
    else hook.state = action;
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };

    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

/**
 * @description 更新函数组件
 * @param {} fiber
 */
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

/**
 * @description 更新类组件
 * @param {*} fiber
 */
function updateHostComponent(fiber) {
  if (!fiber.dom) fiber.dom = createDom(fiber);
  reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(wipFiber, elements) {
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  // 这里的oldFiber不能使用!==
  for (let index = 0; index < elements.length || oldFiber != null; ++index) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    /**
     * 更新dom节点, 如果新旧节点类型相同, 只需要更新其props即可
     */
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: EFFECT_TAG.UPDATE,
      };
    }

    /**
     * add the node.
     * if the type is different and there is a new element,
     * it means we need to create a new DOM node
     */
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: EFFECT_TAG.PLACEMENT,
      };
    }
    /**
     * delete the node.
     * if the types are different and there is an old fiber,
     * we need to remove the old node
     */
    if (oldFiber && !sameType) {
      oldFiber.effectTag = EFFECT_TAG.DELETION;
      deletions.push(oldFiber);
    }

    if (oldFiber) oldFiber = oldFiber.sibling;

    if (index === 0) wipFiber.child = newFiber;
    else if (element) prevSibling.sibling = newFiber;

    prevSibling = newFiber;
  }
}

const Ling = {
  createElement,
  render,
  useState,
};

export default Ling;

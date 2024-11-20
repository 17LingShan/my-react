import { updateDom } from ".";
import { commitDeletion } from "./commitDeletion";

/**
 * @description
 * @param {*} fiber
 * @returns
 */
export function commitWork(fiber) {
  if (!fiber) return;

  // 找到最近的具有真实dom的节点
  // why? 因为并非每一个节点都与真实dom相关联，如Fragment是不会产生真实dom
  // 还有如Context等逻辑组件也不会产生真实的dom
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

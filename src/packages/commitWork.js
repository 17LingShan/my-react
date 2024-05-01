import { updateDom } from ".";
import { commitDeletion } from "./commitDeletion";

/**
 * @description
 * @param {*} fiber
 * @returns
 */
export function commitWork(fiber) {
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

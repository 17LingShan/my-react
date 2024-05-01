export function commitDeletion(fiber, domParent) {
  if (fiber.dom) domParent.removeChild(fiber.dom);
  else commitDeletion(fiber.child, domParent);
}

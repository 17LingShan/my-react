import "./index.css";
import Ling, { createElement } from "./packages/Ling";

const root = document.getElementById("root");

const element = createElement(
  "div",
  null,
  "div",
  createElement("img", {
    style: "width:300px;height:300px;",
    src: "https://cdn.pixabay.com/photo/2023/04/19/03/58/flower-7936549_1280.png",
    alt: "img",
  }),
  createElement("h1", { style: "color:red" }, "red color h1")
);

Ling.render(element, root);

import "@/index.css";
import Ling, { createElement } from "@/packages/Ling";

const container = document.getElementById("root");

// const element = createElement(
//   "div",
//   null,
//   "div",
//   createElement("img", {
//     style: "width:300px;height:300px;",
//     src: "https://cdn.pixabay.com/photo/2023/04/19/03/58/flower-7936549_1280.png",
//     alt: "img",
//   }),
//   createElement("h1", { style: "color:red" }, "red color h1")
// );

const updateValue = (e) => {
  rerender(e.target.value);
};

const rerender = (value) => {
  const element = createElement(
    "div",
    null,
    createElement("input", { onInput: updateValue, value: value }),
    createElement("h2", null, `Hello ${value}`)
  );

  Ling.render(element, container);
};

rerender("hello");

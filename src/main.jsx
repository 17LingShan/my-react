import "@/index.css";
import Ling from "@/packages/Ling";

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
  /** @jsx Ling.createElement */
  const element = (
    <div>
      <input value={value} onInput={updateValue} />
      <h2>hello {value}</h2>
    </div>
  );

  Ling.render(element, container);
};

rerender("hello");

import "@/index.css";
import Ling from "@/packages";
import Counter from "./Counter";

const container = document.getElementById("root");
const element = <Counter />;
Ling.render(element, container);

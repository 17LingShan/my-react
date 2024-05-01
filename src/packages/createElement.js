import { ELEMENT_TYPE } from "./enum";

/**
 *
 * @param {string} type  a type of the Element
 * @param {Object} props  all properties of the Element
 * @param  {...any} children the children of the Element
 * @returns
 */
export default function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

/**
 * @description create an element which only has text
 * @param {string} text the text of the ELement
 * @returns
 */
function createTextElement(text) {
  return {
    type: ELEMENT_TYPE.TEXT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

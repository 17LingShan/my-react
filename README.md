# my-react

## introduction

This project shows how to <a href="[text](https://pomb.us/build-your-own-react/)">`build your own React`</a>.

## how to use jsx factory in your vanilla project using Vite

Vite uses esbuild to transforms `JSX` to `JS` and compiles code with `Rollup`.

To configure esbuild for JSX transpilation, edit your `Vite.config.js` file.

If you want to implicit inject your some packages into your `JSX` files, you could use the `jsxInject` option.

## fiber tree

A node of fiber tree has the attributes:

- type: A string that specifies the type of dom node we want to create, it's `tagName` you pass to `document.createElement` when you want to create a HTML element.
- props: An object, it has all the keys and values from the JSX attributes. It also has a special property: `children`.
- dom: The real HTML element of this fiber node. Because some fiber node doesn't need a real HTML element, such as `Fragment` and logical component like `Context` and others.
- parent: The parent node of this fiber.
- sibling: The sibling node of this fiber.
- alternate: This property is a link to old fiber, the fiber that we committed to the DOM in previous phase.
- effectTag: specify the type of handling node during phase. It has three type: `UPDATE`, `PLACEMENT` and `DELETION`.

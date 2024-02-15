import "@/index.css";

const container = document.getElementById("root");

const updateValue = (e) => {
  rerender(e.target.value);
};

const rerender = (value) => {
  const element = (
    <div>
      <input type="text" value={value} onInput={updateValue} />
      <h2>hello {value}</h2>
    </div>
  );

  Ling.render(element, container);
};

rerender("react");

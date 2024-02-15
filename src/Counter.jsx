import Ling from "@/packages";

export default function Counter() {
  const [count, setCount] = Ling.useState(0);

  return (
    <div>
      <h1>number: {count}</h1>
      {/* <button onClick={() => setCount(count +1)}>increment</button> */}
      <button onClick={() => setCount((prev) => prev + 1)}>increment</button>
    </div>
  );
}

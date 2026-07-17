/* @refresh reload */

import "./main.css";

import { createSignal } from "solid-js";
import { render } from "solid-js/web";

function App() {
  const [count, setCount] = createSignal(0);
  const _x = 1;

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank"></a>
        <a href="https://solidjs.com" target="_blank"></a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count()}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">Click on the Vite and Solid logos to learn more</p>
    </>
  );
}

render(() => <App />, document.getElementById("root")!);

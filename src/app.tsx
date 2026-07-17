/* @refresh reload */

import "./app.css";

import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { pokemons } from "./models/pokemon/list";
import { strictness } from "./models/strictness";

function App() {
  const [count, setCount] = createSignal(0);

  strictness.subscribe();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank"></a>
        <a href="https://solidjs.com" target="_blank"></a>
      </div>
      <h1>{strictness.name}</h1>
      <button onClick={() => (strictness.key = "easygoing")}>x</button>
      <div>{pokemons.all.length}</div>
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

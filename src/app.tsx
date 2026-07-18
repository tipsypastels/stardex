/* @refresh reload */

import "./app.css";

import { render } from "solid-js/web";
import { Layout } from "./components/layout";
import { pokedexMode } from "./models/pokedex/mode";
import { strictness } from "./models/strictness";
import { dark } from "./models/ui/dark";
import { toasts } from "./models/ui/toast";

function App() {
  strictness.subscribe();
  pokedexMode.subscribe();
  dark.subscribe();

  return (
    <Layout>
      <button onClick={() => toasts.add("star", crypto.randomUUID())}>star</button>
    </Layout>
  );
}

render(() => <App />, document.getElementById("root")!);

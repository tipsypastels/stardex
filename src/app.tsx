/* @refresh reload */

import "./app.css";

import { render } from "solid-js/web";
import { Layout } from "./components/layout";
import { dark } from "./models/dark";
import { strictness } from "./models/strictness";

function App() {
  strictness.subscribe();

  dark.subscribe();

  return <Layout>hi</Layout>;
}

render(() => <App />, document.getElementById("root")!);

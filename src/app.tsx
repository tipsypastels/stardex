import "./app.css";

import { render } from "preact";
import { Layout } from "./components/layout/Layout";
import { Models } from "./state/context";

export function App() {
  return (
    <>
      <Models>
        <Layout />
      </Models>
    </>
  );
}

render(<App />, document.getElementById("app")!);

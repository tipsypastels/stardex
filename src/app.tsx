import "./app.scss";

import { render } from "preact";
import { Models } from "./state/context";

export function App() {
  return (
    <>
      <Models>hiii</Models>
    </>
  );
}

render(<App />, document.getElementById("app")!);

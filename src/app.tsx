import "drag-drop-touch";
import "./app.css";

import { render } from "preact";
import { Layout } from "./components/layout";
import { Pokedex } from "./components/pokemon/pokedex";
import { Recommendations } from "./components/recommendations";
import { Toast } from "./components/toast";
import { Types } from "./components/types";
import { TypeSuggestions } from "./components/types/util/suggestions";
import { Models } from "./state/context";
import { useDarkClass } from "./state/dark";

export function App() {
  useDarkClass();

  return (
    <>
      <TypeSuggestions />
      <Models>
        <Layout>
          <Toast />

          <Pokedex />
          <Types />
          <Recommendations />
        </Layout>
      </Models>
    </>
  );
}

render(<App />, document.getElementById("app")!);

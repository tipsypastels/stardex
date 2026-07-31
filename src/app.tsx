/* @refresh reload */

import "./app.css";

import { render } from "solid-js/web";
import { CatchStartupError } from "./components/error/startup";
import { Export } from "./components/export";
import { Layout } from "./components/layout";
import { Pokedex } from "./components/pokedex";
import { Recommendations } from "./components/recommendations";
import { Types } from "./components/types";
import { TypeSuggestions } from "./components/types/util/suggestions";

function App() {
  return (
    <CatchStartupError>
      <Layout>
        <TypeSuggestions />

        <Pokedex />
        <Types />
        <Recommendations />
        <Export />
      </Layout>
    </CatchStartupError>
  );
}

render(() => <App />, document.getElementById("root")!);

/* @refresh reload */

import "./app.css";

import { render } from "solid-js/web";
import { CatchValidationError } from "./components/error/validation";
import { Export } from "./components/export";
import { Layout } from "./components/layout";
import { Pokedex } from "./components/pokedex";
import { Recommendations } from "./components/recommendations";
import { Types } from "./components/types";
import { TypeSuggestions } from "./components/types/util/suggestions";

function App() {
  return (
    <CatchValidationError>
      <Layout>
        <TypeSuggestions />

        <Pokedex />
        <Types />
        <Recommendations />
        <Export />
      </Layout>
    </CatchValidationError>
  );
}

render(() => <App />, document.getElementById("root")!);

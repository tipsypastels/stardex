/* @refresh reload */

import "./app.css";

import { render } from "solid-js/web";
import { CatchValidationError } from "./components/error/validation";
import { Export } from "./components/export";
import { Layout } from "./components/layout";
import { Pokedex } from "./components/pokedex";
import { Recommendations } from "./components/recommendations";
import { Types } from "./components/types";

function App() {
  return (
    <CatchValidationError>
      <Layout>
        <Pokedex />
        <Types />
        <Recommendations />
        <Export />
      </Layout>
    </CatchValidationError>
  );
}

render(() => <App />, document.getElementById("root")!);

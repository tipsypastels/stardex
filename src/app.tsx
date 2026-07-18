/* @refresh reload */

import "./app.css";

import { render } from "solid-js/web";
import { Layout } from "./components/layout";
import { Recommendations } from "./components/recommendations";
import { Types } from "./components/types";

function App() {
  return (
    <Layout>
      <Types />
      <Recommendations />
    </Layout>
  );
}

render(() => <App />, document.getElementById("root")!);

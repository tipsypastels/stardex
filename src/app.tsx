/* @refresh reload */

import "./app.css";

import { render } from "solid-js/web";
import { Layout } from "./components/layout";
import { Types } from "./components/types";

function App() {
  return (
    <Layout>
      <Types />
    </Layout>
  );
}

render(() => <App />, document.getElementById("root")!);

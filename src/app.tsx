import "./app.css";

import { render } from "preact";
import { Layout } from "./components/layout/Layout";
import { SectionHeading } from "./components/layout/SectionHeading";
import { Models } from "./state/context";

export function App() {
  return (
    <>
      <Models>
        <Layout
          left={
            <>
              <SectionHeading title="Pokédex" />
            </>
          }
          right={
            <>
              <SectionHeading title="Types" />
              <SectionHeading title="Recommendations" />
            </>
          }
        />
      </Models>
    </>
  );
}

render(<App />, document.getElementById("app")!);

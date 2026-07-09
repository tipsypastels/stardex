import "./app.css";

import { render } from "preact";
import { Layout } from "./components/layout";
import { Section } from "./components/layout/section";
import { Pokedex } from "./components/pokemon/pokedex";
import { Recommendations } from "./components/recommendations";
import { Types } from "./components/types";
import { TypeSuggestions } from "./components/types/util/suggestions";
import { Models } from "./state/context";
import { dark, useDarkClass } from "./state/dark";

export function App() {
  useDarkClass();

  return (
    <>
      <TypeSuggestions />
      <Models>
        <Layout>
          <Pokedex />
          <Types />
          <Recommendations />
          <Section id="dark" title="dark">
            <button class="dark:text-red-500" onClick={() => (dark.value = !dark.value)}>
              toggle
            </button>
          </Section>
        </Layout>
      </Models>
    </>
  );
}

render(<App />, document.getElementById("app")!);

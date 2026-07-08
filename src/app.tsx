import "./app.css";

import { Show } from "@preact/signals/utils";
import { render } from "preact";
import { useContext } from "preact/hooks";
import { Empty } from "./components/common/empty";
import { Layout } from "./components/layout";
import { Section } from "./components/layout/section";
import { Pokedex } from "./components/pokemon/pokedex";
import { Recommendations } from "./components/pokemon/recommendations";
import { TypePieChart } from "./components/pokemon/type_pie_chart";
import { MetricsContext, Models } from "./state/context";
import { dark, useDarkClass } from "./state/dark";

export function App() {
  useDarkClass();

  return (
    <>
      <Models>
        <Layout>
          <AppInner />
        </Layout>
      </Models>
    </>
  );
}

function AppInner() {
  const metrics = useContext(MetricsContext);

  return (
    <>
      <Section id="pokedex" title="Pokédex" hasActions>
        <Pokedex />
      </Section>
      <Section id="types" title="Types">
        <Show
          when={() => metrics.pokemonsAllotment.value.total > 0}
          fallback={<Empty>You have no Pokémon yet.</Empty>}
        >
          <TypePieChart allotment={metrics.pokemonsAllotment.value} />
        </Show>
      </Section>
      <Section id="recommendations" title="Recommendations" hasActions>
        <Recommendations />
      </Section>
      <Section id="dark" title="dark">
        <button class="dark:text-red-500" onClick={() => (dark.value = !dark.value)}>
          toggle
        </button>
      </Section>
    </>
  );
}

render(<App />, document.getElementById("app")!);

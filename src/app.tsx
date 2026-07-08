import "./app.css";

import { render } from "preact";
import { useContext } from "preact/hooks";
import { Layout } from "./components/layout";
import { Section } from "./components/layout/section";
import { Pokedex } from "./components/pokemon/pokedex";
import { Recommendations } from "./components/pokemon/recommendations";
import { TypePieChart } from "./components/pokemon/type_pie_chart";
import { MetricsContext, Models } from "./state/context";

export function App() {
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
      <Section id="pokedex" title="Pokédex" left>
        <Pokedex />
      </Section>
      <Section id="types" title="Types">
        <TypePieChart allotment={metrics.pokemonsAllotment.value} />
      </Section>
      <Section id="recommendations" title="Recommendations">
        <Recommendations />
      </Section>
    </>
  );
}

render(<App />, document.getElementById("app")!);

import "./app.css";

import { render } from "preact";
import { useContext } from "preact/hooks";
import { Layout } from "./components/layout";
import { Section } from "./components/layout/section";
import { Recommendations } from "./components/pokemon/recommendations";
import { TypePieChart } from "./components/pokemon/type_pie_chart";
import { MetricsContext, Models } from "./state/context";

export function App() {
  return (
    <>
      <Models>
        <Layout left={<Left />} right={<Right />} />
      </Models>
    </>
  );
}

function Left() {
  return (
    <>
      <Section title="Pokédex" left>
        hi
      </Section>
    </>
  );
}

function Right() {
  const metrics = useContext(MetricsContext);

  return (
    <>
      <Section title="Types">
        <TypePieChart allotment={metrics.pokemonsAllotment.value} />
      </Section>
      <Section title="Recommendations">
        <Recommendations />
      </Section>
    </>
  );
}

render(<App />, document.getElementById("app")!);

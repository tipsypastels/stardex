import "./app.css";

import { render } from "preact";
import { useContext } from "preact/hooks";
import { Layout } from "./components/layout/layout";
import { SectionHeading } from "./components/layout/section_heading";
import { TypePieChart } from "./components/pokemon/util/type_pie_chart";
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
      <section>
        <SectionHeading title="Pokédex" />
      </section>
    </>
  );
}

function Right() {
  const metrics = useContext(MetricsContext);

  return (
    <>
      <section>
        <SectionHeading title="Types" />
        <TypePieChart allotment={metrics.pokemonsAllotment.value} />
      </section>
      <section>
        <SectionHeading title="Recommendations" />
      </section>
    </>
  );
}

render(<App />, document.getElementById("app")!);

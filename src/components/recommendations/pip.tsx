import { createSignal, onMount } from "solid-js";
import type { Recommendation } from "../../metrics/recommendations";
import { recommendations } from "../../models/metrics";

export interface PipRecommendationsProps {
  pip: ReturnType<typeof createPipRecommendations>;
}

export function PipRecommendations(props: PipRecommendationsProps) {
  onMount(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => props.pip.finishIn()));
  });

  function tr(recommendations: Recommendation[], title: string) {
    return (
      <tr>
        <td>{title}</td>
        <td>{recommendations.length}</td>
      </tr>
    );
  }

  return (
    <div
      class="fixed right-8 bottom-8 z-40 transform rounded-lg border-2 border-divider-heavy bg-background shadow-shadow transition-all duration-300"
      classList={{
        "translate-x-0 scale-100 opacity-100 ease-out": props.pip.in,
        "translate-x-12 scale-95 opacity-0 ease-in": !props.pip.in,
      }}
    >
      <table>
        <tbody>
          {tr(recommendations.value.remove, "Too Many")}
          {tr(recommendations.value.add, "Too Few")}
          {tr(recommendations.value.none, "Just Right")}
        </tbody>
      </table>
    </div>
  );
}

export function createPipRecommendations() {
  const [state, setState] = createSignal<"in" | "in:anim" | "out" | "out:anim">("out");

  return {
    get in() {
      return state() === "in";
    },

    get inOrAnimating() {
      return state() !== "out";
    },

    finishIn() {
      setState("in");
    },

    open() {
      setState("in:anim");
    },

    close() {
      setState("out:anim");
      setTimeout(() => setState("out"), 300);
    },

    toggle() {
      if (state().startsWith("in")) {
        this.close();
      } else {
        this.open();
      }
    },
  };
}

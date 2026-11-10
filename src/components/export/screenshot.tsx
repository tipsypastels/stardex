import domToImage from "dom-to-image-more";
import { batch } from "solid-js";
import { getRecommendationsByType } from "../../metrics/recommendations";
import { pokemonsAllotment, recommendations } from "../../models/metrics";
import { pokemons } from "../../models/pokemon/list";
import { projects } from "../../models/project/list";
import { strictness } from "../../models/strictness";
import type { Type } from "../../models/type";
import { toasts } from "../../models/ui/toast";
import { tw } from "../../utils/string";
import { Button } from "../common/button";
import { Icon } from "../common/icon";
import { Modal } from "../common/menus/modal";
import { TypePieChart } from "../types/util/pie_chart";

export interface ExportScreenshotModalProps {
  onClose(): void;
}

export function ExportScreenshotModal(props: ExportScreenshotModalProps) {
  let inner: HTMLDivElement | undefined;

  async function make(toastIcon: string, toastText: string, f: (dataUrl: string) => Promise<void>) {
    if (!inner) return;

    const dataUrl = await domToImage.toPng(inner, {
      bgcolor: "var(--background)",
      ignoreCSSRuleErrors: true,
      onclone(node) {
        if (!(node instanceof HTMLElement) || !("screenshotOuter" in node.dataset)) return;
        node.classList.add(tw`border-2`, tw`border-divider-heavy`, tw`bg-red-500`);
      },
      style: {
        borderWidth: "2px",
        borderColor: "var(--primary)",
        borderRadius: "var(--radius-lg)",
      },
    });
    await f(dataUrl);

    batch(() => {
      toasts.add(toastIcon, toastText);
      props.onClose();
    });
  }

  function save() {
    return make("save", "Screenshot saved!", (dataUrl) => {
      let onclick: () => void = () => {};

      const a = document.createElement("a");
      const promise = new Promise<void>((ok) => (onclick = ok));

      a.href = dataUrl;
      a.download = `Stardex ${projects.active.name}.png`;
      a.onclick = onclick;
      a.click();

      return promise.then(() => {
        a.remove();
      });
    });
  }

  function copy() {
    make("copy", "Screenshot copied!", async (dataUrl) => {
      const blob = await fetch(dataUrl).then((res) => res.blob());
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    });
  }

  return (
    <Modal
      title="Export Screenshot"
      onClose={() => props.onClose()}
      footer={
        <>
          <div class="flex flex-col justify-center gap-2">
            <Button onClick={save}>Save Image</Button>
            <Button onClick={copy}>Copy to Clipboard</Button>
          </div>
        </>
      }
    >
      <div class="flex overflow-x-scroll border-2 border-divider-heavy select-none">
        <div class="flex grow flex-col gap-4 p-4 pt-8" ref={inner} data-screenshot-outer>
          <ScreenshotTypePieChart />
          <div class="text-center text-sm">
            <div class="text-secondary">
              <strong>{projects.active.name}</strong>
              &nbsp;/&nbsp;
              <strong>{pokemons.all.length}</strong> Pokémon &nbsp;/&nbsp;
              <strong>{strictness.name}</strong> Strictness
            </div>
            <div class="text-primary">tipsypastels.github.io/stardex</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ScreenshotTypePieChart() {
  const recommendationsByType = () => getRecommendationsByType(recommendations.value);

  function recommendationIcon(type: Type) {
    const recommendation = recommendationsByType()[type.key];
    switch (recommendation?.change) {
      case "remove": {
        return <Icon name="square-minus" />;
      }
      case "add": {
        return <Icon name="square-plus" />;
      }
      default: {
        return null;
      }
    }
  }

  return (
    <TypePieChart
      allotment={pokemonsAllotment.value}
      diameter={200}
      class="flex-row"
      olClass="grid grid-flow-col grid-rows-8 gap-x-4 gap-y-1 text-sm whitespace-nowrap"
      renderLiExtra={(alloted) => recommendationIcon(alloted.type)}
    />
  );
}

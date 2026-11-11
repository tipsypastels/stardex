import { domToBlob, type Options as ScreenshotOptions } from "modern-screenshot";
import { batch, onMount } from "solid-js";
import { getRecommendationsByType } from "../../metrics/recommendations";
import { pokemonsAllotment, recommendations } from "../../models/metrics";
import { pokemons } from "../../models/pokemon/list";
import { projects } from "../../models/project/list";
import { strictness } from "../../models/strictness";
import type { Type } from "../../models/type";
import { toasts } from "../../models/ui/toast";
import { Button } from "../common/button";
import { Icon } from "../common/icon";
import { Modal } from "../common/menus/modal";
import { TypePieChart } from "../types/util/pie_chart";

export interface ExportScreenshotModalProps {
  onClose(): void;
}

export function ExportScreenshotModal(props: ExportScreenshotModalProps) {
  let inner: HTMLDivElement | undefined;
  let blobPromise: Promise<Blob> | undefined;

  onMount(() => {
    if (!inner) return;
    setTimeout(() => {
      blobPromise = (async () => {
        await document.fonts.ready;

        const { width, height } = inner.getBoundingClientRect();
        const options: ScreenshotOptions = {
          width,
          height,
          scale: 2,
          backgroundColor: "var(--background)",
          onCloneNode(node) {
            if (!(node instanceof HTMLElement)) return;
            node.style.boxSizing = "border-box";
          },
        };

        // Dummy run to ensure fonts load properly.
        await domToBlob(inner, options);

        return await domToBlob(inner, options);
      })();
    }, 200);
  });

  async function save() {
    if (!blobPromise) return;
    const blob = await blobPromise;

    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = objectUrl;
    a.download = `Stardex ${projects.active.name}.png`;
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);

    batch(() => {
      toasts.add("save", "Screenshot saved!");
      props.onClose();
    });
  }

  async function copy() {
    if (!blobPromise) return;
    const blob = await blobPromise;

    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);

    batch(() => {
      toasts.add("copy", "Screenshot copied!");
      props.onClose();
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
        <div class="flex grow flex-col gap-4 p-4 pt-8" ref={inner}>
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

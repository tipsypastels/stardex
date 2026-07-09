import hotkeys from "hotkeys-js";
import { useEffect } from "preact/hooks";
import { HotkeyHint } from "../common/hotkey_hint";

export function Toc() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const KEY_POKEDEX = "1";
  const KEY_TYPES = "2";
  const KEY_RECOMMENDATIONS = "3";

  const scrollToPokedex = () => scrollTo("pokedex");
  const scrollToTypes = () => scrollTo("types");
  const scrollToRecommendations = () => scrollTo("recommendations");

  useEffect(() => {
    hotkeys(KEY_POKEDEX, scrollToPokedex);
    hotkeys(KEY_TYPES, scrollToTypes);
    hotkeys(KEY_RECOMMENDATIONS, scrollToRecommendations);

    return () => {
      hotkeys.unbind(KEY_POKEDEX, scrollToPokedex);
      hotkeys.unbind(KEY_TYPES, scrollToTypes);
      hotkeys.unbind(KEY_RECOMMENDATIONS, scrollToRecommendations);
    };
  });

  return (
    <nav class="border-divider-light mb-8 hidden border-y-2 lg:block">
      <ul class="grid grid-cols-[1fr] gap-4 py-2 md:grid-cols-3">
        <li class="text-center">
          <button class="cursor-pointer" onClick={scrollToPokedex}>
            Pokédex
            <HotkeyHint
              hotkey={KEY_POKEDEX}
              title={`Press ${KEY_POKEDEX} to jump to the Pokédex.`}
            />
          </button>
        </li>
        <li class="text-center">
          <button class="cursor-pointer" onClick={scrollToTypes}>
            Types
            <HotkeyHint
              hotkey={KEY_TYPES}
              title={`Press ${KEY_TYPES} to jump to the type chart.`}
            />
          </button>
        </li>
        <li class="text-center">
          <button class="cursor-pointer" onClick={scrollToRecommendations}>
            Recommendations
            <HotkeyHint
              hotkey={KEY_RECOMMENDATIONS}
              title={`Press ${KEY_RECOMMENDATIONS} to jump to the recommendations.`}
            />
          </button>
        </li>
      </ul>
    </nav>
  );
}

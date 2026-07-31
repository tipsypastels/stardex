import { Show } from "solid-js";
import { pokedexMode } from "../../../models/pokedex/mode";
import { pokemons } from "../../../models/pokemon/list";
import { Icon } from "../../common/icon";

export function PokedexEmptyTutorial() {
  return (
    <ul class="ml-4 list-disc">
      <Show
        when={pokedexMode.key === "text"}
        fallback={
          <>
            <li>Enter a Pokémon's name above to add it to your dex.</li>
            <li>Click on a Pokémon you've added to change its type, form, or settings.</li>
            <li>Drag and drop Pokémon you've added to reorder them.</li>
            <li>You'll be given recommendations and statistics based on your Pokédex.</li>
            <Show when={pokemons.all.length > 0}>
              <li>
                To reimport your Pokédex, choose{" "}
                <strong class="text-foreground-muted">
                  <Icon name="trash" /> Clear
                </strong>{" "}
                first.
              </li>
            </Show>
          </>
        }
      >
        <li>Type or paste in one Pokémon name per line.</li>
        <li>Autocomplete suggestions will be provided as you type.</li>
        <li>
          Blank lines are ignored, as are comments, which start with{" "}
          <code class="text-sm text-editor-comment">#</code>.
        </li>
        <li>
          To set a Pokémon's type, write it after the name in parentheses:
          <ul class="ml-6 list-disc">
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Oshawott</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-type-name">Fire</span>
                <span class="text-editor-punctuation">)</span>
              </code>
            </li>
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Xatu</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-type-name">MyCustomType</span>
                <span class="text-editor-punctuation">/</span>
                <span class="text-editor-type-name">Flying</span>
                <span class="text-editor-punctuation">)</span>
              </code>
            </li>
          </ul>
        </li>
        <li>
          To set a Pokémon's form name, write it in those same parentheses, followed by a colon:
          <ul class="ml-6 list-disc">
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Zoroark</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-alt-name">Hisuian</span>
                <span class="text-editor-punctuation">:)</span>
              </code>
            </li>
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Raichu</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-alt-name">Mega Y</span>
                <span class="text-editor-punctuation">:)</span>
              </code>
            </li>
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Politoed</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-alt-name">MyRegionian</span>
                <span class="text-editor-punctuation">:</span>
                <span class="text-editor-type-name">Water</span>
                <span class="text-editor-punctuation">/</span>
                <span class="text-editor-type-name">Grass</span>
                <span class="text-editor-punctuation">)</span>
              </code>
            </li>
          </ul>
        </li>
        <li>You'll be given recommendations and statistics based on your Pokédex.</li>
        <li>
          To exclude a Pokémon from recommendations, write{" "}
          <code class="text-sm text-editor-modifier">@exclude</code> or{" "}
          <code class="text-sm text-editor-modifier">@ignore</code> after its name:
          <ul class="ml-6 list-disc">
            <li>
              <code class="text-sm">
                <span class="text-editor-name">MySpecialLegendary</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-type-name">Fairy</span>
                <span class="text-editor-punctuation">/</span>
                <span class="text-editor-type-name">Normal</span>
                <span class="text-editor-punctuation">)</span>{" "}
                <span class="text-editor-modifier">@exclude</span>
              </code>
            </li>
          </ul>
        </li>
      </Show>
    </ul>
  );
}

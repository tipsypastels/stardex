import { basicSetup, EditorView } from "codemirror";
import { onCleanup, onMount } from "solid-js";
import { pokemons } from "../../../../models/pokemon/list";
import { language } from "./plugins";
import { highlightTheme, theme } from "./theme";

export function PokedexTextView() {
  let parent!: HTMLDivElement;

  onMount(() => {
    const doc = pokemons.toSerializedText();
    const view = new EditorView({
      doc,
      parent,
      extensions: [basicSetup, theme, language, highlightTheme],
    });

    onCleanup(() => view.destroy());
  });

  return <div class="rounded-b-md border-2 border-t-0 border-secondary" ref={parent} />;
}

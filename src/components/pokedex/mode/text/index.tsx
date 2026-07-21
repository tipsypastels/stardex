import { basicSetup, EditorView } from "codemirror";
import { onCleanup, onMount } from "solid-js";
import { language } from "./plugins";

export function PokedexTextView() {
  let parent!: HTMLDivElement;

  onMount(() => {
    const view = new EditorView({
      parent,
      extensions: [basicSetup, language],
    });

    onCleanup(() => view.destroy());
  });

  return <div ref={parent} />;
}

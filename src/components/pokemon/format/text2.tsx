import { StreamLanguage, syntaxTree } from "@codemirror/language";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "preact/hooks";

export function PokedexTextView2() {
  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>(null);

  useEffect(() => {
    if (!view.current && ref.current) {
      view.current = new EditorView({
        doc: "xy",
        parent: ref.current,
        extensions: [basicSetup, language],
      });
      return () => view.current?.destroy();
    }
  }, []);

  return (
    <>
      <div ref={ref}></div>
      <button
        onClick={() => {
          view.current!.state.console.log(syntaxTree(view.current!.state));
        }}
      >
        click
      </button>
    </>
  );
}

type State = {
  kind: "lineStart";
};

const language = StreamLanguage.define<State>({
  startState() {
    return { kind: "lineStart" };
  },
  token(stream, state) {
    if (stream.eatSpace()) {
      return null;
    }

    const ch = stream.next();
    if (ch === "x") {
      return "string";
    }
    if (ch === "y") {
      return "comment";
    }

    return null;
  },
});

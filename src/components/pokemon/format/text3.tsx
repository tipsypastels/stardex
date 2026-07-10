import { Language, syntaxTree } from "@codemirror/language";
import { Facet } from "@codemirror/state";
import { Parser, type Input, type PartialParse } from "@lezer/common";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "preact/hooks";

export function PokedexTextView3() {
  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>(null);

  useEffect(() => {
    if (!view.current && ref.current) {
      view.current = new EditorView({
        doc: "xy\nz",
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
          console.log(syntaxTree(view.current!.state));
        }}
      >
        click
      </button>
    </>
  );
}

class Foo extends Parser {
  createParse(input: Input): PartialParse {
    console.log(arguments);
    throw "x";
  }
}

const language = new Language(Facet.define({}), new Foo());

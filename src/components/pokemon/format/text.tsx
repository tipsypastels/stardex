import { linter } from "@codemirror/lint";
import { basicSetup, EditorView } from "codemirror";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import type { PokemonList } from "../../../models/pokemon/list";
import { PokemonsContext } from "../../../state/context";

import {
  parsePokemonListText,
  PokemonListTextParseError,
} from "../../../models/pokemon/text/parse";
import { serializePokemonListToText } from "../../../models/pokemon/text/serialize";
import { useDebouncedEffect } from "../../../utils/hooks";

const RELOAD_DEBOUNCE_MS = 1000;

export function PokedexTextView() {
  const pokemons = useContext(PokemonsContext);
  const [text, setText] = useState(() =>
    serializePokemonListToText({
      pokemons: initialFromList(pokemons),
      textDiff: pokemons.textDiff.raw.peek(),
    }),
  );

  const changed = useRef(true);

  const [errors, setErrors] = useState<PokemonListTextParseError[]>([]);
  const errorLinter = linter(() => {
    console.log("linted", errors);
    return errors;
  });

  // const errors = useRef<PokemonListTextParseError[]>([]);
  // const errorLinter = linter(() => {
  //   console.log("linted", errors.current);
  //   return errors.current;
  // });
  // function setErrors(e: any) {
  //   errors.current = e;
  // }

  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>(null);

  function run() {
    if (!changed.current) {
      console.log("unchanged");
      return;
    }

    const result = parsePokemonListText(text);
    console.log("result", result.errors);

    changed.current = false;
    setErrors(result.errors);
    pokemons.setFromRaw(result.pokemons);
  }

  useEffect(() => {
    if (!view.current && ref.current) {
      run();
      view.current = new EditorView({
        doc: text,
        parent: ref.current,
        extensions: [basicSetup, errorLinter],
        dispatch(transaction, view) {
          view.update([transaction]);
          changed.current = true;
          setText(transaction.newDoc.toString());
        },
      });
      return () => view.current?.destroy();
    }
  }, []);

  useDebouncedEffect(run, RELOAD_DEBOUNCE_MS, [text]);

  return <div ref={ref}></div>;
}

function* initialFromList(pokemons: PokemonList) {
  const iter = pokemons.all.peek();
  for (const pokemon of iter) {
    yield pokemon.toRaw();
  }
}

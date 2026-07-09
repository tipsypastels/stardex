import { linter } from "@codemirror/lint";
import { EditorView } from "codemirror";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { PokemonList } from "../../../models/pokemon/list";
import { PokemonsContext } from "../../../state/context";

import {
  parsePokemonListText,
  type PokemonListTextParseError,
} from "../../../models/pokemon/text/parse";
import { serializePokemonListToText } from "../../../models/pokemon/text/serialize";
import { POKEMON_LIST_VERSION } from "../../../models/versioned";
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

  const [errors, setErrors] = useState<PokemonListTextParseError[]>([]);
  const errorLinter = useMemo(() => linter(() => errors), [errors]);

  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>(null);

  useDebouncedEffect(
    () => {
      const result = parsePokemonListText(text);
      pokemons.setFromRaw({
        v: POKEMON_LIST_VERSION,
        all: result.pokemons,
        textDiff: result.textDiff,
      });
      setErrors(result.errors);
    },
    RELOAD_DEBOUNCE_MS,
    [text],
  );

  useEffect(() => {
    if (!view.current && ref.current) {
      view.current = new EditorView({
        doc: text,
        parent: ref.current,
        extensions: [errorLinter],
        dispatch(transaction, view) {
          view.update([transaction]);
          setText(transaction.newDoc.toString());
        },
      });
      return () => view.current?.destroy();
    }
  }, []);

  return <div ref={ref}></div>;
}

function* initialFromList(pokemons: PokemonList) {
  const iter = pokemons.all.peek();
  for (const pokemon of iter) {
    yield pokemon.toRaw();
  }
}

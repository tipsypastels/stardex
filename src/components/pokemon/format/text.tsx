import { linter } from "@codemirror/lint";
import { EditorView } from "codemirror";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { PokemonList } from "../../../models/pokemon/list";
import { PokemonsContext } from "../../../state/context";
import {
  textPokedexFromRawPokemons,
  TextPokedexParseError,
  textPokedexToRawPokemons,
} from "../../../state/text";
import { useDebouncedEffect } from "../../../utils/hooks";

const RELOAD_DEBOUNCE_MS = 1000;

export function PokedexTextView() {
  const pokemons = useContext(PokemonsContext);
  const [text, setText] = useState(() => textPokedexFromRawPokemons(initialFromList(pokemons)));

  const [errors, setErrors] = useState<TextPokedexParseError[]>([]);
  const errorLinter = useMemo(() => linter(() => errors), [errors]);

  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>(null);

  useDebouncedEffect(
    () => {
      const result = textPokedexToRawPokemons(text);
      pokemons.setFromRaw(result.pokemons);
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

import { Actions } from "../common/actions";
import { PokedexFormat } from "./pokedex_format";

export function Pokedex() {
  return (
    <>
      <PokedexFormat
        actions={() => (
          <Actions
            actions={[
              {
                icon: "asterisk",
                name: "Filter",
                onClick: () => {},
              },
              {
                icon: "asterisk",
                name: "Filter",
                onClick: () => {},
              },
              {
                icon: "asterisk",
                name: "Filter",
                onClick: () => {},
              },
            ]}
          />
        )}
      />
    </>
  );
}

import { Actions } from "../common/actions";
import { PokedexFormat } from "./format";

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

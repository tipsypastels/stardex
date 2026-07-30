import { createSignal, type JSXElement } from "solid-js";
import { UploadButton } from "../../../common/button";
import { Modal } from "../../../common/menus/modal";
import { Steps } from "../../../common/steps";
import { ImportPBSModalLanding, ImportPBSModalLandingFooter } from "./0_landing";
import { ImportPBSModalDexes, ImportPBSModalDexesFooter } from "./1_dexes";
import { ImportPBSModalForms, ImportPBSModalFormsFooter } from "./2_forms";
import { ImportPBSModalFinish, ImportPBSModalFinishFooter } from "./3_finish";
import type { ImportPBSFiles } from "./files";
import type { ImportPBSPhase, ImportPBSState } from "./state";

export interface ImportPBSModalProps {
  state: ImportPBSState;
  phase: ImportPBSPhase;
}

export function ImportPBSModal(props: ImportPBSModalProps) {
  function makeChildren(inner: JSXElement) {
    return (
      <>
        <div class="mb-2">
          <Steps
            currentIndex={props.phase.index}
            steps={[{ label: "Upload" }, { label: "Dex" }, { label: "Forms" }, { label: "Finish" }]}
          />
        </div>
        {inner}
      </>
    );
  }

  function render() {
    // TODO: Handle errors and empty dexes.
    if (props.phase.files && props.phase.files.parsed.pokemons.size === 0) {
      return {
        children: makeChildren(<NoPokemon />),
        footer: <NoPokemonFooter files={props.phase.files} />,
      };
    }
    switch (props.phase.type) {
      case "landing": {
        return {
          children: makeChildren(<ImportPBSModalLanding />),
          footer: <ImportPBSModalLandingFooter state={props.state} phase={props.phase} />,
        };
      }
      case "dexes": {
        return {
          children: makeChildren(<ImportPBSModalDexes state={props.state} phase={props.phase} />),
          footer: <ImportPBSModalDexesFooter state={props.state} phase={props.phase} />,
        };
      }
      case "forms": {
        return {
          children: makeChildren(<ImportPBSModalForms state={props.state} phase={props.phase} />),
          footer: <ImportPBSModalFormsFooter state={props.state} phase={props.phase} />,
        };
      }
      case "finish": {
        return {
          children: makeChildren(<ImportPBSModalFinish state={props.state} phase={props.phase} />),
          footer: <ImportPBSModalFinishFooter state={props.state} phase={props.phase} />,
        };
      }
    }
  }

  return <Modal title="Import PBS Files" onClose={() => props.state.close()} {...render()} />;
}

/* -------------------------------------------------------------------------- */
/*                                 No Pokémon                                 */
/* -------------------------------------------------------------------------- */

interface NoPokemonProps {
  files: ImportPBSFiles;
}

function NoPokemon() {
  return <>Your uploaded files have no Pokémon. Upload PBS files with at least one Pokémon.</>;
}

function NoPokemonFooter(props: NoPokemonProps) {
  const [uploading, setUploading] = createSignal(false);
  return (
    <div class="flex flex-col justify-center">
      <UploadButton
        accept="text/plain"
        multiple
        disabled={uploading()}
        // eslint-disable-next-line solid/reactivity
        onUpload={async (fileList) => {
          setUploading(true);

          props.files.import(fileList);
        }}
      >
        Upload PBS Files
      </UploadButton>
    </div>
  );
}

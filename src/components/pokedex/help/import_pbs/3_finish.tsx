import type { ImportPBSFinishPhase, ImportPBSState } from "./state";

export interface ImportPBSModalFinishProps {
  state: ImportPBSState;
  phase: ImportPBSFinishPhase;
}

export function ImportPBSModalFinish(_props: ImportPBSModalFinishProps) {
  return <>xd</>;
}

export function ImportPBSModalFinishFooter(_props: ImportPBSModalFinishProps) {
  // const [uploading, setUploading] = createSignal(false);
  // return (
  //   <div class="flex flex-col justify-center">
  //     <UploadButton
  //       accept="text/plain"
  //       multiple
  //       disabled={uploading()}
  //       // eslint-disable-next-line solid/reactivity
  //       onUpload={async (fileList) => {
  //         setUploading(true);

  //         const files = await createImportPBSFilesState(fileList);
  //         props.state.gotoDexes(files);
  //       }}
  //     >
  //       Upload PBS Files
  //     </UploadButton>
  //   </div>
  // );
  return "ok";
}

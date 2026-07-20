import { batch, createEffect, createSignal, Show, type Accessor } from "solid-js";
import type { Pokemon } from "../../../models/pokemon";
import { customIcons } from "../../../models/pokemon/custom_icon";
import { blobToDataUrl } from "../../../utils/file";
import { Button } from "../../common/button";
import { Icon } from "../../common/icon";
import { ButtonLink, UploadLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";

export interface EditPokemonCustomIconLinkProps {
  state: CustomIconUploadState;
}

export function EditPokemonCustomIconLink(props: EditPokemonCustomIconLinkProps) {
  return (
    <div class="mb-4">
      <h2 class="font-bold">Custom Icon</h2>
      <ul>
        <li>
          <UploadLink
            accept="image/png"
            onUpload={(files) => {
              if (files[0]) props.state.setUploaded(files[0]);
            }}
          >
            <span class="pr-1">
              <Icon name="upload" />
            </span>
            <Show when={props.state.alreadyHas} fallback="Upload">
              Reupload
            </Show>
          </UploadLink>
        </li>

        <Show when={props.state.alreadyHas}>
          <li>
            <span class="pr-1">
              <Icon name="times" />
            </span>
            <ButtonLink onClick={() => props.state.delete()}>Remove</ButtonLink>
          </li>
        </Show>
      </ul>
    </div>
  );
}

export interface EditPokemonCustomIconModalProps {
  pokemon: Pokemon;
  initialFile: File;
  onClose(): void;
  onCancel(): void;
}

export function EditPokemonCustomIconModal(props: EditPokemonCustomIconModalProps) {
  const [blob, setBlob] = createSignal<Blob>(props.initialFile);

  const [didDoubleScale, setDidDoubleScale] = createSignal(false);
  const [didCrop, setDidCrop] = createSignal(false);
  const [didRemoveBackground, setDidRemoveBackground] = createSignal(false);
  const noChanges = () => !didDoubleScale() && !didCrop() && !didRemoveBackground();

  let image: HTMLDivElement | undefined;
  let dataUrl: string | undefined;

  function doubleScale() {
    if (!dataUrl) return;

    const img = new Image();

    img.onload = () => {
      const { width, height } = img;

      const canvas = document.createElement("canvas");

      canvas.width = width * 2;
      canvas.height = height * 2;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          batch(() => {
            setBlob(blob);
            setDidDoubleScale(true);
          });
        }
      }, "image/png");
    };
    img.src = dataUrl;
  }

  function cropInHalf() {
    if (!dataUrl) return;

    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      if (width === height) {
        setDidCrop(true);
        return;
      }

      const canvas = document.createElement("canvas");

      if (width > height) {
        canvas.width = width / 2;
        canvas.height = height;
      } else {
        canvas.width = width;
        canvas.height = height / 2;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          batch(() => {
            setBlob(blob);
            setDidCrop(true);
          });
        }
      }, "image/png");
    };
    img.src = dataUrl;
  }

  function removeBackgroundColor() {
    if (!dataUrl) return;

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      if (data[3] === 0) {
        setDidRemoveBackground(true);
        return;
      }

      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r === bgR && g === bgG && b === bgB) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          batch(() => {
            setBlob(blob);
            setDidRemoveBackground(true);
          });
        }
      }, "image/png");
    };
    img.src = dataUrl;
  }

  function upload() {
    batch(() => {
      customIcons.add(props.pokemon.id, blob());
      props.onClose();
    });
  }

  function reset() {
    batch(() => {
      setBlob(props.initialFile);
      setDidCrop(false);
      setDidDoubleScale(false);
      setDidRemoveBackground(false);
    });
  }

  createEffect(() => {
    blobToDataUrl(blob(), (newDataUrl) => {
      if (!image) return;
      image.style.setProperty("--data-url", `url("${newDataUrl}")`);
      dataUrl = newDataUrl;
    });
  });

  return (
    <Modal
      title={`Edit ${props.pokemon.name}'s Custom Icon`}
      onClose={props.onClose}
      footer={
        <div class="flex">
          <ButtonLink look="secondary" onClick={props.onCancel}>
            Cancel
          </ButtonLink>
          <div class="grow" />
          <Button onClick={upload}>Upload</Button>
        </div>
      }
      footerHasDivider
    >
      <div class="flex items-start gap-4">
        <div class="flex flex-col items-center">
          <div class="rounded-md border-2 border-divider-heavy p-2">
            <div
              ref={image}
              role="img"
              class="h-15 w-20 dim"
              style={{
                "background-image": "var(--data-url)",
                "background-repeat": "no-repeat",
                "background-position": "center",
                "image-rendering": "pixelated",
              }}
            />
          </div>
          <ButtonLink onClick={reset} disabled={noChanges()} small>
            Reset
          </ButtonLink>
        </div>
        <div class="grow">
          <h3 class="text-sm">pre-upload options:</h3>
          <ul class="list-inside list-disc">
            <li>
              <ButtonLink onClick={doubleScale} disabled={didDoubleScale()}>
                <Show when={didDoubleScale}>
                  <Icon name="check" />
                </Show>
                Scale up (for RH icons).
              </ButtonLink>
            </li>
            <li>
              <ButtonLink onClick={cropInHalf} disabled={didCrop()}>
                <Show when={didCrop}>
                  <Icon name="check" />
                </Show>
                Crop to first frame of two.
              </ButtonLink>
            </li>
            <li>
              <ButtonLink onClick={removeBackgroundColor} disabled={didRemoveBackground()}>
                <Show when={didRemoveBackground}>
                  <Icon name="check" />
                </Show>
                Remove background colour.
              </ButtonLink>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

export interface CustomIconUploadState {
  uploaded: File | undefined;
  setUploaded(file: File | undefined): void;
  alreadyHas: boolean;
  delete(): void;
}

export function createCustomIconUploadState(pokemonId: Accessor<string>): CustomIconUploadState {
  const [uploaded, setUploaded] = createSignal<File>();
  return {
    get uploaded() {
      return uploaded();
    },
    setUploaded,
    get alreadyHas() {
      return customIcons.pokemonIds.has(pokemonId());
    },
    delete() {
      customIcons.delete(pokemonId());
    },
  };
}

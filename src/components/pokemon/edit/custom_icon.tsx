import { batch, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import type { Pokemon } from "../../../models/pokemon";
import { CustomIconsContext } from "../../../state/context";
import { blobToDataUrl } from "../../../utils/file";
import { Button } from "../../common/button";
import { Icon } from "../../common/icon";
import { ButtonLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";

export interface EditPokemonCustomIconLinkProps {
  onUpload(file: File): void;
}

export function EditPokemonCustomIconLink({ onUpload }: EditPokemonCustomIconLinkProps) {
  // TODO: "Manage" if it has one already.
  return (
    <div class="mb-4">
      <h2 class="font-bold">Custom Icon</h2>
      <ul class="list-inside list-disc">
        <li>
          <label class="cursor-pointer text-primary underline">
            <input
              class="hidden"
              type="file"
              accept="image/png"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) onUpload(file);
              }}
            />
            upload
          </label>
        </li>
      </ul>
    </div>
  );
}

export interface EditPokemonCustomIconModalProps {
  pokemon: Pokemon;
  file: File;
  onClose(): void;
  onFinishOrCancel(): void;
}

export function EditPokemonCustomIconModal({
  pokemon,
  file,
  onClose,
  onFinishOrCancel,
}: EditPokemonCustomIconModalProps) {
  const customIcons = useContext(CustomIconsContext);
  const [blob, setBlob] = useState<Blob>(file);

  const didDoubleScale = useSignal(false);
  const didCrop = useSignal(false);
  const didRemoveBackground = useSignal(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const dataUrlRef = useRef<string>();

  function doubleScale() {
    const dataUrl = dataUrlRef.current;
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
          setBlob(blob);
          didDoubleScale.value = true;
        }
      }, "image/png");
    };
    img.src = dataUrl;
  }

  function cropInHalf() {
    const dataUrl = dataUrlRef.current;
    if (!dataUrl) return;

    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      if (width === height) {
        didCrop.value = true;
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
          setBlob(blob);
          didCrop.value = true;
        }
      }, "image/png");
    };
    img.src = dataUrl;
  }

  function removeBackgroundColor() {
    const dataUrl = dataUrlRef.current;
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
        didRemoveBackground.value = true;
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
          setBlob(blob);
          didRemoveBackground.value = true;
        }
      }, "image/png");
    };
    img.src = dataUrl;
  }

  function upload() {
    batch(() => {
      customIcons.upload(pokemon.key.value, blob);
      onFinishOrCancel();
    });
  }

  useEffect(() => {
    blobToDataUrl(blob, (dataUrl) => {
      if (!imageRef.current) return;
      imageRef.current.style.setProperty("--data-url", `url("${dataUrl}")`);
      dataUrlRef.current = dataUrl;
    });
  }, [blob]);

  return (
    <Modal
      title={`Edit ${pokemon.name.value}'s Custom Icon`}
      onClose={onClose}
      footer={
        <div class="flex">
          <ButtonLink look="secondary" onClick={onFinishOrCancel}>
            Cancel
          </ButtonLink>
          <div class="grow" />
          <Button onClick={upload}>Upload</Button>
        </div>
      }
      hasFooterDivider
    >
      <div class="flex items-start gap-4">
        <div class="rounded-md border-2 border-divider-heavy p-2">
          <div
            ref={imageRef}
            role="img"
            class="h-15 w-20 dim"
            style="background: transparent var(--data-url) no-repeat center; image-rendering: pixelated;"
          />
        </div>
        <div class="grow">
          <h3 class="text-sm">pre-upload options:</h3>
          <ul class="list-inside list-disc">
            <li>
              <ButtonLink onClick={doubleScale} disabled={didDoubleScale}>
                <Show when={didDoubleScale}>
                  <Icon name="check" />
                </Show>
                Scale up (for RH icons).
              </ButtonLink>
            </li>
            <li>
              <ButtonLink onClick={cropInHalf} disabled={didCrop}>
                <Show when={didCrop}>
                  <Icon name="check" />
                </Show>
                Crop to first frame of two.
              </ButtonLink>
            </li>
            <li>
              <ButtonLink onClick={removeBackgroundColor} disabled={didRemoveBackground}>
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

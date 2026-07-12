import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useEffect, useRef, useState } from "preact/hooks";
import type { Pokemon } from "../../../models/pokemon";
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
              accept="image/png, image/gif, image/jpeg"
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
}

export function EditPokemonCustomIconModal({
  pokemon,
  file,
  onClose,
}: EditPokemonCustomIconModalProps) {
  const [blob, setBlob] = useState<Blob>(file);

  const didCrop = useSignal(false);
  const didRemoveBackground = useSignal(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const dataUrlRef = useRef<string>();

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
      });
    };
    img.src = dataUrl;
  }

  useEffect(() => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (!imageRef.current) return;
      const dataUrl = fileReader.result as string;

      imageRef.current.style.setProperty("--data-url", `url("${dataUrl}")`);
      dataUrlRef.current = dataUrl;
    };

    fileReader.readAsDataURL(blob);
  }, [blob]);

  return (
    <Modal
      title={`Edit ${pokemon.name.value}'s Custom Icon`}
      onClose={onClose}
      footer={
        <div class="flex">
          <ButtonLink look="secondary" onClick={() => {}}>
            Cancel
          </ButtonLink>
          <div class="grow" />
          <Button onClick={() => {}}>Upload</Button>
        </div>
      }
      hasFooterDivider
    >
      <div class="flex gap-4">
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
              <ButtonLink onClick={cropInHalf} disabled={didCrop}>
                <Show when={didCrop}>
                  <Icon name="check" />
                </Show>
                Crop to first frame of two.
              </ButtonLink>
            </li>
            <li>
              <ButtonLink onClick={() => {}} disabled={didRemoveBackground}>
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

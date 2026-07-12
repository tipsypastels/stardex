import { useEffect, useRef, useState } from "preact/hooks";
import type { Pokemon } from "../../../models/pokemon";
import { Button } from "../../common/button";
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
  const [blob] = useState<Blob>(file);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (!imageRef.current) return;
      const dataUrl = fileReader.result as string;
      imageRef.current.style.setProperty("--data-url", `url("${dataUrl}")`);
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
          <h3 class="text-sm">pre-upload actions:</h3>
          <ul class="list-inside list-disc">
            <li>
              <ButtonLink onClick={() => {}}>Crop to first frame of two.</ButtonLink>
            </li>
            <li>
              <ButtonLink onClick={() => {}}>Remove background colour.</ButtonLink>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

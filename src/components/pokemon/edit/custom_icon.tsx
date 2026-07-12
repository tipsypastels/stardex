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

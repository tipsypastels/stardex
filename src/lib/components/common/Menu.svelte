<script lang="ts">
  import { type Snippet } from "svelte";
  import Icon from "./Icon.svelte";

  type MenuItemButton = {
    type: "button";
    name: string;
    icon: string;
    class?: string;
    onclick(): void;
  };

  type MenuItemDivider = {
    type: "divider";
  };

  type MenuItem = MenuItemButton | MenuItemDivider;

  interface Props {
    items: MenuItem[];
    trigger: Snippet<[toggle: () => void]>;
  }

  let { items, trigger }: Props = $props();
  let open = $state(false);
  let menu: HTMLDivElement | undefined;

  function handleClick(e: MouseEvent) {
    if (!open) return;
    // May be null if hot reload weirdness etc.
    if (menu?.contains(e.target as HTMLElement)) return;
    open = false;
  }

  $effect(() => {
    if (open) {
      document.body.addEventListener("click", handleClick);
    } else {
      document.body.removeEventListener("click", handleClick);
    }
  });
</script>

<div class="relative" bind:this={menu}>
  {@render trigger(() => (open = !open))}

  {#if open}
    <div class="absolute right-0 z-40 w-max border-2 border-slate-300 bg-white shadow-lg">
      <ul class="appearance-none py-2">
        {#each items as item}
          {#if item.type === "button"}
            <li>
              <button
                class="cursor-pointer px-4 py-1 hover:text-lime-600 {item.class}"
                onclick={() => {
                  item.onclick();
                  open = false;
                }}
              >
                <Icon name={item.icon} class="pr-1" />
                {item.name}
              </button>
            </li>
          {:else if item.type === "divider"}
            <li class="py-2">
              <hr />
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</div>

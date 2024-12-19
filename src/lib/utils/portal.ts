import { tick } from "svelte";

export function portal(el: HTMLElement) {
  el.hidden = true;

  async function update() {
    await tick();
    document.body.appendChild(el);
    el.hidden = false;
  }

  function destroy() {
    el.parentNode?.removeChild(el);
  }

  update();

  return {
    update,
    destroy,
  };
}

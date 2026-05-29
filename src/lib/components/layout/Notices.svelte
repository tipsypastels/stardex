<script lang="ts">
  import NOTICES from "$lib/data/notices.json" with { type: "json" };
  import { lastDismissedNoticeDate } from "$lib/state/notices";
  import { format } from "date-fns";
  import Icon from "../common/Icon.svelte";

  const notice = $derived(
    NOTICES.find((notice) => new Date(notice.date).getTime() > $lastDismissedNoticeDate.getTime()),
  );
</script>

{#if notice}
  {@const date = new Date(notice.date)}

  <div class="mb-4 rounded-md border-[1px] border-lime-600 p-4">
    <div class="mb-2 flex text-lime-600">
      <h2 class="grow text-xl font-bold">
        <Icon name="note-sticky" /> New - {format(date, "MMMM dd, yyyy")}
      </h2>
    </div>

    <div class="mb-2">
      {notice.text}
    </div>

    <div>
      <button
        class="cursor-pointer text-lime-600 underline"
        onclick={() => ($lastDismissedNoticeDate = date)}>Got it!</button
      >
    </div>
  </div>
{/if}

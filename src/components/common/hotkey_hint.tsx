export interface HotkeyHintProps {
  hotkey: string;
  title?: string;
}

export function HotkeyHint(props: HotkeyHintProps) {
  return (
    <span
      class="bg-secondary ml-2 hidden h-4 w-4 items-center justify-center rounded-sm font-mono text-xs text-white lg:inline-flex"
      title={props.title}
    >
      <div>{props.hotkey}</div>
    </span>
  );
}

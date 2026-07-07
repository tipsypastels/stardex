export interface SectionHeadingProps {
  title: string;
}

export function SectionHeading(props: SectionHeadingProps) {
  return (
    <h2 class="mb-4 flex items-center px-4">
      <div class="border-b-divider-light w-4 border-b"></div>
      <div class="px-2 text-3xl">{props.title}</div>
      <div class="border-b-divider-light w-4 grow border-b"></div>
    </h2>
  );
}

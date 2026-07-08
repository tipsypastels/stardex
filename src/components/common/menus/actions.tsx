import { Icon } from "../icon";

interface Action {
  name: string;
  icon: string;
  iconColor?: string;
  onClick(): void;
}

export interface ActionsProps {
  actions: Action[];
}

export function Actions({ actions }: ActionsProps) {
  return (
    <ul class="border-secondary text-secondary mb-8 flex rounded-md border-2 p-2 pl-0">
      {actions.map((action) => (
        <li class="border-r-secondary border-r">
          <button
            class="flex cursor-pointer items-center gap-1 px-4 text-sm font-bold"
            onClick={action.onClick}
          >
            <div class="text-xs" style={action.iconColor ? `color: ${action.iconColor}` : ""}>
              <Icon name={action.icon} />
            </div>
            <div>{action.name}</div>
          </button>
        </li>
      ))}
    </ul>
  );
}

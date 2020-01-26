import React, { CSSProperties } from 'react'

export type IconGroup = 'fas' | 'fab' | 'fal' | 'far' | 'fad';
export const DEFAULT_ICON_GROUP: IconGroup = 'fas';

export type IconSize =
  | 'xs'
  | 'sm'
  | 'lg'
  | '2x'
  | '3x'
  | '5x'
  | '7x'
  | '10x';

export type IconSource =
  | string
  | [string, IconGroup]
  | [string, IconGroup, Partial<Omit<Props, 'src'>>]
  | [string, Partial<Omit<Props, 'src'>>];

type Props = {
  src: IconSource;
  defaultGroup?: IconGroup;
  fw?: boolean;
  className?: string;
  transform?: string;
  mask?: string;
  size?: IconSize;
  color?: string;
  color2?: string;
  opacity?: number;
  opacity2?: number;
  alt?: string;
}
export type IconProps = Props;

export default function Icon(props: Props) {
  const {
    name, group, alt,
    fw, className,
    transform, mask, size,
    color, color2, opacity, opacity2,
  } = useIconProps(props);

  return (
    <i
      className={`
        icon
        ${group}
        fa-${name}
        ${fw && 'fa-fw'}
        ${size && `fa-${size}`}
        ${className}
      `}
      title={alt}
      aria-label={alt}
      style={{
        color,
        '--fa-primary-color': color,
        '--fa-secondary-color': color2,
        '--fa-primary-opacity': opacity,
        '--fa-secondary-opacity': opacity2,
      } as CSSProperties}
      data-fa-transform={transform}
      data-fa-mask={mask}
    />
  );
}

type UseIconProps =
  & Omit<Props, 'src'>
  & { name: string, group: IconGroup };

export function useIconProps({ src, ...props }: Props): UseIconProps {
  let fullProps = props;
  let name: string;
  let group: any;

  if (Array.isArray(src)) {
    switch (src.length) {
      case 3: {
        name = src[0];
        group = src[1];
        fullProps = Object.assign(src[2], fullProps);
        break;
      }

      case 2: {
        name = src[0];

        if (typeof src[1] === 'object') {
          fullProps = Object.assign(src[1], fullProps);
        } else {
          group = src[1];
        }
        break;
      }
    }
  } else {
    name = src;
  }

  group = group
    || ((fullProps.color2 || fullProps.opacity2) ? 'fad' : undefined)
    || fullProps.defaultGroup
    || DEFAULT_ICON_GROUP;

  return { name, group, ...fullProps };
}

import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode;
  className?: string;
}

export default function Note({ children, className }: Props) {
  return (
    <div className={`Note ${className}`}>
      {children}
    </div>
  )
}

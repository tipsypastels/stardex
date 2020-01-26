import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode;
  primary?: boolean;
  disabled?: boolean;
  className?: ReactNode;
  onClick?: () => void;
}

export default function Button({ className, primary, ...props }: Props) {
  return (
    <button 
      className={`
        Button 
        ${primary && 'Button--primary'} 
        ${props.disabled && 'Button--disabled'}
        ${className}
      `} 
      {...props} 
    />
  )
}

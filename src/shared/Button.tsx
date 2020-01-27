/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ReactNode } from 'react'

const Styles = css({
  backgroundColor: '#ddd',
  color: '#333',
  border: 'none',
  outline: 'none !important',
  fontSize: '1rem',
  fontWeight: 'bold',
  padding: '0.5rem 0.75rem',
  borderRadius: 6,
  userSelect: 'none',
  cursor: 'pointer',
  
  '&:disabled': {
    color: 'rgba(51, 51, 51, 0.75)',
    cursor: 'not-allowed',
  },

  '&.primary': {
    backgroundColor: 'var(--primary-color)',
    color: 'white',

    '&:disabled': {
      color: 'rgba(255, 255, 255, 0.75)',
    },
  },
});

type Props = {
  children: ReactNode;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({ primary, ...props }: Props) {
  return (
    <button 
      css={Styles}
      className={primary ? 'primary' : ''} 
      {...props} 
    />
  )
}
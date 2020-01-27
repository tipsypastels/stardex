/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ReactNode, useRef, useEffect } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { mq } from '../styling';

const Styles = css(mq({
  position: 'fixed',
  top: 0,
  left: 0,
  width: ['100%', '100vw'],
  height: ['100%', '100vh'],
  zIndex: 999999999, // this is fine
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  transition: '0.2s ease-in-out',
  opacity: 0,
  pointerEvents: 'none',
  cursor: 'pointer',

  '&.open': {
    opacity: 1,
    pointerEvents: 'unset',
  },

  '& > .content': {
    backgroundColor: 'white',
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)',
    padding: '0.5rem 1rem',
    maxWidth: '75vw',
    cursor: 'initial',
  },
}));

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  
  function onClick(e: any) {
    if (!ref.current?.contains(e.target)) {
      onClose();
    }
  }

  useEffect(() => {
    function listener({ key }: { key: string }) {
      key === 'Escape' && onClose();
    };

    document.addEventListener('keyup', listener);
    return () => document.removeEventListener('keyup', listener);
  });

  useEffect(() => {
    if (open) {
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
    }
  }, [open]);

  return (
    <div css={Styles} className={`${open && 'open'}`} onClick={onClick}>
      <div className="content" ref={ref}>
        {children}
      </div>
    </div>
  )
}

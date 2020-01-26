import React, { ReactNode, useRef, useEffect } from 'react'

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

  return (
    <div className={`Modal ${open && 'Modal--open'}`} onClick={onClick}>
      <div className="Modal__content" ref={ref}>
        {children}
      </div>
    </div>
  )
}

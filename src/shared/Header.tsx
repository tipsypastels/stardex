/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useContext } from 'react';
import { AppContext } from '../App';
import { mq } from '../styling';
import Icon from './Icon';

export default function Header() {
  const [{ mobEditorOpen }, dispatch] = useContext(AppContext);
  const icon = `caret-square-${mobEditorOpen ? 'left' : 'right'}`;

  return (
    <div css={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 1rem',
    }}>
      <h1 css={{ flexGrow: 1 }}>
        Stardex
      </h1>

      <div css={mq({ display: ['block', 'none' ]})}>
        <Icon
          src={[icon, 'far']}
          onClick={() => dispatch({
            type: 'SET_MOB_EDITOR_OPEN',
            open: !mobEditorOpen,
          })}
        />
      </div>
    </div>
  );
}
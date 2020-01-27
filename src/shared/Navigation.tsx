/** @jsx jsx */
import { NavLink } from 'react-router-dom'
import { jsx, css } from '@emotion/core'

const Styles = css({
  backgroundColor: '#f8f8f8',
  border: '1px solid #eaeaea',
  borderLeft: 'none',
  borderRight: 'none',
  display: 'flex',
  fontSize: '1.1rem',
  padding: '0 1rem',
  marginBottom: '1rem',

  'a': {
    color: '#848384',
    padding: '0.5rem',
    fontWeight: 'bold',

    '&.active': {
      color: 'black',
    },
  },
});

export default function Navigation() {
  return (
    <nav css={Styles}>
      <NavLink to="/" exact>
        Overview
      </NavLink>

      <NavLink to="/compare" exact>
        Compare
      </NavLink>
      
      <NavLink to="/export" exact>
        Export
      </NavLink>

      <NavLink to="/settings" exact>
        Settings
      </NavLink>

      <NavLink to="/tutorial" exact>
        Tutorial
      </NavLink>
    </nav>
  )
}

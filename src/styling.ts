import facepaint from "facepaint";
import { css } from '@emotion/core';

const BREAKPOINTS = [768, 992, 1200];

export const mq = facepaint(
  BREAKPOINTS.map(bp => `@media (min-width: ${bp}px)`)
);

export const globalStyles = css`
  --primary: #ff5687;
  --note: #f8d030;
  --note-light: #fcecab;
  --add: green;
  --remove: red;
  --code: #222;

  .add {
    color: var(--add);
  }

  .remove {
    color: var(--remove);
  }

  textarea {
    resize: none;
    outline: none !important;
    border: none;

    background-color: var(--code);
    color: white;
    font-size: 1.5rem;
    box-sizing: border-box;
    font-family: Ubuntu Mono;
    transition: 0.25s ease-in-out;
  }

  code {
    font-family: Ubuntu Mono;
    background-color: var(--code);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
  }

  h2 {
    margin-bottom: 0.5rem;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  a, .link {
    text-decoration: none;
    color: var(--primary);
    cursor: pointer;
  }

  table.visible {
    margin-bottom: 1rem;
    border: 1px solid #ddd;

    td, th {
      padding: 0.25rem;
    }

    th {
      text-align: inherit;
    }
  }
`;
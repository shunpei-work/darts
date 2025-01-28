import * as React from 'react'
import { render } from 'react-dom'
import { Editor } from './pages/game';
import { Global, css } from "@emotion/react";

const globalStyles = css`
  body {
    margin: 0;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }

  ul {
    padding: 0px;
    margin: 0px;
    list-style: none;
  }
`;

const Main = (
<>
  <Global styles={globalStyles} />
  <Editor />
</>
)

render(Main, document.getElementById('app'))
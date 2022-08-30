import axios from 'axios';
import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';

import App from './App';

const GlobalStyle = createGlobalStyle`
  body, html {
    width: 100vw;
    //height: 100vh;
  }
  
  body {
    font-family: Montserrat,sans-serif;
  }
  

  #root {
    //height: 100%;
  }
`;

enableMapSet();

ReactDOM.render(
	<React.StrictMode>
		<GlobalStyle />
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
);

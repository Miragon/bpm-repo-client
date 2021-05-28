import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from "react-redux";
import reportWebVitals from './reportWebVitals';
import {Auth0Provider} from '@auth0/auth0-react';
import {HashRouter} from "react-router-dom";
import App from "./components/Layout/App";
import store from "./store/store";

ReactDOM.render((
   <Auth0Provider
        domain="flowsquad.eu.auth0.com"
        clientId="3h8eEHlAfoMF4yYkTOzsDcQc6rgpLOxO"
        audience="https://flowsquad.io"
        authorizeTimeoutSeconds={5}
        maxAge={86400}
        useRefreshTokensIn
        redirectUri={window.location.origin}>
       <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
       </Provider>
    </Auth0Provider>
    ),
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

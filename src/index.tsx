import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApiProvider } from './contexts/ApiContext';
import { AuthProvider } from './contexts/AuthContext';
import config from './stack.dev.json';
import reportWebVitals from './reportWebVitals';

const awsConfig = {
  Auth: {
    userPoolId: config.UserPoolId,
    userPoolWebClientId: config.UserPoolClientId,
    region: config.Region
  }
};

const apiConfig = {
  endpoint: config.ServiceEndpoint,
  api: [{
    name: 'withAuth',
    path: '/withAuth',
  }, {
    name: 'withoutAuth',
    path: '/withoutAuth',
  }]
};

console.log({ awsConfig, apiConfig });

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider
      awsConfig={awsConfig}
      apiConfig={apiConfig}
    >
      <ApiProvider
        apiConfig={apiConfig}
      >
        <App />
      </ApiProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

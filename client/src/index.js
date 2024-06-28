import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClientProvider from './apolloClient';
import AppRouter from './AppRouter';
import 'antd/dist/reset.css'; 
import './index.css';

ReactDOM.render(
  <ApolloClientProvider>
    <AppRouter />
  </ApolloClientProvider>,
  document.getElementById('root')
);




import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Helmet from 'react-helmet'
import './index.css'

ReactDOM.hydrate(
  <App />,
  document.getElementById('root')
);

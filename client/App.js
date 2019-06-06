import React from 'react'
import Router from 'router'
import Pages from 'pages'
import config from 'config'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Pages />
      </Router>
    );
  }
}

export default App

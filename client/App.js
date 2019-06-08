import React from 'react'
import Router from 'router'
import Pages from 'pages'

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

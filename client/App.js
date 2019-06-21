import React from 'react'
import { BrowserRouter } from 'router'
import renderBaseApp from 'lib/baseApp'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {renderBaseApp()}
      </BrowserRouter>
    )
  }
}

export default App

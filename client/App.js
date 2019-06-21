import React from 'react'
import { BrowserRouter } from 'router'
import renderBaseApp from 'lib/baseApp'

class App extends React.Component {
  render() {
    console.log('window', window._INIT_CONTEXT_)
    return (
      <BrowserRouter>
        {renderBaseApp(window._INIT_CONTEXT_)}
      </BrowserRouter>
    )
  }
}

export default App

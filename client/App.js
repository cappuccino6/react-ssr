import React from 'react'
import { BrowserRouter } from 'router'
import BaseApp from 'lib/baseApp'

class App extends BaseApp {
  render() {
    return (
      <BrowserRouter>
        {this.App}
      </BrowserRouter>
    )
  }
}

export default App

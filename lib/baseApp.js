import React from 'react'
import Pages from 'client/pages'
import AppContextProvider from 'hocs/withAppContext'

let globalContextData = {}

// 共享同一个 context 和 App
class BaseApp extends React.Component {

  constructor(props) {
    super(props)
  }

  async fetchProcess(promise, id) {
    const contextData = await promise
    globalContextData[id] = contextData
  }

  get App() {
    const appContext = {addFetchProcess: this.fetchProcess, ...globalContextData}

    return (
      <AppContextProvider appContext={appContext}>
        <Pages />
      </AppContextProvider>
    )
  }

}

export default BaseApp
import React from 'react'
import Pages from 'client/pages'
import AppContextProvider from 'hocs/withAppContext'

export const renderBaseApp = context => {

  return (
    <AppContextProvider appContext={context}>
      <Pages />
    </AppContextProvider>
  )
}

export default renderBaseApp
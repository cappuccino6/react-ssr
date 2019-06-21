import React from 'react'
import {pick} from 'lodash'
import hoistNonReactStatics from 'hoist-non-react-statics' // 类似于 Object.assign

const AppContext = React.createContext(null)

export function contextMapFn(context) {
  const type = typeof context
  if(type === 'string' || type === 'array') {
    return t => pick(t, context)
  }
  if(type === 'function') {
    return context
  }
  return t => t
}

export function withAppContext(context) {
  const contextMap = contextMapFn(context)
  return function(Component) {
    class AppContextConsumer extends React.Component {
      render() {
        return (
          <AppContext.Consumer>
            {
              v => <Component {...this.props} {...contextMap(v, this.props)}></Component>
            }
          </AppContext.Consumer>
        )
      }
    }
    hoistNonReactStatics(AppContextConsumer, Component)
    return AppContextConsumer
  }
} 

export default class AppContextProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      setAppContext: (...args) => {
        return this.setState(...args, () => {
          if (this.props.onSetAppContext) {
            this.props.onSetAppContext(this.state)
          }
        })
      },
      ...props.appContext
    }
  }

  render () {

    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

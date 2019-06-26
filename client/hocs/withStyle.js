import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { withAppContext } from './withAppContext'

function prodWithStyle () {
  return x => x
}

function devWithStyle (css) {
  if (typeof window !== 'undefined') {
    return s => s
  }

  return function withStyleInner (Component) {
    const componentName = Component.displayName || Component.name
    class CSSWrapper extends React.Component {
      render () {

        if (typeof this.props.addStyles === 'function') {
          this.props.addStyles(css)
        }

        return <Component {...this.props} css={css} />
      }
    }
    hoistNonReactStatics(CSSWrapper, Component)
    CSSWrapper.displayName = `withStyle(${componentName})`
    return withAppContext('addStyles')(CSSWrapper)
  }
}

const isProd = process.env.NODE_ENV === 'production'
const withStyle = isProd ? prodWithStyle : devWithStyle

export default withStyle

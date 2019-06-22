/**
 * 目前仅供开发环境下提取 CSS
 */

import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { withAppContext } from './withAppContext'

function devWithStyle (css) {
  if (typeof window !== 'undefined') {
    return x => x
  }

  return function devWithStyleInner (Component) {
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

function prodwithStyle () {
  return x => x
}

const withStyle = process.env.NODE_ENV === 'production' ? prodwithStyle : devWithStyle
export default withStyle

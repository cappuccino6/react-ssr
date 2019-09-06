import React from 'react'
import {compose} from 'redux' 
import {withRouter} from 'react-router'
import JumpLink from '../JumpLink'
import {routes} from 'pages'
import cx from 'classnames'
import withStyle from 'hocs/withStyle'
import css from './Navigator.css'

const Navigator = React.memo(({match: {url}}) => (
  // 用 window.location 跳转的形式，这样会走服务端渲染，解决跨域问题
  <div className={css.root}>
    {routes.map((nav, index) => (
      <JumpLink href={nav.path} key={index} className={cx(css.nav, {[css.active]: url === nav.path})}>
        {nav.name}
      </JumpLink>
    ))}
  </div>
))

export default compose(
  withRouter,
  withStyle(css)
)(Navigator)
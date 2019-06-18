import React from 'react'
import {withRouter} from 'react-router'
import cx from 'classnames'
import css from './Navigator.css'

const navs = [
  {name: '首页', link: '/home'},
  {name: '高分电影', link: '/movie/high-score'},
]

class Navigator extends React.PureComponent {
  render() {
    const {match: {url}} = this.props
    return (
      <div className={css.root}>
        {navs.map((nav, index) => (
          <a key={index} className={cx(css.nav, {[css.active]: url === nav.link})} href={nav.link}>
            {nav.name}
          </a>
        ))}
      </div>
    )
  }
}

export default withRouter(Navigator)
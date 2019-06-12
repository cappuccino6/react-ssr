import React from 'react'
import Avatar from './Avatar'
import Navigator from './Navigator'
import css from './Header.css'

const logo = 'https://b-gold-cdn.xitu.io/v3/static/img/simplify-logo.3e3c253.svg'

class Header extends React.Component {
  render() {
    return (
      <div className={css.root}>
        <div className={css.left}>
          <img className={css.logo} src={logo} />
          <Navigator />
        </div>
        <Avatar />
      </div>
    )
  }
}

export default Header
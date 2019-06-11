import React from 'react'
import { Link } from 'router'
import css from './Header.css'

const logo = 'https://b-gold-cdn.xitu.io/v3/static/img/simplify-logo.3e3c253.svg'

class Header extends React.Component {
  render() {
    return (
      <div className={css.root}>
        <img src={logo} />
      </div>
    )
  }
}

export default Header
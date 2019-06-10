import React from 'react'
import { Link } from 'router'
import css from './Header.css'

class Header extends React.Component {
  render() {
    return (
      <div className={css.root}>
        123
        <Link to="/home">home</Link>
        <Link to="/usercenter">usercenter</Link>
      </div>
    )
  }
}

export default Header
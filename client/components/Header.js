import React from 'react'
import { Link } from 'router'
import css from './Header.css'

class Header extends React.Component {
  handleAlert = () => {
    alert(123)
  }
  render() {
    return (
      <div className={css.root}>
        <div onClick={this.handleAlert}>点我</div>
        <Link to="/home">home</Link>
        <Link to="/usercenter">usercenter</Link>
      </div>
    )
  }
}

export default Header
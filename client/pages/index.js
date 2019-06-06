import React from 'react'
import {Route, Switch} from 'router'
import Home from './Home'
import UserCenter from './UserCenter'

export default () => (
  <Switch>
    <Route
      path="/"
      component={Home}
    />
    <Route
      path="/home"
      component={Home}
    />
    <Route
      path="/usercenter"
      component={UserCenter}
    />
  </Switch>
)


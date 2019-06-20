import React from 'react'
import {Route, Switch} from 'router'
import Home from './Home'
import Movie from './Movie'

export default () => (
  <Switch>
    <Route
      path="/home"
      component={Home}
    />
    <Route
      path="/movie"
      component={Movie}
    />
    <Route
      path="/"
      component={Home}
    />
  </Switch>
)


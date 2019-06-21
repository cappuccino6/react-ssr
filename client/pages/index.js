import React from 'react'
import {Route, Switch} from 'router'
import Home from './Home'
import Movie from './Movie'

export const routes = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/movie',
    component: Movie
  },
  {
    path: '/',
    component: Home
  }
]

export default () => (
  <Switch>
    {routes.map(r => (
      <Route
        key={r.path}
        path={r.path}
        component={r.component}
      />
    ))}
  </Switch>
)
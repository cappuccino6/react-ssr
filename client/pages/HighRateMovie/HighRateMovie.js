import React from 'react'
import { compose } from 'redux'
import { hot } from 'react-hot-loader'
import { withAppContext } from 'hocs/withAppContext'
import withFetch from 'hocs/withFetch'
import withStyle from 'hocs/withStyle'
import { MovieCell, Header } from 'components'
import { fetchMovies, fetchArticles } from 'store'
import css from './HighRateMovie.css'

class HighRateMovie extends React.Component {

  getInitialProps() {
    return [fetchMovies, fetchArticles]
  }

  render() {
    const fetchId = fetchMovies.id
    const {data = {}} = this.props[fetchId] || {}
    const {subjects = []} = data

    console.log(this.props)
    return (
      <div className={css.root}>
        <Header />
        <div className={css.movies}>
          {subjects.map((item, index) => (
            <MovieCell key={index} data={item} />
          ))}
        </div>
      </div>
    );
  }
}

export default compose(
  hot(module),
  withAppContext(),
  withStyle(css),
  withFetch()
)(HighRateMovie)

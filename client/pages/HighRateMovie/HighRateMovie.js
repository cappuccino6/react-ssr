import React from 'react'
import { compose } from 'redux'
import { hot } from 'react-hot-loader'
import fetch from 'utils/fetch'
import Header from 'components/Header'
import { withAppContext } from 'hocs/withAppContext'
import moreFetch from 'hocs/moreFetch'
import withStyle from 'hocs/withStyle'
import {addQuery} from 'utils/url'
import MovieCell from 'components/MovieCell'
import css from './HighRateMovie.css'

const fetchId = 'highRateMovie'

class HighRateMovie extends React.Component {

  getInitialProps() {
    return HighRateMovie.getInitialProps()
  }

  render() {
    const {data = {}} = this.props[fetchId] || {}
    const {subjects = []} = data

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

HighRateMovie.fetchId = fetchId
HighRateMovie.getInitialProps = () => fetch(addQuery('https://movie.douban.com/j/search_subjects', {
  type: 'movie',
  tag: '豆瓣高分',
  sort: 'recommend',
  page_limit: 40,
  page_start: 0
}))

export default compose(
  hot(module),
  withAppContext(),
  withStyle(css),
  moreFetch({fetchId})
)(HighRateMovie)

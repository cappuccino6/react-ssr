import React from 'react'
import { compose } from 'redux'
import { hot } from 'react-hot-loader'
import fetch from 'utils/fetch'
import Header from 'components/Header'
import { withAppContext } from 'hocs/withAppContext'
import moreFetch from 'hocs/moreFetch'

const fetchId = 'moviePage'

class Movie extends React.Component {
  getInitialProps() {
    return Movie.getInitialProps()
  }

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

Movie.getInitialProps = () => fetch('https://movie.douban.com/j/search_subjects?type=movie&tag=%E8%B1%86%E7%93%A3%E9%AB%98%E5%88%86&sort=recommend&page_limit=20&page_start=0')
Movie.fetchId = fetchId

export default compose(
  hot(module),
  withAppContext(),
  moreFetch({ fetchId })
)(Movie)

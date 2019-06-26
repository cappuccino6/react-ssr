import fetch from 'utils/fetch'
import {addQuery} from 'utils/url'

export const fetchMovies = {
  id: 'HighRateMovie',
  ajax: () => fetch(addQuery('https://movie.douban.com/j/search_subjects', {
    type: 'movie',
    tag: '豆瓣高分',
    sort: 'recommend',
    page_limit: 40,
    page_start: 0
  }))
}

export default {
  fetchMovies
}
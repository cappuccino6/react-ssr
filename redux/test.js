import { createAction, handleActions } from 'redux-actions'
import http from 'utils/http'

export const initialState = {
  categories: {}
}

const FETCH_TEST = 'class/FETCH_TEST'
export const fetchTest = createAction(FETCH_TEST, () => 
  http('http://3darar.com/api/v1/categories')
)

export default handleActions({
  [`${FETCH_TEST}_FULFILLED`]: (state, {payload: {data}}) => ({
    ...state,
    categories: data
  }),
}, initialState)

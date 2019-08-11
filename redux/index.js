import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleWare from 'redux-thunk'
import createPromiseMiddleWare from 'redux-promise-middleware'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import reducers from './reducer'
import { reducer as formReducer } from 'redux-form'

const sagaMiddleWare = createSagaMiddleware()
const promiseMiddleWare = createPromiseMiddleWare

let middleWare = applyMiddleware(thunkMiddleWare, promiseMiddleWare, sagaMiddleWare)

if(process.env.NODE_ENV === 'development') {
  middleWare = compose(
    applyMiddleware(thunkMiddleWare, promiseMiddleWare, sagaMiddleWare, createLogger()),
  )
}

const store = createStore(
  combineReducers({
    ...reducers, 
    form: formReducer
  }),
  {},
  middleWare
)

export default store

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// IMPORT REDUCERS
import {
  productListReducer,
  productDetailReducer,
} from './reducers/productReducers'

/*=======================================
REDUCERS | STATE
========================================*/
const reducers = combineReducers({
  productList: productListReducer,
  productDetails: productDetailReducer,
})

const initialState = {}

const middleware = [thunk]

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store

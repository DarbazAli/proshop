import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import {
    productListReducer,
    productDetailReducer,
} from './reducers/productReducers.js'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailReducer,
})
const initialState = {}
const middlware = [thunk]
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlware))
)

export default store
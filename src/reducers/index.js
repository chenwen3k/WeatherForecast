import {combineReducers} from 'redux'
import navReducer from './navigation'
import weatherReducer from './weather'

export default combineReducers({
    nav: navReducer,
    weather: weatherReducer
})
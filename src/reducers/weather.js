import {Alert} from 'react-native';

export default (state = {localWeather: [], position: [], loading: false}, action) => {
    console.log(`reducer: ${action.type}`);
    switch (action.type) {
        case 'GET_LOCATION':
            return {
                ...state,
                loading: true
            };
        case 'GET_WEATHER':
            return state;
        case 'GET_ADDRESS':
            return state;
        case 'GET_ADDRESS_SUCCESS':
            return {
                ...state,
                position: action.data
            };
        case 'GET_WEATHER_SUCCESS':
            return {
                ...state,
                loading: false,
                localWeather: action.data
            };
        case 'GET_POSITION_ERROR':
            Alert.alert("Can't get your location");
            return {
                ...state,
                loading: false,
                localWeather: [],
                position: []
            };
        case 'GET_ADDRESS_ERROR':
            Alert.alert("Can't get your address");
            return {
                ...state,
                loading: false,
                position: []
            };
        case 'GET_WEATHER_ERROR':
            Alert.alert("Can't get your weather");
            return {
                ...state,
                loading: false,
                localWeather: []
            };
        default:
            return state
    }
}

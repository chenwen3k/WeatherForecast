import {Alert} from 'react-native';

export default (state = {data: [], loading: false}, action) => {
    console.log(action);
    console.log(action.type);
    switch (action.type) {
        case 'GET_LOCATION':
            return {
                ...state,
                loading: true,
                data: []
            };
        case 'GET_LOCATION_SUCCESS':
            return state;
        case 'GET_ADDRESS':
            return state;
        case 'GET_ADDRESS_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.data
            };
        case 'GET_LOCATION_ERROR':
            Alert.alert("Can't get your location");
            return {
                ...state,
                loading: false,
                data: []
            };
        case 'GET_ADDRESS_ERROR':
            Alert.alert("Can't get your address");
            return {
                ...state,
                loading: false,
                data: []
            };
        default:
            return state
    }
}

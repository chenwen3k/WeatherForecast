import {timestampToDate} from '../utils'

export default (state = {localWeather: {}, position: {}, loading: false, errorMsg: ""}, action) => {
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
                currentWeather: restructureCurrentWeather(action.data)
            };
        case 'GET_POSITION_ERROR':
            return {
                ...state,
                loading: false,
                localWeather: [],
                position: [],
                errorMsg: "Can't get your location"
            };
        case 'GET_ADDRESS_ERROR':
            return {
                ...state,
                loading: false,
                position: [],
                errorMsg: "Can't get your address"
            };
        case 'GET_WEATHER_ERROR':
            return {
                ...state,
                loading: false,
                localWeather: [],
                errorMsg: "Can't get your weather"
            };
        default:
            return state
    }
}

const restructureCurrentWeather: Object = (currentWeather) => {
    let structuredCurrentWeather = {};
    if (currentWeather) {
        if (currentWeather.weather && currentWeather.weather.length > 0) {
            structuredCurrentWeather["weatherDesc"] = currentWeather.weather[0].main;
            structuredCurrentWeather["weatherIcon"] = currentWeather.weather[0].icon;
        }
        if (currentWeather.main) {
            structuredCurrentWeather["temp"] = currentWeather.main.temp.toFixed(0);
            structuredCurrentWeather["pressure"] = currentWeather.main.pressure;
            structuredCurrentWeather["humidity"] = currentWeather.main.humidity;
            structuredCurrentWeather["tempMin"] = currentWeather.main.temp_min.toFixed(0);
            structuredCurrentWeather["tempMax"] = currentWeather.main.temp_max.toFixed(0);
        }
        if (currentWeather.visibility) {
            structuredCurrentWeather["visibility"] = currentWeather.visibility;
        }

        if (currentWeather.wind && currentWeather.wind.speed) {
            structuredCurrentWeather["windSpeed"] = currentWeather.wind.speed;
        }
        if (currentWeather.sys) {
            let sunrise = currentWeather.sys.sunrise;
            if (sunrise) {
                structuredCurrentWeather["sunrise"] = timestampToDate(sunrise, "hh:mma");
            }
            let sunset = currentWeather.sys.sunset;
            if (sunset) {
                structuredCurrentWeather["sunset"] = timestampToDate(sunset, "hh:mma");
            }
        }
    }
    return structuredCurrentWeather;
};

const restructureWeather = (localWeather) => {
    if (localWeather && localWeather.list && localWeather.list.length > 0) {
        localWeather.list.forEach(item => {
            console.log("timestampToDate", timestampToDate(item.dt, "LLLL"));
        })
    }
};

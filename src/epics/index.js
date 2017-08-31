import {combineEpics} from 'redux-observable'
import {Observable} from "rxjs";
import {ajax} from 'rxjs/observable/dom/ajax'
import {WEATHER_URI, FORECAST, DAILY} from '../config.json'
import {weatherAjaxWrapper} from '../utils'

const getLocationEpic = action$ =>
    action$.ofType('GET_LOCATION')
        .mergeMap(() =>
            currentPosition$()
                .flatMap(data =>
                    // Concat 2 observables so they fire sequentially
                    Observable.concat(
                        Observable.of({
                            type: 'GET_WEATHER',
                            data: {"latitude": data.coords.latitude, "longitude": data.coords.longitude}
                        }),
                        Observable.of({
                            type: 'GET_ADDRESS',
                            data: {"latitude": data.coords.latitude, "longitude": data.coords.longitude}
                        })
                    )
                )
                // .map(data => ({
                //     type: 'GET_ADDRESS',
                //     data: {"latitude": data.latitude, "longitude": data.longitude}
                // }))
                .catch(error => {
                    console.log("GET POSITION ERR", error);
                    return Observable.of({type: 'GET_POSITION_ERROR', error: error});
                })
        );

const getAddressEpic = action$ =>
    action$.ofType('GET_ADDRESS')
        .do(data => console.log(data))
        .switchMap(action =>
            ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${action.data.latitude},${action.data.longitude}`)
                .map(data => ({
                    type: 'GET_ADDRESS_SUCCESS', data: {
                        address: data.response.results[0].formatted_address,
                        latitude: action.data.latitude,
                        longitude: action.data.longitude
                    }
                }))
                .catch(error => {
                    console.log("GET_ADDRESS_ERROR", error);
                    return Observable.of({type: 'GET_ADDRESS_ERROR', error: error});
                }));

const getCurrentWeatherEpic = action$ =>
    action$.ofType('GET_WEATHER')
        .switchMap(action => {
                console.log("getCurrentWeatherEpic!");

                return weatherAjaxWrapper(WEATHER_URI, {"lat": action.data.latitude, "lon": action.data.longitude})
                    .map(data => ({
                        type: 'GET_WEATHER_SUCCESS', data: data.response
                        // data: {
                        //     address: data.response.results[0].formatted_address,
                        //     latitude: action.data.latitude,
                        //     longitude: action.data.longitude
                        // }
                    }))
                    .catch(error => {
                        console.log("GET_WEATHER_ERROR", error);
                        return Observable.of({type: 'GET_WEATHER_ERROR', error: error});
                    });

            }
        );


const currentPosition$ = () => getCurrentPositionObservable({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000
});

const getCurrentPositionObservable = (options) => new Observable(observer => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(`getCurrentAddress`);
            observer.next(position);
            observer.complete();
        },
        error => {
            observer.error(error);
        },
        options
    );
    // is there any way to cancel this? If so, return a teardown function
    // that does so!
});

const rootEpic = combineEpics(
    getLocationEpic,
    getAddressEpic,
    getCurrentWeatherEpic
);

export default rootEpic
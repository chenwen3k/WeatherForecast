import {combineEpics} from 'redux-observable'
import {Observable} from "rxjs";
import {ajax} from 'rxjs/observable/dom/ajax'

const getLocationEpic = action$ =>
    action$.ofType('GET_LOCATION')
        .mergeMap(() =>
            currentPosition$()
                .map(data => ({
                    type: 'GET_ADDRESS',
                    data: {"latitude": data.coords.latitude, "longitude": data.coords.longitude}
                }))
                .catch(error => {
                    console.log("GET POSITION ERR", error);
                    return Observable.of({type: 'GET_POSITION_ERROR', error: error});
                })
        );

const getAddressEpic = action$ =>
    action$.ofType('GET_ADDRESS')
        .do({
            next: data => {console.log(data.data)}
        })
        .switchMap(action =>
            ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${action.data.latitude},${action.data.longitude}`)
                .map(data => (data))
                .do({
                    next: data => {
                        console.log("address data");
                        console.log(data);
                    }
                })
                .map(data => ({
                    type: 'GET_ADDRESS_SUCCESS', data: data.response.results[0].formatted_address
                }))
                .catch(error => {
                    console.log("GET_ADDRESS_ERROR", error);
                    return Observable.of({type: 'GET_ADDRESS_ERROR', error: error});
                }));


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
    getAddressEpic
);

export default rootEpic
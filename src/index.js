import React from 'react';
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {createEpicMiddleware} from 'redux-observable'
import AppWithNavigationState from './navigators'
import reducers from './reducers'
import appEpic from './epics'

const epicMiddleware = createEpicMiddleware(appEpic);

const store = createStore(reducers, applyMiddleware(epicMiddleware));

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState/>
            </Provider>
        );
    }
}
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Platform, StatusBar} from 'react-native';
import {addNavigationHelpers, StackNavigator} from 'react-navigation';

import MainScreen from '../components/MainScreen';

export const AppNavigator = StackNavigator({
        Main: {
            screen: MainScreen
        },
    },
    {
        navigationOptions: {
            header: null,
        },
    });

const AppWithNavigationState = ({dispatch, nav}) => (
    <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})}/>
);

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    // nav as a prop
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
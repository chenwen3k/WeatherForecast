import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, View, Text, Geolocation} from 'react-native'
import MapView from 'react-native-maps';
import {getLocation} from '../actions'
import LoadingView from './LoadingView'

let i = 0;
class MainScreen extends Component {
    static navigationOptions = {
        title: 'Weather forecast',
    };

    componentDidMount() {
        this.props.onComponentMount();
    }

    render() {
        i++;
        console.log("render", i);
        return (
            <View style={styles.container}>

                {this.renderLoadingView(this.props.loading)}
                {this.renderAddress(this.props.position)}
                <MapView
                    style={{
                        height: 200,
                        width: 200
                    }}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            </View>

        )
    }

    renderLoadingView = (loading) => {
        if (loading) {
            return (<LoadingView showLoading={true}/>);
        }
    };

    renderAddress = (data) => {
        if (data && data.address) {
            return (<Text style={styles.text}>{data.address}</Text>);
        }
    };
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: '#FF0000',
        flex: 1
    },
    text: {}
});


const mapStateToProps = state => {
    return {
        loading: state.weather.loading,
        position: state.weather.position,
        localWeather: state.weather.localWeather,
    }
};

const dispatchToProps = dispatch => {
    return {
        onComponentMount: () => dispatch(getLocation())
    }
};

export default connect(mapStateToProps, dispatchToProps)(MainScreen);
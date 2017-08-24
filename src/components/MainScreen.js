import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, View, Text, Geolocation} from 'react-native'
import MapView from 'react-native-maps';
import {getLocation} from '../actions'

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
        console.log(this);
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.data}</Text>
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
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    text: {
        backgroundColor: '#00FF00'
    }
});


const mapStateToProps = state => {
    console.log("mapStateToProps");
    console.log(state);
    return {
        loading: state.weather.loading,
        data: state.weather.data,
    }
};

const dispatchToProps = dispatch => {
    return {
        onComponentMount: () => dispatch(getLocation())
    }
};

export default connect(mapStateToProps, dispatchToProps)(MainScreen);
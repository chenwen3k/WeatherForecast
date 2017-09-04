import React, {Component} from 'react'
import {Alert, Animated, ScrollView, Platform} from 'react-native'
import {connect} from 'react-redux'
import {Image, StyleSheet, View, Text, PixelRatio} from 'react-native'
import MapView from 'react-native-maps';
import {getLocation} from '../actions'
import LoadingView from './LoadingView'
import {screenWidth, screenHeight, timestampToDate} from '../utils'
import {WEATHER_BG_WIDTH, WEATHER_BG_HEIGHT, WEATHER_ICON} from '../config.json'

let i = 0;
class MainScreen extends Component {


    constructor(props: any) {
        super(props);
        this.bgWidth = WEATHER_BG_WIDTH / WEATHER_BG_HEIGHT * screenHeight;
        console.log("screenHeight", screenHeight);
        console.log("screenWidth", screenWidth);
        this.offsetX = screenWidth - this.bgWidth;

        this.state = {
            translateX: new Animated.Value(this.offsetX),
        };
        console.log("bgWidth", this.bgWidth);
        this.animationStart = false;
    }

    componentDidMount() {
        this.props.onComponentMount();
    }

    shouldComponentUpdate() {
        console.log("shouldComponentUpdate");
        return true;
    }

    componentWillUpdate() {
        console.log("componentWillUpdate");
        console.log("currentWeather", this.props.currentWeather);
    }

    render() {
        i++;
        console.log("render", i);
        console.log("this.state.translateX", this.state.translateX);
        console.log("in render currentWeather", this.props.currentWeather);
        if (this.props.currentWeather && !this.animationStart) {
            console.log("animationStart");
            Animated.timing(this.state.translateX, {
                toValue: 0,
                duration: 10000
            }).start();
            this.animationStart = true;
        }
        return (
            <View style={styles.fullScreen}>
                <Animated.Image
                    style={{
                        position: "absolute",
                        width: this.bgWidth,
                        height: screenHeight,
                        transform: [{translateX: this.state.translateX}]
                    }}
                    resizeMode="contain"
                    source={require("../res/image/sunny_bg.jpg")}
                />

                {this.renderLocation(this.props.position)}
                {this.renderDivider()}
                <ScrollView>
                    {this.renderLocalWeather(this.props.currentWeather)}
                </ScrollView>
                {this.renderLoadingView(this.props.loading)}
                {this.renderErrorAlert(this.props.errorMsg)}
            </View>
        )
    }

    renderLocation = (data) => {
        if (data && data.address) {
            return (
                <View style={styles.location}>
                    <Image source={require('../res/image/location.png')} style={{
                        width: PixelRatio.getPixelSizeForLayoutSize(12),
                        height: PixelRatio.getPixelSizeForLayoutSize(12),
                    }}/>
                    <Text style={[styles.textCommon, {
                        marginRight: 10
                    }]}
                          numberOfLines={1}
                          ellipsizeMode="tail">{data.address}</Text>
                </View>
            );
        }
    };

    renderDivider = () => {
        return (
            <View style={{height: 1, backgroundColor: "rgba(0,0,0,0.1)",}}/>
        );
    };

    renderLocalWeather = (currentWeather) => {
        if (currentWeather)
            return (
                <View style={{alignItems: 'center'}}>
                    <Text style={[styles.textCommon, styles.textLarge]}
                          numberOfLines={1}
                          ellipsizeMode="tail">{currentWeather.weatherDesc}</Text>

                    {console.log(`${WEATHER_ICON}${currentWeather.weatherIcon}.png`)}
                    <Image
                        style={{width: 50, height: 50}}
                        source={{uri: 'http://openweathermap.org/img/w/50n.png'}}
                    />
                    <Image style={{width: 40, height: 40}}
                           source={{uri: `${WEATHER_ICON}${currentWeather.weatherIcon}.png`}}/>
                    <Text style={styles.textCommon}
                          numberOfLines={1}
                          ellipsizeMode="tail">{currentWeather.weatherDesc}</Text>
                    {this.renderDivider()}
                </View>
            );
    };

    renderLoadingView = (loading) => {
        console.log("renderLoadingView", loading);
        if (loading) {
            return (<LoadingView showLoading={true}/>);
        }
    };

    renderErrorAlert = (errorMsg) => {
        console.log("errorMsg", errorMsg);
        if (errorMsg) {
            // Bug from RN, see: https://github.com/facebook/react-native/issues/10471
            setTimeout(() => {
                Alert.alert("Ooops", errorMsg);
            }, 200);
        }
    };

}

const styles = StyleSheet.create({
    fullScreen: {
        flexDirection: 'column',
        flex: 1
    },
    location: {
        marginTop: Platform.OS === 'ios' ? 20 + 10 : 10,
        marginBottom: 10,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center'
    },
    textCommon: {
        textShadowColor: 'rgba(0,0,0,0.7)',
        color: '#FFFFFF',
        backgroundColor: '#00000000',
        textShadowOffset: {width: 1, height: 1},
        fontSize: 16,
        textShadowRadius: 1,
        flex: 1
    },
    textLarge: {
        fontSize: 20
    }
});


const mapStateToProps = state => {
    return {
        loading: state.weather.loading,
        position: state.weather.position,
        currentWeather: state.weather.currentWeather,
        errorMsg: state.weather.errorMsg,
    }
};

const dispatchToProps = dispatch => {
    return {
        onComponentMount: () => dispatch(getLocation())
    }
};

export default connect(mapStateToProps, dispatchToProps)(MainScreen);
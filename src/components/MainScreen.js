import React, {Component} from 'react'
import {Alert, Animated, ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {Image, StyleSheet, View, Text, PixelRatio} from 'react-native'
import MapView from 'react-native-maps';
import {getLocation} from '../actions'
import LoadingView from './LoadingView'
import {screenWidth, screenHeight, timestampToDate} from '../utils'
import {WEATHER_BG_WIDTH, WEATHER_BG_HEIGHT} from '../config.json'

let i = 0;
class MainScreen extends Component {
    static navigationOptions = {
        title: 'Weather forecast',
    };

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

        if (this.props.currentWeather && !this.animationStart) {
            console.log("animationStart");
            Animated.timing(this.state.translateX, {
                toValue: 0,
                duration: 10000
            }).start();
            this.animationStart = true;
        }
    }

    render() {
        i++;
        console.log("render", i);
        console.log("this.state.translateX", this.state.translateX);
        return (
            <View style={styles.fullScreen}>
                <Animated.Image
                    style={{
                        width: this.bgWidth,
                        height: screenHeight,
                        transform: [{translateX: this.state.translateX}]
                    }}
                    resizeMode="contain"
                    source={require("../res/image/sunny_bg.jpg")}
                />

                <View style={{
                    width: StyleSheet.hairlineWidth,
                    backgroundColor: "#00FFFF",
                    position: "absolute",
                    flexDirection: "column"
                }}>
                    {this.renderLocation(this.props.position)}
                    {this.renderDivider()}
                    <ScrollView style={styles.scrollContainer}>
                        {this.renderLocalWeather(this.props.currentWeather)}
                        {this.renderDivider()}
                    </ScrollView>
                </View>
                <View style={styles.container}>
                    {this.renderLoadingView(this.props.loading)}
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
                {this.renderErrorAlert(this.props.errorMsg)}
            </View>

        )
    }

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

    renderLocalWeather = (currentWeather) => {
        console.log("currentWeather", currentWeather);
        // if (localWeather && localWeather.list && localWeather.list.length > 0) {
        //     console.log("timestampToDate", timestampToDate(localWeather.list[0].dt, "YYYYMMDD hh:MM:ss"));
        if (currentWeather)
            return (
                <View style={styles.fullHorizontal}>
                    <Text style={styles.text}
                          numberOfLines={1}
                          ellipsizeMode="tail">{currentWeather.weatherDesc}</Text>
                </View>
            );
        // }
    };

    renderLocation = (data) => {
        if (data && data.address) {
            return (
                <View style={
                    [styles.fullHorizontal,
                        {top: 10, left: 8, bottom: 10}
                    ]}>
                    <Image source={require('../res/image/location.png')} style={{
                        width: PixelRatio.getPixelSizeForLayoutSize(12),
                        height: PixelRatio.getPixelSizeForLayoutSize(12),
                    }}/>
                    <Text style={styles.text}
                          numberOfLines={1}
                          ellipsizeMode="tail">{data.address}</Text>
                </View>
            );
        }
    };

    renderDivider = () => {
        return (
            <View style={{height: 1, backgroundColor: "#00FFFF", paddingLeft: 0, paddingRight: 0}}>
            </View>
        );                        // 'rgba(0,0,0,0.1)'}

    };
}

const styles = StyleSheet.create({
    fullScreen: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#0000FF',
    },
    fullHorizontal: {
        flexDirection: 'row',
        alignItems: "center"
    },
    scrollContainer: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#FF0000',
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: '#FF0000',
        flex: 1
    },
    text: {
        textShadowColor: 'rgba(0,0,0,0.7)',
        color: '#FFFFFF',
        backgroundColor: '#00000000',
        left: 8,
        textShadowOffset: {width: 1, height: 1},
        fontSize: 14,
        textShadowRadius: 1
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
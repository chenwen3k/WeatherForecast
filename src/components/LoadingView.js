import React, {Component} from 'react';

import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal
} from 'react-native';
import loadingImage from '../res/image/loading.gif'
const {width, height} = Dimensions.get('window');

class LoadingView extends Component {
    constructor(props) {
        super(props);
    }

    _close() {
        console.log("onRequestClose ---- ");
        this.props.showLoading = false;
    }

    render() {
        console.log("render loadingview")
        const {showLoading, opacity, backgroundColor} = this.props;
        return (
            <Modal onRequestClose={() => this._close()} visible={showLoading} transparent>
                <View style={ [styles.loadingView, {
                    opacity: opacity || 0.3,
                    backgroundColor: backgroundColor || 'gray'
                }]}/>
                <View style={ styles.loadingImageView }>
                    <View style={ styles.loadingImage }>
                        {
                            this.props.loadingViewClick ?
                                <TouchableOpacity onPress={ this.props.loadingViewClick }>
                                    <Image style={ styles.loadingImage } source={ loadingImage }/>
                                </TouchableOpacity> :
                                <Image style={ styles.loadingImage } source={ loadingImage }/>
                        }
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        height,
        width,
        position: 'absolute'
    },
    loadingImage: {
        width: 120,
        height: 120,
    },
    loadingImageView: {
        position: 'absolute',
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

LoadingView.propTypes = {
    loadingViewClick: React.PropTypes.func,
    showLoading: React.PropTypes.bool.isRequired,
    opacity: React.PropTypes.number,
    backgroundColor: React.PropTypes.string
};


export default LoadingView

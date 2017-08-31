import {ajax} from 'rxjs/observable/dom/ajax'
import {SUFFIX} from '../config.json'
import {Dimensions} from 'react-native'
import moment from "moment";

export const weatherAjaxWrapper = (urlOrRequest: string, param: Object) => {
    param = {...param, ...SUFFIX};

    urlOrRequest = addAppendix(urlOrRequest, param);
    console.log('param', param);
    console.log('urlOrRequest', urlOrRequest);

    return (
        ajax(urlOrRequest)
    );
};

export const addAppendix: string = (url, appendix: Object) => {
    let splitResult = url.split("?");
    console.log("splitResult", splitResult);
    let connector = "?";
    if (splitResult.length > 1) {
        connector = "&"
    }

    let result = url;
    Object.keys(appendix).map(key => {
        result = result + connector + key + "=" + appendix[key];
        if (connector === "?") {
            connector = "&";
        }
    });

    return result;
};

export const timestampToDate: string = (timestamp?, formatStr) => {
    return moment(timestamp * 1000).format(formatStr);
};

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
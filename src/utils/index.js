import {ajax} from 'rxjs/observable/dom/ajax'
import {APPID} from '../config.json'

export const weatherAjaxWrapper = (urlOrRequest: string) => {
    urlOrRequest = addAppendix(urlOrRequest, APPID);
    console.log('Error', urlOrRequest);
    return (
        ajax(urlOrRequest)
    );
};

export const addAppendix: string = (url, appendix: string | Array) => {
    var splitResult = url.split("?");
    console.log("splitResult", splitResult);
    var connector = "?";
    if (splitResult.length > 1) {
        connector = "&"
    }

    return url + connector + appendix;
}
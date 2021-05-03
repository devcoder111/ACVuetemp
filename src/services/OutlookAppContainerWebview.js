// eslint-disable-next-line
import {applog} from '@/services/applog.js'

//this is our outlook app
export class OutlookAppContainerWebview {

    classname;

    constructor() {
        this.classname='OutlookAppContainerWebview';
    }

    OpenExternalURL(url)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.OpenExternalURL(url);
    }

    consolelog(msg)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.consolelog(msg);
    }

    popupCenter(urlname, url, _datastring, params)
    {
        window.chrome.webview.hostObjects.sync.TS.popupCenter(urlname, url, _datastring, params);
    }

    replytagemail(dataAsString)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.replytagemail(dataAsString);
    }

    getDocuments(dataAsString)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.getDocuments(dataAsString);
    }

    removeTag(tagPrefixSuffix)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.removeTag(tagPrefixSuffix);
    }

    tagEmail(dataAsString)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.tagEmail(dataAsString);
    }

    newtask(dataAsString)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.newtask(dataAsString);
    }

    newappt(dataAsString)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.newappt(dataAsString);
    }

    newemail(dataAsString)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.newemail(dataAsString);
    }

    setInstanceSettings(connectionName,instanceSettingsAsString)
    {
        console.log('setInstanceSettings webview2 #1 of 2');
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.setInstanceSettings(connectionName,instanceSettingsAsString);
        console.log('setInstanceSettings webview2 #2 of 2');
    }

    SelectionChange()
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.SelectionChange();
    }

    buttonAction(senderDialog,dialogAction,senderData)
    {
        console.log('buttonAction webview,'+senderDialog+','+dialogAction+','+senderData);
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.buttonAction(senderDialog,dialogAction,senderData);
    }

    fileUpload(dataAsString)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.fileUpload(dataAsString);
    }
    getEmailData(sender)
    {
        console.log('getEmailData webview sender:'+sender);
        // eslint-disable-next-line
        let res=null;
        try{
            res = window.chrome.webview.hostObjects.sync.TS.getEmailData(sender);
            console.log('getEmailData webview2 #A');
        }catch{
            res = window.chrome.webview.hostObjects.sync.TS.getEmailData();
            console.log('getEmailData webview2 #B');
        }
        console.log('getEmailData webview2 ');
        return res;
    }
    updateProps(dataAsString)
    {
        // eslint-disable-next-line
        window.chrome.webview.hostObjects.sync.TS.updateProps(dataAsString);
    }

}
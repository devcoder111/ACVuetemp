// eslint-disable-next-line
import {applog} from '@/services/applog.js'

//this is our outlook app
export class OutlookAppContainer {

    classname;
    coreObject;

    constructor() {
        this.classname='OutlookAppContainer'
    }

    OpenExternalURL(url)
    {
        // eslint-disable-next-line
        window.external.OpenExternalURL(url);
    }

    consolelog(msg)
    {
        // eslint-disable-next-line
        window.external.consolelog(msg);
    }

    popupCenter(urlname, url, _datastring, params)
    {
        // eslint-disable-next-line
        window.external.popupCenter(urlname, url, _datastring, params);
    }

    replytagemail(dataAsString)
    {
        // eslint-disable-next-line
        window.external.replytagemail(dataAsString);
    }

    getDocuments(dataAsString)
    {
        // eslint-disable-next-line
        window.external.getDocuments(dataAsString);
    }

    removeTag(tagPrefixSuffix)
    {
        // eslint-disable-next-line
        window.external.removeTag(tagPrefixSuffix);
    }

    tagEmail(dataAsString)
    {
        // eslint-disable-next-line
        window.external.tagEmail(dataAsString);
    }

    newtask(dataAsString)
    {
        // eslint-disable-next-line
        window.external.newtask(dataAsString);
    }

    newappt(dataAsString)
    {
        // eslint-disable-next-line
        window.external.newappt(dataAsString);
    }

    newemail(dataAsString)
    {
        // eslint-disable-next-line
        window.external.newemail(dataAsString);
    }

    setInstanceSettings(connectionName,instanceSettingsAsString)
    {
        // eslint-disable-next-line
        window.external.setInstanceSettings(connectionName,instanceSettingsAsString);
    }

    SelectionChange()
    {
        // eslint-disable-next-line
        window.external.SelectionChange();
    }

    buttonAction(senderDialog,dialogAction,senderData)
    {
        // eslint-disable-next-line
        window.external.buttonAction(senderDialog,dialogAction,senderData)
    }

    fileUpload(dataAsString)
    {
        // eslint-disable-next-line
        window.external.fileUpload(dataAsString)
    }
    getEmailData(sender)
    {
        console.log("getEmailData:"+sender);
        // eslint-disable-next-line
        let res=null;
        try{
            res= window.external.getEmailData(sender);
        }catch{
            //old format...fallback for those with older outlook clients
            res= window.external.getEmailData();
        }
        return res;
    }
    updateProps(dataAsString)
    {
        // eslint-disable-next-line
        window.external.updateProps(dataAsString)
    }

}
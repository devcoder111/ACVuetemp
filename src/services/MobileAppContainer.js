// eslint-disable-next-line
import {applog} from '@/services/applog.js'

export class MobileAppContainer {

    classname;

    constructor() {
        this.classname='MobileAppContainer';
         // Set up ItemChanged event
        
    }

    OpenExternalURL(url)
    {
        window.open(url);
    }

    consolelog(msg)
    {
        console.log(msg);
    }

    async popupCenter(urlname, url, _datastring, params){
        this.consolelog("MobileAppContainer popupCenter:"+urlname);
        this.consolelog("url:"+url);
        this.consolelog(urlname, url, _datastring, params);
    }
    
    newtask(dataAsString){
        this.consolelog(dataAsString);
    }

    newappt(dataAsString){
        this.consolelog(dataAsString);
    }

    newemail(dataAsString){
        this.consolelog(dataAsString);
    }

    setInstanceSettings(connectionName,instanceSettingsAsString)
    {
        this.consolelog(connectionName+"="+instanceSettingsAsString);
    }

    buttonAction(senderDialog,dialogAction,senderData){
        this.consolelog("MobileAppContainer buttonAction:"+senderDialog+"="+dialogAction+"="+senderData);
    }

    fileUpload(dataAsString){
        this.consolelog("MobileAppContainer fileUpload");
        this.consolelog(dataAsString);
    }
  
}
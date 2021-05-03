//use this line to include this
/*

    // eslint-disable-next-line
    import {applog} from '@/services/applog.js'

*/
//
//use as
/*
    this.$applog('logMessage')
*/
import Vue from 'vue'

Vue.prototype.$applog = function (msg) {
    try{
        console.log(msg);
        window.external.consolelog(msg);
    }catch (e){
        try{
            // eslint-disable-next-line
            return chrome.webview.hostObjects.sync.TS.consolelog(msg);
        }catch (ee){
            //ignore
        }
    }
};
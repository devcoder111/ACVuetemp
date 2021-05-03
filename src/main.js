import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

import Vue from 'vue'
import App from './App.vue'
//import './registerServiceWorker'
import router from './router'
import store from './store'
import polyfill from '@/plugins/polyfill'
import {MailBox} from '@/services/EmailConnectors/mailBox'
import {Office365Container} from '@/services/Office365Container'
import {OutlookAppContainer} from '@/services/OutlookAppContainer'
import {OutlookAppContainerWebview} from '@/services/OutlookAppContainerWebview'
import {MobileAppContainer} from '@/services/MobileAppContainer'

import vuetify from './plugins/vuetify'

import VueI18n from "vue-i18n";
import '@/scss/variables.scss';

import en from "../src/assets/locales/en.json";
import enUS from "../src/assets/locales/en-US.json";
import enGB from "../src/assets/locales/en-GB.json";
import de from "../src/assets/locales/de.json";
import es from "../src/assets/locales/es.json";
import fr from "../src/assets/locales/fr.json";
const messages = { en, enUS, enGB, de,  es, fr }

import VueLocalStorage from 'vue-localstorage'
 // eslint-disable-next-line
import DataFactoryClass from '@/services/dataFactory'

Vue.prototype.$extrasmall=500;
Vue.prototype.$small=650;
Vue.config.productionTip = false;

const appMode = store.getters.appMode;

if (appMode == 'MX') {
  Vue.prototype.$appContainer=new MobileAppContainer();
}else
if (appMode == 'AC') {
  //now...whats our container?....not the most elegant i admit
  try {
    window.external.getHost();
    Vue.prototype.$appContainer=new OutlookAppContainer();
  }catch(e)
  {
    try{
      //got to try for our webview2 version
      // eslint-disable-next-line
      window.chrome.webview.hostObjects.sync.TS.getHost();
      Vue.prototype.$appContainer=new OutlookAppContainerWebview();
    }catch (ee){
      Vue.prototype.$appContainer=new Office365Container(window.Office);
    }    
  }
  Vue.prototype.$mailbox = new MailBox(Vue.prototype.$appContainer);
}
Vue.use(VueLocalStorage);

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
//NOTE ON AWS AMPLIFY....IT BREAKS IE11...THIS IS AN ISSUE FOR US

//import { registerWebPlugin } from '@capacitor/core';
//registerWebPlugin(Plugins);
Vue.use(Plugins)

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  messages
});

Storage.get({ key : "appLanguage"}).then(key => {
  if (key.value==null)
  {
    i18n.locale = navigator.language;
  }else{
    i18n.locale = key.value;
  }
  //TO TEST LANGUAGES....
  // i18n.locale = 'en';
});

function mainRun()
{
  window.vueAppInstance = new Vue({
    i18n,
    router,
    store,
    Storage,
    polyfill,
    MailBox,
    OutlookAppContainer,
    Office365Container,
    vuetify,
    iconfont: 'mdi',
    render: h => h(App),
    methods: {
      async changeRoute(_name, _params)
      {
        //used by our windows app to navigate the dialogs
        this.$applog('main changeRoute');
        this.$applog('main changeRoute name:'+_name);
        this.$applog('main changeRoute params:'+JSON.stringify(_params));
        //window.vueAppInstance.changeRoute('someroute',{ some param object }) ---should be called from taskpane..dialog to taskpane is the direction
        this.$router.push({ name: _name, params: _params });
        this.$applog('main changeRoute COMPLETE');
      },
      async processMessageQ() {
        //window.vueAppInstance.processMessageQ() ---should be called from taskpane..dialog to taskpane is the direction
        //this.$applog('main processMessageQ');//CHANGED HERE AS MIGHT NOT BE WORKING ALL THE TIME
        try{
          console.log('main processMessageQ');
          window.external.consolelog('main processMessageQ');
        }catch (e){
          try{
            // eslint-disable-next-line
            window.chrome.webview.hostObjects.sync.TS.consolelog('main processMessageQ');
          }catch (ee){
            //ignore
          }          
        }        
        window.vueAppInstance.$mailbox.processQueue();
        try{
          console.log('main processMessageQ COMPLETE');
          window.external.consolelog('main processMessageQ COMPLETE');
        }catch (e){
          try{
            // eslint-disable-next-line
            window.chrome.webview.hostObjects.sync.TS.consolelog('main processMessageQ COMPLETE');
          }catch (ee){
            //ignore
          }  
        }             
        //this.$applog('main processMessageQ COMPLETE');
      }
    }
  }).$mount('#app');
}
console.log('Vue.prototype.$appContainer.classname:'+Vue.prototype.$appContainer.classname);
if (Vue.prototype.$appContainer.classname=='Office365Container')
{
  console.log('365 mode:true');
  window.addEventListener('load', (event) => {
    console.log('365 page is fully loaded:'+event);
    if (window.Office)
    {
      window.Office.onReady()
      .then(function() {
        console.log('Office.onReady called:');
        mainRun();          
        // eslint-disable-next-line
        window.setup365Container();
      });
    }else{
      mainRun();
    }
  });
}else{
  mainRun();
}


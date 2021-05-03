import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  directives: {
    Ripple
  }
})

export default new Vuetify(
    {
        icons: {
          iconfont: 'mdi', // default - only for display purposes
        },
        theme: {
          dark: false,
          themes: {
            light: {
                primary: '#662d90',
                secondary: '#33a8a5',
                displayheader: '#EBEDEF',
                accent: '#2e3132',
                error: '#FF5252',
                info: '#F3F4F6',
                success: '#4CAF50',
                warning: '#FFC107',
            },
            dark: {
              primary: '#662d90',
              secondary: '#33a8a5',
              displayheader: '#7e7e7e',
              accent: '#82B1FF',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FFC107',
           },
          },
        },
      }
);

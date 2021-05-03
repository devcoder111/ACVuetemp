# vue-html-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


////////////////////////////////////
//language code reference
//https://phrase.com/blog/posts/ultimate-guide-to-vue-localization-with-vue-i18n/#vueconfigjs
//and
//https://www.freecodecamp.org/news/how-to-add-internationalization-to-a-vue-application-d9cfdcabb03b/
////////////////////////////////////

//fonts
npm install @mdi/font -D
npm install material-design-icons-iconfont -D
//
//https://developer.microsoft.com/en-us/fluentui#/styles/web
font is set in the src/layout files

EG

html {
    font-size: 14px;
}

To add in a translation us $t
EG
{{ $t('fileemail-screen.header') }}

in code add in

    this.$i18n.t('login-screen.username')
    OR
    window.vueAppInstance.$i18n.t('fileemail-screen.details')    
also add in
  import i18n from '@/plugins/i18n'

  in vuetify components we set
       :locale="this.$i18n.locale"
////////
To run type
    vue ui
////////

///project maintenance - run
  npm outdated to see packages needing updating
//and
  npm update 
//to update all

//check for errors in project
  npm run lint

  
//Localazy...from command line
run
localazy upload
to upload 

Run 
localazy download 
for downloading translation back to your app

...to TEST LANGUAGES....open main.js and SEARCH FOR ...//TO TEST LANGUAGES....and comment in the line below this

//update vuetify
npm update vuetify

//do not use window.open as the default or windows.external...use 
          this.$appContainer
//use
    try{
        this.$appContainer.OpenExternalURL(url);
        return;
    }catch(e){
        window.open(url);
    }

====
mailboxChange 
  this is called from SystemContainer

the search line is

    this.entitySearch('__email__',this.currentemail, true);

====
colours - see
    src/plugins/vuetify.js

/////aws amplify ******************************************************
MAKE SURE YOU RUN
  npm run build
BEFORE YOU PUBLISH

  amplify publish

Run 
  npm i -g @aws-amplify/cli 
to update

To add a new env type

  amplify env add

and follow instructions...when it asks to you want to use an existing profile select Y and select the acceleratorprofile

We have 
dev
which is in factold  production and opens
   https://acapp1.crmtogether.com/#/

devowa
  which is for the 365 config

aclive1
  https://aclive1.crmtogether.com/#/ is now live production


///this.applog ******************************************************
this is imported from 
    services/applog.js

/////////////////
office dev....we used yo office to create the manifest

to regenerate the ssl certs use

Run: npx office-addin-dev-certs uninstall and then npx office-addin-dev-certs install. This will recreate the certificates.
If you're still having problems, try restarting your computer.

MOBILEX_________________________________

TO TURN ON THIS MODE CHANGE
    appMode:'AC', //MX or AC

START SCREEN
https://localhost:3000/#/mxsplash




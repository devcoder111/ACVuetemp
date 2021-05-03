// eslint-disable-next-line
import {applog} from '@/services/applog.js'

import {MyTaskPaneEntityDataBaseClass, } from "@/services/MyTaskPane/dataBase"
import {PayloadWrapper, EmailAttachment} from "@/services/data";
//import {Data, PayloadWrapper,EmailData, EmailAddressInfo,EmailAttachment,} from "@/services/data";

import {FileEmailScreenMetadata} from "@/services/FileEmail/data.js";
import axios from 'axios';
import { Plugins } from '@capacitor/core';

//import store from '@/store/'
//import router from '@/router'
// const { Modals } = Plugins;
//const { Toast } = Plugins;
const { Storage } = Plugins;

// const showAlert = async(_title, _message) => {
//   await Modals.alert({
//     title: _title,
//     message: _message
//   });
// }

export  class MyTaskPaneEntityDataSageCRMAcceleratorClass extends MyTaskPaneEntityDataBaseClass {

    lastResult;
    lastSearchResult;
    lastCreateResult;
    lastEntityResult;
    lastgetFormMetadataResult;
    screenmetadata;
    screentabs;
    lastUserObject;
    getTabContentlastResult;

    rootPath;
    requestConfig;

    screentabs;

    devMode;
    connectionName;
    connectionObject;//_cap_connections in localstorage

    login_dataObject;//this is the data object sent into the logon method

    appContainer;

    BASE_CRM_URL;
    SID;
    constructor(tabName, appContainer) {
        super();
        this.appContainer=appContainer;
        // eslint-disable-next-line
        vueAppInstance.$applog('Sage CRM Connector this.appContainer.classname:'+this.appContainer.classname);
                    
        // eslint-disable-next-line
        vueAppInstance.$applog('Sage CRM Connector created: MyTaskPaneEntityDataSageCRMAcceleratorClass:'+tabName);

        this.lastUserObject=null;
        this.connectionName=tabName;
        try{
        if (localStorage["_cap_"+tabName+"_authobject"]!=null)
            this.lastUserObject=JSON.parse(localStorage["_cap_"+tabName+"_authobject"]);
        }catch{
            this.lastUserObject=null;
        }
        this.rootPath="/custompages/sagecrmws/ac2020/";
        this.screentabs=[];

        this.requestConfig = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        this.devMode=false;
        this._type="MyTaskPaneEntityDataSageCRMAcceleratorClass";
        //get the connection object...needed for dialogs when we are not logged in already
        Storage.get({ key: "connections"}).then(connections =>{
           let connectionsObj = (connections.value != null) ? JSON.parse(connections.value) : [];
           connectionsObj.forEach(element => {
               if (element.tabName==this.connectionName)
               {
                   this.connectionObject=element;
               }
           });
           
        });        
    }

    setCRMURL(sURL) {       
        this.BASE_CRM_URL = sURL;
    }

    setSID(sid) {
        this.SID = sid;
    }

    getSID() {
        return this.SID;
    }

    //called when button is clicked (file/return/cancel)
    actioned(senderDialog,dialogAction,senderData){
        //alert('actioned: MyTaskPaneEntityDataSageCRMAcceleratorClass: '+senderDialog);
        try{
            this.appContainer.buttonAction(senderDialog,dialogAction,senderData);
        }catch(e){
            // eslint-disable-next-line
            vueAppInstance.$applog('actioned: ERROR:'+e.message);
            // eslint-disable-next-line
            vueAppInstance.$applog('this.appContainer.buttonAction:(senderDialog:'+senderDialog+')'+
                '(dialogAction:'+dialogAction+')'+
                '(senderData:'+senderData+')'+
                ' ERROR:'+e.message);
        }
    }

    getTabByName(_tabName){
        // eslint-disable-next-line
        vueAppInstance.$applog('getTabByName: MyTaskPaneEntityDataSageCRMAcceleratorClass:'+_tabName);
        // eslint-disable-next-line
        vueAppInstance.$applog(JSON.stringify(this.screentabs));
        _tabName=_tabName.split('-')[1];
        // eslint-disable-next-line
        vueAppInstance.$applog('getTabByName: MyTaskPaneEntityDataSageCRMAcceleratorClass:'+_tabName);
        for(var i=0;i<this.screentabs.length;i++)
        {
            let _tab=this.screentabs[i];
            if (_tabName==_tab.tabName)
            {
                return _tab; 
            }
        }
        return null;
    }

    async checkSession()
    {
        if ((this.lastUserObject)&&(this.lastUserObject.sid!=""))
        {
            return true;
        }
        return false;
    }

    async selectEntity(_entity, _entityId){
        // eslint-disable-next-line
       vueAppInstance.$applog('selectEntity: MyTaskPaneEntityDataSageCRMAcceleratorClass:'+_entity+'='+_entityId);
       let _that=this;  
       let _page='selectEntity.asp';
       let _server=this.getCRMURL();
       let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;
      
       let bodyFormData = new URLSearchParams();
       bodyFormData.append('entity', _entity);
       bodyFormData.append('entityid', _entityId);
     
       await axios.post(_url, bodyFormData,this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("selectEntity success START");
                // eslint-disable-next-line
                vueAppInstance.$applog(JSON.stringify(response));
                // eslint-disable-next-line
                vueAppInstance.$applog("selectEntity success END");
                _that.lastEntityResult=response.data;
                _that.screentabs=response.data.screenMetadata.tabs;
            })
            .catch(e => {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("selectEntity ERROR: "+e.message);
                throw new Error(e);
            });

       return await this.lastEntityResult;
    }

    async toggleBookmark(_entity, _entityId){
        // eslint-disable-next-line
        vueAppInstance.$applog('toggleBookmark: MyTaskPaneEntityDataSageCRMAcceleratorClass:'+_entity+'='+_entityId);
        let _page='toggleBookmark.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;
      
       let bodyFormData = new URLSearchParams();
       bodyFormData.append('entity', _entity);
       bodyFormData.append('entityid', _entityId);
     
       let res=null;
       await axios.post(_url, bodyFormData,this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("toggleBookmark START");
                // eslint-disable-next-line
                vueAppInstance.$applog(JSON.stringify(response));
                // eslint-disable-next-line
                vueAppInstance.$applog("toggleBookmark END");
                res=response;
            })
            .catch(e => {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("toggleBookmark ERROR: "+e.message);
                throw new Error(e);
            });

       return await res;
    }

    async getTabContent(_entityData, _tabName)
    {
       // eslint-disable-next-line
       vueAppInstance.$applog('getTabContent: MyTaskPaneEntityDataSageCRMAcceleratorClass:'+_entityData.screenMetadata.entity+'='+ _entityData.screenMetadata.entityid);
       //this.$applog(JSON.stringify(_entityData));
       // eslint-disable-next-line
       vueAppInstance.$applog('Tabname='+_tabName);
       let _tab=this.getTabByName(_tabName);
       if(_tab==null)
           return await null;
       // eslint-disable-next-line
       vueAppInstance.$applog('getTabContent: _tab.component='+_tab.component);


       let _page='getTabContent.asp';
       let _server=this.getCRMURL();
       let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

       //cope with our js report file option
       if (_tab.tabAction.toLowerCase().indexOf("_js.")>0)
       {
          _url=_tab.tabAction;
       }       

       let bodyFormData = new URLSearchParams();
       bodyFormData.append('entity', _entityData.screenMetadata.entity);
       bodyFormData.append('entityid', _entityData.screenMetadata.entityid);
       bodyFormData.append('tab', _tab.tabName);
       bodyFormData.append('appname', 'Accelerator');
       if ((_entityData.screenMetadata.filterscreen)&&(_entityData.screenMetadata.filterscreen.formElements))
       {
            bodyFormData.append('filters', JSON.stringify(_entityData.screenMetadata.filterscreen.formElements));       
       }
       let _that=this;  
       await axios.post(_url, bodyFormData,this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("getTabContent success="+JSON.stringify(response));
                _that.getTabContentlastResult=response.data;
            })
            .catch(e => {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("getTabContent ERROR: "+e.message);
                throw new Error(e);
            });

       return await this.getTabContentlastResult;
    }

    async getBookmarks(){
        // eslint-disable-next-line
        vueAppInstance.$applog('getBookmarks: MyTaskPaneEntityDataSageCRMAcceleratorClass');

        let _page='getBookmarks.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;
       
       let bodyFormData = new URLSearchParams();
       bodyFormData.append('username', this.lastUserObject.username);
       bodyFormData.append('crmurl',  this.lastUserObject.crmurl);
       bodyFormData.append('dataonly', 'Y');

       let _that=this;  
       await axios.post(_url, bodyFormData,this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("getBookmarks success="+response);
                _that.lastSearchResult=response.data;
            })
            .catch(e => {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("getBookmarks ERROR: "+e.message);
                throw new Error(e);
            });

       return await this.lastSearchResult;     

    }
    async getSalesList(){
        // eslint-disable-next-line
        vueAppInstance.$applog('getSalesList: MyTaskPaneEntityDataSageCRMAcceleratorClass');

        let _page='getSalesList.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        //build payload out
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getSalesList";
        this.requestData.payload.data={
            user: this.lastUserObject
        }
       
       let bodyFormData = new URLSearchParams();
       bodyFormData.append('username', this.lastUserObject.username);
       bodyFormData.append('crmurl',  this.lastUserObject.crmurl);
       bodyFormData.append('dataonly', 'Y');

       let _that=this;  
       await axios.post(_url, bodyFormData,this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("getSalesList success="+response);
                _that.lastSearchResult=response.data;
            })
            .catch(e => {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("getSalesList ERROR: "+e.message);
                throw new Error(e);
            });

       return await this.lastSearchResult;     

    }    
    async getCasesList(){
         // eslint-disable-next-line
         vueAppInstance.$applog('getCasesList: MyTaskPaneEntityDataSageCRMAcceleratorClass');

        let _page='getCasesList.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        //build payload out
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getCasesList";
        this.requestData.payload.data={
            user: this.lastUserObject
        }
       
       let bodyFormData = new URLSearchParams();
       bodyFormData.append('username', this.lastUserObject.username);
       bodyFormData.append('crmurl',  this.lastUserObject.crmurl);
       bodyFormData.append('dataonly', 'Y');

       let _that=this;  
       await axios.post(_url, bodyFormData,this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("getCasesList success="+response);
                _that.lastSearchResult=response.data;
            })
            .catch(e => {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("getCasesList ERROR: "+e.message);
                throw new Error(e);
            });

       return await this.lastSearchResult;     

    } 
    privateParseData(_data){
        let crmdata=[];
        for(var y=0;y<_data.screens.length;y++)
        { 
          let _screen=_data.screens[y];
          for(var i=0;i<_screen.formElements.length;i++)
          {
            var elm=_screen.formElements[i];
            // eslint-disable-next-line
            vueAppInstance.$applog('createEntity elm: '+elm.name);
            // eslint-disable-next-line
            vueAppInstance.$applog('createEntity elm: '+JSON.stringify(elm));           
            if (elm.value)
            { 
                if (elm.componentType=="MyFormRemoteLookup")
                {
                    if (elm.value)         
                    {
                        crmdata.push({
                            name:elm.name,
                            value:elm.value.value.entityid
                        });
                    }
                }else if (elm.componentType=="MyFormSelect")
                {
                    crmdata.push({
                        name:elm.name,
                        value:elm.value.value
                    })
                } else if (elm.componentType=="MyFormPhone")
                {
                    crmdata.push({
                        name:elm.name,
                        value:elm.value
                    })
                }else{
                    crmdata.push({
                        name:elm.name,
                        value:elm.value
                    })
                }
             }
           }
        }
        return crmdata;
    }
    async createEntity(_data){
//_data is the screen data object
        // eslint-disable-next-line
        vueAppInstance.$applog('createEntity: MyTaskPaneEntityDataSageCRMAcceleratorClass');
        // eslint-disable-next-line
        vueAppInstance.$applog('createEntity: '+JSON.stringify(_data));

        //parse the data for our connector
        let crmdata= this.privateParseData(_data);
        // eslint-disable-next-line
        vueAppInstance.$applog('createEntity data for connector: '+JSON.stringify(crmdata));

        let _page='createEntity.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        //build payload out
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="createEntity";
        this.requestData.payload.data={
            user: this.lastUserObject,
            data:crmdata
        }
       
       let bodyFormData = new URLSearchParams();
       bodyFormData.append('username', this.lastUserObject.username);
       bodyFormData.append('crmurl',  this.lastUserObject.crmurl);
       bodyFormData.append('data', JSON.stringify(crmdata));
       bodyFormData.append('entity', _data.screens[0].entity);

       let _that=this;  
       await axios.post(_url, bodyFormData,this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("createEntity success:");
                // eslint-disable-next-line
                vueAppInstance.$applog(JSON.stringify(response));
                _that.lastCreateResult=response.data;
            })
            .catch(e => {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("createEntity ERROR: "+e.message);
                throw new Error(e);
            });
       //result should object....{valid:boolean,entity:'company',entityid:123, etc?}...mayeb flag possible dulicates later on?
       return await this.lastCreateResult;        

    }

    async getFormMetadata(_entity, _entityData){
        // eslint-disable-next-line
        vueAppInstance.$applog('getFormMetadata: MyTaskPaneEntityDataSageCRMAcceleratorClass');
        // eslint-disable-next-line
        vueAppInstance.$applog('getFormMetadata: '+_entity+'='+JSON.stringify(_entityData));
        let _page='getFormMetadata.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        let bodyFormData = new URLSearchParams();
        bodyFormData.append('entity', _entity);
        bodyFormData.append('screenMetadata_entity', _entityData.screenMetadata.entity);
        bodyFormData.append('screenMetadata_entityid', _entityData.screenMetadata.entityid);
        let _that=this;  
        // eslint-disable-next-line
        vueAppInstance.$applog('getFormMetadata _url: '+_url);
        // eslint-disable-next-line
        vueAppInstance.$applog('getFormMetadata bodyFormData: '+bodyFormData);
        await axios.post(_url, bodyFormData,this.requestConfig)
                .then(function (response) {
                    //handle success
                    // eslint-disable-next-line
                    vueAppInstance.$applog("getFormMetadata START");
                    // eslint-disable-next-line
                    vueAppInstance.$applog(JSON.stringify(response));
                    // eslint-disable-next-line
                    vueAppInstance.$applog("getFormMetadata END");
                    _that.lastgetFormMetadataResult=response;
                })
                .catch(e => {
                    //handle error
                    // eslint-disable-next-line
                    vueAppInstance.$applog("getFormMetadata ERROR: "+e.message);
                    // eslint-disable-next-line
                    vueAppInstance.$applog("getFormMetadata ERROR Object: "+e);
                    throw new Error(e);
                });
        //result should object....{valid:boolean,entity:'company',entityid:123, etc?}...mayeb flag possible dulicates later on?
        return await this.lastgetFormMetadataResult;
    }

    getCRMURL()
    {
        //clever     
        if (this.connectionName+''=='null')
        {
            this.connectionName=localStorage["_cap_activeTabName"];
        }
        if (this.lastUserObject==null)
        {
            if (localStorage["_cap_"+this.connectionName+"_authobject"]!=null)
              this.lastUserObject=JSON.parse(localStorage["_cap_"+this.connectionName+"_authobject"]);
        }
        return this.lastUserObject.crmurl;   
    }
    async entitySearch(_entity, _searchObject, _itemsPerPage, _currentPage, _sortBy, _sortDesc){
        //this is used when we change email to search for a match
        let _page='entitySearch.asp';
        let _server=this.getCRMURL();
        let SID = this.SID || this.lastUserObject.sid;
        let _url =_server+this.rootPath+_page+'?SID=' +SID;
       
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('entity', _entity);
        bodyFormData.append('searchObject', JSON.stringify(_searchObject));
        bodyFormData.append('itemsPerPage', JSON.stringify(_itemsPerPage));
        bodyFormData.append('page', JSON.stringify(_currentPage));
        bodyFormData.append('sortBy', JSON.stringify(_sortBy));
        bodyFormData.append('sortDesc', JSON.stringify(_sortDesc));
        
        // eslint-disable-next-line
        vueAppInstance.$applog("entitySearch entity: " + _entity);
        // eslint-disable-next-line
        vueAppInstance.$applog("entitySearch searchObject: " + JSON.stringify(_searchObject));
      
        let _that=this;  
        await axios.post(_url, bodyFormData, this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("entitySearch START");
                // eslint-disable-next-line
                vueAppInstance.$applog(JSON.stringify(response));
                // eslint-disable-next-line
                vueAppInstance.$applog("entitySearch END");
                _that.lastSearchResult=response;
            })
            .catch(e => {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("entitySearch ERROR: "+e.message);
                // eslint-disable-next-line
                vueAppInstance.$applog("entitySearch ERROR url: "+_url);
                throw new Error(e);
            });
        return await this.lastSearchResult;
    }
    async getRemoteData(senderObject,_query){
        // eslint-disable-next-line
        vueAppInstance.$applog('getRemoteData senderObject:'+JSON.stringify(senderObject));
        // eslint-disable-next-line
        vueAppInstance.$applog('getRemoteData _query:'+JSON.stringify(_query));

        let _data=new Object();

        if ((senderObject.filter!=null)&&(senderObject.filterObject!=null)&&
                (senderObject.filterObject.value!=null))
        {
            senderObject.filter.replace('{0}',senderObject.filterObject.value.entityid);
        }

        let _searchObject={
            searchstring:_query.value,
            searchfilter: _query.filter,
            fieldname:_query.fieldname
        }

        let res=await this.entitySearch(_query.entity, _searchObject);
        _data.options=[];
        if (res) {
            for(var i=0;i<res.data.data.tableData.length;i++)
            {
                let itemraw=res.data.data.tableData[i];
                let _displayText='';
                for(var x=1;x<res.data.data.tableColumns.length;x++)
                {
                    let colname=res.data.data.tableColumns[x].value;
                    if (_displayText!='')
                        _displayText+=' ';
                    _displayText+=itemraw[colname];
                }
                let xitem={
                    text: _displayText, value:{entity: itemraw.entity, entityid: itemraw.entityid},icon: itemraw.tileicon 
                }
                _data.options.push(xitem);
            }
            _data.fieldname=res.data.data.fieldname;
            // eslint-disable-next-line
            vueAppInstance.$applog('getRemoteData _data.options count:'+_data.options.length);
        }
        this.lastResult= {
            screenMetadata:null,
            data:_data
        }

        return this.lastResult;

    }
    //function returns an object that controls how the connection screen works and what features are enabled or not
    async getScreenSetup(){
        // eslint-disable-next-line
        vueAppInstance.$applog('getScreenSetup MyTaskPaneEntityDataSageCRMAcceleratorClass');

        let _page='getScreenSetup.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        // eslint-disable-next-line
        vueAppInstance.$applog("getScreenSetup _url: "+_url);
       
        let bodyFormData = new FormData();
        bodyFormData.append('username', this.lastUserObject.username);
        bodyFormData.append('crmurl',  this.lastUserObject.crmurl);
        bodyFormData.append('dataonly', 'Y');

        let _that=this;
        await axios.post(_url, bodyFormData,this.requestConfig)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("getScreenSetup success="+JSON.stringify(response));
                let response_asjson=response.data;
                _that.ScreenSetup=response_asjson;
                _that.lastResult= {
                    screenMetadata:response_asjson,
                    data:null
                }
                _that.screenMetadata=response_asjson;
                _that.screenMetadata.hasParseEmail=true;
                _that.screenMetadata.hasNewAppointment=true;
                // eslint-disable-next-line
                vueAppInstance.$applog("getScreenSetup appContainer="+_that.appContainer.classname);
                if ((_that.appContainer.classname!="OutlookAppContainer")&& 
                (_that.appContainer.classname!="OutlookAppContainerWebview"))
                {
                    //remove new email, addtag, reply and new task...
                    _that.screenMetadata.hasHistory=false;
                    _that.screenMetadata.hasParseEmail=false;
                    _that.screenMetadata.hasNewAppointment=false;
                    for (var xx=0;xx<_that.screenMetadata.options.length;xx++)
                    {
                        if ((_that.screenMetadata.options[xx].name=="tagemail")||
                            (_that.screenMetadata.options[xx].name=="replytagemail")||
                            (_that.screenMetadata.options[xx].name=="newemail")||
                            (_that.screenMetadata.options[xx].name=="newappt"))
                        {
                            _that.screenMetadata.options[xx].enabled=false;
                        }
                    }
                }

            })
            .catch(function (response) {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("getScreenSetup ERROR="+response);
                this.lastUserObject=null;
                throw new Error(response);
            });

        return await this.lastResult;        

    }
    async logout(){
        // eslint-disable-next-line
        vueAppInstance.$applog('logout: MyTaskPaneEntityDataSageCRMAcceleratorClass');

        let _action ='KonneXGateway.aspx?action=logout';
        _action="/custompages/sagecrmws/"+_action;
        let _server=this.getCRMURL();
        let _url =_server+_action+'&SID='+this.lastUserObject.sid;
       const bodyFormData = new URLSearchParams();
       bodyFormData.append('dataonly', 'Y');
       bodyFormData.append('appname', 'Accelerator');

       var _that=this;
       await axios.post(_url,bodyFormData, this.requestConfig)
            .then((response) => {
                // eslint-disable-next-line
                vueAppInstance.$applog("logout response=" + response);       
                _that.lastUserObject={loggedin:false}
            })
            .catch(function (err) {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("logout catch=" + err);                
                _that.lastUserObject={loggedin:false}
            });

            return this.lastUserObject;
    }
    async login(dataObject){
        // eslint-disable-next-line
        vueAppInstance.$applog('login: MyTaskPaneEntityDataSageCRMAcceleratorClass'+JSON.stringify(dataObject));
        this.login_dataObject=dataObject;

        let _action ='KonneXGateway.aspx?SID=&action=logon';
        _action="/custompages/sagecrmws/"+_action;
   
       const bodyFormData = new URLSearchParams();
       bodyFormData.append('username', dataObject.username);
       bodyFormData.append('password',  dataObject.password);  
       bodyFormData.append('crmurl',  dataObject.url);
       bodyFormData.append('dataonly', 'Y');
       bodyFormData.append('appname', dataObject.appName);

       var _that=this;
       // eslint-disable-next-line
       vueAppInstance.$applog('login: url'+dataObject.url+_action);

       //dev lines
     //  _action ='KonneXGateway.aspx?SID=&action=logon';
      // dataObject.url='http://localhost:1898/';

       await axios.post(dataObject.url+_action,bodyFormData, this.requestConfig)
            .then((response) => {
                //handle success
                if (response == null) {
                    _that.lastUserObject={loggedin:false}
                } else {
                    // eslint-disable-next-line
                    vueAppInstance.$applog("login success=" + response.data);
                    _that.lastUserObject={
                        username:dataObject.username,
                        displayName:dataObject.username,
                        crmurl:dataObject.url,
                        sid:response.data,
                        loggedin:true
                    }
                    if (JSON.stringify(response.data)=='"logonfailed"')
                    {
                        _that.lastUserObject.loggedin=false;
                    }                    
                }
            })
            .catch(function (err) {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("login catch=" + err);                
                _that.lastUserObject={loggedin:false}
            });

            return this.lastUserObject;
    }

    async validateConnection(dataObject){
        // eslint-disable-next-line
        vueAppInstance.$applog('validateConnection:MyTaskPaneEntityDataSageCRMAcceleratorClass');
        try {
            let res = await this.login(dataObject);
            return res;
        }catch(e){
            return null;
        }
    }

    async historyGetData(filterEntity, filterDate){
        let _page='getMySearchHistory.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;
        //fix up the date
        let _year=filterDate.getFullYear();
        let _month=filterDate.getMonth()+1;
        let _date=filterDate.getDate();
        let crmURL=_url+"&yyyy="+_year+"&MM="+_month+"&dd="+_date+"&Entity="+filterEntity;
      
        let response = await axios.get(crmURL);
        this.lastResult=response.data;
        // eslint-disable-next-line
        vueAppInstance.$applog("historyGetData="+JSON.stringify(response));
        return await this.lastResult;
    }
    async emailTemplatesGetData(_filter, entity, entityid){
         // eslint-disable-next-line
        vueAppInstance.$applog("emailTemplatesGetData:"+_filter+"-"+entity+"-"+entityid);
        let _page='getEMailTemplates.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        let bodyFormData = new URLSearchParams();
        bodyFormData.append('s', _filter);
        bodyFormData.append('entity', entity);
        bodyFormData.append('entityid', entityid);

        let _that=this;
        await axios.post(_url, bodyFormData, this.requestConfig).then((response) => {
            _that.lastResult=response.data;     
            // eslint-disable-next-line
            vueAppInstance.$applog(JSON.stringify(response));
        }).catch(e => {
            // eslint-disable-next-line
            vueAppInstance.$applog(JSON.stringify(e));
            if (e.message!=null)
            {
                //alert("1");
                let idx401a = e.message.indexOf("401");
                if (idx401a>-1)
                {
                    let _storedData={
                        url:_that.connectionObject.dataurl,
                        username:_that.connectionObject.username,
                        password:_that.connectionObject.password,
                        appName:"Accelerator"
                    }
                    _that.login(_storedData).then((response) => {
                        _that.userObject=response;
                        _that.loggedin=response.loggedin;
                        if (_that.loggedin){
                          Storage.set({ key: _that.connectionName+"_authobject", value: JSON.stringify(_that.lastUserObject)});
                          _that.login_loading=false;
                        }else{
                          _that.loginAlert=true;
                        }
                        _that.loading=false;
                        window.location.reload();
                      }).catch(e => {
                        _that.loggedin=false;
                        _that.loading=false;
                        //handle error
                        // eslint-disable-next-line
                        vueAppInstance.$applog(e);
                        // eslint-disable-next-line
                        vueAppInstance.$applog("emailTemplatesGetData catch="+JSON.stringify(e));
                        alert("please log into CRM first");
                    });
                }
            }
        });
        return await this.lastResult;
    }
    async emailTemplateGetContent(templateid, entity, entityid){
        let _page='getEMailTemplateContent.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;
        let crmURL=_url+"&templateid="+templateid;
        if (entity+''!='undefined')
        {
            crmURL+="&entity="+entity+"&entityid="+entityid;
        }
        // eslint-disable-next-line
        vueAppInstance.$applog("emailTemplateGetContent url:"+crmURL);
        let _that=this;
        await axios.get(crmURL).then((response) => {
            _that.lastResult=response.data;     
            // eslint-disable-next-line
            vueAppInstance.$applog("emailTemplateGetContent RESPONSE START:");
            // eslint-disable-next-line
            vueAppInstance.$applog(JSON.stringify(response));
            // eslint-disable-next-line
            vueAppInstance.$applog("emailTemplateGetContent RESPONSE END:");
        }).catch(e => {
            // eslint-disable-next-line
            vueAppInstance.$applog("emailTemplateGetContent ERROR: "+JSON.stringify(e));
            document.write(JSON.stringify(e));
        });
        // eslint-disable-next-line
        vueAppInstance.$applog("emailTemplateGetContent COMPLETE");
        return await this.lastResult;
    }    
    async attachDocumentsGetData(_filter,entity, entityid){
      
        let _page='getEntityFiles.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        let bodyFormData = new URLSearchParams();
        bodyFormData.append('s', _filter);

        if (entity+''!='undefined')
        {
            bodyFormData.append('entity', entity);
            bodyFormData.append('entityid', entityid);
        }

        let _that=this;
        await axios.post(_url, bodyFormData, this.requestConfig).then((response) => {
            _that.lastResult=response.data;     
            // eslint-disable-next-line
            vueAppInstance.$applog(JSON.stringify(response));
        }).catch(e => {
            // eslint-disable-next-line
            vueAppInstance.$applog(JSON.stringify(e));
            if (e.message!=null)
            {
                let idx401a = e.message.indexOf("401");
                if (idx401a>-1)
                {
                    let _storedData={
                        url:_that.connectionObject.dataurl,
                        username:_that.connectionObject.username,
                        password:_that.connectionObject.password,
                        appName:"Accelerator"
                    }
                    _that.login(_storedData).then((response) => {
                        _that.userObject=response;
                        _that.loggedin=response.loggedin;
                        if (_that.loggedin){
                          Storage.set({ key: _that.connectionName+"_authobject", value: JSON.stringify(_that.lastUserObject)});
                          _that.login_loading=false;
                        }else{
                            _that.loginAlert=true;
                        }
                        _that.loading=false;
                        window.location.reload();
                      }).catch(e => {
                        _that.loggedin=false;
                        _that.loading=false;
                        //handle error
                        // eslint-disable-next-line
                        vueAppInstance.$applog(e);
                        // eslint-disable-next-line
                        vueAppInstance.$applog("attachDocumentsGetData catch="+JSON.stringify(e));
                        //alert('entitySearch message'+response.message);
                        //alert('entitySearch error'+JSON.stringify(response));
                        alert("please log into CRM first");
                    });
                }
            }
        });
        return await this.lastResult;
    }
    async addressBookGetData(_filter){
        // eslint-disable-next-line
        vueAppInstance.$applog("addressBookGetData:"+_filter);
        let _page='searchAddressBook.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        let bodyFormData = new URLSearchParams();
        bodyFormData.append('s', _filter);

        _url+="&s="+_filter;//first build used querystring

        let _that=this;
        await axios.post(_url, bodyFormData, this.requestConfig).then((response) => {
            _that.lastResult=response.data;     
            // eslint-disable-next-line
            vueAppInstance.$applog(JSON.stringify(response));
        }).catch(e => {
            // eslint-disable-next-line
            vueAppInstance.$applog("ERROR:"+JSON.stringify(e));
            if (e.message!=null)
            {
                let idx401a = e.message.indexOf("401");
                if (idx401a>-1)
                {
                    let _storedData={
                        url:_that.connectionObject.dataurl,
                        username:_that.connectionObject.username,
                        password:_that.connectionObject.password,
                        appName:"Accelerator"
                    }
                    _that.login(_storedData).then((response) => {
                        _that.userObject=response;
                        _that.loggedin=response.loggedin;
                        if (_that.loggedin){
                          Storage.set({ key: _that.connectionName+"_authobject", value: JSON.stringify(_that.lastUserObject)});
                          _that.login_loading=false;
                        }else{
                            _that.loginAlert=true;
                        }
                        _that.loading=false;
                        window.location.reload();
                      }).catch(e => {
                        _that.loggedin=false;
                        _that.loading=false;
                        //handle error
                        // eslint-disable-next-line
                        vueAppInstance.$applog(e);
                        // eslint-disable-next-line
                        vueAppInstance.$applog("addressBookGetData catch="+JSON.stringify(e));
                        //alert('entitySearch message'+response.message);
                        //alert('entitySearch error'+JSON.stringify(response));
                        alert("please log into CRM first");
                    });
                }
            }
        });
        return await this.lastResult;
    }
    fileUpload(response){
       // eslint-disable-next-line
       vueAppInstance.$applog("fileUpload response.data.attachmentlinks.length="+response.data.attachmentlinks.length);
        if (response.data.attachmentlinks.length>0)
        {
            for(var q=0;q<response.data.attachmentlinks.length;q++){
                var att=response.data.attachmentlinks[q];
                // eslint-disable-next-line
                vueAppInstance.$applog("fileUpload start:"+JSON.stringify(att));
                this.appContainer.fileUpload(JSON.stringify(att));
                // eslint-disable-next-line
                vueAppInstance.$applog("fileUpload complete");
            }
        }
    }
    async fileEmail(_emailDataObject){
        // eslint-disable-next-line
        vueAppInstance.$applog("fileEmail: Sage CRM connector");
        let res_entityFile;
        let _page='fileemail.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        // eslint-disable-next-line
        vueAppInstance.$applog("fileEmail url:"+_url);

        let bodyFormData = new URLSearchParams();
        bodyFormData.append('emaildata', JSON.stringify(_emailDataObject));
        var _that=this;

        // eslint-disable-next-line
        vueAppInstance.$applog("fileEmail: _emailDataObject");
        // eslint-disable-next-line
        vueAppInstance.$applog(JSON.stringify(_emailDataObject));

        await axios.post(_url, bodyFormData,this.requestConfig)  
            .then(function (response) {
                // eslint-disable-next-line
                vueAppInstance.$applog("fileEmail success:");

                    //***UPDATE THE OUTLOOK CUSTOM PROPERTIES */
                    // eslint-disable-next-line
                    vueAppInstance.$applog("fileUpload updateProps");
                    // eslint-disable-next-line
                    vueAppInstance.$applog(JSON.stringify(response.data));
                    _that.appContainer.updateProps(JSON.stringify(response.data));
                    // eslint-disable-next-line
                    vueAppInstance.$applog("fileUpload updateProps complete");
                    
                // eslint-disable-next-line
                vueAppInstance.$applog("before fileUpload:");

                _that.fileUpload(response.data);
                // eslint-disable-next-line
                vueAppInstance.$applog("after fileUpload:");

            })
            .catch(function (response) {
                // eslint-disable-next-line
                vueAppInstance.$applog("fileEmail fileUpload error:"+response.message);
                // eslint-disable-next-line
                vueAppInstance.$applog("fileEmail fileUpload error object: "+JSON.stringify(response));
                // eslint-disable-next-line
                vueAppInstance.$applog("fileEmailfileUpload error _emailDataObject:");
                // eslint-disable-next-line
                vueAppInstance.$applog(JSON.stringify(_emailDataObject));                
            });
       return await res_entityFile;     
    }    
    async fileEmailEntitySearch(_emailDataObject, _entity, _entityid){
       // eslint-disable-next-line
       vueAppInstance.$applog("fileEmailEntitySearch start:"+_entity+"="+_entityid);
       let res_entitySearch;
       let _page='fileemailSearch.asp';
       let _server=this.getCRMURL();
       let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;
       // eslint-disable-next-line
       vueAppInstance.$applog("fileEmailEntitySearch _url:"+_url);

       let bodyFormData = new URLSearchParams();
       //to speed things up we alter the _emailDataObject 
       //if (this.hasTag(_emailDataObject))
       
       //copy the html part and set this as null as we do not need to send this up
       let temphtmlBody=JSON.stringify(_emailDataObject.htmlBody);
       _emailDataObject.htmlBody=null;
       
       bodyFormData.append('emaildata', JSON.stringify(_emailDataObject));
       if (_entity+''=='null')
           _entity='';
       bodyFormData.append('entity', _entity);
       if (_entityid+''=='null')
         _entityid='';
       bodyFormData.append('entityId', _entityid);
       bodyFormData.append('username', this.lastUserObject.username);

       // eslint-disable-next-line
       vueAppInstance.$applog("fileEmailEntitySearch bodyFormData START:");
       // eslint-disable-next-line
       vueAppInstance.$applog("fileEmailEntitySearch Context:"+_entity+"="+_entityid);           
       // eslint-disable-next-line
       vueAppInstance.$applog(JSON.stringify(_emailDataObject));
       // eslint-disable-next-line
       vueAppInstance.$applog("fileEmailEntitySearch bodyFormData END:");       

       // eslint-disable-next-line
       vueAppInstance.$applog("fileEmailEntitySearch _emailDataObject JSON START:");
       // eslint-disable-next-line
       vueAppInstance.$applog(JSON.stringify(_emailDataObject));
       // eslint-disable-next-line
       vueAppInstance.$applog("fileEmailEntitySearch _emailDataObject JSON END:");

       let _that=this;

       await axios.post(_url, bodyFormData,this.requestConfig)  
            .then(function (response) {
                _emailDataObject.htmlBody=JSON.parse(temphtmlBody);
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("fileEmailEntitySearch RESPONSE START");
                // eslint-disable-next-line
                vueAppInstance.$applog(JSON.stringify(response));
                // eslint-disable-next-line
                vueAppInstance.$applog("fileEmailEntitySearch RESPONSE END");
                if (response.data.container+""=="undefined")
                {
                    alert("please log into CRM first");
                    //todo...disable buttons/screens ?

                }else{
                    res_entitySearch=response.data;
                }
            })
            .catch(function (e) {
                // eslint-disable-next-line
                vueAppInstance.$applog("fileEmailEntitySearch ERROR");
                if (e.message!=null)
                {
                    //eslint-disable-next-line
                    vueAppInstance.$applog("fileEmailEntitySearch ERROR:"+e.message);

                    let idx401a = e.message.indexOf("401");
                    if (idx401a>-1)
                    {
                        //try log in.....
                        let _storedData={
                            url:_that.connectionObject.dataurl,
                            username:_that.connectionObject.username,
                            password:_that.connectionObject.password,
                            appName:"Accelerator"
                        }
                        _that.login(_storedData).then((response) => {
                            _that.userObject=response;
                            _that.loggedin=response.loggedin;
                            if (_that.loggedin){
                              Storage.set({ key: _that.connectionName+"_authobject", value: JSON.stringify(_that.lastUserObject)});
                              _that.login_loading=false;
                            }else{
                                _that.loginAlert=true;
                            }
                            _that.loading=false;
                            window.location.reload();
                          }).catch(e => {
                            _that.loggedin=false;
                            _that.loading=false;
                            //handle error
                            // eslint-disable-next-line
                            vueAppInstance.$applog("fileEmailEntitySearch ERROR message: "+e.message);
                            alert("please log into CRM first");
                        });
                    }
                }
            });
       return await res_entitySearch;     
    }
    async parseEmailGetData()
    {
        // eslint-disable-next-line
        vueAppInstance.$applog('parseEmailGetData');
        let emails=[];
        let emailData;

        try{
            let x = this.appContainer.getEmailData('read');
            // eslint-disable-next-line
            vueAppInstance.$applog("parseEmailGetData this.appContainer.getEmailData:"+x);
            emailData= JSON.parse(x);       
            //we must fix up the data for our form...
            emailData.subject={name:'subject',value:emailData.subject, caption:''}
            emailData.htmlBody={name:'details',
                    value:{text:emailData.body,html:emailData.htmlBody},
                        caption:window.vueAppInstance.$i18n.t('fileemail-screen.details'), height:200}
            // eslint-disable-next-line
            vueAppInstance.$applog('parseEmailGetData step 2');
        }catch(e){
            // eslint-disable-next-line
            vueAppInstance.$applog("parseEmailGetData ERROR:"+e.message);
            if (this.devMode)
              emailData=this.private_getEmailDemoObj();
            else 
              emailData={}
        }
        // eslint-disable-next-line
        vueAppInstance.$applog(JSON.stringify(emailData)); 

        if (emailData.from.emailAddress!="")
            emails.push(emailData.from.emailAddress);

        // eslint-disable-next-line
        vueAppInstance.$applog("from:"+emailData.from.emailAddress); 

        for(var i=0;i<emailData.to.length;i++)
        {
            if ((emailData.to[i].emailAddress!="")&&(emailData.to[i].emailAddress!=null))
            {
                if(!emails.includes(emailData.to[i].emailAddress))
                    emails.push(emailData.to[i].emailAddress);
            }
        }
        for(var j=0;j<emailData.cc.length;j++)
        {
            if ((emailData.cc[i].emailAddress!="")&&(emailData.cc[i].emailAddress!=null))
            {
                if(!emails.includes(emailData.cc[j].emailAddress))
                emails.push(emailData.cc[j].emailAddress);
            }
        }
        //find emails in the body...to do
        let addbodyemails=this.findEmailAddresses(emailData.htmlBody.value.text,emails);
        emails=addbodyemails;
        let addsubjectemails=this.findEmailAddresses(emailData.subject.value,emails);
        emails=addsubjectemails;
        let res={
            screenMetadata:null,
            emailAddresses:emails
        }                          
        return res;
    }
    findEmailAddresses(val,emails) {
        val=new String(val);
        var emailsArray = val.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
		if (emailsArray) {
			for (var i = 0; i < emailsArray.length; i++) {
                if((!emails.includes(emailsArray[i]))&&(emailsArray[i]!=""))
                    emails.push(emailsArray[i]);
			}
		}
		return emails;
    }
    hasTag(emailData)
    {
         let res={
             hastag:false,
             tagcode:''
         };
         let tagarray=this.ScreenSetup.tagPrefixSuffix.split(",");
         if (emailData.subject!=null)
         {
             if (emailData.subject.indexOf(tagarray[0])>-1)
             {
               res.hastag=true;
               let istart=emailData.subject.indexOf(tagarray[0]);
               let ipart=istart.subject.substring(istart);
               let iend=ipart.indexOf(tagarray[1]);
               res.tagcode=ipart.substring(0,iend);
            
             }
         }
         if (emailData.body!=null)
         {
             if (emailData.body.indexOf(tagarray[0])>-1)
             {
               res.hastag=true;
               let istart=emailData.subject.indexOf(tagarray[0]);
               let ipart=istart.subject.substring(istart);
               let iend=ipart.indexOf(tagarray[1]);
               res.tagcode=ipart.substring(0,iend);
             }
         } 
         return res;
    }
    async fileEmailGetData(_entity, _entityid,_containercontext){
        // eslint-disable-next-line
        vueAppInstance.$applog('fileEmailGetData:getData-'+_containercontext);
        //get the data from the outlook client...
        let emailData=null;
        //we doa try catch here so we can dev in chrome
        try{
            // eslint-disable-next-line
            vueAppInstance.$applog('fileEmailGetData appContainer:'+this.appContainer.classname);
            //alert("_containercontext:"+_containercontext);
            let x = this.appContainer.getEmailData(_containercontext);
            // eslint-disable-next-line
            vueAppInstance.$applog("fileEmailGetData x="+x);
            if (typeof x==='string')
            {
                emailData= JSON.parse(x);       
            }
            else{
                emailData=x;
            }
            //we must fix up the data for our form...
            emailData.subject={name:'subject',value:emailData.subject, caption:''}
            emailData.htmlBody={name:'details',
                    value:{text:emailData.body,html:emailData.htmlBody},
                        caption:window.vueAppInstance.$i18n.t('fileemail-screen.details'), height:200}
            // eslint-disable-next-line
            vueAppInstance.$applog('fileEmailGetData step 2');
        }catch(e){
            // eslint-disable-next-line
            vueAppInstance.$applog("fileEmailGetData ERROR #1:"+e.message);
            if (this.devMode)
              emailData=this.private_getEmailDemoObj();
            else 
            emailData={}
        }
        // eslint-disable-next-line
        vueAppInstance.$applog("fileEmailGetData step 4");
        //build our result...
        let metadata=new FileEmailScreenMetadata();
        let emails=[];
        emails.push(emailData);

        let res_entityData =  null;
        if (_entity+''=='undefined')
        {
            _entity='';
            _entityid='';
        }
        // eslint-disable-next-line
        vueAppInstance.$applog('fileEmailGetData:'+_entity+'='+_entityid);
        await this.fileEmailEntitySearch(emailData, _entity, _entityid).then(response => {
            // eslint-disable-next-line
            vueAppInstance.$applog('fileEmailGetData result');
            res_entityData=response;    
        }).catch(e => 
            {
                // eslint-disable-next-line
                vueAppInstance.$applog("fileEmailGetData ERROR #2:"+e.message);
            });
        await res_entityData;
    
        metadata.entity=res_entityData.entity;
        metadata.entityid=res_entityData.entityid;
        metadata.entityName=res_entityData.entityName;
        metadata.entityIcon=res_entityData.entityIcon;
        metadata.tilecolor=res_entityData.tilecolor;
        metadata.screensetup=res_entityData;

        this.lastResult={
            screenMetadata:metadata,
            EmailList:emails
        }                          
        // eslint-disable-next-line
        vueAppInstance.$applog('fileEmailGetData:getData END');
        return this.lastResult;
    }

    private_getEmailDemoObj()
    {
        let y={addresses:null,
                from:{displayName:"Fake Person",
                emailAddress:"fake@personas.com",type:null},
                fullName:"Fakeish Person",
                phoneNumbers:[],
                attachments:[],
                to:[
                    {displayName:"Fake Imposter",
                    emailAddress:"Fake@Imposter.com",
                    type:null},
                    {displayName:"Fake Imposter 2",
                    emailAddress:"Fake@Imposter2.com",
                    type:null}
                ],
                cc:[
                    {displayName:"Fake Imposter cc",
                    emailAddress:"Fake@Imposter cc.com",
                    type:null},
                    {displayName:"Fake Imposter cc2",
                    emailAddress:"Fake@Impostercc2.com",
                    type:null}, 
                    {displayName:"Fake Imposter",
                    emailAddress:"Fake@Imposter.com",
                    type:null}
                ],                
                urls:[],
                subject:{name:'subject',value:'ERROR DATA', caption:''},
                body:"text body",
                htmlBody:{name:'details',
                value:{text:"error data",html:"<html><head></head><body><b>fake@personas.com email Fake@Impostercc2.com content.person@sample.com  and content2.person2@sample.comtext body</b></body></html>"},
                    caption:window.vueAppInstance.$i18n.t('fileemail-screen.details'), height:200}
                
            }
                
            y.receivedDateTime = {
                raw:"",
                year:2021,
                month:1,
                day:12,
                hour:12,
                minute:12,
                second:12,
                rawutc:"",
                TZ:""
            }
                
            y.sentDateTime = {
                raw:"",
                year:2021,
                month:1,
                day:12,
                hour:12,
                minute:12,
                second:12,
                rawutc:"",
                TZ:""
            }               
            // eslint-disable-next-line
            vueAppInstance.$applog("fileEmailGetData step 3");
            let at1=new EmailAttachment();
            at1.id="1";
            at1.value=true;
            at1.name="something.docx";
            at1.caption="something.docx";
            at1.size="123223";
            y.attachments.push(at1);      

            let at2=new EmailAttachment();
            at2.id="2";
            at2.value=true;
            at2.name="something.pdf";
            at2.caption="something.pdf";
            at2.size="5475475";
            y.attachments.push(at2);      
        
        return y;
    }

    async QueueMessage(_data)
    {
        // eslint-disable-next-line
        vueAppInstance.$applog('MyTaskPaneEntityDataSageCRMAcceleratorClass QueueMessage');
        // eslint-disable-next-line
        vueAppInstance.$applog(JSON.stringify(_data));
        //this is used to message between dialogs and the opening task pane
        //clear anything there...there should only be one item there
        Storage.set({ key: "dialogmessageq", value: JSON.stringify([])});  
        Storage.get({ key: "dialogmessageq"}).then(qdata =>{
            let qdataObj = (qdata.value != null) ? JSON.parse(qdata.value) : [];
            qdataObj.push(_data);
            Storage.set({ key: "dialogmessageq", value: JSON.stringify(qdataObj)});
            // eslint-disable-next-line
            vueAppInstance.$applog('QueueMessage dialogmessageq: '+ JSON.stringify(qdataObj));
        });
    }  

    async createTask(_request)
    {
        // eslint-disable-next-line
        vueAppInstance.$applog('createTask:');
        let res=null;

        let _page='createEntity.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        //build payload out
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('data', JSON.stringify(_request.data));
        bodyFormData.append('entity', _request.entity);        
        bodyFormData.append('contextentity', _request.contextentity);        
        bodyFormData.append('contextentityid', _request.contextentityid);        
        bodyFormData.append('actiondatetime', _request.actiondatetime);        
        bodyFormData.append('username', this.lastUserObject.username);
        bodyFormData.append('crmurl',  this.lastUserObject.crmurl);
        bodyFormData.append('dataonly', 'Y');

        await axios.post(_url, bodyFormData,this.requestConfig)
        .then(function (response) {
            //handle success
            res=response;
            // eslint-disable-next-line
            vueAppInstance.$applog("createTask success:"+JSON.stringify(response));
        })
        .catch(function (response) {
            //handle error
            // eslint-disable-next-line
            vueAppInstance.$applog("createTask ERROR:"+JSON.stringify(response));
        });
        return await res;  
    }
    async logCall(_request)
    {
        // eslint-disable-next-line
        vueAppInstance.$applog('logCall:');
        let res=null;

        let _page='createEntity.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

        //build payload out
        let bodyFormData = new URLSearchParams();
        let _ourdata=[{"name":"Comm_Action","value":_request.data.phonedirection},
                        {"name":"Comm_Status","value":"Complete"},
                        {"name":"Comm_Subject","value":_request.data.formElements[0].value},
                        {"name":"comm_note","value":_request.data.formElements[1].value}]
        bodyFormData.append('data', JSON.stringify(_ourdata));
        bodyFormData.append('entity', _request.entity);        
        bodyFormData.append('contextentity', _request.contextentity);        
        bodyFormData.append('contextentityid', _request.contextentityid);        
        bodyFormData.append('actiondatetime', _request.actiondatetime);        
        bodyFormData.append('username', this.lastUserObject.username);
        bodyFormData.append('crmurl',  this.lastUserObject.crmurl);
        bodyFormData.append('dataonly', 'Y');

        await axios.post(_url, bodyFormData,this.requestConfig)
        .then(function (response) {
            //handle success
            res=response;
            // eslint-disable-next-line
            vueAppInstance.$applog("logCall success:"+JSON.stringify(response));
        })
        .catch(function (response) {
            //handle error
            // eslint-disable-next-line
            vueAppInstance.$applog("logCall ERROR:"+JSON.stringify(response));
        });
        return await res;  
    }
    async getMyCRM(){
        // eslint-disable-next-line
        vueAppInstance.$applog('getMyCRM MyTaskPaneEntityDataSageCRMAcceleratorClass');

        let _page='mycrm.asp';
        let _server=this.getCRMURL();
        let _url =_server+this.rootPath+_page+'?SID='+this.lastUserObject.sid;

       let res=null;
       var _that=this;
       await axios.get(_url)
            .then(function (response) {
                //handle success
                // eslint-disable-next-line
                vueAppInstance.$applog("getMyCRM success="+JSON.stringify(response));
                res=response.data;
            })
            .catch(function (response) {
                //handle error
                // eslint-disable-next-line
                vueAppInstance.$applog("getMyCRM catch="+response);
                _that.lastUserObject={loggedin:false}
                throw new Error(response);
            });

       return await res;        

    }


    async getLoggedOnUserData(username) { //get SID from localsstorage 
        let getLoggedOnUserURL = this.BASE_CRM_URL +  this.rootPath + "getLoggedOnUser.asp?SID=" + this.SID;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('username', username);
        var currentUser = null;
        await axios.post(getLoggedOnUserURL, bodyFormData, this.requestConfig).then((response)=>{            
            currentUser =  response.data;
        });
        return currentUser;
    }

    async saveFCMToken(userId, fcmtoken) {      
        let url = this.BASE_CRM_URL + this.rootPath + "setFCMToken.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('user_ct_fcmtoken', fcmtoken);
        bodyFormData.append('user_userid', userId);
        
        await axios.post(url, bodyFormData, this.requestConfig).then(()=>{

        }).catch(function (response) {
            // eslint-disable-next-line
            vueAppInstance.$applog(response);
        });  
    }


    async getForm(entity, entityId, screenName) {
        let url = this.BASE_CRM_URL + this.rootPath + "getForm.asp?SID=" + this.SID;
        switch (entity.toLowerCase()) {
            case "people":
                entity = "person";
                break;
            case "communications":
                entity = "communication";
                break;
            default: 
                break;
        }

        let bodyFormData = new URLSearchParams();        
        bodyFormData.append('entity', entity);
        bodyFormData.append('entityId', entityId);
        bodyFormData.append('screenName', screenName);    
        var data = {};
        await axios.post(url, bodyFormData,this.requestConfig).then((result)=> {
            data = result.data;            
        });

        return data;
    }


    async getFormNew(entity, entitydata) {
        let url = this.BASE_CRM_URL + this.rootPath + "getFormMetadata.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();        
        bodyFormData.append('entity', entity);
        bodyFormData.append('entitydata', JSON.stringify(entitydata));
        var data = {};
        await axios.post(url, bodyFormData,this.requestConfig).then((result)=> {
            data = result.data;            
        });

        return data;
    }


    

    async getUserProfileForm(userId) {
        let url = this.BASE_CRM_URL + this.rootPath + "getForm.asp?SID=" + this.SID;
        
        let bodyFormData = new URLSearchParams();        
        bodyFormData.append('entity', 'Users');
        bodyFormData.append('entityId', userId);
        bodyFormData.append('screenName', 'UserAdminExtraBox');    
        var data = {};
        await axios.post(url, bodyFormData,this.requestConfig).then((result)=> {
            data = result.data;            
        });

        return data;
    }


    async saveForm(formData) {
        let url = this.BASE_CRM_URL + this.rootPath + "saveForm.asp?SID=" + this.SID;
        var data = null;
        await axios.post(url, formData,this.requestConfig).then((result)=> {
            data = result;
        });

        return data; 
    }

    async createNewEntity(formData) {
        let url = this.BASE_CRM_URL + this.rootPath + "createEntity.asp?SID=" + this.SID;
        var data = null;
        await axios.post(url, formData,this.requestConfig).then((result)=> {
            data = result;
        });

        return data; 
    }


    async getTabContent2(entity, entityId, tabName) {
        let url =  this.BASE_CRM_URL + this.rootPath + "getTabContent.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();
        switch (entity.toLowerCase()) {
            case "people":
                entity = "person";
                break;
            case "communications":
                entity = "communication";
                break;
            default: 
                break;
        }

        bodyFormData.append('entity', entity);
        bodyFormData.append('entityId', entityId);
        bodyFormData.append('tab', tabName);
        let data = null;
        await axios.post(url, bodyFormData, this.requestConfig).then((response) => {
            data = response.data;          
        });

       return data;
    }

    async entitySearch2(entity, searchObject) {
        let url =  this.BASE_CRM_URL + this.rootPath + "entitySearch.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('entity', entity);
        bodyFormData.append('searchObject', JSON.stringify(searchObject || ""));
        let data = null;
        await axios.post(url, bodyFormData, this.requestConfig).then((response) => {
            data = response.data.data;          
        });

       return data;  
    }

    async getAppointments(from, to, user) {
       
        let url =  this.BASE_CRM_URL + this.rootPath + "getCommunications.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('entity', 'communications');
        bodyFormData.append('type', 'appointment');
        bodyFormData.append('from', from.getFullYear() + "-" + (from.getMonth()+1) + "-" + from.getDate());
        bodyFormData.append('to', to.getFullYear() + "-" + (to.getMonth()+1) + "-" + to.getDate());
        bodyFormData.append('userId', user.id);
        let data = null;
        await axios.post(url, bodyFormData, this.requestConfig).then((response) => {
            data = response.data;          
        });
       return data;
    }

    async getTasks(from, to) {
        let url =  this.BASE_CRM_URL + this.rootPath + "getCommunications.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('entity', 'communications');
        bodyFormData.append('type', 'task');
        bodyFormData.append('from', from);
        bodyFormData.append('to', to);
        let data = null;
        await axios.get(url, bodyFormData, this.requestConfig).then((response) => {
            data = response.data.data;          
        });

       return data;
    }

    async saveEmail(entity, entityId, email) {
        let url =  this.BASE_CRM_URL + this.rootPath + "saveEmail.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('entity', entity);
        bodyFormData.append('entityId', entityId);
        bodyFormData.append('emailAddress', email.value);
        bodyFormData.append('emailType', email.name.toLowerCase().replace(':',''));        
        let data = null;
        await axios.post(url, bodyFormData, this.requestConfig).then((response) => {
            data = response.data.data;          
        });
        return data;
    }


    async savePhone(entity, entityId, phone) {
        // eslint-disable-next-line
        vueAppInstance.$applog("save phone", phone);
        let url =  this.BASE_CRM_URL + this.rootPath + "savePhone.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('entity', entity);
        bodyFormData.append('entityId', entityId);
        bodyFormData.append('areacode', phone.value.areacode_value);
        bodyFormData.append('countrycode', phone.value.countrycode_value);
        bodyFormData.append('phonenumber', phone.value.phonenumber_value);
        bodyFormData.append('phoneType', phone.name.toLowerCase().replace(':',''));        
        let data = null;
        await axios.post(url, bodyFormData, this.requestConfig).then((response) => {
            data = response.data.data;          
        });
        return data;
    }


    async getUsers() {
        let url =  this.BASE_CRM_URL + this.rootPath + "getUsers.asp?SID=" + this.SID;
        let data = null;
        await axios.get(url).then((response) => {            
            data = response.data;             
        });
        return data;
    }


    async pingGetuserPings(userId) {
       
        let url =  this.BASE_CRM_URL + this.rootPath + `pingGetuserPings.asp?SID=${this.SID}&userId=${userId}`;
        let data = null;
        await axios.get(url).then((response) => {            
            data = response.data;            
        });
        return data;
    }

    async pingMarkRead(pingId) {
        let url =  this.BASE_CRM_URL + this.rootPath + "pingUpdate.asp?SID=" + this.SID;
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('id', pingId);
        bodyFormData.append('comm_status', 'read');
        let data = null;
        await axios.post(url, bodyFormData).then((response) => {            
            data = response.data;            
        });
        return data;
    }


    async pingCreate(screenMetadata, senderId, shareWithUser, shareMesssage) {
        let url =  this.BASE_CRM_URL + this.rootPath + "pingCreate.asp?SID=" + this.SID;
        
        //this.$applog(pushData);

        let bodyFormData = new URLSearchParams();
        bodyFormData.append('entity', screenMetadata.entity);
        bodyFormData.append('entityId', screenMetadata.entityid);
        bodyFormData.append('body', shareMesssage);
        bodyFormData.append('title', screenMetadata.entityName);
        bodyFormData.append('recipientUserId', shareWithUser.id);       

        /*
            let pushData = {
                "Notification": { 
                    "Title": screenMetadata.entityName, 
                    "Body" : "Check this out",
                    "ImageUrl" : "" 
                },
                "FCMToken" :  shareWithUser.fcmtoken, //todo remove this
                "SentBy": senderId,
                "UserId" : shareWithUser.id
            }
            let url = "https://demo.leadingedge.ro/CRM2020R1/CustomPages/LeadingEdge/PushServer/api/notification/send"; //TODO - move somewhere else
            var entity = Request.Form("entity");
            var entitiId = Request.From("entityId");
            var body = Request.From("body");
            var title = Request.From("title");
            var recipientUserId = Request.From("recipientUserId");
            var senderUserId = Request.From("recipientUserId");        
        */


        let pushHeaderConfig = {
            /*headers: {
                APIKey : "dyd62MsFaJr0AD6n7ACTAtLWPlgR40RLrBdOrTYzwcA", //TODO - might not need this as is also set in createPing.asp
            }*/
        }
        let data = null;
        await axios.post(url, bodyFormData, pushHeaderConfig).then((response) => {
            data = response.data;
        });
        return data;

    }


    //mobilex dashbaord 
    async getMyCRM2(){    
        let url =  this.BASE_CRM_URL + this.rootPath + "mycrm.asp?SID=" + this.SID;
        let bodyFormData = new FormData();
        let data=null;
        await axios.post(url, bodyFormData,this.requestConfig).then(function (response) {
            // eslint-disable-next-line
            vueAppInstance.$applog("getMyCRM2 success="+response);
            data = response.data;
        });
        return data;
    }



    
}

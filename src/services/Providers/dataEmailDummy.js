// eslint-disable-next-line
import {applog} from '@/services/applog.js'
import {MyTaskPaneScreenSetupMetadata, MyTaskPaneEntityScreenMetadata} from "@/services/MyTaskPane/data"
import {MyTaskPaneEntityDataBaseClass, } from "@/services/MyTaskPane/dataBase"
import {PayloadWrapper,EntityData,Section,SectionDataItem} from "@/services/data";

/*
This file is the dev file for the email data source
This is how we will implement the actual 365 connection or anydata source connection
*/

export  class MyTaskPaneEntityDataEmailDummyClass extends MyTaskPaneEntityDataBaseClass {

    lastResult;
    lastSearchResult;
    lastEntityResult;
    lastUserObject;

    constructor() {
        super();
        this.$applog('created: MyTaskPaneEntityDataEmailDummyClass');
        this._type="MyTaskPaneEntityDataEmailDummyClass";
    }

    //called when button is clicked (file/return/cancel)
    actioned(){
        this.$applog('actioned: MyTaskPaneEntityDataEmailDummyClass');
        
    }
    //this always gives the current email
    async selectEntity(_entity, _entityId){
        alert('selectEntity: MyTaskPaneEntityDataEmailDummyClass:'+_entity+'='+_entityId);

        let _entitydata=new EntityData();
        //section 1
        let _sec1=new Section();
        _sec1.name="email1";
        _sec1.title="Person";
        _sec1.closed=false;
        _sec1.btnSearch=true;
        _sec1.searchData="sometitle@somewhere.com";//shouldl be json later so we can have multiple items!
        _entitydata.sections.push(_sec1);
            //section 1 data
            let sdi = new SectionDataItem();
            sdi.name="item1";
            sdi.value="Harold Wilson";
            sdi.displayvalue=sdi.value;
            sdi.caption="Name";
            _sec1.data.push(sdi);
            let sdi2 = new SectionDataItem();
            sdi2.name="Phone";
            sdi2.value="982 1298128";
            sdi2.displayvalue=sdi2.value;            
            sdi2.caption="Phone";
            _sec1.data.push(sdi2);          

        //section 2
        let _sec2=new Section();
        _sec2.name="email2";
        _sec2.title="Emails";
        _sec2.closed=false;
        _entitydata.sections.push(_sec2);       
            //section 1 data
            let sdi21 = new SectionDataItem();
            sdi21.name="sdi21";
            sdi21.value="someone1@somewhere.com";
            sdi21.displayvalue=sdi21.value;
            sdi21.caption="From";
            _sec2.data.push(sdi21);
            let sdi22 = new SectionDataItem();
            sdi22.name="sdi22";
            sdi22.value="someone2@somewhere.com";
            sdi22.displayvalue=sdi22.value;
            sdi22.caption="From";
            _sec2.data.push(sdi22);               


        this.DataList.push(_entitydata);

        //screen data
        let _screenmetadata=new MyTaskPaneEntityScreenMetadata();
        _screenmetadata.lang='en';
        _screenmetadata.container="coreemail";
        _screenmetadata.entity= 'Email',
        _screenmetadata.entityId='9820320r7989ry',
        _screenmetadata.entityName='Person name',
        _screenmetadata.entityIcon='mdi-account';
        _screenmetadata.entityImage='https://www.google.com/s2/favicons?domain=crmtogether.com';
        _screenmetadata.entityName2="marc@crmtogether.com";
        _screenmetadata.entityName3="232 2323 21312";
        
        let _tab={
            tabName:'Details',
            tabCaption:this.$i18n.t('taskpane-screen.Details'),
            component:"EntityViewX",
            enabled:true,
            selected:true
        }
        _screenmetadata.tabs.push(_tab); 

        this.lastEntityResult= {
            screenMetadata:_screenmetadata,
            data:this.DataList
        }
        return this.lastEntityResult;
    }
    
    //not used
    async getTabContent(_entityData, _tab)
    {
        this.$applog('getTabContent: MyTaskPaneEntityDataEmailDummyClass');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getTabContent";
        this.requestData.payload.data={
            EntityData:_entityData,
            Tab:_tab
        }
        alert(JSON.stringify(this.lastSearchResult));
        return await this.lastSearchResult;
    }
    
    //not used
    async entitySearch(_entity, _searchString){
        this.$applog('entitySearch: MyTaskPaneEntityDataEmailDummyClass');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="entitySearch";
        this.requestData.payload.data={
            Entity:_entity,
            _searchString:_searchString
        }
        var _that=this;
        await this.selectEntity(_entity, '').then(function (response) {
            //handle success
            _that.lastEntityResult=response;
            _that.screentabs=response.screenMetadata.tabs;
        })
        .catch(function (response) {
            //handle error
            this.$applog("dummy email - selectEntity entitySearch catch="+response);
            alert('MyTaskPaneEntityDataEmailDummyClass selectEntity entitySearch error'+JSON.stringify(response));
        });
        return await this.lastEntityResult;
    }

    //function returns an object that controls how the connection screen works and what features are enabled or not
    async getScreenSetup(){
        this.$applog('MyTaskPaneEntityDataEmailDummyClass getScreenSetup');
        //screen data
        let _screensetup=new MyTaskPaneScreenSetupMetadata();
        _screensetup.hasHome=true;
        _screensetup.hasSearch=false;
        _screensetup.hasFileEmail=false;
        _screensetup.searchEntities=[];
        _screensetup.hasOptions=false;
        _screensetup.hasNew=false;
        _screensetup.defaultSearchEntity='';
        
        this.lastResult= {
            screenMetadata:_screensetup,
            data:null
        }
        this.$applog('MyTaskPaneEntityDataEmailDummyClass returning result')
        return this.lastResult;
    }
    
    async login(dataObject){
        this.$applog('login: MyTaskPaneEntityDataEmailDummyClass'+dataObject);

        this.$applog('login: MyTaskPaneEntityDataEmailDummyClass'+dataObject);
        this.lastUserObject= {
            screenMetadata:{},
            data:{
                sid:'1212121',
                username: 'sds',
                displayName:'Bob Hope'
            }
        }
        return this.lastUserObject;
    }
}

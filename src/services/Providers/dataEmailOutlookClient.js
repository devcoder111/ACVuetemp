// eslint-disable-next-line
import {applog} from '@/services/applog.js'
import {MyTaskPaneScreenSetupMetadata, MyTaskPaneEntityScreenMetadata} from "@/services/MyTaskPane/data"
import {MyTaskPaneEntityDataBaseClass, } from "@/services/MyTaskPane/dataBase"
import {PayloadWrapper,EntityData,Section,SectionDataItem} from "@/services/data";

/*
This file is the dev file for the email data source
This is how we will implement the actual 365 connection or anydata source connection
*/

export  class MyTaskPaneEntityDataOutlookClientClass extends MyTaskPaneEntityDataBaseClass {

    lastResult;
    lastSearchResult;
    lastEntityResult;
    lastUserObject;

    constructor() {
        super();
        this.$applog('created: MyTaskPaneEntityDataEmailOutlookClient');
        this._type="MyTaskPaneEntityDataOutlookClientClass";
    }

    //called when button is clicked (file/return/cancel)
    actioned(){
        this.$applog('actioned: MyTaskPaneEntityDataEmailOutlookClient');
        
    }
    //this always gives the current email
    async selectEntity(_entity, _entityId){
        this.$applog('selectEntity: MyTaskPaneEntityDataEmailOutlookClient:'+_entity+'='+_entityId);
        this.DataList =[];//list of data objects

        // eslint-disable-next-line
        let email=vueAppInstance.$mailbox.getCurrentItem();

        let _entitydata=new EntityData();
        //section 1
        let _sec1=new Section();
        _sec1.name="email1";
        _sec1.title="Summary";
        _sec1.closed=false;
        _sec1.btnSearch=true;
        _sec1.searchData=email.from;//shouldl be json later so we can have multiple items!

            //section 1 data
            let sdi = new SectionDataItem();
            sdi.name="item1";
            sdi.displayvalue=email.from.emailAddress;
            sdi.caption="From";//translate?
            _sec1.data.push(sdi);
           
            if (email.phoneNumbers.length>0)
            {
                for(var z=0;z<email.phoneNumbers.length;z++)
                {
                    let sdi2 = new SectionDataItem();
                    sdi2.name="Phone"+z;
                    sdi2.displayvalue=email.phoneNumbers[z].number;
                    sdi2.caption="Phone";
                    _sec1.data.push(sdi2);      
                }
            }
    
        _entitydata.sections.push(_sec1);

        //email address parsing
        var regexEmail = new RegExp(
            "\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*",
            "gi"
        );
        //section parsed emails
        let _secParsedEmail=new Section();
        _secParsedEmail.name="AllEmails";
        _secParsedEmail.title="Parsed Email Addresses";
        _secParsedEmail.closed=false;
        _secParsedEmail.btnSearch=true;
        let iEmailCount=0;
        var resultEmail;
        var uniqueEmails=[];
        while((resultEmail = regexEmail.exec(email.body)) !== null) {
            //section 1 data
            if (!uniqueEmails.includes(resultEmail[0]))
            {
                uniqueEmails.push(resultEmail[0]);
                let sditmp2 = new SectionDataItem();
                sditmp2.name="phoneitem_"+iEmailCount;
                sditmp2.displayvalue=resultEmail[0];
                sditmp2.caption="Address";//translate?
                _secParsedEmail.data.push(sditmp2);
                iEmailCount++;
            }
        }
        if (iEmailCount>0)
            _entitydata.sections.push(_secParsedEmail);

        //phone number parsing
        var regex = new RegExp(
            "\\+?\\(?\\d*\\)? ?\\(?\\d+\\)?\\d*([\\s./-]\\d{2,})+",
            "g"
        );
        //section Phone
        let _secPhone=new Section();
        _secPhone.name="Phone1";
        _secPhone.title="Parsed Phone Numbers";
        _secPhone.closed=false;
        _secPhone.btnSearch=true;
        let iPhoneCount=0;
        var result;
        while((result = regex.exec(email.body)) !== null) {
                    //section 1 data
                    let sditmp = new SectionDataItem();
                    sditmp.name="phoneitem_"+iPhoneCount;
                    sditmp.displayvalue=result[0];
                    sditmp.caption="Number";//translate?
                    var pnumlen=result[0].replace(/\s+/g, '')
                    if (pnumlen.length>7)
                    {
                        _secPhone.data.push(sditmp);
                        iPhoneCount++;
                    }
        }
        if (iPhoneCount>0)
            _entitydata.sections.push(_secPhone);

        //todo..address parsing         

        this.DataList.push(_entitydata);

        //screen header data
        let _screenmetadata=new MyTaskPaneEntityScreenMetadata();
        _screenmetadata.container="coreemail";
        _screenmetadata.entity= sdi.displayvalue,
        _screenmetadata.entityId=email.entryid,
        _screenmetadata.entityName=email.from.displayName,
        _screenmetadata.entityIcon='mdi-microsoft-outlook';
        _screenmetadata.entityName2=email.from.emailAddress;
        //phone number?
        _screenmetadata.entityName3=email.subject;
        
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
        this.$applog('getTabContent: MyTaskPaneEntityDataEmailOutlookClient');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getTabContent";
        this.requestData.payload.data={
            EntityData:_entityData,
            Tab:_tab
        }
        return await this.lastSearchResult;
    }
    
    //not used
    async entitySearch(_entity, _searchObject){
        alert('entitySearch: MyTaskPaneEntityDataEmailOutlookClient');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="entitySearch";
        this.requestData.payload.data={
            Entity:_entity,
            searchObject:_searchObject
        }
        var _that=this;
        //to do...okay so in Version 1 we dont have a search facility on the email link..
        //we will later on..for now though we just show the current email item
        await this.selectEntity(_entity, '').then(function (response) {
            //handle success
            alert("outlook client - selectEntity entitySearch success="+JSON.stringify(response));
            _that.lastEntityResult=response;
            _that.screentabs=response.screenMetadata.tabs;

        })
        .catch(function (response) {
            //handle error
            this.$applog("outlook client - selectEntity entitySearch catch="+response);
            alert('outlook client selectEntity entitySearch error');
        });
        return await this.lastEntityResult;
    }

    //function returns an object that controls how the connection screen works and what features are enabled or not
    async getScreenSetup(){
        this.$applog('MyTaskPaneEntityDataOutlookClientClass getScreenSetup');
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
        this.$applog('MyTaskPaneEntityDataEmailOutlookClient returning result')
        return this.lastResult;
    }

    async login(dataObject){
        this.$applog('login: MyTaskPaneEntityDataEmailOutlookClient'+dataObject);
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

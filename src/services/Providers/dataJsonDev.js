// eslint-disable-next-line
import {applog} from '@/services/applog.js'
import {MyTaskPaneScreenSetupMetadata, MyTaskPaneEntityScreenMetadata} from "@/services/MyTaskPane/data"
import {MyTaskPaneEntityDataBaseClass, } from "@/services/MyTaskPane/dataBase"
import {PayloadWrapper,Data,EntityData,Section} from "@/services/data";
import {ScreenMetadata} from "@/services/data.js";
import { FormScreenMetadata, MyFormElement, MySelectOptions } from "../formdata";

import axios from 'axios';

export  class MyTaskPaneEntityDataJsonDevClass extends MyTaskPaneEntityDataBaseClass {

    lastResult;
    lastSearchResult;
    lastEntityResult;
    screenmetadata;
    screentabs;
    lastUserObject;

    constructor() {
        super();
        this.$applog('created: MyTaskPaneEntityDataJsonDevClass');
        this.screentabs=[];
        this._type="MyTaskPaneEntityDataJsonDevClass";
    }

    //called when button is clicked (file/return/cancel)
    actioned(){
        this.$applog('actioned: MyTaskPaneEntityDataJsonDevClass');
        
    }

    getTabByName(_tabName){
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

    async getScreenTabs(){
        this.screentabs=[];
        let _tab={
            tabName:"Details",
            tabCaption:"Details",
            tabIcon:"mdi-account",
            component:"EntityViewX",
            enabled:true,
            selected:true
        }
        this.screentabs.push(_tab);

        let _tabSales={
            tabName:"Sales",
            tabCaption:"Sales",
            tabIcon:"el-icon-money",
            component:"EntityListX",
            enabled:true,
            selected:false
        }
        this.screentabs.push(_tabSales);        

        let _tabFrame={
            tabName:"Frame",
            tabCaption:"Frame",
            tabIcon:"el-icon-picture-outline-round",
            component:"EntityViewFrame",
            enabled:true,
            selected:false,
            data:"https://crmtogether.com"
        }
        this.screentabs.push(_tabFrame);        


    }

    async selectEntity(_entity, _entityId){
        this.$applog('selectEntity: MyTaskPaneEntityDataJsonDevClass:'+_entity+'='+_entityId);

        let _entitydata=new EntityData();

        let _sec1=new Section();
        _sec1.name="summary";
        _sec1.title="title set here";
        _sec1.closed=false;
        _entitydata.sections.push(_sec1);

        let _sec2=new Section();
        _sec2.name="Person";
        _sec2.title="Person title set here";
        _sec2.closed=false;
        _entitydata.sections.push(_sec2);        

        this.DataList.push(_entitydata);

        //screen data
        this.screenmetadata=new MyTaskPaneEntityScreenMetadata();
        this.screenmetadata.container="coreemail";
        this.screenmetadata.entity= 'Email',
        this.screenmetadata.entityId='9820320r7989ry',
        this.screenmetadata.entityName='Jason Dev',
        this.screenmetadata.entityIcon='mdi-account';

        await this.getScreenTabs();
        this.screenmetadata.tabs=this.screentabs;

        this.lastEntityResult= {
            screenMetadata:this.screenmetadata,
            data:this.DataList
        }
        return this.lastEntityResult;
    }

    async getTabContent(_entityData, _tabName)
    {
        this.$applog('getTabContent: MyTaskPaneEntityDataJsonDevClass');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getTabContent";
        this.requestData.payload.data={
            EntityData:_entityData,
            Tab:_tabName
        }
        //get the tab object
        let _tab=this.getTabByName(_tabName);
        if (_tab.component=="EntityViewX")
        {
            this.lastSearchResult= {
                screenMetadata:this.screenmetadata,
                data:[]
            }
            this.$applog("========EntityViewX========");
            this.$applog(JSON.stringify(this.lastSearchResult));
            return await this.lastSearchResult;
        }else
        if (_tab.component=="EntityViewFrame")
        {
            this.lastSearchResult= {
                screenMetadata:this.screenmetadata,
                data:_tab.data
            }
            this.$applog("=======EntityViewFrame=========");
            this.$applog(JSON.stringify(this.lastSearchResult));
            return await this.lastSearchResult;
        }else 
        if (_tab.component=="EntityListX")
        {
            let _tableData=null;

            _tableData=[{
                entity:'person',
                entityID:'123',
                fullname: 'Frank Jonex',
                emailaddress:'frank@jonex.com'
            }, {
                entity:'person',
                entityID:'1234',
                fullname: 'Rachel White',
                emailaddress:'rach@rwhites.com'
            }, {
                entity:'person',
                entityID:'12345',
                fullname: 'Paula Smith and a very very long name',
                emailaddress:'paula.smith@greatstuff.com'
            }, {
                entity:'person',
                entityID:'123455',
                fullname: 'Paula Smith and a very very long name',
                emailaddress:'paula.smith@greatstuff.com'
            }, {
                entity:'person',
                entityID:'123456',
                fullname: 'Paula Smith and a very very long name',
                emailaddress:'paula.smith@greatstuff.com'
            }, {
                entity:'person',
                entityID:'123457',
                fullname: 'Paula Smith and a very very long name',
                emailaddress:'paula.smith@greatstuff.com'
            }, {
                entity:'person',
                entityID:'123485',
                fullname: 'Paula Smith and a very very long name',
                emailaddress:'paula.smith@greatstuff.com'
            }]
        
            //screen data
            let _screenmetadata=new ScreenMetadata();
            _screenmetadata.container="core";
            let _data=new Data();
        
            _data.tableData= _tableData;
            _data.tableColumns= [{
                    fixed:true,
                    prop:"fullname",
                    label:"Name",
                    width:"150px",
                    minWidth: "150px"
            },{
                fixed:true,
                prop:"emailaddress",
                label:"Email Address",
                width:"250px",
                minWidth: "250px"
            }]

            this.lastSearchResult= {
                screenMetadata:_screenmetadata,
                data:_data
            }
            this.$applog("=======EntityListX=========");
            this.$applog(JSON.stringify(this.lastSearchResult));
            return await this.lastSearchResult;
        }

    }

    async getBookmarks(){
        this.$applog('getBookmarks: MyTaskPaneEntityDataJsonDevClass');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getBookmarks";
        this.requestData.payload.data={}

        let _tableData=null;

        _tableData=[{
            entity:'person',
            entityID:'123',
            book_entityname: 'Person',
            book_title:'Frank Jones'
        }, {
            entity:'person',
            entityID:'1234',
            book_entityname: 'Person',
            book_title:'Frank Jones'
        }, {
            entity:'person',
            entityID:'12345',
            book_entityname: 'Cases',
            book_title:'Issue with ABC'
        }, {
            entity:'person',
            entityID:'123455',
            book_entityname: 'Company',
            book_title:'Jones Inc'
        }, {
            entity:'person',
            entityID:'123456',
            book_entityname: 'Opportunity',
            book_title:'Something to sell'
        }, {
            entity:'person',
            entityID:'123457',
            book_entityname: 'Person',
            book_title:'Frank Jones'
        }, {
            entity:'person',
            entityID:'123485',
            book_entityname: 'Company',
            book_title:'Some Company'
        }]
      
        //screen data
        let _screenmetadata=new ScreenMetadata();
        _screenmetadata.container="core";
        let _data=new Data();
     
        _data.tableData= _tableData;
        _data.tableColumns= [{
                fixed:true,
                prop:"book_entityname",
                label:"Name",
                width:"150px",
                minWidth: "150px"
        },{
            fixed:true,
            prop:"book_title",
            label:"Email Address",
            width:"250px",
            minWidth: "250px"
        }]

        this.lastSearchResult= {
            screenMetadata:_screenmetadata,
            data:_data
        }
        this.$applog(JSON.stringify(this.lastSearchResult));
        return await this.lastSearchResult;

    }

    async createEntity(_entity, _data){
        this.$applog('createEntity: MyTaskPaneEntityDataJsonDevClass');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="entitySearch";
        this.requestData.payload.data={
            Entity:_entity,
            entityData:_data
        }
        
        //todo...return data 
        return {
            screenMetadata:null,
            data:''
        }
    }

    async getFormMetadata(_entity,_entityData){
        this.$applog('getFormMetadata: MyTaskPaneEntityDataJsonDevClass');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getFormMetadata";
        this.requestData.payload.data={
            Entity:_entity,
            entityData:_entityData
        }

        let _screenmetadata=new FormScreenMetadata();
        _screenmetadata.title='New '+_entity;
        _screenmetadata.entity=_entity;
        //text field
        let fieldText=new MyFormElement();
        fieldText.name='fieldText';
        fieldText.value='some default value';
        fieldText.caption='MyFormInput Caption';
        fieldText.componentType='MyFormInput';
        _screenmetadata.formElements.push(fieldText);

        //divider
        let fieldDivider=new MyFormElement();
        fieldDivider.name='fieldDivider';
        fieldDivider.caption='MyFormDivider caption';
        fieldDivider.componentType='MyFormDivider';
        _screenmetadata.formElements.push(fieldDivider);        

        //**************************************** */
        //remote lookup
        //**************************************** */
        let fieldRemoteLookup=new MyFormElement();
        fieldRemoteLookup.name='fieldRemoteLookup';
        //fieldRemoteLookup.value='{"text":"A Midland & Sons","value":{"entity":"company","entityid":44},"icon":"mdi-office-building"}';
        fieldRemoteLookup.value=null;
        fieldRemoteLookup.entity='company';
        fieldRemoteLookup.caption='MyFormRemoteLookup caption';
        fieldRemoteLookup.componentType='MyFormRemoteLookup';
        fieldRemoteLookup.placeholder='placeholder text';
        fieldRemoteLookup.remoteLookup=this.getRemoteData;
        fieldRemoteLookup.sender=this;
        _screenmetadata.formElements.push(fieldRemoteLookup);

        //**************************************** */
        //remote lookup with filter
        //**************************************** */
        
        let fieldRemoteLookupFilter=new MyFormElement();
        fieldRemoteLookupFilter.name='fieldRemoteLookupFilter';
        //fieldRemoteLookup.value='{"text":"A Midland & Sons","value":{"entity":"company","entityid":44},"icon":"mdi-office-building"}';
        fieldRemoteLookupFilter.value=null;
        fieldRemoteLookupFilter.entity='person';
        fieldRemoteLookupFilter.filter='pers_companyid={0}';
        fieldRemoteLookupFilter.filterObject=fieldRemoteLookup;
        fieldRemoteLookupFilter.caption='MyFormRemoteLookup caption filter demo';
        fieldRemoteLookupFilter.componentType='MyFormRemoteLookup';
        fieldRemoteLookupFilter.placeholder='filter demo';
        fieldRemoteLookupFilter.remoteLookup=this.getRemoteData;
        fieldRemoteLookupFilter.sender=this;
        _screenmetadata.formElements.push(fieldRemoteLookupFilter);

        //divider2
        let fieldDivider2=new MyFormElement();
        fieldDivider2.name='fieldDivider2';
        fieldDivider2.caption='MyFormDivider caption';
        fieldDivider2.componentType='MyFormDivider';
        _screenmetadata.formElements.push(fieldDivider2);        

/////////////////////        
        //select field
        let fieldSelect=new MyFormElement();
        fieldSelect.name='fieldSelect';
        fieldSelect.value='opt2';
        fieldSelect.caption='MyFormSelect Caption';
        fieldSelect.componentType='MyFormSelect';
        //add options
        let fieldSelectOp1=new MySelectOptions();
        fieldSelectOp1.text="fieldSelectOp1";
        fieldSelectOp1.value="opt1";
        fieldSelect.options.push(fieldSelectOp1);
        let fieldSelectOp2=new MySelectOptions();
        fieldSelectOp2.text="test2 label";
        fieldSelectOp2.value="opt2";
        fieldSelect.options.push(fieldSelectOp2);
        //add the field
        _screenmetadata.formElements.push(fieldSelect);
/////////////////////

/////////////////////   
        //multiple select field
        let fieldSelectMultiple=new MyFormElement();
        fieldSelectMultiple.name='fieldSelectMultiple';
        fieldSelectMultiple.text='opt2,opt3';
        fieldSelectMultiple.caption='MyFormSelectMultiple Caption';
        fieldSelectMultiple.componentType='MyFormSelectMultiple';
        //add options
        let fieldSelectMultipleOp1=new MySelectOptions();
        fieldSelectMultipleOp1.text="fieldSelectMultipleOp1";
        fieldSelectMultipleOp1.value="opt1";
        fieldSelectMultiple.options.push(fieldSelectMultipleOp1);
        let fieldSelectMultipleOp2=new MySelectOptions();
        fieldSelectMultipleOp2.text="fieldSelectMultipleOp2 label";
        fieldSelectMultipleOp2.value="opt2";
        fieldSelectMultiple.options.push(fieldSelectMultipleOp2);
        let fieldSelectMultipleOp3=new MySelectOptions();
        fieldSelectMultipleOp3.text="fieldSelectMultipleOp3 label";
        fieldSelectMultipleOp3.value="opt3";
        fieldSelectMultiple.options.push(fieldSelectMultipleOp3);        
        //add the field
        _screenmetadata.formElements.push(fieldSelectMultiple);
/////////////////////   

/////////////////////   
        //checkbox
        let fieldCheckbox=new MyFormElement();
        fieldCheckbox.name='fieldCheckbox';
        fieldCheckbox.value='Y';
        fieldCheckbox.caption='MyFormCheckbox caption';
        fieldCheckbox.componentType='MyFormCheckbox';
        _screenmetadata.formElements.push(fieldCheckbox);
/////////////////////   

        //number
        let fieldNumber=new MyFormElement();
        fieldNumber.name='fieldNumber';
        fieldNumber.value='4';
        fieldNumber.caption='MyFormNumber caption';
        fieldNumber.componentType='MyFormNumber';
        _screenmetadata.formElements.push(fieldNumber);

        //date only
        let fieldDate=new MyFormElement();
        fieldDate.name='fieldDate';
        fieldDate.value= new Date().toISOString().substr(0, 10);
        fieldDate.caption='MyFormDate caption';
        fieldDate.componentType='MyFormDate';
        _screenmetadata.formElements.push(fieldDate);        

        //date time only
        let fieldDateTime=new MyFormElement();
        fieldDateTime.name='fieldDateTime';
        fieldDateTime.value={date:new Date().toISOString().substr(0, 10),time:'01:00'};
        fieldDateTime.caption='MyFormDateTime caption';
        fieldDateTime.componentType='MyFormDateTime';
        _screenmetadata.formElements.push(fieldDateTime);             

        let fieldDateTime2=new MyFormElement();
        fieldDateTime2.name='fieldDateTime2';
        fieldDateTime2.value={date:new Date().toISOString().substr(0, 10),time:'06:00'};
        fieldDateTime2.caption='MyFormDateTime caption2';
        fieldDateTime2.componentType='MyFormDateTime';
        _screenmetadata.formElements.push(fieldDateTime2);        

        //radio group only
        let fieldRadioGroup=new MyFormElement();
        fieldRadioGroup.name='fieldRadioGroup';
        fieldRadioGroup.value='opt2';
        fieldRadioGroup.caption='MyFormRadioGroup caption';
        fieldRadioGroup.componentType='MyFormRadioGroup';
        //radio options
        let fieldRadioGroupOp1=new MySelectOptions();
        fieldRadioGroupOp1.label="fieldRadioGroupOp1 label";
        fieldRadioGroupOp1.value="opt1";
        fieldRadioGroup.options.push(fieldRadioGroupOp1);   
        let fieldRadioGroupOp2=new MySelectOptions();
        fieldRadioGroupOp2.label="fieldRadioGroupOp2 label";
        fieldRadioGroupOp2.value="opt2";
        fieldRadioGroup.options.push(fieldRadioGroupOp2);   
        let fieldRadioGroupOp3=new MySelectOptions();
        fieldRadioGroupOp3.label="fieldRadioGroupOp3 label";
        fieldRadioGroupOp3.value="opt3";
        fieldRadioGroup.options.push(fieldRadioGroupOp3);                    
        //add field
        _screenmetadata.formElements.push(fieldRadioGroup);              

        //switch
        let fieldSwitch=new MyFormElement();
        fieldSwitch.name='fieldSwitch';
        fieldSwitch.value='';
        fieldSwitch.caption='MyFormSwitch Caption';
        fieldSwitch.componentType='MyFormSwitch';
        _screenmetadata.formElements.push(fieldSwitch);
        
        //textarea
        let fieldTextArea=new MyFormElement();
        fieldTextArea.name='fieldTextArea';
        fieldTextArea.value='';
        fieldTextArea.caption='MyFormTextArea Caption';
        fieldTextArea.componentType='MyFormTextArea';
        _screenmetadata.formElements.push(fieldTextArea);

        //time
        let fieldTime=new MyFormElement();
        fieldTime.name='fieldTime';
        fieldTime.value='';
        fieldTime.caption='MyFormTime Caption';
        fieldTime.componentType='MyFormTime';
        _screenmetadata.formElements.push(fieldTime);

        //currency
        let fieldCurrency=new MyFormElement();
        fieldCurrency.name='fieldCurrency';
        fieldCurrency.value={currency:null, amount:'4'};
        fieldCurrency.caption='MyFormCurrency Caption';
        fieldCurrency.componentType='MyFormCurrency';
        //add in currency options
        let fieldCurrencyOp1=new MySelectOptions();
        fieldCurrencyOp1.label="$";
        fieldRadioGroupOp1.value="USD";
        fieldCurrency.options.push(fieldCurrencyOp1);   
        let fieldCurrencyOp2=new MySelectOptions();
        fieldCurrencyOp2.label="£";
        fieldRadioGroupOp1.value="GBP";
        fieldCurrency.options.push(fieldCurrencyOp2);   
        _screenmetadata.formElements.push(fieldCurrency);

        //website/url
        let fieldURL=new MyFormElement();
        fieldURL.name='fieldURL';
        fieldURL.value='somesite.com';
        fieldURL.caption='MyFormURL Caption';
        fieldURL.componentType='MyFormURL';
        _screenmetadata.formElements.push(fieldURL);        

        return {
            screenMetadata:_screenmetadata,
            data:''
        }
    }

    async entitySearch(_entity, _searchString){
        this.$applog('entitySearch: MyTaskPaneEntityDataJsonDevClass');
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="entitySearch";
        this.requestData.payload.data={
            Entity:_entity,
            _searchString:_searchString
        }

        let _tableData=null;

        _tableData=[{
            entity:'person',
            entityID:'123',
            fullname: 'Frank Jonex',
            emailaddress:'frank@jonex.com'
        }, {
            entity:'person',
            entityID:'1234',
            fullname: 'Rachel White',
            emailaddress:'rach@rwhites.com'
        }, {
            entity:'person',
            entityID:'12345',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }, {
            entity:'person',
            entityID:'123455',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }, {
            entity:'person',
            entityID:'123456',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }, {
            entity:'person',
            entityID:'123457',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }, {
            entity:'person',
            entityID:'123485',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }]
      
        //screen data
        let _screenmetadata=new ScreenMetadata();
        _screenmetadata.container="core";
        let _data=new Data();
     
        _data.tableData= _tableData;
        _data.tableColumns= [{
                fixed:true,
                prop:"fullname",
                label:"Name",
                width:"150px",
                minWidth: "150px"
        },{
            fixed:true,
            prop:"emailaddress",
            label:"Email Address",
            width:"250px",
            minWidth: "250px"
        }]

        this.lastSearchResult= {
            screenMetadata:_screenmetadata,
            data:_data
        }
        this.$applog(JSON.stringify(this.lastSearchResult));
        return await this.lastSearchResult;
    }
    async getRemoteData(sender, _query){
        this.$applog('getRemoteData sender:'+sender);
        this.$applog('getRemoteData _query:'+_query);

        let _data=new Object();
        _data.options=[{ value: '123', label:'test1' },
        { value: '1233', label:'test2' },
        { value: '1234', label:'test3' }];

        this.lastResult= {
            screenMetadata:null,
            data:_data
        }
        return this.lastResult;

    }
    //function returns an object that controls how the connection screen works and what features are enabled or not
    async getScreenSetup(){
        this.$applog('MyTaskPaneEntityDataJsonDevClass getScreenSetup');
        //screen data
        let _screensetup=new MyTaskPaneScreenSetupMetadata();
        _screensetup.hasHome=true;
        _screensetup.hasFileEmail=true;
        _screensetup.searchEntities=[{
                name:'company',
                caption:'Company'
            },{
                name:'person',
                caption:'Person'
            },{
                name:'cases',
                caption:'Cases'
            }
        ];
        _screensetup.hasOptions=true;
        _screensetup.hasNew=true;
        _screensetup.newEntities=[{
                name:'company',
                caption:'Company'
            },{
                name:'person',
                caption:'Person'
            },{
                name:'cases',
                caption:'Cases'
            }
        ];        
        _screensetup.options=[{
                name:'phone',
                caption:'Phone'
            },{
                name:'tagemail',
                caption:'Tag Email'
            },{
                name:'replytagemail',
                caption:'Reply and Tag'
            },{
                name:'newemail',
                caption:'New Email'
            },{
                name:'newappt',
                caption:'New Appointment'
            },{
                name:'newtask',
                caption:'New Task'
            }
        ];        
        
        this.lastResult= {
            screenMetadata:_screensetup,
            data:null
        }
        this.$applog('MyTaskPaneEntityDataJsonDevClass returning result')
        return this.lastResult;
    }

    async login(dataObject){
        this.$applog('login: MyTaskPaneEntityDataJsonDevClass'+JSON.stringify(dataObject));

        let _action ='KonneXGateway.aspx?SID=&action=logon';
        
        //build payload out
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="logon";
        this.requestData.payload.data={
            username: 'admin',
            password: '',
            crmurl: 'http://localhost:1898/',
            _clienttzoffset_current: '-60',
            clientdt_current: '2020-07-09T14:56:42.944Z',
            dataonly:'Y'	
        }
       
       let bodyFormData = new FormData();
       bodyFormData.set('username', dataObject.username);
       bodyFormData.set('password',  dataObject.password);  
       bodyFormData.set('crmurl',  dataObject.url);
       bodyFormData.set('dataonly', 'Y');

       var _that=this;
       await axios.post( dataObject.url+_action, bodyFormData,{
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then(function (response) {
                //handle success
                this.$applog("login success="+response);
                _that.lastUserObject={
                    username:dataObject.username,
                    displayName:dataObject.username,
                    crmurl:dataObject.url,
                    sid:response,
                    loggedin:true
                }
            })
            .catch(function (response) {
                //handle error
                this.$applog("login catch="+response);
                _that.lastUserObject={loggedin:false}
            });

       return await this.lastUserObject;

       /*

        this.lastUserObject= {
            screenMetadata:{},
            data:{
                sid:'1212121',
                username: 'sds',
                displayName:'Bob Hope'
            }
        }
        return this.lastUserObject;*/
    }
}

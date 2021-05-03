// eslint-disable-next-line
import {applog} from '@/services/applog.js'
import {MyTaskPaneScreenSetupMetadata, MyTaskPaneEntityScreenMetadata} from "@/services/MyTaskPane/data"
import {MyTaskPaneEntityDataBaseClass } from "@/services/MyTaskPane/dataBase"
import {Data, PayloadWrapper,EmailData, EmailAddressInfo,EmailAttachment,} from "@/services/data";
import {HistoryScreenMetadata} from "@/services/History/data";
import {EmailTemplateScreenMetadata} from "@/services/EmailTemplates/data";
import {AttachDocumentsScreenMetadata} from "@/services/AttachDocuments/data";
import {AddressBookScreenMetadata,AddressBookData} from "@/services/AddressBook/data";
import {FileEmailScreenMetadata} from "@/services/FileEmail/data";

export  class MyTaskPaneEntityDataDummyClass extends MyTaskPaneEntityDataBaseClass {

    lastResult;
    lastUserObject;
    EmailList;

    constructor() {
        super();
        this.$applog('created: MyTaskPaneEntityDataDummyClass');
        this.EmailList=[];
        this._type="MyTaskPaneEntityDataDummyClass";
    }

    //called when button is clicked (file/return/cancel)
    actioned(){
        this.$applog('actioned: MyTaskPaneEntityDataDummyClass');
        
    }
    
    async selectEntity(_entity, _entityId){
        this.$applog('MyTaskPaneEntityDataDummyClass:'+_entity+'='+_entityId);
        let _emaildata=new EmailData();
        _emaildata.subject='Dummy subject';
        _emaildata.body='some dummy body';
        _emaildata.htmlBody='<html><head></head><body>Some html dummy body</body><html>';

        let _from=new EmailAddressInfo();
        _from.displayName ='James Joyce';
        _from.emailAddress = 'info@dummyemail.com';
        _emaildata.from=_from;

        let _to=new EmailAddressInfo();
        _to.displayName ='Bruce Lee';
        _to.emailAddress = 'blee@hiya.com';
        _emaildata.to.push(_to);

        let _cc=new EmailAddressInfo();
        _cc.displayName ='Trevor Lee';
        _cc.emailAddress = 'trevor.lee@hiya.com';
        _emaildata.cc.push(_cc);
        let _cc2=new EmailAddressInfo();
        _cc2.displayName ='Jane Jones';
        _cc2.emailAddress = 'jj@jones.com';
        _emaildata.cc.push(_cc2);        

        let addr1='3015 Lake Drive, Citywest Business Campus, Dublin 24, Ireland';
        _emaildata.locations.push(addr1);
        let addr2='3017 Lake Drive, Citywest Business Campus, Dublin 24, Ireland';
        _emaildata.locations.push(addr2);

        let orgName="CRM Together";
        _emaildata.orgArray.push(orgName);
        let orgName2="Microsoft";
        _emaildata.orgArray.push(orgName2);

        let per1="Bill Gates";
        _emaildata.personArray.push(per1);
        let per2="Melinda Gates";
        _emaildata.personArray.push(per2);

        let _phone1='+232 2333 324 234';
        _emaildata.phoneNumbers.push(_phone1);
        let _phone2='+76 1132 334 22';
        _emaildata.phoneNumbers.push(_phone2);

        //attachments
        let at1=new EmailAttachment();
        at1.id="1";
        at1.displayName="something.docx";
        at1.size="10kb";
        _emaildata.attachments.push(at1);
        for(var i=0;i<20;i++)
        {
            let at3=new EmailAttachment();
            at3.id="2";
            at3.displayName="at2.pdf";
            at3.size="10kb";
            at3.ischecked=true;
            _emaildata.attachments.push(at3);
        }
        //screen data
        let _screenmetadata=new MyTaskPaneEntityScreenMetadata();
        _screenmetadata.lang='de';
        _screenmetadata.container="coreemail";
        _screenmetadata.entity= 'Email',
        _screenmetadata.entityId='9820320r7989ry',
        _screenmetadata.entityName='James Joyce',
        _screenmetadata.entityIcon='mdi-account';
        let _tab={
            tabName:"EmailDetails",
            tabCaption:"Details",
            component:"EmailDetails",
            enabled:true,
            selected:true
        }
        _screenmetadata.tabs.push(_tab);

        this.DataList.push(_emaildata);

        this.lastResult= {
            screenMetadata:_screenmetadata,
            data:this.DataList
        }
        this.$applog('MyTaskPaneEntityDataDummyClass returning result');
        this.$applog(JSON.stringify(this.lastResult));
        return this.lastResult;
    }
    async entitySearch(_entity, _searchObject){
        alert('MyTaskPaneEntityDataDummyClass-entitySearch: MyTaskPaneEntityDataEmailOutlookClient');
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
            alert("MyTaskPaneEntityDataDummyClass - selectEntity entitySearch success="+JSON.stringify(response));
            _that.lastEntityResult=response.data;
            _that.screentabs=response.screenMetadata.tabs;

        })
        .catch(function (response) {
            //handle error
            this.$applog("MyTaskPaneEntityDataDummyClass - selectEntity entitySearch catch="+response);
            alert('MyTaskPaneEntityDataDummyClass selectEntity entitySearch error');
        });
        return await this.lastEntityResult;
    }

    //function returns an object that controls how the connection screen works and what features are enabled or not
    async getScreenSetup(){
        this.$applog('MyTaskPaneEntityDataDummyClass getScreenSetup');
        //screen data
        let _screensetup=new MyTaskPaneScreenSetupMetadata();
        _screensetup.hasHome=true;
        _screensetup.searchEntities=[];
        _screensetup.hasOptions=false;
        _screensetup.hasNew=false;
        _screensetup.defaultSearchEntity=false;
        _screensetup.lang="de";
        
        this.lastResult= {
            screenMetadata:_screensetup,
            data:null
        }
        this.$applog('MyTaskPaneEntityDataEmailDummyClass returning result')
        return this.lastResult;
    }
    async login(dataObject){
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

    async historyGetData(filterEntity, filterDate){
        this.$applog("history filterdate:"+filterDate)
        this.$applog("history filterEntity:"+filterEntity)
        filterDate=new String(filterDate);
        let fdate=filterDate.split("-");
        let _year=fdate[0];
        let _month=fdate[1];
        let _date=fdate[2];
        //build payload out
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getHistoryData";
        this.requestData.payload.data={
                Entity:filterEntity,
                Year:_year,
                Month:_month,
                Date:_date
        }
        let _tableData=null;
        if (filterEntity=="company")
        {
            _tableData=[{
                count:1,
                entityID:'12311',
                entityType: 'Company',
                entityName: 'Dolan Inc'
            }, {
                count:2,
                entityID:'12342',
                entityType: 'Company',
                entityName: 'Axios'
            }, {
                count:3,
                entityID:'123453',
                entityType: 'Company',
                entityName: 'CRM Together'
            }, {
                count:4,
                entityID:'45345',
                entityType: 'Company',
                entityName: 'Paploy'
            }, {
                count:5,
                entityID:'6756',
                entityType: 'Company',
                entityName: 'Revenge group'
            }]
        }else{
            _tableData=[{
                count:1,
                entityID:'123',
                entityType: 'Company',
                entityName: 'Dolan Inc'
            }, {
                count:2,
                entityID:'1234',
                entityType: 'Company',
                entityName: '1234434'
            }, {
                count:3,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }, {
                count:4,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }, {
                count:5,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }, {
                count:6,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }, {
                count:7,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }, {
                count:8,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }, {
                count:9,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }, {
                count:10,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }, {
                count:11,
                entityID:'12345',
                entityType: 'Person',
                entityName: 'Ava Jones'
            }]
        }


        //screen data
        let _screenmetadata=new HistoryScreenMetadata();
        _screenmetadata.entityOptionsDefault='All';

        _screenmetadata.searchEntities=[
            {
            label:'All',
            value:'all',
            selected:true
            },            {
                label:'Company',
                value:'company',
                selected:false
                },            {
                    label:'Person',
                    value:'person',
                    selected:false
                    },            {
                        label:'Cases',
                        value:'cases',
                        selected:false
                        },            {
                            label:'Opportunity',
                            value:'opportunity',
                            selected:false
                            },
        ]

        let _data=new Data();
        _data.tableData= _tableData;
          _data.tableColumns= [{
            value:"__Select__",
            text:"  "
      },{
                value:"entityType",
                text:"Type"
          },{
            value:"entityName",
            text:"Name"
      },
        ]

        this.lastResult= {
            screenMetadata:_screenmetadata,
            data:_data
        }
        this.$applog(JSON.stringify(this.lastResult));
        return await this.lastResult;
    }
    async emailTemplatesGetData(_filter, entity, entityid){
        console.log("emailTemplatesGetData:"+_filter+"-"+entity+"-"+entityid);
        //build payload out
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getEmailTemplatesData";
        this.requestData.payload.data={
                Filter:_filter
        }
        let _tableData=null;

        _tableData=[{
            count:1,
            entityid:'123',
            templateDescription: 'email Template 101'
        }, {
            count:2,
            entityid:'1234',
            templateDescription: 'Some other template'
        }, {
            count:3,
            entityid:'12345',
            templateDescription: 'check this out'
        }, {
            count:4,
            entityid:'12345',
            templateDescription: 'check this out'
        }, {
            count:5,
            entityid:'12345',
            templateDescription: 'check this out'
        }, {
            count:6,
            entityid:'12345',
            templateDescription: 'check this out'
        }, {
            count:7,
            entityid:'12345',
            templateDescription: 'check this out'
        }, {
            count:8,
            entityid:'12345',
            templateDescription: 'check this out'
        }, {
            count:9,
            entityid:'12345',
            templateDescription: 'check this out'
        }, {
            count:10,
            entityid:'12345',
            templateDescription: 'check this out'
        }]

        //screen data
        let _screenmetadata=new EmailTemplateScreenMetadata();
        _screenmetadata.lang='de';
        _screenmetadata.container="core";

        let _data=new Data();
        _data.tableData= _tableData;
          _data.tableColumns= [
            {
                value:"__Select__",
                text:""
            } , 
            {
                value:"templateDescription",
                text:"Template"
          }]

        this.lastResult= {
            screenMetadata:_screenmetadata,
            data:_data
        }
        this.$applog(JSON.stringify(this.lastResult));
        return await this.lastResult;
    }    
    async attachDocumentsGetData(_filter){
      
        //build payload out
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getAttachDocumentsData";
        this.requestData.payload.data={
                Filter:_filter
        }
        let _tableData=null;

        _tableData=[{
            count:1,
            entityid:'123',
            fileName: 'How to work.pdf',
            fileDescription: 'Shows how we work'
        }, {
            count:2,
            entityid:'1234',
            fileName: 'Terms and conditions.pdf',
            fileDescription: 'Our terms that we offer'
        }, {
            count:3,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:4,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:5,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:6,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:7,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:8,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:9,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:10,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:11,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:12,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:13,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }, {
            count:14,
            entityid:'12345',
            fileName: 'Support Details.pdf',
            fileDescription: 'How to log a support issue'
        }]

        //screen data
        let _screenmetadata=new AttachDocumentsScreenMetadata();
        _screenmetadata.lang='de';
        _screenmetadata.container="core";

        let _data=new Data();
        _data.tableData= _tableData;
          _data.tableColumns= [  {
            value:"__Select__",
            text:"Attach"
        },{
                value:"fileName",
                text:"Type"
          },{
            value:"fileDescription",
            text:"Name"
        }]

        this.lastResult= {
            screenMetadata:_screenmetadata,
            data:_data
        }
        this.$applog(JSON.stringify(this.lastResult));
        return await this.lastResult;
    }
    async addressBookGetData(_filter){
      
        //build payload out
        this.requestData=new PayloadWrapper();
        this.requestData.callerid="getAddressBookData";
        this.requestData.payload.data={
                Filter:_filter
        }
        let _tableData=null;

        _tableData=[{
            count:1,
            entityid:'123',
            fullname: 'Frank Jonex',
            emailaddress:'frank@jonex.com'
        }, {
            count:2,
            entityid:'1234',
            fullname: 'Rachel White',
            emailaddress:'rach@rwhites.com'
        }, {
            count:3,
            entityid:'12345',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }, {
            count:4,
            entityid:'123455',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }, {
            count:5,
            entityid:'123456',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }, {
            count:6,
            entityid:'123457',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }, {
            count:7,
            entityid:'123485',
            fullname: 'Paula Smith and a very very long name',
            emailaddress:'paula.smith@greatstuff.com'
        }]

        //screen data
        let _screenmetadata=new AddressBookScreenMetadata();
        _screenmetadata.lang='de';
        _screenmetadata.container="core";

        let _data=new AddressBookData();
        _data.tableData= _tableData;
          _data.tableColumns= [{
            value:"__Select__",
            text:""
      },{
                value:"fullname",
                text:"Name"
          },{
            value:"emailaddress",
            text:"Email Address"
      }]

        this.lastResult= {
            screenMetadata:_screenmetadata,
            data:_data
        }
        this.$applog(JSON.stringify(this.lastResult));
        return await this.lastResult;
    }
    
    async fileEmailGetData(){
        let _emaildata=new EmailData();
        _emaildata.subject='Dummy subject';
        _emaildata.body='some dummy body';
        _emaildata.htmlBody='<html><head></head><body>Some html dummy body</body><html>';

        let _from=new EmailAddressInfo();
        _from.displayName ='James Joyce';
        _from.emailAddress = 'info@dummyemail.com';
        _emaildata.from=_from;

        let _to=new EmailAddressInfo();
        _to.displayName ='Bruce Lee';
        _to.emailAddress = 'blee@hiya.com';
        _emaildata.to.push(_to);

        //attachments
        let at1=new EmailAttachment();
        at1.id="1";
        at1.displayName="something.docx";
        at1.size="10kb";
        _emaildata.attachments.push(at1);
        for(var i=0;i<20;i++)
        {
            let at3=new EmailAttachment();
            at3.id='2'+i;
            at3.displayName="at2.pdf";
            at3.size="10kb";
            at3.ischecked=true;
            _emaildata.attachments.push(at3);
        }
        //screen data
        let _screenmetadata=new FileEmailScreenMetadata();
        _screenmetadata.lang='de';
        _screenmetadata.container="core";
        _screenmetadata.entity= 'Person',
        _screenmetadata.entityid='1234',
        _screenmetadata.entityName='Frank Wright',
        _screenmetadata.entityIcon='mdi-account';

        this.EmailList.push(_emaildata);

        /*
        COMMENT IN TO ADD IN A SECOND EMAIL
            let _emaildata2=new EmailData();
            _emaildata2.subject='Dummy subject 2';
            _emaildata2.body='some dummy body 2';
            _emaildata2.htmlBody='<html><head></head><body>Some html dummy body2</body><html>';
    
            let _from2=new EmailAddressInfo();
            _from2.displayName ='James Joyce';
            _from2.emailAddress = 'info@dummyemail.com';
            _emaildata2.from=_from2;
    
            let _to2=new EmailAddressInfo();
            _to2.displayName ='Bruce Lee';
            _to2.emailAddress = 'blee@hiya.com';
            _emaildata2.to.push(_to2);
    
            //attachments
            let at12=new EmailAttachment();
            at12.id="1";
            at12.displayName="something.docx";
            at12.size="10kb";
            _emaildata2.attachments.push(at12);
            let at22=new EmailAttachment();
            at22.id="2";
            at22.displayName="at2.pdf";
            at22.size="10kb";
            at22.checked=true;
            _emaildata2.attachments.push(at22);
            this.EmailList.push(_emaildata2);
        */
        this.lastResult= {
            screenMetadata:_screenmetadata,
            EmailList:this.EmailList
        }
        return this.lastResult;
    }

    async QueueMessage(_data)
    {
        window.vueAppInstance.queueRequest(_data);
    }
}

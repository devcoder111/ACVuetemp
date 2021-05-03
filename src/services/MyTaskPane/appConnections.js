
//theme class for our connection
export class AppConnectionTheme {
    primary;
    secondary;
    accent;
    error;
    info;
    success;
    warning;
    constructor() {
        this.primary= '#00815d';
        this.secondary= '#F3F2F1';
        this.accent= '#82B1FF';
        this.error= '#FF5252';
        this.info= '#2196F3';
        this.success= '#4CAF50';
        this.warning= '#FFC107';
    }
}

export class AppConnection {
    tabName;
    tabCaption;
    tabAction;
    enabled;
    provider;
    username;
    password;
    dataurl;
    connectionClass;
    isCoreUIDriver;
    tabIcon;
    tabClass;//NOT USED? FLAG TO REMOVE
    tabDescriptor;
    //used in ConnectionHome
    title;
    details;

    //themes
    light;
    dark;

    order;
    rememberMe;

    constructor() {
       this.tabName="NOTSET";
       this.tabCaption="NOTSET";
       this.tabAction="";
       this.enabled=false;
       this.isCoreUIDriver=false;
       this.title="title NOTSET (AppConnection)";
       this.details="details NOTSET (AppConnection)";
       this.tabClass="";
       this.tabDescriptor="";
       this.rememberMe=false;

       this.light=new AppConnectionTheme();
       this.dark=new AppConnectionTheme(); 
       
    }
}

export default class AppConnections {
    
    data;

    constructor() {

        //read from localstorage
        let datastr=window.vueAppInstance.$localStorage.get('_cap_connections');
        this.data = JSON.parse(datastr);
        /*
        EXAMPLE OF HOW TO CREATE A CONNECTION IN CODE
        //always add in the core connection
        let coreEmail=new AppConnection();
        coreEmail.tabName="Email";
        coreEmail.tabCaption="Email";
        coreEmail.tabAction="summary";
        coreEmail.enabled=true;
        coreEmail.provider="SystemContainer";
        coreEmail.tabDescriptor="Outlook Graph API Connector";        
            // eslint-disable-next-line
        let _host=getHost();
        if (_host=="OutlookClient")
        {
            this.$applog("App Host"+_host);
            coreEmail.connectionClass="MyTaskPaneEntityDataOutlookClientClass";
        }else{
            coreEmail.connectionClass="MyTaskPaneEntityDataEmailDummyClass";
        }
        coreEmail.isCoreUIDriver=true;
        coreEmail.tabIcon="img/connectors/crmtogether_sagecrm.png";
        coreEmail.icon="img/logo-tall-white.png";
        coreEmail.title="Outlook Accelerator<br>from<br>CRM Together";
        coreEmail.details="Live in Email?<br>Get better organized.<br>Stay on top of sales.<br>Power up your Outlook";

        this.data=[];
       // this.data.push(coreEmail);
        //for now we add this in too
        let SageCRM=new AppConnection();
        SageCRM.tabName="SageCRM";
        SageCRM.tabCaption="Sage CRM";
        SageCRM.tabClass="sagecrm";
        SageCRM.tabAction="summary";
        SageCRM.enabled=true;
        SageCRM.username="admin";
        SageCRM.password="admin";
        SageCRM.provider="SystemContainer";
        SageCRM.tabDescriptor="CRM Together Connector";
        SageCRM.connectionClass="MyTaskPaneEntityDataSageCRMAcceleratorClass";
        SageCRM.dataurl="http://46.4.121.181/CRM2018R3/";
        SageCRM.tabIcon="img/connectors/crmtogether_sagecrm.png";
        SageCRM.icon="img/connectors/crmtogether_sagecrm.png";
        SageCRM.title="Sage CRM<br>Connector";
        SageCRM.details="File Emails,<br>Log calls,<br>Create Entities and more";

    //   this.data.push(SageCRM);
    */
/*
        let JsonDev=new AppConnection();
        JsonDev.tabName="JsonDev";
        JsonDev.tabCaption="Json Dev";
        JsonDev.enabled=true;
        JsonDev.username="";
        JsonDev.password="";
        JsonDev.provider="SystemContainer";
        JsonDev.connectionClass="MyTaskPaneEntityDataJsonDevClass";
        JsonDev.title="some title - JsonDev";
        JsonDev.details="something - JsonDev";

        this.data.push(JsonDev);        
*/
    }    
}

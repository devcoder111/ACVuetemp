export class ScreenMetadataBase {
    container;//app container

    entity;
    entityid;

    lang;

    constructor() {
        this.entity='';
        this.entityid='';
    }    
}
export class ScreenMetadata extends ScreenMetadataBase {

    constructor() {
        super();
      
    }    
}

export class Payload {
    data;
   
    constructor() {
        this.data={};
    }
}

export class PayloadWrapper {
    payloadtype;
    callerid;
    version;
    payload;

    constructor() {
        this.payloadtype='list|screen etc';
        this.callerid='nameofmethod';
        this.version='1';
        this.payload=new Payload();
    }    
}

export class Data {
    tableData;

    constructor() {
        this.tableData=[];
    }    
}

export class Section{
    title;
    name;
    closed;
    data;

    //buttons on section
    btnSearch;

    //searchData is a string now but should be object later
    searchData;

    externallink;//url maybe
    internallink;//internal url call or flag    
    
    constructor() {
        this.name="";
        this.title="";
        this.searchData="";
        this.closed=true;
        this.data=[];//array of SectionDataItem
        this.btnSearch=false;
        this.btnUpload=false;
        this.btnLink=false;
        this.externallink={
            url:'',
            icon:'mdi-open-in-new',
            color:'green'
        };
        this.internallink={
            entity:'',
            entityid:'',
            icon:'',
            color:''
        };
    }
}

export class SectionDataItem{
    name;
    value;
    displayvalue;
    caption;
    type;//phone, email...
    externallink;//url maybe
    internallink;//internal url call or flag
    constructor() {
        this.name='';
        this.value='';
        this.displayvalue='';
        this.caption='';
        this.type='';
        this.externallink={
            url:'',
            icon:'mdi-open-in-new',
            color:'green'
        };
        this.internallink={
            entity:'',
            entityid:'',
            icon:'',
        };
    }
}

export class EntityData {
    sections;
    constructor() {
        this.sections=[]; 
    }

}

export class EmailData {
    from;
    fullName;
    phoneNumbers;
    to;
    urls;
    subject;
    body;
    htmlBody;
    cc;
    attachments;
    //ai items
    personArray;
    OrgArray;
    Locations;

    constructor() {
        this.from = new EmailAddressInfo();
        this.fullName = "";
        this.phoneNumbers = [];
        this.to = [];//array of EmailAddressInfo
        this.cc = [];//array of EmailAddressInfo
        this.urls = [];
        this.subject = "";
        this.body = "";
        this.htmlBody = "";
        this.attachments=[];

        this.personArray=[];
        this.orgArray=[];
        this.locations=[];
    }

}

export class EmailAttachment {
    name="";
    caption = "";
    value=false;//checked or not
    size = "";
    type="";//values are normal or embedded
}

export class EmailAddressInfo {
    displayName = "";
    emailAddress = "";
    type = "";
}


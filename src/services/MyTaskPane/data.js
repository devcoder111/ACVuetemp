import {ScreenMetadataBase} from "@/services/data.js";

//this is how we control the conneciton screen and what shows or not
export class MyTaskPaneScreenSetupMetadata extends ScreenMetadataBase{
    hasHome;
    hasSearch;
    hasFileEmail;
    searchEntities;
    newEntities
    options;
    hasOptions;
    hasNew;
    hasHistory;
    hasBookmarks;

    defaultSearchEntity;

    constructor() {
        super();
        this.hasHome=true;
        this.hasSearch=true;
        this.hasFileEmail=false;
        this.searchEntities=[{
            name:'none',
            caption:'None x'
        }];
        this.newEntities=[];
        this.options=[];
        this.hasOptions=true;
        this.hasNew=true;
        this.defaultSearchEntity='none';
        this.hasHistory=true;
        this.hasBookmarks=true;
    }
}


export class MyTaskPaneEntityScreenMetadata extends ScreenMetadataBase{
    entityIcon;
    entityImage;
    entityName;
    tabs;
    constructor() {
        super();
        this.container='';
        this.entity='';
        this.entityId='';
        this.entityIcon='';
        this.entityName='';
        this.entityImage='';

        this.tabs=[];
        
        this.lang='en';
    }
}


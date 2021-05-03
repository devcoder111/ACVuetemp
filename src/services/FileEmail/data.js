import {ScreenMetadataBase,} from "@/services/data.js";

export class FileEmailScreenMetadata extends ScreenMetadataBase{
    entityIcon;
    entityName;

    sendMode;

    screensetup;
    comm_screen_metadata;
    library_screen_metadata;

    constructor() {
        super();
        this.container='';
        this.entity='FileEmailScreenMetadata RAW';
        this.entityid='-1';
        this.entityIcon='mdi-Office-Building-Outline';
        this.entityName='FileEmailScreenMetadata RAW';
        //checkboxes defaults

        this.sendMode=false;

        this.screensetup={};
        this.comm_screen_metadata={};
        this.library_screen_metadata={};

    }    
}


export class FileEmailDataBaseClass {

    EmailList =[];//list of email objects

    constructor() {
       
    }
}

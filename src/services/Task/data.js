import {ScreenMetadataBase} from "@/services/data.js";

export class TaskScreenMetadata extends ScreenMetadataBase {
    
    entityName;
    entityIcon;
    
    constructor() {
        super();

        this.entityIcon='';
        this.entityName='';
      
    }    
}

export class TaskDataBaseClass {

    lastResult;

    constructor() {
       
    }
}


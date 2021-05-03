import {ScreenMetadataBase} from "@/services/data.js";

export class HistoryScreenMetadata extends ScreenMetadataBase {

    entityOptions;

    constructor() {
        super();
        this.entityOptionsDefault='base';
        this.entityOptions=[{
            label:'base',
            value:'base',
            selected:true
        }];
    }    
}

export class HistoryDataBaseClass {

    constructor() {
       
    }
}

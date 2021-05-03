import {ScreenMetadataBase, Data} from "@/services/data.js";

export class ParseEmailData extends Data {
 
    to;
    cc;
    bcc;

    constructor() {
        super();
        this.to=[];
        this.cc=[];
        this.bcc=[];
    }
}

export class ParseEmailScreenMetadata extends ScreenMetadataBase {

    
    constructor() {
        super();
      
    }    
}


export class ParseEmailDataBaseClass  {

    constructor() {
   
    }
}


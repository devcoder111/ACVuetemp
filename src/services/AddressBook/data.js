import {ScreenMetadataBase, Data} from "@/services/data.js";

export class AddressBookData extends Data {
 
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

export class AddressBookScreenMetadata extends ScreenMetadataBase {

    
    constructor() {
        super();
      
    }    
}


export class AddressBookDataBaseClass  {

    constructor() {
   
    }
}


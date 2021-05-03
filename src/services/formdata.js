import {ScreenMetadataBase} from "@/services/data.js";

export class MySelectOptions {
    label;
    value;    
}

export class MyFormElement {
    name;
    componentType;
    value;    
    internalValue;
    caption;
    placeholder;
    options;//array of MySelectOptions
    remoteMethod;//used where there needs to be a lookup

    filterObject;//some components can be linked
    filter;

    required;

    constructor() {
        this.options=[];
        this.remoteMethod=null;
        this.required=false;
    }

}
export class FormScreenMetadata extends ScreenMetadataBase{
    title;//title on dialog
    entity;
    name;
    formElements;

    constructor() {
        super();
        this.formElements=[];
    }
}


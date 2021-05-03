
export class MyTaskPaneEntityDataBaseClass {

    _type;
    DataList =[];//list of data objects
    styleSheet;

    focus;//sticky, freeze

    ScreenSetup;

    constructor() {
       this._type="MyTaskPaneEntityDataBaseClass";//classes derived from this should set it to be their class name
       this.styleSheet="";
       this.focus=false;
       this.ScreenSetup={};
    }
    async getScreenSetup(){
        alert('getScreenSetup not implemented')
    }
    getFocus(){
        return this.focus;
    }
    toggleFocus(){
        this.focus=!this.focus;
    }
    
}

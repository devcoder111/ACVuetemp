
import {MyTaskPaneEntityDataDummyClass} from "@/services/Providers/dataDummy"
import {MyTaskPaneEntityDataSageCRMAcceleratorClass} from "@/services/Providers/dataSageCRMAccelerator"

//our app container
import {Office365Container} from '@/services/Office365Container'
import {OutlookAppContainer} from '@/services/OutlookAppContainer'
import {OutlookAppContainerWebview} from '@/services/OutlookAppContainerWebview'

export const SERVICE_TYPE_ACCELERATOR = "Accelerator";
export const SERVICE_TYPE_DUMMY = "Dummy";

export default class DataFactoryClass {
    dialogDataService;
    appContainer;
    
    constructor() {
        this._setupAppContainer();
    }

    _setupAppContainer(){
        try {
            window.external.getHost();
            this.appContainer=new OutlookAppContainer();
        }catch(e)
        {
            try{
                // eslint-disable-next-line
                chrome.webview.hostObjects.sync.TS.getHost();
                this.appContainer=new OutlookAppContainerWebview();
            }catch (ee){
                this.appContainer=new Office365Container();
            }
        }     
    }

    getDataService(screenName, tabName) {

        if ((typeof screenName) == "object"){
            if (screenName.connectionClass=="MyTaskPaneEntityDataSageCRMAcceleratorClass")
            {
                return new MyTaskPaneEntityDataSageCRMAcceleratorClass(tabName,this.appContainer);
            }
        }
        if (screenName=='SageCRM')
        {
            return new MyTaskPaneEntityDataSageCRMAcceleratorClass(tabName,this.appContainer);
        }        
        
        let serviceType=SERVICE_TYPE_ACCELERATOR;
        switch (serviceType) {
            case SERVICE_TYPE_DUMMY:
                this.dialogDataService = new MyTaskPaneEntityDataDummyClass();
                break;               
            default:
                this.dialogDataService = new MyTaskPaneEntityDataSageCRMAcceleratorClass(tabName,this.appContainer);
                break;
        }
        return this.dialogDataService;

    }

}
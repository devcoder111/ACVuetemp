// eslint-disable-next-line
function getHost(){
    try{
        return window.external.getHost();
    }catch (e){
        try{
            // eslint-disable-next-line
            return chrome.webview.hostObjects.TS;
        }catch (ee){
            return null;
        }
    }
}
// eslint-disable-next-line
function changeSelectedEmail(_emailObj)
{
    console.log("changeSelectedEmail");
    // eslint-disable-next-line
    vueAppInstance.$mailbox.changeSelectedEmail(_emailObj);
} 

// eslint-disable-next-line
import {applog} from '@/services/applog.js'
import axios from 'axios';

let dialog;

export class Office365Container {

    classname;

    constructor() {
        this.classname='Office365Container';
         // Set up ItemChanged event
        
    }

    OpenExternalURL(url)
    {
        window.open(url);
    }

    consolelog(msg)
    {
        console.log(msg);
    }

    async popupCenter(urlname, url, _datastring, params){
        this.consolelog("Office365Container popupCenter:"+urlname);
        this.consolelog("url:"+url);
        this.consolelog(urlname, url, _datastring, params);
        let realurl="";
        var __url=new String(url);
        if (urlname=="task")
        {
            //url should be  
            //https://localhost:3000/#/task/SageCRM/company/205
            //but comes in as 
            //https://localhost:3000/?et=#/mytaskpane/outlook365/explorer/#/task/SageCRM/company/205
            var __urlarray2=__url.split(urlname+"/");
            var _urlpart12=__urlarray2[0].split("?");
            realurl=_urlpart12[0]+"#/"+urlname+"/"+__urlarray2[1];
            this.consolelog("realurl task:"+realurl);

        }else{
            //we need to fix up ...url
            //example url is
            //https://localhost:3000/?et=#/mytaskpane/outlook365/explorer/#/fileemail/read/false/SageCRM/person/1779
            //we need
            //https://localhost:3000/#/fileemail/read/false/SageCRM/person/1779
            //so lets do it...
            var __urlarray=__url.split(urlname);
            var _urlpart1=__urlarray[0].split("?");
            realurl=_urlpart1[0]+"#/"+urlname+__urlarray[1];
            this.consolelog("realurl fileemail:"+realurl);

            // eslint-disable-next-line
            var item = window.Office.context.mailbox.item;
            let _EmailData=await this.__item365toOurEmailObject(item);
            this.__storeLastViewedItem(_EmailData);
            this.__getBodyText(item);
        }
        var _that=this;
        // eslint-disable-next-line
        window.Office.context.ui.displayDialogAsync(realurl, 
            function (asyncResult) {
                dialog = asyncResult.value;
                dialog.addEventHandler(window.Office.EventType.DialogMessageReceived, _that.processMessage);
            },
            {height: 50, width: 60, displayInIframe: true, promptBeforeOpen:false});
    }
    processMessage(arg) {
        console.log('processMessage');
        var messageFromDialog = JSON.parse(arg.message);
        console.log('processMessage messageType:'+messageFromDialog.messageType);
        if (messageFromDialog.messageType === "fileUpload") {   
            let _payload=messageFromDialog.payload;
            console.log("_payload   :"+JSON.stringify(_payload));
            // eslint-disable-next-line
            Office.context.mailbox.item.getAttachmentContentAsync(_payload.senderid, (result) => {
                console.log("getAttachmentContentAsync result:"+result);
                console.log(JSON.stringify(result));

                // Parse string to be a url, an .eml file, a base64-encoded string, or an .icalendar file.
                // eslint-disable-next-line
                let __AttachmentContentFormat=window.Office.MailboxEnums.AttachmentContentFormat;
                //console.log(JSON.stringify(result));
                //result.value.content contains the value
                
                switch (result.value.format) {
                    case __AttachmentContentFormat.Base64:
                        {
                        // Handle file attachment as base64
                        console.log("__handleAttachmentCallback Base64 START");
                        //console.log(result.value.content);
                        console.log("__handleAttachmentCallback Base64 END");
                        console.log("__handleAttachmentCallback _payload.type:"+_payload.type);
                        console.log("__handleAttachmentCallback _payload.link:"+_payload.link);

                        //var blob= __b64toBlob("data:"+_payload.type+";base64,"+result.value.content, _payload.type);
                        var blob= __b64toBlob(result.value.content, _payload.type);
                        console.log("blob:"+blob);
                        
                        var xfile=getbase64File("data:"+_payload.type+";base64,"+result.value.content,_payload.name);
                        console.log("xfile:"+xfile);
                        // var fileOfBlob = new File(xfile, _payload.name);
                        var formDataToUpload = new FormData();
                        formDataToUpload.append("file", xfile);
                        
                        const headers = {
                            'Content-Type': 'multipart/form-data'
                        }
                        console.log("__handleAttachmentCallback axios post");
                        /*
                        let ssarr=_payload.link.split("SID=");
                        _payload.link="http://localhost:1898/ac2020fupload.aspx?"+ssarr[1];
                        console.log(_payload.link);
                        */
                        axios.post(_payload.link,
                            formDataToUpload, {
                                headers: headers
                            }
                            ).then(function () {
                                console.log('Attachment SUCCESS!!');
                            })
                            .catch(function () {
                                console.log('Attachment FAILURE!!');
                            });
                        break;
                    }
                    case __AttachmentContentFormat.Eml:
                        console.log("__handleAttachmentCallback Eml");
                        // Handle email item attachment.
                        break;
                    case __AttachmentContentFormat.ICalendar:
                        console.log("__handleAttachmentCallback ICalendar");
                        // Handle .icalender attachment.
                        break;
                    case __AttachmentContentFormat.Url:
                        console.log("__handleAttachmentCallback Url");
                        // Handle cloud attachment.
                        break;
                    default:
                        // Handle attachment formats that are not supported.
                        this.consolelog("__handleAttachmentCallback Url");
                }
            });
        }else if (messageFromDialog.messageType === "dialogClosed") {
           dialog.close();
        }
    }

    replytagemail(dataAsString){
        this.consolelog(dataAsString);
    }

    getDocuments(dataAsString){
        this.consolelog(dataAsString);
    }

    removeTag(tagPrefixSuffix)
    {
        this.consolelog(tagPrefixSuffix);
    }

    tagEmail(dataAsString){
        this.consolelog(dataAsString);
    }

    newtask(dataAsString){
        this.consolelog(dataAsString);
    }

    newappt(dataAsString){
        this.consolelog(dataAsString);
    }

    newemail(dataAsString){
        this.consolelog(dataAsString);
    }

    setInstanceSettings(connectionName,instanceSettingsAsString)
    {
        this.consolelog(connectionName+"="+instanceSettingsAsString);
    }

    SelectionChange(){
        console.log("Office365Container selectionchange");
    }

    buttonAction(senderDialog,dialogAction,senderData){
        this.consolelog("buttonAction:"+senderDialog+"="+dialogAction+"="+senderData);
        //ref: https://docs.microsoft.com/en-us/office/dev/add-ins/develop/dialog-api-in-office-add-ins
        if ((dialogAction=="close")||(dialogAction=="ok"))
        {
            var messageObject = {messageType: "dialogClosed"};
            var jsonMessage = JSON.stringify(messageObject);
            window.Office.context.ui.messageParent(jsonMessage);
        }
    }

    fileUpload(dataAsString){
        this.consolelog("Office365Container fileUpload");
        this.consolelog(dataAsString);
        let dataAsObject=JSON.parse(dataAsString);
        var messageObject = {messageType: "fileUpload", payload:dataAsObject};    
        var jsonMessage = JSON.stringify(messageObject);
        window.Office.context.ui.messageParent(jsonMessage);
    }
    getEmailData(sender){
        // Get a reference to the current message
        this.consolelog("getEmailData Office365Container:"+sender);
        var item=null;
        let _EmailData=null;
        // eslint-disable-next-line
        if (window.Office.context.mailbox)
        {
            this.consolelog("getEmailData Office365Container: Found office");
            // eslint-disable-next-line
            item = window.Office.context.mailbox.item;
            _EmailData=this.__item365toOurEmailObject(item);
            this.__getBodyText(item);
        }else{
            this.consolelog("getEmailData Office365Container: Office not found");
            //get from local storage
            var itemAsString=window.vueAppInstance.$localStorage.get('Office.context.mailbox.item');
            _EmailData=JSON.parse(itemAsString);
        }
        return _EmailData;///need to fix so its like our object
    }
    updateProps(dataAsString){
        this.consolelog(dataAsString);
    }

    __storeLastViewedItem(_EmailData)
    {
        this.consolelog("store item start:");
        window.vueAppInstance.$localStorage.set('Office.context.mailbox.item', JSON.stringify(_EmailData));
        this.consolelog("store item complete:");
    }
    __retrieveLastViewedItem()
    {
        this.consolelog("retrieve item start:");
        let emailAsString= window.vueAppInstance.$localStorage.get('Office.context.mailbox.item');
        let res=JSON.parse(emailAsString);
        this.consolelog("retrieve item complete:");
        return res;
    }
    __item365toOurEmailObject(item)
    {
        //build our email object
        let _EmailData={
            "from": {
              "displayName":item.from.displayName,
              "emailAddress":item.from.emailAddress,
              "type":item.from.recipientType,
            },
            "replyto": {  
              "displayName":item.from.displayName,
              "emailAddress":item.from.emailAddress,
              "type":item.from.recipientType,
            },
            "fullName":item.from.displayName,
            "phoneNumbers":[],
            "to":this._parse365Recipients(item.to),
            "cc":this._parse365Recipients(item.cc),
            "bcc":this._parse365Recipients(item.bcc),
            "subject":item.subject,
            "body":"...",
            "htmlBody":"...",
            "attachments":this._parse365Attachments(item),
            "entryid":item.itemId,
            "urls":[],
            "addresses":[],
            "sentItem":this._isSentItem(item),
            "receivedDateTime":this._parse365SentDates(item),
            "sentDateTime":this._parse365SentDates(item),
            "companies":"",
        }

        return _EmailData;
    }

    __getBodyText(item)
    {
        console.log('__getBodyText 365');
        var _that=this;
        item.body.getAsync('text', function(result){
            if (result.status === 'succeeded') {
                let _EmailData=_that.__retrieveLastViewedItem();
                _EmailData.body=result.value.replace(/\n\n\n\n/, '');
                _that.__storeLastViewedItem(_EmailData);
                item.body.getAsync('html', function(result){
                    if (result.status === 'succeeded') {
                        console.log('365 Email Body Retrieved');
                        let _EmailData=_that.__retrieveLastViewedItem();    
                        _EmailData.htmlBody=result.value;
                        _that.__storeLastViewedItem(_EmailData);
                        console.log('__storeLastViewedItem #1');
                        //now fix up any images....clever
                        let tmp_EmailData=JSON.stringify(_EmailData);
                        let tmp_EmailDataObj=JSON.parse(tmp_EmailData);
                        // eslint-disable-next-line
                        let __AttachmentContentFormat=window.Office.MailboxEnums.AttachmentContentFormat;
                        if (_EmailData.htmlBody!=null)
                        {
                            //loop through the embedded attachments
                            var tmp = document.createElement('div');
                            tmp.innerHTML = _EmailData.htmlBody;
                            var srcImgs = tmp.querySelectorAll('img');
                            console.log("srcImgs:"+srcImgs.length);
                            srcImgs.forEach(function(srcimg) {
                                let __src=srcimg.getAttribute("src");
                                console.log("__src:"+__src);
                                console.log(__src.indexOf("cid:"));
                                if (__src.indexOf("cid:")==0)
                                {
                                    for(var xx=0;xx<tmp_EmailDataObj.attachments.length;xx++)
                                    {
                                        let __att=tmp_EmailDataObj.attachments[xx];
                                        if (__att.isInline==true)
                                        {
                                            //tmp.innerHTML=tmp.innerHTML.replace(__src,"test.png"); 
                                            console.log("__att.id:"+__att.id);
                                            // eslint-disable-next-line  
                                            Office.context.mailbox.item.getAttachmentContentAsync(__att.id, (result) => {
                                                //console.log("getAttachmentContentAsync:"+JSON.stringify(result.value));
                                                switch (result.value.format) {
                                                    case __AttachmentContentFormat.Base64:
                                                        //console.log("base 64 image:"+__src);
                                                        tmp.innerHTML=tmp.innerHTML.replace(" src=\""+__src,"src=\"data:"+__att.type+";base64,"+result.value.content);   
                                                        _EmailData.htmlBody=tmp.innerHTML;
                                                        console.log("_EmailData.attachments:"+_EmailData.attachments.length);
                                                        _EmailData.attachments= _EmailData.attachments.splice(xx,1);
                                                        console.log("_EmailData.attachments:"+_EmailData.attachments.length);
                                                        _that.__storeLastViewedItem(_EmailData);       
                                                        console.log('__storeLastViewedItem #9');                     
                                                    break;
                                                    default:
                                                        // Handle attachment formats that are not supported.
                                                        console.log("__handleAttachmentCallback no match on format");
                                                }
                                            });
                                            console.log(JSON.stringify(__att));
                                        }
                                    }
                                }
                            });
                        }  

                    }
                });
            }
        });
    }

    _parse365SentDates(_Mailitem)
    {
      let _date=_Mailitem.dateTimeCreated;

      let res={
        "year":_date.getFullYear(),
        "month":_date.getMonth()+1,
        "day":_date.getDate(),
        "hour":_date.getHours(),
        "minute":_date.getMinutes(),
        "second":_date.getSeconds(),
        "raw": _date.toLocaleString(),
        "rawutc":_date.getUTCDate()
      }
      return res;
    }

    _parse365Attachments(item){
      console.log("_parse365Attachments");
      let res=[];
      let i=0;
      console.log("_parse365Attachments length:"+item.attachments.length);
      if (item.attachments.length > 0) 
      {
        for (i = 0 ; i < item.attachments.length ; i++) {
            var attachment = item.attachments[i];
            console.log("_parse365Attachments attachment:"+JSON.stringify(attachment));
            var _att={
              "id":attachment.id,
              "name":attachment.name,
              "caption":attachment.name,
              "size":attachment.size,
              "filename":attachment.name,
              "type": attachment.contentType,
              "base64":"",
              "isInline":attachment.isInline,
              "value":true
            }
            res.push(_att);
            }
      }
      return res;
    }

    _parse365Recipients(recObj){
      let rec_res=[];
      for (var ff=0;ff<recObj.length;ff++)
      {
        let _rec={
          "displayName":recObj[ff].displayName,
          "emailAddress":recObj[ff].emailAddress,
          "type":recObj[ff].recipientType,
        }
        rec_res.push(_rec);
      }
      return rec_res;
    }

    _isSentItem(item) {
        this.consolelog("_isSentItem");
        // eslint-disable-next-line
        if ((Office)&&(Office.context)&&(Office.context.mailbox)&&(Office.context.mailbox.userProfile))
        {
            // eslint-disable-next-line
            this.consolelog("isSentItem userProfile:"+Office.context.mailbox.userProfile.emailAddress);
            // eslint-disable-next-line
            this.consolelog("isSentItem sender:"+item.sender.emailAddress);
            // eslint-disable-next-line
            return Office.context.mailbox.userProfile.emailAddress === item.sender.emailAddress;
        }else{
            return false;
        }
    }


}

    /**
     * https://ourcodeworld.com/articles/read/322/how-to-convert-a-base64-image-into-a-image-file-and-upload-it-with-an-asynchronous-form-using-jquery
     * Convert a base64 string in a Blob according to the data and contentType.
     * 
     * @param b64Data {String} Pure base64 string without contentType
     * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
     * @param sliceSize {Int} SliceSize to process the byteCharacters
     * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
     * @return Blob
     */
    function __b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 1024;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    function getbase64File(dataurl, filename){
 
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length, 
                u8arr = new Uint8Array(n);
                
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            
            return new File([u8arr], filename, {type:mime});
    }

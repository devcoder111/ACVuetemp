// eslint-disable-next-line
import {applog} from '@/services/applog.js'

//this is essentially our mailbox database
export class MailBox {

    emailObjects=[];//all selected emails

    devEmail={"from":{"displayName":"Majella O'Connor","emailAddress":"majella@crmtogether.com","type":null},"replyto":null,"fullName":"Majella O'Connor","phoneNumbers":[],"to":[{"displayName":"Marc Reidy","emailAddress":"marc@crmtogether.com","type":null}],"cc":[],"bcc":[],"subject":"FW: NEW OPPORTUNITIES TODAY","body":"This is wrong as I couldn’t complete oppo creation in CRM with the new version  Presume they will be pulled into tomorrows stats?     From: CRM Together <sagecrm@crmtogether.com>   Sent: 03 February 2021 17:30  To: Majella O'Connor <majella@crmtogether.com>  Subject: NEW OPPORTUNITIES TODAY     Opportunities Created [03 Feb 2021]  SoundPro AC and CM  Product: Accelerator  [Blytheco]  (Robert Newman)  Forecast: 0  Territory: North America  ","htmlBody":"<html xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" xmlns:m=\"http://schemas.microsoft.com/office/2004/12/omml\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><meta name=Generator content=\"Microsoft Word 15 (filtered medium)\"><style><!--\r\n/* Font Definitions */\r\n@font-face\r\n\t{font-family:\"Cambria Math\";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;}\r\n/* Style Definitions */\r\np.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{margin:0cm;\r\n\tfont-size:11.0pt;\r\n\tfont-family:\"Calibri\",sans-serif;}\r\nspan.EmailStyle18\r\n\t{mso-style-type:personal-reply;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tcolor:windowtext;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-fareast-language:EN-US;}\r\n@page WordSection1\r\n\t{size:612.0pt 792.0pt;\r\n\tmargin:72.0pt 72.0pt 72.0pt 72.0pt;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n--></style><!--[if gte mso 9]><xml>\r\n<o:shapedefaults v:ext=\"edit\" spidmax=\"1026\" />\r\n</xml><![endif]--><!--[if gte mso 9]><xml>\r\n<o:shapelayout v:ext=\"edit\">\r\n<o:idmap v:ext=\"edit\" data=\"1\" />\r\n</o:shapelayout></xml><![endif]--></head><body lang=EN-IE link=\"#0563C1\" vlink=\"#954F72\" style='word-wrap:break-word'><div class=WordSection1><p class=MsoNormal><span style='mso-fareast-language:EN-US'>This is wrong as I couldn&#8217;t complete oppo creation in CRM with the new version<o:p></o:p></span></p><p class=MsoNormal><span style='mso-fareast-language:EN-US'>Presume they will be pulled into tomorrows stats?<o:p></o:p></span></p><p class=MsoNormal><span style='mso-fareast-language:EN-US'><o:p>&nbsp;</o:p></span></p><div style='border:none;border-top:solid #E1E1E1 1.0pt;padding:3.0pt 0cm 0cm 0cm'><p class=MsoNormal><b><span lang=EN-US>From:</span></b><span lang=EN-US> CRM Together &lt;sagecrm@crmtogether.com&gt; <br><b>Sent:</b> 03 February 2021 17:30<br><b>To:</b> Majella O'Connor &lt;majella@crmtogether.com&gt;<br><b>Subject:</b> NEW OPPORTUNITIES TODAY<o:p></o:p></span></p></div><p class=MsoNormal><o:p>&nbsp;</o:p></p><p class=MsoNormal>Opportunities Created [03 Feb 2021]<br>SoundPro AC and CM<br>Product: Accelerator<br>[Blytheco]<br>(Robert Newman)<br>Forecast: 0<br>Territory: North America<o:p></o:p></p></div></body></html>","attachments":[{"id":"FW: NEW OPPORTUNITIES TODAY.msg","name":"FW: NEW OPPORTUNITIES TODAY.msg","caption":"FW: NEW OPPORTUNITIES TODAY.msg","size":"72631","filename":"FW: NEW OPPORTUNITIES TODAY.msg","type":"emailasattachment","base64":null,"value":false}],"entryid":"000000008D29C22795ED0F43AE13B26188F01E9A0700774E149E6B7EAB44AD9FF58B53D5D33C00000000010C0000774E149E6B7EAB44AD9FF58B53D5D33C000323869D7C0000","urls":[],"addresses":null,"sentItem":false,"receivedDateTime":{"year":2021,"month":2,"day":3,"hour":17,"minute":50,"second":37,"raw":"2021-02-03T17:50:37.229","rawutc":"2021-02-03T17:50:37.229Z","TZ":{"StandardName":"GMT Standard Time","DaylightName":"GMT Summer Time"}},"sentDateTime":{"year":2021,"month":2,"day":3,"hour":17,"minute":50,"second":34,"raw":"2021-02-03T17:50:34","rawutc":"2021-02-03T17:50:34Z","TZ":{"StandardName":"GMT Standard Time","DaylightName":"GMT Summer Time"}},"companies":null}

    _changeEmailHandler;
    _queueHandler;
    appContainer;

    constructor(_appContainer) {
        this.appContainer=_appContainer;
    }

    assignHandler(_event)
    {
        // eslint-disable-next-line
        vueAppInstance.$applog('assignHandler');
        this._changeEmailHandler=_event;
    }
    assignQueueHandler(_event)
    {
        // eslint-disable-next-line
        vueAppInstance.$applog('assignQueueHandler');
        this._queueHandler=_event;
    }
    //vueAppInstance.$mailbox.ping();
    ping(){
        // eslint-disable-next-line
        vueAppInstance.$applog('mailbox ping');
    }

    //vueAppInstance.$mailbox.getCurrentItem();
    getCurrentItem(){
        // eslint-disable-next-line
        vueAppInstance.$applog('mailbox getCurrentItem');
        if (this.emailObjects.length==0)
        {
            try{
                var _ged =this.appContainer.getEmailData('taskpane');
                if (_ged)
                {
                    return JSON.parse(_ged);
                }
            }catch(e){
                // eslint-disable-next-line
                vueAppInstance.$applog('mailbox getCurrentItem error:'+e.message);
                // eslint-disable-next-line
                vueAppInstance.$applog('mailbox getCurrentItem error #2:'+JSON.stringify(this.appContainer));
                return null;
            }
        }
        /*
        uncomment for dev
        if (this.emailObjects.length==0)
        {
            this.emailObjects.push(this.devEmail);
        }*/
        // eslint-disable-next-line
        vueAppInstance.$applog('mailbox getCurrentItem emailObjects:'+JSON.stringify(this.emailObjects[0]));
        return this.emailObjects[0];
    }
    
    getSelectedItems(){
        return this.emailObjects;
    }

    //vueAppInstance.$mailbox.changeSelectedEmail(_emailObject);//this is called by our container..EG our vsto add in or 365 stuff
    changeSelectedEmail = function (_emailObject) {
        // eslint-disable-next-line
        vueAppInstance.$applog('mailbox changeSelectedEmail:');

        let json_emailObj=JSON.parse(_emailObject);        
        this.emailObjects[0]=json_emailObj;        
        this._changeEmailHandler();
        //store the data inthis object!! this is our database in affect
    };

    processQueue = function () {
        // eslint-disable-next-line
        vueAppInstance.$applog('mailbox processQueue start');       
        this._queueHandler();///...in sage crm accelerator this is....????
        // eslint-disable-next-line
        vueAppInstance.$applog('mailbox processQueue end');        
    };

}
//calling
//vueAppInstance.$mailbox.changeSelectedEmail('ds');
//from the console works

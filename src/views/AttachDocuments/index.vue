 <template>
<Layout>
  <template v-slot:header>
    <v-col
       class="text-left ml-2 mt-1"
      cols="20"
    >
    <h5>{{ $t('attachdocs-screen.title') }}</h5>
    </v-col>
    <v-col cols="4"
       class="text-right mr-1 mt-2"
    >    
 <MyFormSelect v-show="connectionSelect.options.length>1" v-model="connectionSelect" @change="filterChange" ></MyFormSelect>
    </v-col> 

  </template>
  <template v-slot:aside>
     <navbar :dataObject="dataObject" />
  </template>
  <template v-slot:main >
    <div>

    <div id="General" >
    <div id="GeneralHeader" class="Header" >
       <v-skeleton-loader v-if="screenloading"
          type="list-item-one-line"
        ></v-skeleton-loader>
      <v-icon>mdi-file-plus-outline</v-icon>
    {{ $t('attachdocs-screen.header') }} </div>
    <div name="tabone">
<v-skeleton-loader v-if="screenloading"
          type="card-heading@3, text@9, list-item-two-line"
        ></v-skeleton-loader>           
       <AttachDocumentsGeneral :dataObject="dataObject" @selectItem="selectItem" @change="templatefilterchange"  />
    </div>
  </div>
   </div>
 <v-snackbar
      v-model="snackbar"
      timeout="3000"
    >
     {{ $t('attachdocs-screen.fileattached') }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          {{$t('common.close')}}
        </v-btn>
      </template>
    </v-snackbar>
  </template>
  <template v-slot:footer>
    <v-spacer></v-spacer>
    <v-btn tile large outlined class="ma-2" color="red" @click="closeClick()" >
        <v-icon>mdi-close</v-icon>{{$t('common.close')}}
    </v-btn>

  </template>
</Layout>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
//vue
import  Layout  from '@/layout/indexNoTabs'
import  Navbar  from '@/layout/components/AttachDocuments/Navbar'
import  AttachDocumentsGeneral  from '@/components/AttachDocuments/General'
import MyFormSelect from '@/components/FormElements/MyFormSelect'
//classes
import  DataFactoryClass from '@/services/dataFactory'
import {AttachDocumentsScreenMetadata} from "@/services/AttachDocuments/data.js";
import {Data} from "@/services/data";

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

//vue page object
export default {
  name: 'attachdocuments',
  _DataFactory: [],
  components:{
    Layout, Navbar, AttachDocumentsGeneral ,MyFormSelect
  },
  data() {
    return {
      snackbar: false,
      awaitingSearch: false,
      screenloading:true,
      loading:false,
      dataProvider:[],
      connectionSelect:{name:'connectionSelect',value:{text:'',value:''}, caption:'', options:[]},            
      dataObject: {
          type:Object
      }
    }
  },
  methods: {
    templatefilterchange(value)
    {
        this.dataProvider.attachDocumentsGetData(value, this.$route.params.entity, this.$route.params.entityid).then((response) => {
              this.dataObject=response;
              this.screenloading=false;
              this.$applog("AttachDocuments data="+JSON.stringify(response));
            }).catch(e => {
              this.screenloading=false;
              this.$applog("AttachDocuments filterChange ERROR:"+e.message);
            });     
    },    
    filterChange(){
      //filterchange is changing the connection filter and not the search!!!!
      this.$applog('attachdocs filterChange:');
      this.screenloading=true;
      this.dataProvider=this._DataFactory.getDataService(this.connectionSelect.value.value,this.connectionSelect.value.value);
      this.dataProvider.attachDocumentsGetData('', this.$route.params.entity, this.$route.params.entityid).then((response) => {
            this.dataObject=response;
            this.screenloading=false;
            this.$applog("AttachDocuments data="+JSON.stringify(response));
          }).catch(e => {
            this.screenloading=false;
            this.$applog("AttachDocuments filterChange ERROR:"+e.message);
          });       
    },       
    selectItem(template){
        this.$applog('attachdocs main selectItem('+template.entityid+')');
        this.$applog(JSON.stringify(template));
        //so when usig our VSTO wrapper this is not a promise
        this.dataProvider.actioned("AttachDocuments", "Attach",JSON.stringify(template));
        this.snackbar=true;
        /*
        //var _that=this;//IE seems to need this...
        
        this.dataProvider.actioned("AttachDocuments", "Attach",JSON.stringify(template)).then(response => {
          _that.$applog("attachdocs response:"+response);
        }).catch(e => {
          _that.$applog("attachdocs submitClick ERROR:"+e.message);
        });*/         
      
    },
    closeClick() {
        this.$applog('attachdocs closeClick()');
        this.dataProvider.actioned("AttachDocuments","close","");
    }
  },
  created(){
        //get our data provider and fetch our data
        this.$applog('AttachDocuments created()');
        this.screenloading=true;
        let _screenmetadata=new AttachDocumentsScreenMetadata();
        let _data=new Data();
        this.dataObject= {
            screenMetadata:_screenmetadata,
            data:_data
        }
        Storage.get({ key: "connections"}).then( connections =>{
           Storage.get({ key: "activeTabName"}).then( activeTabName =>{
              let tabObj=JSON.parse(connections.value);
              if (this.$route.params.connection)
              {
                  this.connection=this.$route.params.connection;
              }else if ((activeTabName)&& (activeTabName.value)){
                  this.connection=activeTabName.value;
              }else{
                  this.connection=tabObj[0].tabName;
              }   
              this._DataFactory=new DataFactoryClass();
              this.dataProvider=this._DataFactory.getDataService(this.connection,this.connection);
              for(var rr=0;rr<tabObj.length;rr++)
              {
                this.connectionSelect.options.push({text:tabObj[rr].tabName,value:tabObj[rr].tabName});
              }
              this.connectionSelect.value={text:this.connection,value:this.connection};

              this.dataProvider.attachDocumentsGetData('', this.$route.params.entity, this.$route.params.entityid).then((response) => {
                this.dataObject=response;
                this.screenloading=false;
                this.$applog("AttachDocuments data="+JSON.stringify(response));
              }).catch(e => {
                this.screenloading=false;
                this.$applog("AttachDocuments ERROR:"+e.message);
              });
          });
        });
    }
}
</script>

<style scoped>

</style>

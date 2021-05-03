 <template>
<Layout>
  <template v-slot:header>
    <h5>{{ $t('parseemail-screen.title') }}</h5>
  </template>
  <template v-slot:aside>
     <navbar @activateTab="activateTab" :dataObject="dataObject"  />
  </template>
  <template v-slot:main >
    <div>
      <div id="General">    
        <div id="GeneralHeader" class="Header" >
          <v-icon>mdi-email-search</v-icon>
        {{ $t('parseemail-screen.header') }} 
        </div>
        <div name="tabone">
            <ParseEmailGeneral :dataObject="dataObject" @selectParseEmailItem="selectParseEmailItem" />
        </div>
      </div>
   </div>

  </template>
  <template v-slot:footer>
    <v-spacer></v-spacer>
    <v-btn tile large outlined class="ma-2" color="red" @click="closeClick()" >
        <v-icon>mdi-close</v-icon>{{$t('common.cancel')}}
    </v-btn>
  </template>
</Layout>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
//vue
import  Layout  from '@/layout/indexNoTabs'
import  ParseEmailGeneral  from '@/components/ParseEmail/General'

//classes
import  DataFactoryClass from '@/services/dataFactory'
import {ParseEmailScreenMetadata, ParseEmailData} from "@/services/ParseEmail/data.js";

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

//vue page object
export default {  
  name: 'parseemail',
  _DataFactory: [],
  components:{
    Layout, ParseEmailGeneral 
  },
  data() {
    return {
      dataProvider:{
          type:Object
      },        
      dataObject: {
          type:Object
      }
    }
  },
  methods: {
    async selectParseEmailItem(selectItem){
        this.$applog('parseemail selectParseEmailItem()');
        let res={
          screenMetadata:{
            method:'parseemail'
          },
          data:selectItem
        }
        await this.dataProvider.QueueMessage(res);
        this.dataProvider.actioned("ParseEmail","close","");
    },
    closeClick() {
        this.dataProvider.actioned("ParseEmail", "close","");
    }
  },
  created(){
        //get our data provider and fetch our data
        this.$applog('parseemail created()');
        let _screenmetadata=new ParseEmailScreenMetadata();
        let _data=new ParseEmailData();
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

              this.dataProvider.parseEmailGetData().then(response => {
                let emailAddresses=response.emailAddresses;
                this.dataObject={
                    screenMetadata:{},
                    data:{
                      tableColumns:[{text:'Email',value:'EmailAddress'},{text:'',value:'__Select__'}],
                      tableData:[]
                    }
                }
                for(var i=0;i<emailAddresses.length;i++)
                {
                  let lineitem={
                    count:i,
                    EmailAddress:emailAddresses[i],
                    entityid:emailAddresses[i]
                  }
                  this.dataObject.data.tableData.push(lineitem);
                }
              }).catch(e => this.$applog(e));
          });  
        });     
    }
}
</script>

<style>

</style>

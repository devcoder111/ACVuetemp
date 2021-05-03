 <template>
<Layout>
  <template v-slot:header>
    <v-col
       class="text-left ml-2 mt-1"
      cols="20"
    >
    <h5>{{ $t('history-screen.title') }}</h5>
    </v-col>
    <v-col cols="4"
       class="text-right mr-1 mt-2"
    >    
 <MyFormSelect v-show="connectionSelect.options.length>1" v-model="connectionSelect" @change="connectionfilterChange" ></MyFormSelect>
    </v-col>      
  </template>
  <template v-slot:aside>
     <navbar :dataObject="dataObject"  />
  </template>
  <template v-slot:main >
    <div>

    <div id="General" >
    <div id="GeneralHeader" class="Header" >
        <v-icon>mdi-timer-outline</v-icon>
    {{ $t('history-screen.header') }} </div>
  <br/>
    <div name="tabone">
       <HistoryGeneral :dataObject="dataObject" @selectHistoryItem="selectHistoryItem" @filterChange="filterChange" />
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
import  Navbar  from '@/layout/components/History/Navbar'
import  HistoryGeneral  from '@/components/History/General'
import MyFormSelect from '@/components/FormElements/MyFormSelect'
//classes
import  DataFactoryClass from '@/services/dataFactory'
import {HistoryScreenMetadata} from "@/services/History/data.js";
import {Data} from "@/services/data";

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

//vue page object
export default {
  name: 'history',
  _DataFactory: [],
  components:{
    Layout, Navbar, HistoryGeneral, MyFormSelect
  },
  data() {
    return {
      dataProvider:{
          type:Object
      },      
      connectionSelect:{name:'connectionSelect',value:{text:'',value:''}, caption:'', options:[]},     
      dataObject: {
          type:Object
      }
    }
  },
  methods: {
    connectionfilterChange(){
          this.$applog('history connectionfilterChange:');
          this.dataProvider=this._DataFactory.getDataService(this.connectionSelect.value.value,this.connectionSelect.value.value);
          this.dataProvider.historyGetData('all', new Date()).then((response) => {
                this.$applog('history historyGetData:'+JSON.stringify(response));
                this.dataObject=response;
              }).catch(e => this.$applog(e));  
    },
    async selectHistoryItem(selectItem){
        this.$applog('selectHistoryItem:'+JSON.stringify(selectItem));
        Storage.set({ key: "dialogmessageq", value: JSON.stringify([]) });
        let res={
          screenMetadata:{
            method:'history'
          },
          data:selectItem
        }
        await this.dataProvider.QueueMessage(res);
        this.dataProvider.actioned("History","close","");
    },
    closeClick() {
        this.dataProvider.actioned("History","close","");
    },
    filterChange(entitySelect,dateSelect){
        this.$applog('filterChange entityOptionsValue:'+JSON.stringify(entitySelect));
        this.$applog('filterChange fromDateVal:'+JSON.stringify(dateSelect));

        let _filterDate=new String(dateSelect);
        let _filterDate_arr= _filterDate.split("-");
        let _mth=new Number(_filterDate_arr[1]);
        _mth--;
        this.$applog('_mth='+_mth);
        let _filterDateObj=new Date( _filterDate_arr[0], _mth, _filterDate_arr[2]);
        this.$applog(_filterDateObj);
        this.dataProvider.historyGetData(entitySelect.value.value, _filterDateObj).then((response) => {
            this.dataObject=response;
        }).catch(e => this.$applog(e));

    },    
  },
  created(){
        //get our data provider and fetch our data
        this.$applog('History created()');
        let _screenmetadata=new HistoryScreenMetadata();
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

              this.dataProvider.historyGetData('all', new Date()).then((response) => {
                this.$applog('history historyGetData:'+JSON.stringify(response));
                this.dataObject=response;
              }).catch(e => this.$applog(e));
          });
        });
    }
}
</script>

<style scoped>

</style>

<template>
<v-form>

    <v-container class="grey lighten-5">
    <v-row>
      <v-col
        cols="4"
      >
<MyFormSelect v-model="entitySelect" @change="filterChange" ></MyFormSelect>

  <v-date-picker v-model="picker"
   @change="filterChange"
   :locale="this.$i18n.locale"
   ></v-date-picker>
      </v-col>
      <v-col
        cols="20  "
      >
    <v-data-table  
    :headers="dataObject.data.tableColumns"
      :items="dataObject.data.tableData"
      item-key="name" 
      class="elevation-1"
      loading=data_loading 
      loading-text=""
       mobile-breakpoint="0"
      :search="search"   
      :locale="this.$i18n.locale"

      :footer-props="{
           'items-per-page-text':this.$i18n.t('common.rowsperpage')
      }"

      >

        <template v-slot:[`header.__Select__`]="{ header }">
          {{ header.text.toUpperCase() }}
        </template>
        
        <template v-slot:[`item.__Select__`]="{ item }">
          <v-btn small
          @click="selectHistoryItem(item)"
          :color="item.tilecolor"
          icon
            >
          <v-icon>mdi-view-stream</v-icon>
          </v-btn>
        </template>

    </v-data-table>


      </v-col>
    </v-row>
  </v-container>


</v-form>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
import  DataFactoryClass from '@/services/dataFactory'

import MyFormSelect from '@/components/FormElements/MyFormSelect'

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

export default {
    name: "General",
    _DataFactory: [],
    components:{
      MyFormSelect
    },    
    data(){
        return {
            dataProvider:{
                type:Object
            },          
            entitySelect:{name:'entitySelect',value:{text:this.$i18n.t('history-screen.all'),value:'all'}, caption:this.$i18n.t('history-screen.select'), options:[]},
            search: '',
            entityOptionsValue:'all',
            picker: new Date().toISOString().substr(0, 10),
            connection:''
        }
    },
    props:{
         dataObject:{
            type:Object
         }
    },
    watch:{
      dataObject: {
        // This will let Vue know to look inside the object
        deep: true,
        // We have to move our method to a handler field
        handler(obj){ 
          this.$applog('dataObject:'+JSON.stringify(obj));
          this.entitySelect.options=obj.screenMetadata.entityOptions;
        }
      }         
    },
    methods:{
      getMaxDate(){
        let rDate= new Date();
        let res = this.formatDate(rDate);
        this.$applog('getMaxDate:'+res);
        return res;
      },
      filterChange(){
        this.$applog('history General filterChange entityOptionsValue:');
        this.$emit('filterChange',this.entitySelect,this.picker);
      },
      selectHistoryItem(selectedRow) {
        //rows.splice(index, 1);
        this.$emit('selectHistoryItem', selectedRow);
      },
      formatDate(val)
      {
        let mth=new String(val.getMonth()+1);
        let day=new String(val.getDate());
        if (mth.length==1)
          mth='0'+mth;
        if (day.length==1)
          day='0'+day;
        let res = val.getFullYear()+'-'+mth+'-'+day;
        return res;
      }
    },
    computed: {
      fromDateDisp() {
        return this.fromDateVal;
      },
    },    
    created(){
        let tmpdate=new Date();
        this.fromDateVal =this.formatDate(tmpdate);
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
                });
          });
    }
}
</script>

<style >


</style>

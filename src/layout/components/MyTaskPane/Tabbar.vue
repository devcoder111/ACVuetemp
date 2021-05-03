<template>
  <div>
      <input type="hidden" id="active_connection" name="active_connection" ref="active_connection" value="" />
      <input type="hidden" id="active_entity" name="active_entity" ref="active_entity" value="" />
      <input type="hidden" id="active_entityid" name="active_entityid" ref="active_entityid" value="" />
    <v-tabs
    show-arrows
      ts_comp="Tabbar"
     :fixed-tabs=false
      v-model="tab"
      color="primary"
      class="elevation-2"
      :centered="true"
      :grow="true"
      :vertical="false"
      :right="false"
      :icons-and-text="false"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab
        :ts_comp="'Tabbar'+tab.tabName"
        v-for="tab in tabs" 
        :key="tab.tabName"
        :href="`#tab-${tab.tabName}`" 
        @click="selectTab(tab)"
         >
        {{ tab.tabCaption }}
      </v-tab>

      <v-tab-item
        :ts_comp="'mytaskpane_tabbar'+tab.tabName"
        v-for="tab in tabs" 
        :key="tab.tabName"
        :value="`tab-${tab.tabName}`" > 
        <div class="tab-item-wrapper">
            <component :is="tab.provider" :tab="tab" :activeTabName="activeTabName" @linkSearch="linkSearch"
                    :propsearchData="searchDataObject" ></component>
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
/******************************/
//this is the tab component that is used on the connector tabs...see ViewEntity.vue for the inner tabs
/******************************/
import appConnections from '@/services/MyTaskPane/appConnections';
import SystemContainer from  '@/components/MyTaskPane/SystemContainer';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

export default {
    name: 'Tabbar',
    components:{
        SystemContainer
    }, 
    data(){
        return {
            tab: null,
            tabs:[],
            activeTabName: '',
            searchDataObject:{
                type:Object
            }
        }
     },
     methods:{
        setActiveTab(){
          try{
            window.external.setValue('activeTabName',this.activeTabName);
          }catch(e)
          {
            try{
                // eslint-disable-next-line
                return window.chrome.webview.hostObjects.sync.TS.setValue('activeTabName',this.activeTabName);
            }catch (ee){
                  console.log('setActiveTab failed')
            }
          }
        },
        getHiddenEntity(){
            let res= "entity_"+this.activeTabName;
            return res;
        },
        getHiddenEntityId(){
            let res= "entityid_"+this.activeTabName;
            return res;
        },         
        getTabCaption(tab){
            return "  "+tab.tabCaption;
        },   
        selectTab(tab) {
            this.activeTabName=tab.tabName;
            Storage.set({ key: "activeTabName", value: this.activeTabName});     
            this.$refs["active_connection"].value=this.activeTabName; 
            //set the active connections entity and entityid
            this.$refs["active_entity"].value=document.getElementById(this.getHiddenEntity()).value;
            this.$refs["active_entityid"].value=document.getElementById(this.getHiddenEntityId()).value;   
            this.setActiveTab();
        },
        openEmailTab(){
          //still used?? I DONT THINK SO...REMOVE..TODO...
            this.$applog('Tabbar openEmailTab:');
            //change the tab to be the first item (after email)..this gets called when the search icon is clicked from the email tab
            this.activeTabName=this.tabs[0].tabName;
        },
        linkSearch(section){
          //still used?? I DONT THINK SO...REMOVE..TODO...
          //change the tab to be the first item (after email)..this gets called when the search icon is clicked from the email tab
          this.activeTabName=this.tabs[1].tabName;
          this.searchDataObject={
              searchText:section.searchData.emailAddress
          }
        },
     },
     mounted(){
        var _that=this;
        this.tabs=(new appConnections()).data;
        if ((this.tabs==null)||(this.tabs==''))
        {
             this.$router.push({ name: 'startup', params: { connectioncounts:'1' } });
        }
        Storage.get({ key: "firstrun"}).then( firstrunObj =>{
           this.$applog("firstrun check "+firstrunObj.value);
           if (firstrunObj.value!='Y')
             this.$router.push({ name: 'firstrun' });
        });        
        if ((this.tabs!=null)&&(this.tabs.length>0)){
          this.activeTabName=this.tabs[0].tabName;
           _that.setActiveTab();
          Storage.set({ key: "activeTabName", value: this.activeTabName});  
          this.$refs["active_connection"].value=this.activeTabName; 
          Storage.get({ key: "activeTabName"}).then( activeTabName =>{
            if (activeTabName){
              this.activeTabName=activeTabName.value;//note ...this is NOT SETTING THE TAB AS BEING ACTIVE..IT SHOLUD REALLY..TODO
            }
          });
        }
     }
}
</script>

<style>
.container{
  padding:0px !important;
}

.tab-item-wrapper {
  /* vuetify sets the v-tabs__container height to 48px */
  height: calc(100vh - 48px)
}

</style>
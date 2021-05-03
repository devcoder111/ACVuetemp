<template>
<div>
  <v-text-field
        v-model="searchTerm"
        hide-details
        append-icon="mdi-magnify"
        single-line      
        clearable         
        loading         
        @click:append="runSearch()"        
    >
    <template v-slot:progress>
        <v-progress-linear     
          v-if="custom"     
          :value="progress"
          :color="color"
          absolute
          height="4"
        ></v-progress-linear>
      </template>
    
    </v-text-field>
    <v-banner v-if="listItems.length == 0">
      No records
    </v-banner>
    <v-list two-line>        
        <template v-for="(item, index) in listItems">
            <v-skeleton-loader :loading="loading"        
                type="list-item-avatar-two-line"
                tile="tile"
               :key="item.entityid"
            >
             <v-subheader
              v-if="item.header"
              :key="item.header"
              v-text="item.header"
            ></v-subheader>

            <v-divider
               v-else-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider>


            <v-list-item
              v-else
              :key="item.entityid"
            >

            <v-list-item-avatar>
              <v-icon :color="item.tilecolor">{{item.tileicon}}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="item.title" @click="goToSummary(item.entity, item.entityid)"></v-list-item-title>
              <v-list-item-subtitle v-html="item.subtitle" ></v-list-item-subtitle>
            </v-list-item-content>
            <!--<v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>-->
            </v-list-item>

            </v-skeleton-loader>
      </template>
    </v-list>
</div>

</template>
<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
export default {
    name : "EntityList",
    props: ["dataProvider", "entity", "entityId", "tab", "pageResult"],
    data : () =>{
        return {
          listItems: [],
          loading : true,
          searchTerm : '',
          showProgress:false,
          custom:true
        }
    },
    watch : {
      entity : function() {     
        this.searchTerm = '';         
        if (this.entityId == null)
          this.entitySearch("");        
        }
    },
    computed: {
      progress () {
        if (this.searchTerm) {
          return Math.min(100, this.searchTerm.length * 50)
        } else {
          return 0;
        } 
      },
      color () {
        return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
      },
    },
    methods : {      

      runSearch() {
          if (this.searchTerm) {
            if (this.searchTerm != "" && this.searchTerm.length >= 2) {
              this.entitySearch(this.searchTerm);
            }           
          }          
        },


      entitySearch(searchTerm) {
        this.listItems = [];
        this.feedSkeletonData(this.entity);
        this.loading = true;
        this.custom = false;
        this.dataProvider.entitySearch2(this.entity, searchTerm).then((data)=> {
            this.listItems = [];
            let tableData = data.tableData;
            let tableColumns = data.tableColumns;
            tableData.forEach(element => {
                this.listItems.push({ 
                    tileicon: element.tileicon,
                    tilecolor: element.tilecolor,
                    entityid: element.entityid,
                    entity: this.entity,
                    title: (element[tableColumns[1].value]),
                    subtitle: element[tableColumns[2].value] || ""
                });
                this.listItems.push({ divider: true, inset: false });
            });
            this.loading = false;
            this.custom = true;
        });
      },
      entityTabContent() {
          this.listItems = [];
          this.feedSkeletonData(this.entity);
          this.dataProvider.getTabContent2(this.entity, this.entityId, this.tab.tabName).then((result) => {            
            this.loading = true;     
            let tableData = result.data.tableData;
            let tableColumns = result.data.tableColumns;
            this.listItems = [];
            tableData.forEach(element => {
                this.listItems.push({ 
                    tileicon: element.icon,
                    tilecolor: element.tilecolor,
                    entityid: element.entityid,
                    entity: this.tab.tabName,
                    title: (element[tableColumns[1].value]),
                    subtitle: element[tableColumns[2].value] || ""
                });
                this.listItems.push({ divider: true, inset: false });
            });
            this.loading = false;
         });
      },
      goToSummary(entity, entityId) {
        //this.$applog("gotosummary", ("/entity/" + entity.toLowerCase() + "/" + entityId));
        this.$router.push("/entity/" + entity.toLowerCase() + "/" + entityId);        
      },
      feedSkeletonData(forEntity) {
        for(var i = 0; i<8; i++) {
              this.listItems.push({ 
                tileicon: '',
                tilecolor: '',
                entityid: forEntity + "_" + i,
                title: "",
                subtitle: ''});
        }        
      }
    },
    mounted() {
      this.listItems = [];   
      this.searchTerm = '';  
      if (this.entityId == null) {
        this.entitySearch("");
      } else {
        this.entityTabContent();
      }
    }
}
</script>
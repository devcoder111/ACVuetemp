<template>
<div class="MyCRM">

<v-expansion-panels v-model="panel" focusable class="MyCRMexpansion" >
    <v-expansion-panel v-model="panel" expand class="MyCRMexpansion">
      <v-expansion-panel-header>
        {{$t('mycrm-screen.youractivity')}}
      </v-expansion-panel-header>
      <v-expansion-panel-content >         
        <v-card
          class="mx-auto text-center MyCRMCard"
        >
          <v-card-text>
            <v-sheet color="primary">
              <v-sparkline
                :value="activitydata"
                :labels="activitydatalabels"
                color="rgba(255, 255, 255, .7)"
                height="100"
                padding="12"
                stroke-linecap="round"
                smooth
              >
          <template v-slot:label="item">
                  {{ item.value }}
                </template>        
              </v-sparkline>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel v-if="salesdatacollection && salesdatacollection.labels && salesdatacollection.labels.length>0" class="MyCRMexpansion">
      <v-expansion-panel-header>
        {{$t('mycrm-screen.opportunitypipeline')}}
      </v-expansion-panel-header>
      <v-expansion-panel-content >
          <doughnut-chart :chart-data="salesdatacollection" :centertext="doughnutcentertext"  >
          </doughnut-chart>      
       <v-spacer></v-spacer>
          <v-btn tile large outlined class="ma-2" color="accent" @click="getSalesList()" >
              <v-icon>mdi-cash-multiple</v-icon>{{$t('mycrm-screen.viewsaleslist')}}
          </v-btn>          
      </v-expansion-panel-content>
    </v-expansion-panel>


    <v-expansion-panel v-if="casesdatacollection && casesdatacollection.labels && casesdatacollection.labels.length>0">
      <v-expansion-panel-header>
         {{$t('mycrm-screen.casespipeline')}}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
          <doughnut-chart :chart-data="casesdatacollection" :centertext="doughnutcentertextCases" >
          </doughnut-chart>
 <v-spacer></v-spacer>
          <v-btn tile large outlined class="ma-2" color="accent" @click="getCasesList()" >
              <v-icon>mdi-briefcase-outline</v-icon>{{$t('mycrm-screen.viewcaseslist')}}
          </v-btn>          
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>

</div>  
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'

  import DoughnutChart from '@/components/charts/DoughnutChart'

  export default {
    name: 'mycrm',
    components: {
      DoughnutChart
    },
    props:{
      dataObject:{
        type:Object
      }
    },
    watch: { 
      dataObject: {
        // This will let Vue know to look inside the object
        deep: true,
        // We have to move our method to a handler field
        handler(){          
          if (this.dataObject!=null)
          {
            if (this.dataObject.data.salestats)
              this.salesdatacollection=this.dataObject.data.salestats;
            if (this.dataObject.screenMetadata.salestats)
            {
              this.salestats=this.dataObject.screenMetadata.salestats;
              this.doughnutcentertext=new String(this.salestats.item1Value);
            }
            if (this.dataObject.data.casestats)
            {
              this.casesdatacollection=this.dataObject.data.casestats;
            }
            this.doughnutcentertextCases='.';
            if (this.dataObject.data.casestats.datasets[0].data)
            {
              this.doughnutcentertextCases=new String(this.dataObject.data.casestats.datasets[0].data[0]);
            }  
            if (this.dataObject.screenMetadata.activitydata)    
            this.activitydata=this.dataObject.screenMetadata.activitydata;
            this.activitydatalabels=this.dataObject.screenMetadata.activitydatalabels;
            this.dataloaded=true;
          }
        }
      }
    },      
    data () {
      return {
        panel: 0,
        activitydata:[0,0,0,0,0,0,0,0,0,0,0,0],
        activitydatalabels:['a','b','c','d','e','f','g','h','i','j','k','l'],
        doughnutcentertext:this.$i18n.t('mycrm-screen.loading'),
        doughnutcentertextCases:this.$i18n.t('mycrm-screen.loading'),  
        salestats:{
          item1Caption:'',
          item1Value:'',
          item2Caption:'',
          item2Value:'',          
          item3Caption:'',
          item3Value:'',          
          item4Caption:'',
          item4Value:'',          
          item5Caption:'',
          item5Value:'',          
          item6Caption:'',
          item6Value:'',          
        },
        casesdatacollection: {
                          "datasets": [{
                              "data": []
                          }],
                          "labels": []
                      },        
        salesdatacollection: {
                          "datasets": [{
                              "data": []
                          }],
                          "labels": []
                      },
        dataloaded:true
      }
    },
    methods:{
      getCasesList(){
        this.$applog('mycrm - getCasesList:');
        this.$emit('getCasesList');
      },      
      getSalesList(){
        this.$applog('mycrm - getSalesList:');
        this.$emit('getSalesList');
      },
      toggleSales(){
        this.showSalesGraph=!this.showSalesGraph;
      },
      toggleCases(){
        this.showCasesGraph=!this.showCasesGraph;
      },      
      getToggleSwitch(){
        if (this.showSalesGraph==true)
        {
            return "mdi-toggle-switch-off";
        }else{
            return "mdi-toggle-switch";
        }       
      },
      getToggleSwitchCases(){
        if (this.showCasesGraph==true)
        {
            return "mdi-toggle-switch-off";
        }else{
            return "mdi-toggle-switch";
        }       
      }

    }
  }
</script>

<style scoped>
  .small {
    max-width: 400px;
    margin:  10px auto;
  }

  .MyCRM{
    height: calc(100vh - 159px);
    width: -webkit-calc((100%) - 1px); /** Safari 6, Chrome 19-25 **/
    width: -moz-calc((100%) - 1px); /** FF 4-15  **/
    overflow-y: auto !important;
  }

  .MyCRMCard{
    border-radius: 0px !important;
    box-shadow: 0px !important;
  }
  .MyCRMexpansion{
    border-radius: 0px !important;
    box-shadow: 0px !important;
  }
  .MyCRMexpansionContent{
    max-height: 100px;
  }
  svg{
    overflow: scroll;/*IE fix*/
  }
</style>
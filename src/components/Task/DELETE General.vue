<template>
<v-form>

<v-data-table dense v-if="dataObject"
  :headers="dataObject.data.tableColumns"
   :items="dataObject.data.tableData"
   item-key="name" 
   class="elevation-1"
   loading=data_loading 
   loading-text=""
   hide-default-footer
   :items-per-page="itemsPerPage"
    mobile-breakpoint="0"
   no-data-text="No items found"
   no-results-text="Nothing found this time"    
   >

    <template v-slot:[`header.__Select__`]="{ header }">
      {{ header.text.toUpperCase() }}
    </template>
    <template v-slot:[`header.__Copy__`]="{ header }">
      {{ header.text.toUpperCase() }}
    </template>    
    
    <template v-slot:[`item.__Select__`]="{ item }">
      <v-btn small
      @click="selectRow(item)"
      :color="item.tilecolor"
      icon
        >
       <v-icon>mdi-phone</v-icon>
      </v-btn>
    </template>
    <template v-slot:[`item.__Copy__`]="{ item }">
      <v-btn small
      @click="copyRow(item)"
      :color="item.tilecolor"
      icon
        >
       <v-icon>mdi-content-copy </v-icon>
      </v-btn>
    </template>
   </v-data-table>
</v-form>

</template>

<script>

/*

THIS IS FLAGGED TO BE DELETED AS NOT USE ANY MORE

*/

export default {
    name: "General",
    data(){
        return {
          Filter: '',
          item: 0,
          itemsPerPage:20
        }
    },
    props:{
         dataObject:{
            type:Object
         }
    },
    methods:{
      filterChange(val){
        this.$applog('filterChange:'+val+'---'+this.Filter);

        this._DataObject.getData(this.Filter).then((response) => {
          this.$applog(JSON.stringify(  this.dataObject.data.tableData));
          this.dataObject.data.tableData=response.data.tableData;
        }).catch(e => this.$applog(e));

      },
      selectRow(index) {
        //rows.splice(index, 1);
        this.$applog('phone select row:'+JSON.stringify(index));
        this.$emit('selectRow', index);
      },
      copyRow(index) {
        //rows.splice(index, 1);
        this.$applog('phone copy row:'+JSON.stringify(index));
        this.$emit('copyRow', index);
      }
    }
}
</script>

<style >
.el-table .cell{
  font-size: 1em !important;
}

</style>

<template>
 <div>
   <v-autocomplete
      v-bind="$attrs"
      v-model="value.value" 
      :label="value==null ? '':value.caption" 
      :name="value==null ? '':value.name" 
      :immediate="immediateSearch"
      ref="value.name" 

        filled
        chips
        :color="value.iconColor"

        :items="value.options"
        :loading="isLoading"
        :search-input.sync="search"
    
        :placeholder="value==null ? '':value.placeholder" 
        :prepend-icon="value.icon"
        :no-filter=true
        return-object
      >
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="remove(data.item)"
                >
                 <v-icon left>{{data.item.icon}}</v-icon>
                  {{ data.item.text }}
                </v-chip>
              </template>
              
              <template v-slot:item="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-item-content v-text="data.item"></v-list-item-content>
                </template>
                <template v-else>
                  <v-list-item-avatar>
                      <v-icon left>{{data.item.icon}}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.text"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>

      </v-autocomplete>

    </div>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'

//ref: https://vuetifyjs.com/en/components/autocompletes/

export default {
  name: 'MyFormRemoteLookup',
  props:{
    formElements:{
      type:Array,
      default:function () {
        return []
      }
    },    
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormRemoteLookupNotSet',value:'', caption:'not set', options:[]}
      }
    },
    dataProvider:{
      type:Object
    }
  },
  data () {
      return {
      searchtimer:null,
      immediateSearch:false,
      isLoading: false,
      search: null,
      filterObject:{
        type:Object,
        default:function () {
          return null;
        }
      }
  }},
  watch: { 
    value: {
        // This will let Vue know to look inside the object
        deep: true,
        // We have to move our method to a handler field
        handler: function () {
          this.$applog('MyFormRemoteLookup select:'+JSON.stringify(this.value));
          if ((this.value.value!=null)&&(this.value.value.value!=null))
          {
            this.$applog('MyFormRemoteLookup - emit as value changed:'+this.value.value.value);
            this.$emit('MyFormRemoteLookupChanged',this.value);         
          }else if (this.value.filterObject!=null)
          {
            this.$applog('MyFormRemoteLookup filterObject changed: '+JSON.stringify(this.value.filterObject));
          }
        }
    },       
    search (val) {
      this.$applog('MyFormRemoteLookup search');
      this.$applog(JSON.stringify(this.value));
      if (this.searchtimer!=null)
      {
        clearTimeout(this.searchtimer);
      }
      if ((this.value!=null)&&(this.value.value))
      {
        this.$applog("exit search");
        //we have a value so no search
        return;
      }

      this.$applog('MyFormRemoteLookup search: '+this.value.name+" - "+val);

      this.$applog('Component MyFormRemoteLookup entity:'+this.value.entity);
      let query={
        fieldname:this.value.name,
        entity: this.value.entity,
        value:val,
        filter:''
      }
      //filter object is another lookup
      if ((this.filterObject!=null)&&
            (this.filterObject.value!=null))
      {
        //get our filterObject from prop=formElements
        query.filter=this.filterObject.value.value;//eg {"entity":"Company","entityid":30}
      }
      this.$applog("MyFormRemoteLookup: "+JSON.stringify(query));
      if (query !== '') {
          this.loading = true;
          //query our remote api?
          this.$applog("MyFormRemoteLookup this.value: "+JSON.stringify(this.value));
                    
          this.searchtimer= setTimeout(() => {
                  this.$applog("MyFormRemoteLookup searchtimer search on: "+JSON.stringify(this.value));
                  this.isLoading=true;
                  this.dataProvider.getRemoteData(this.value, query).then((response) => {
                    this.$applog("remoteLookup response data:"+JSON.stringify(response));
                    this.value.options=response.data.options;
                    this.isLoading = false;
                  }).catch(e => {
                      this.$applog("remoteLookup ERROR:"+e.message);
                      this.isLoading = false;
                  });
            }, 1500); // 1.5 sec delay
              
                     
      }else {
        this.options = [];//empty dataset
        this.isLoading = false;
      }
    },
  },     
  methods: {
    remove (item) {
        this.$applog('MyFormRemoteLookup remove: '+JSON.stringify(item));
        this.$applog('MyFormRemoteLookup remove: '+JSON.stringify(this.value));
        this.value.value=null;
    }
  },
  created(){
    this.$applog('MyFormRemoteLookup created: '+this.value.name);
    for(var x=0;x<this.formElements.length;x++)
    {
      if (this.formElements[x].name==this.value.filterObjectName)
      {
        this.filterObject=this.formElements[x]; 
      }
    }
  }

}

</script>

<style scoped>

</style>
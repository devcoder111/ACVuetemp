<template>
  <v-container class="">
    <v-row no-gutters>
      <v-col v-if="value.options.CountryCode==true" :cols="getCountryCodeCols()" :sm="getCountryCodeCols()" class="layoutfixer">

  <v-text-field v-show="value.options.CountryCode==true"
      v-model="value.value.countrycode_value" 
      :label="$t('task-screen.countrycode')"
      :name="value==null ? '':value.name" 
      :ref="value.name"
      :readonly="value==null ? false:value.readonly" 
      :clearable="true"    
          ></v-text-field>
            </v-col>
      <v-col v-if="value.options.AreaCode==true" :cols="getAreaCodeCols()" :sm="getAreaCodeCols()" class="layoutfixer">
  <v-text-field v-show="value.options.AreaCode==true"
      v-model="value.value.areacode_value" 
      :label="$t('task-screen.areacode')"
      :name="value==null ? '':value.name" 
      :ref="value.name"
      :readonly="value==null ? false:value.readonly" 
      :clearable="true"    
          ></v-text-field>
      </v-col>
      <v-col :cols="getPhoneNumberCols()" :sm="getPhoneNumberCols()" class="layoutfixer" >
  <v-text-field
      v-model="value.value.phonenumber_value" 
      :label="value==null ? '':value.caption" 
      :name="value==null ? '':value.name" 
      :ref="value.name"
      :readonly="value==null ? false:value.readonly" 
      :clearable="true"    
          ></v-text-field>
      </v-col>      
    </v-row>
  </v-container>        
</template>

<script>
export default {
  name: 'MyFormPhone',
  props:{
    value:{
      type:Object,
      default:function () {
        return { 
                name:'MyFormPhoneNotSet',
                options:{AreaCode:false, CountryCode:false},
                value: {areacode_value:'',countrycode_value:'', phonenumber_value:''}, 
                caption:'not set'
                }
      }
    } 
  },
  methods:{
    getCountryCodeCols()
    {
      if (!this.value.options.CountryCode)
        return 0;
      return 4;
    },
    getAreaCodeCols()
    {
      if (!this.value.options.AreaCode)
        return 0;      
      return 4;
    },
    getPhoneNumberCols()
    {
      let res=4;
      if (!this.value.options.AreaCode)
        res=res+4;            
      if (!this.value.options.CountryCode)              
        res=res+4;
      return res;
    }   
  }
}

</script>

<style scoped>

.layoutfixer{
  width:100%;
}
</style>

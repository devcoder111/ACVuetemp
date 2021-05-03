<template>

  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col     
        cols="4"
        sm="4"
      >

        <v-select
              v-model="value.value.currency"
              :items="value.options"
              :label="value==null ? '':value.caption" 
              data-vv-name=""
              item-text="text"
              item-value="value"         
              ref="currencyPicker" 
        ></v-select>

      </v-col>
      <v-col  >

        <v-text-field
          v-model="value.value.amount" 
          :name="value==null ? '':value.name" 
          :clearable="true"    
          ref="amountPicker" 
        ></v-text-field>

      </v-col>
    </v-row>
  </v-container>
         
</template>

<script>
export default {
  name: 'MyFormCurrency',
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormCurrencyNotSet',value:{currency:'',amount:''},options:[], caption:'not set'}
      }
    }
  }  
}

</script>

<style scoped>

</style>
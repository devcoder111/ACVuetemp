<template>

      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="value.value"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="value.value"
            :label="value==null ? '':value.caption" 
            :name="value==null ? '':value.name" 

            prepend-icon="mdi-calendar"      
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="value.value" scrollable       
          v-bind="$attrs"
          v-on:input="$emit('change')">

          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal = false" >{{$t('common.cancel')}}</v-btn>
          <v-btn text color="primary" @click="$refs.dialog.save(value.value)">{{$t('common.ok')}}</v-btn>
        </v-date-picker>
      </v-dialog>

</template>

<script>
export default {
  name: 'MyFormDate',
  data() {  
      return {
         modal:false
      }
  },    
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormDateNotSet',value:new Date().toISOString().substr(0, 10), caption:'not set'}
      }
    }
  }   
}

</script>

<style scoped>

</style>

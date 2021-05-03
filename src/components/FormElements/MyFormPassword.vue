<template>
    <v-text-field 
    :label="value.caption" 
     prepend-icon="mdi-lock" 
     :append-icon="showPassword ? 'mdi-eye':'mdi-eye-off'" 
     v-model="value.value" 
     :name="value.name" 
     :type="showPassword ? 'text':'password'" 
     @click:append="showPassword=!showPassword"
     autocomplete="off"  />
</template>

<script>


export default {
  name: 'MyFormPassword',
  data() {
      return {
        showPassword: false
      }
  },  
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormInputNotSet',value:'', caption:'not set'}
      }
    }
  }  
}

</script>

<style scoped>

</style>

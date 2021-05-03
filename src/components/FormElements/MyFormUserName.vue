<template>
    <v-text-field 
    :label="value.caption" 
    prepend-icon="mdi-account-circle" 
    v-model="value.value" 
      :readonly="value==null ? false:value.readonly" 
      :required="value==null ? false:value.required"     
    :name="value.name"  />
</template>

<script>
export default {
  name: 'MyFormUserName',
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

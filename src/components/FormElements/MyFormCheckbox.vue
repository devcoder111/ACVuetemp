<template>
      <v-checkbox v-model="value.value" 
      :label="value==null ? '':value.caption" 
      :name="value==null ? '':value.name" 
      :readonly="value==null ? false:value.readonly" 
      :required="value==null ? false:value.required"       
     />
</template>

<script>
export default {
  name: 'MyFormCheckbox',
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormInputNotSet',value:false, caption:'not set'}
      }
    }
  }    
}

</script>

<style scoped>

</style>

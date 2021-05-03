<template>
  <v-text-field
      v-model="value.value" 
      :label="value==null ? '':value.caption" 
      :name="value==null ? '':value.name" 
      :clearable="true"    
      :readonly="value==null ? false:value.readonly" 
      :required="value==null ? false:value.required"       
       type="number"
          ></v-text-field>
</template>

<script>
export default {
  name: 'MyFormNumber',
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormInputNotSet',value:0, caption:'not set'}
      }
    }
  } 
}

</script>

<style scoped>

</style>
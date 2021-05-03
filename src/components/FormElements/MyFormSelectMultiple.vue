<template>
  <v-select
      v-model="value.value" 
      :label="value==null ? '':value.caption" 
      :name="value==null ? '':value.name" 
      :readonly="value==null ? false:value.readonly" 
      :required="value==null ? false:value.required"       
          multiple
          :items="value.options"
          item-text="text"
          item-value="value"
          persistent-hint
          return-object
        ></v-select>
</template>

<script>
export default {
  name: 'MyFormSelectMultiple',
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormInputNotSet',value:'', caption:'not set',options:[]}
      }
    }
  }   
}

</script>

<style scoped>

</style>
<template>
  <v-text-field
      v-model="value.value" 
      :label="value==null ? '':value.caption" 
      :name="value==null ? '':value.name" 
      :ref="value.name"
      :readonly="true"
      :clearable="false"    
          ></v-text-field>
</template>

<script>
export default {
  name: 'MyFormLabelOnly',
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormLabelOnlyNotSet',value:'', caption:'not set'}
      }
    }
  }
}

</script>

<style scoped>

</style>

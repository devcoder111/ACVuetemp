<template>
   <v-radio-group v-model="value.value">
      <v-radio
        v-for="item in value.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></v-radio>
    </v-radio-group>
</template>

<script>
export default {
  name: 'MyFormRadioGroup',
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
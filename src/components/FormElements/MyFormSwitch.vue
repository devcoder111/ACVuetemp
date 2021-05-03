<template>
 <v-switch
      v-model="value.value"
      :label="value.caption"
    ></v-switch>
</template>

<script>
export default {
  name: 'MyFormSwitch',
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
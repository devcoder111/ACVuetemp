<template>
  <v-select
      v-bind="$attrs"
      v-on:input="$emit('change');"

      v-model="value.value" 
      :label="value==null ? '':value.caption" 
      :name="value==null ? '':value.name" 
      :ref="value.name"
      :readonly="value==null ? false:value.readonly" 
      :required="value==null ? false:value.required" 
      :rules="rules"
      :items="value.options"
      item-text="text"
      item-value="value"  
      persistent-hint
      return-object
    ></v-select>
</template>

<script>
export default {
  name: 'MyFormSelect',
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormSelectNotSet',value:{text:'',value:''}, caption:'not set', options:[]}
      }
    }
  },
  computed: {
      rules () {
        const rules = []

      if (this.value.required) {
          const rule =
            (v) => !!v ||  'Required'

          rules.push(rule)
        }
        return rules
      },
    }   
}

</script>

<style scoped>

</style>
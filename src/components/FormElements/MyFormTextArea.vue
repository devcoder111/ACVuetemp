<template>
     <v-textarea 
          v-bind="$attrs"
          v-model="value.value" 
          :label="value==null ? '':value.caption" 
          :name="value==null ? '':value.name" 
          :rows="value.rows"
      :readonly="value==null ? false:value.readonly" 
      :required="value==null ? false:value.required"         
       :rules="rules"  
          dense
          clearable>
     </v-textarea>
</template>

<script>
export default {
  name: 'MyFormTextArea',
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormTextArea',value:'', caption:'not set'}
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


<style scoped>

</style>
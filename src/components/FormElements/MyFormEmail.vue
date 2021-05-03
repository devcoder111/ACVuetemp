<template>
  <v-text-field
      v-model="value.value" 
      :label="value==null ? '': value.caption" 
      :name="value==null ? '': value.name" 
      :ref="value.name"
      :readonly="value == null ? false: value.readonly " 
      :rules="[rules.email]"
      :clearable="true"    
        :required="value==null ? false:value.required" 
       type="email"
          ></v-text-field>
</template>

<script>
export default {
  name: 'MyFormEmail',
  data() {
    return {
      rules: {
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            let _valid = pattern.test(value);
            if ((value=="")&&(!value.required))
            {
              _valid=true;
            }
            this.value.valid = _valid;
            
            return  _valid || 'Invalid e-mail.'
          }
      }
    }
  },
  props: {
    value: {
      type:Object,
      default:function () {
        return { name:'MyFormEmailNotSet', value: '', caption:'not set', required: false, valid: true}
      }
    }
  }
}

</script>

<style scoped>

</style>

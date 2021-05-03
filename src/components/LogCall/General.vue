<template>

<div>
    <div >
           <v-radio-group
                v-model="customDataObject.phonedirection"
                customDataObject.phonedirection
              >
              <v-radio
                :label="$t('task-screen.phoneout')"
                value="phoneout"
              ></v-radio>
              <v-radio
                :label="$t('task-screen.phonein')"
                value="phonein"
              ></v-radio>
          </v-radio-group>  
      </div>
    <div >
        <component v-for="(formItem, idx) in customDataObject.formElements" :key="idx" :ref="formItem.name"
          :is="formItem.componentType" 
            v-model="customDataObject.formElements[idx]" :formElements="customDataObject.formElements" ></component>
    </div>
</div>

</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
//form components
import MyFormInput from '@/components/FormElements/MyFormInput'
import MyFormTextArea from '@/components/FormElements/MyFormTextArea'

export default {
    name: "General",
    components:{
        MyFormInput,
        MyFormTextArea
    },
    props:{
      dataObject:{
        type: Object
      },
      customDataObject:{
         type: Object
      }
    },
    methods: {
      MyFormRemoteLookupChanged(val){
          this.$applog(val);
      }
    },
}
</script>

<style scoped>


</style>

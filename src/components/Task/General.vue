<template>

<div>
    <div  v-for="(formScreen, idxScreen) in dataObject.screenMetadata.screens" :key="idxScreen">
        <component v-for="(formItem, idx) in formScreen.formElements" :key="idx" :ref="formItem.name"
          :is="formItem.componentType" :dataProvider="dataProvider" 
            v-model="formScreen.formElements[idx]" :formElements="formScreen.formElements"
            @MyFormRemoteLookupChanged="MyFormRemoteLookupChanged" ></component>
    </div>
</div>

</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
//form components
import MyFormInput from '@/components/FormElements/MyFormInput'
import MyFormSelect from '@/components/FormElements/MyFormSelect'
import MyFormCheckbox from '@/components/FormElements/MyFormCheckbox'

import MyFormDate from '@/components/FormElements/MyFormDate'
import MyFormDateTime from '@/components/FormElements/MyFormDateTime'
import MyFormNumber from '@/components/FormElements/MyFormNumber'
import MyFormRadioGroup from '@/components/FormElements/MyFormRadioGroup'
import MyFormRemoteLookup from '@/components/FormElements/MyFormRemoteLookup'
import MyFormSelectMultiple from '@/components/FormElements/MyFormSelectMultiple'
import MyFormSwitch from '@/components/FormElements/MyFormSwitch'
import MyFormTextArea from '@/components/FormElements/MyFormTextArea'
import MyFormTime from '@/components/FormElements/MyFormTime'
import MyFormCurrency from '@/components/FormElements/MyFormCurrency'
import MyFormURL from '@/components/FormElements/MyFormURL'
import MyFormDivider from '@/components/FormElements/MyFormDivider'
import MyFormPhone from '@/components/FormElements/MyFormPhone'
import MyFormEmail from '@/components/FormElements/MyFormEmail'
import MyFormLabelOnly from '@/components/FormElements/MyFormLabelOnly'

export default {
    name: "General",
    components:{
        MyFormInput,MyFormSelect,MyFormCheckbox,MyFormDate,MyFormDateTime,MyFormNumber,
        MyFormRadioGroup,MyFormRemoteLookup,MyFormSelectMultiple,MyFormSwitch,
        MyFormTextArea,MyFormTime,MyFormCurrency,MyFormURL,MyFormDivider,MyFormPhone,MyFormEmail,
        MyFormLabelOnly
    },
    props:{
      dataObject:{
        type: Object
      },
      dataProvider:{
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

<template>
<div>

  <v-form ref="CommsForm" name="CommsForm"  lazy-validation >

 <v-card
    class="mx-auto my-4"
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>
    <v-card-text>
      
    <div v-if="value!=null && value.content!=''" v-html="value.content"></div>
    <div>
        <component v-for="(formItem, idx) in value.formElements" :key="idx" :ref="formItem.name"
          :is="formItem.componentType" :dataProvider="dataProvider" 
        v-model="value.formElements[idx]" :formElements="value.formElements"
        @MyFormRemoteLookupChanged="MyFormRemoteLookupChanged" ></component>
    </div>
     
    </v-card-text>

  </v-card>
  </v-form>

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
    name: "FileEmailComms",
    components:{
        MyFormInput,MyFormSelect,MyFormCheckbox,MyFormDate,MyFormDateTime,MyFormNumber,
        MyFormRadioGroup,MyFormRemoteLookup,MyFormSelectMultiple,MyFormSwitch,
        MyFormTextArea,MyFormTime,MyFormCurrency,MyFormURL,MyFormDivider,MyFormPhone,MyFormEmail,
        MyFormLabelOnly
    },    
    props:{
        value:{
           type:Object
        },
        dataProvider:{
          type:Object
        },         
    },
    methods:{
      MyFormRemoteLookupChanged(val){
        this.$applog('Comms MyFormRemoteLookupChanged:'+val.name+"=="+JSON.stringify(val));
        for(var y=0;y<this.value.screens.length;y++)
        {
          let _screen=this.value.screens[y];
          for(var i=0;i<_screen.formElements.length;i++)
          {
            var elm=_screen.formElements[i];
            if ((elm.componentType=="MyFormRemoteLookup")&&(elm.filterObjectName==val.name))
            {
                this.$applog(val.name+" ????? "+elm.name);
                let query={
                  fieldname:elm.name,
                  entity: elm.entity,
                  value:'',
                  filter:''
                } 
                //filter object is another lookup 
                this.$applog("Comms MyFormRemoteLookup this.value: "+JSON.stringify(elm));      
                let filterObjectName=elm.filterObjectName;
                if (filterObjectName!=null)
                {
                  //get the object with value 'filterObjectName'
                  query.filter={"entity":val.value.value.entity, "entityid":val.value.value.entityid}
                }
                this.$applog("Comms query query.query: "+JSON.stringify(query));      
                this.$applog("Comms MyFormRemoteLookupChanged remoteLookup response data X:"+elm.name);
                this.dataProvider.getRemoteData(elm, query).then((response) => {
                  //get the field
                  var _elm=this.getField(response.data.fieldname);
                  this.$applog("response.data.fieldname: "+response.data.fieldname);
                  this.$applog("Comms MyFormRemoteLookupChanged remoteLookup response data:"+_elm.name);
                   _elm.options=response.data.options;
                }).catch(e => console.error(e));
            
            } 
          }
        }
      },   
    }
}
</script>

<style>

</style>
<template>
<v-sheet class="pa-2">
  <v-form ref="form" name="form" id="form" v-model="valid" lazy-validation> 
    <div v-if="screenMetadata.screens!=null && screenMetadata.screens[0].content!=''" 
            v-html="screenMetadata.screens[0].content"></div>

    <div v-for="(formScreen, idxScreen) in screenMetadata.screens" :key="idxScreen">
                <v-divider v-show="formScreen.subheader!=''"></v-divider>
            <v-subheader v-show="formScreen.subheader!=''" :style="sectionStyle" >
              <v-icon>{{ formScreen.subheadericon}}</v-icon>
              {{ formScreen.subheader }}
            </v-subheader>

        <component v-for="(formItem, idx) in formScreen.formElements" :key="idx" :ref="formItem.name"
          :is="formItem.componentType" :dataProvider="dataProvider" 
          v-model="formScreen.formElements[idx]" :formElements="formScreen.formElements"
          @MyFormRemoteLookupChanged="MyFormRemoteLookupChanged" ></component>
          
    </div>

    <!--<v-btn
      :disabled="!valid || loading"
      :loading="loading"       
      color="primary"
      text
      @click="validateAndSubmit"
    >
      <v-icon left>mdi-content-save</v-icon>
      Save
    </v-btn>-->


    </v-form>
    <v-divider></v-divider>
</v-sheet>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
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
  name: 'MyForm',
  data() {
          return {             
            sectionStyle : "",
            valid: true            
        }
  },
  props: ["screenMetadata", "dataProvider", "screenName", "createEntity"],
  components: {
      MyFormInput,MyFormSelect,MyFormCheckbox,MyFormDate,MyFormDateTime,MyFormNumber,
      MyFormRadioGroup,MyFormRemoteLookup,MyFormSelectMultiple,MyFormSwitch,
      MyFormTextArea,MyFormTime,MyFormCurrency,MyFormURL,MyFormDivider,MyFormPhone,MyFormEmail,MyFormLabelOnly
  },
  methods: {
      validateAndSubmit () {
        let valid = this.$refs.form.validate();
        //valid = true;//todo remove 
        if (valid) {         

          this.$emit("show-loading", true);

          let bodyFormData = new URLSearchParams();
          bodyFormData.append('entity', this.screenMetadata.entity);
          bodyFormData.append('entityid', this.screenMetadata.entityid);
          bodyFormData.append('screenName', this.screenName);

          var data = [];
          

        if (this.createEntity) {

            this.screenMetadata.screens.forEach(formScreen => {
              formScreen.formElements.forEach(formElement => {
                let value = formElement.value;
                if (formElement.componentType == 'MyFormRemoteLookup') {
                  value = formElement.value.value.entityid;
                } else if (typeof formElement.value == "object") {
                  value = formElement.value.value;
                } 
                if (value)                
                  data.push({ name: formElement.name, value: value})          
              });
            });            
            bodyFormData.append('data', JSON.stringify(data));

            this.dataProvider.createNewEntity(bodyFormData).then((result) => {
              this.$router.push(`/entity/${this.screenMetadata.entity}/${result.data.data.entityid}`)
            }).catch(err => {
                this.$emit("show-loading", false);
                this.$emit("show-snackbar", true, err);
            });
        } else {
            this.screenMetadata.screens.forEach(formScreen => {              
              formScreen.formElements.forEach(formElement => {
                //let value = typeof formElement.value == "object" ? formElement.value.value : formElement.value;
                let value = formElement.value;
                if (formElement.componentType == 'MyFormRemoteLookup') {
                  value = formElement.value.value.entityid;
                } else if (typeof formElement.value == "object") {
                  value = formElement.value.value;
                } 
                if (value)
                  bodyFormData.append(formElement.name, value);                
              });
            });

            this.dataProvider.saveForm(bodyFormData).then((result) => {
              if (result.data.saveStatus != "success") {              
                this.$emit("show-loading", false);
                this.$emit("show-snackbar", true, result.data.saveStatus);
              } else {
                setTimeout(()=>{                
                  this.$emit("form-saved", result.data);
                }, 500)              
              }
            }).catch(err => {
                this.$emit("show-loading", false);
                this.$emit("show-snackbar", true, err);
            });
          }
        }
      },
      MyFormRemoteLookupChanged(val) {
        this.$applog('SystemContainer MyFormRemoteLookupChanged X:'+val.name+"=="+JSON.stringify(val));
        for(var y=0;y<this.screenMetadata.screens.length;y++)
        {
          let _screen=this.screenMetadata.screens[y];
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
                this.$applog("SystemContainer MyFormRemoteLookup this.value: "+JSON.stringify(elm));      
                let filterObjectName=elm.filterObjectName;
                if (filterObjectName!=null)
                {
                  //get the object with value 'filterObjectName'
                  query.filter={"entity":val.value.value.entity, "entityid":val.value.value.entityid}
                }
                this.$applog("SystemContainer query query.query: "+JSON.stringify(query));      
                this.$applog("SystemContainer MyFormRemoteLookupChanged remoteLookup response data X:"+elm.name);
                this.dataProvider.getRemoteData(elm, query).then((response) => {
                  //get the field
                  var _elm=this.getField(response.data.fieldname);
                  this.$applog("response.data.fieldname: "+response.data.fieldname);
                  this.$applog("SystemContainer MyFormRemoteLookupChanged remoteLookup response data:"+_elm.name);
                   _elm.options=response.data.options;
                }).catch(e => console.error(e));
            
            } 
          }
        }
      }
    },
}

</script>

<style scoped>

</style>

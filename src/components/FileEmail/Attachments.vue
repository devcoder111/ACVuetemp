<template>
<v-form>
   <v-list>
      <v-list-item
        v-for="(att, index) in value.EmailList[0].attachments" 
        :key="att.id"
         >
       <v-list-item-action>
            <MyFormCheckbox
                v-model="value.EmailList[0].attachments[index]" >
            </MyFormCheckbox>
        </v-list-item-action>
      </v-list-item>
      </v-list>
</v-form>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
import MyFormCheckbox from '@/components/FormElements/MyFormCheckbox'

export default {
    name: "FileEmailAttachments",
    components:{
      MyFormCheckbox
    },       
    props:{
         value:{
            type:Object 
         }
    },
    methods:{   
        getAttachment(att){
            return{
                name:att.id,
                value:att.ischecked,
                caption:this.attachmentDisplayName(att)
            }
        },
        attachmentDisplayName: function (item) {
            this.$applog('attachmentDisplayName:'+item.displayName);
            if (item.size!='')
            {
                return item.displayName+' ('+item.size+')';
            }else{
                return item.displayName;
            }
        }
    }
}
</script>

<style scoped>

</style>
<template>
<v-form>

    <v-skeleton-loader
          :loading="loading"    
          v-show="loading"
          type="card"
        ></v-skeleton-loader>

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
    <v-row class="mx-0" >
      <MyFormInputPlain v-model="value.EmailList[0].subject"  
                    v-show="value.EmailList.length==1">
      </MyFormInputPlain>
    </v-row>
    <v-row class="mx-0" >
    <v-list>
      <v-list-item >
        <div  class="v-label emaillist">{{$t('fileemail-screen.from')}}:{{getEmailDisplayFrom(value.EmailList[0].from)}}</div>
      </v-list-item>      
      <v-list-item v-if="value.EmailList[0].to && value.EmailList[0].to.length>0">
        <div  class="v-label emaillist">{{$t('fileemail-screen.to')}}:{{getEmailDisplayList(value.EmailList[0].to)}}</div>
      </v-list-item>
      <v-list-item v-if="value.EmailList[0].cc && value.EmailList[0].cc.length>0">
        <div  class="v-label emaillist">{{$t('fileemail-screen.cc')}}:{{getEmailDisplayList(value.EmailList[0].cc)}}</div>
      </v-list-item>
    </v-list>
    </v-row>
<v-divider></v-divider>
    <v-row
        class="mx-0"
      >
    <v-list>
      <v-list-item
        v-for="(att, index) in value.EmailList[0].attachments" 
        :key="att.id"
         >
       <v-list-item-action>
            <MyFormCheckbox v-show="value.EmailList[0].attachments[index].type!='emailasattachment'"
                v-model="value.EmailList[0].attachments[index]" >
            </MyFormCheckbox>
        </v-list-item-action>
      </v-list-item>
    </v-list>
      </v-row>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-text>
     
    <MyFormHTMLViewer v-model="value.EmailList[0].htmlBody"  
      v-show="value!=null && value.EmailList.length==1" >
    </MyFormHTMLViewer>
    </v-card-text>

    <v-card-actions>
    </v-card-actions>
  </v-card>

</v-form>
</template>

<script>
//form components
import MyFormCheckbox from '@/components/FormElements/MyFormCheckbox'
import MyFormInputPlain from '@/components/FormElements/MyFormInputPlain'
import MyFormHTMLViewer from '@/components/FormElements/MyFormHTMLViewer'

export default {
  name: "FileEmailGeneral",
  components:{
      MyFormCheckbox,MyFormInputPlain,MyFormHTMLViewer
  },    
  props:{
         value:{
            type:Object
         }
  },
  data() {
      return {
        loading:true
      }
    },       
  methods:{
    getEmailDisplayFrom(value){
        var res='';
        res+=value.displayName;
        res+=" <"+value.emailAddress+">";
        return res;
    },
      getEmailDisplayList(value){
          var res='';
          for(var i=0;i<value.length;i++)
          {
            if (res!='')
              res+=';';
            res+=value[i].displayName;
          }
          return res;
      }
    },
    created(){
      this.loading=false;
    }
}
</script>

<style scoped>
.emaillist{
  max-width:800px;
  max-width:900px;
  display: inline-block;
}
</style>
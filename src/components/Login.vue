<template>
<div>
    <v-card tscomp="Login">
      <v-card-title>{{$t('login-screen.login')}}</v-card-title>
      <v-card-text>
      <v-form>
        <MyFormUrl v-model="data_url"  />
        <MyFormUserName v-model="data_username" />
        <MyFormPassword v-model="data_password"    />
        <MyFormCheckbox v-model="data_rememberme" />
      </v-form>
      </v-card-text>      
      <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn primary  x-large outlined  @click="submitForm(true)" :loading="login_loading" >
              <v-icon>mdi-check</v-icon>{{$t('login-screen.login')}}
          </v-btn>              

        </v-card-actions>
    </v-card>
    <v-alert
      v-model="alert"
      border="left"
      close-text="Close Alert"
      dark
        type="error"
    >
      {{$t('login-screen.loginfailed')}}
    </v-alert>

 </div>   
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'

import DataFactoryClass from '@/services/dataFactory'

import MyFormUrl from '@/components/FormElements/MyFormURL'
import MyFormUserName from '@/components/FormElements/MyFormUserName'
import MyFormPassword from '@/components/FormElements/MyFormPassword'
import MyFormCheckbox from '@/components/FormElements/MyFormCheckbox'

export default {
  name: "login",
  _DataFactory: [],
  components:{
        MyFormUrl,MyFormUserName,MyFormPassword,MyFormCheckbox
  },
  props:{
      trylogin:{
        type:Boolean,
        default:false,
      }, 
      loggedin:{
        type:Boolean,
        default:false,
      },
      login_loading:{
        type:Boolean,
        default:false,
      },
      showalert:{
        type:Boolean,
        default:false,
      },
      tab:{
          type:Object
      }
  },
    watch:{
      trylogin: function(newVal, oldVal) { // watch it
          this.$applog('login trylogin changed: ', newVal, ' | was: ', oldVal);
          this.tryloginCount++;
          if (this.tryloginCount<2)
          {
            this.submitForm(false);
          }
      },      
      showalert: function(newVal, oldVal) { // watch it
          this.$applog('login showalert changed: ', newVal, ' | was: ', oldVal);
          this.alert=this.showalert;
      }
  },
  data(){
      return {
          tryloginCount:0,
          dataProvider:{
            type:Object
          },
          tabs:[],
          alert:false,
          data_url:{name:'URL', caption:this.$i18n.t('login-screen.url'), value:'', required:true,httpsRequired:false},
          data_username:{name:'Username', caption:this.$i18n.t('login-screen.username'), value:''},
          data_password:{name:'Password', caption:this.$i18n.t('login-screen.password'), value:''},
          data_rememberme:{name:'RememberMe', caption:this.$i18n.t('login-screen.rememberme'), value:false}
        }
  },
  methods: {
    async submitForm(userclicked) {
      this.$applog('Login submitForm');
      this.$emit('submitForm',this.buildForm());
      if (userclicked===true)
      {
        this.tryloginCount=0;
      }
      setTimeout(() => {
               // this.login_loading=false;
              }, 4000);
    },
    buildForm(){
      return {
                url:this.data_url.value,
                username:this.data_username.value,
                password:this.data_password.value,
                rememberme:this.data_rememberme.value,
                appName:"Accelerator"
            }
    },
  },
  created(){
      this.$applog('Login Created');
      this.data_url.value=this.tab.dataurl;
      this.data_username.value=this.tab.username;
      this.data_password.value=this.tab.password;
      this.data_rememberme.value=this.tab.rememberMe;
      this.$applog('Login url:'+this.tab.dataurl);  
      this.alert=this.showalert;
      this._DataFactory=new DataFactoryClass();
      this.dataProvider=this._DataFactory.getDataService(this.tab.connectionClass,this.tab.tabName);
      //check have we already a valid connection..if not check remember me value
      this.$applog('Login checkSession:');  
      this.dataProvider.checkSession().then((response) => {
          this.$applog('login checkSession:'+response);
          if (response==true)
          {
              this.$applog('login isloggedin:');
              this.$emit('isloggedin');
          }else{
              this.$applog('Login data_rememberme:'+this.data_rememberme.value);  
              if (this.data_rememberme.value){
                this.submitForm();
              }
          }
           
        }).catch(e => {
          console.error("login fail:"+e);
        });
  }
};
</script>


<style scoped>

</style>

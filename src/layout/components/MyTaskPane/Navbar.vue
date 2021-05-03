<template>
      <v-card
        flat
        tile
        width="100%"
        class="text-center slimcard"
      >
        <v-card-text>
          <v-btn
            class="mx-2"  
            text 
            width="60px"
          >
                <div  v-if="brandingObject" @click="getSecondaryURL" class="mt-2"  @mouseover="hover = true"
                    @mouseleave="hover = false" :class="{'brandedimagehover': hover}" >
                <v-img
                    :src="brandingObject.secondaryLogo"
                    max-width="60"
                    max-height="25"
                  >
            </v-img>
          </div>
          </v-btn>
          <v-btn
            class="mx-2" text width="120px"
          >
           <a elevation="0" @click="getCoreURL()" target="_blank" class="text-center"  >
            <img  v-if="$vuetify.breakpoint.width>$extrasmall"
              src="assets/logo_alt_wide.png"
              style="text-align:center;width:80px;height:20px"
              :class="{'brandedimagehover': hover,}" />
            <img v-else 
              src="assets/icon-80.png"
              style="text-align:center;width:30px;height:30px"  
              :class="{'brandedimagehover': hover}" />
            </a>
          </v-btn>
          <v-btn
           class="mx-2" plain    width="60px"
           icon color="black lighten-2" @click="openSettings()">
              <v-icon>mdi-cog</v-icon>
          </v-btn>              
        </v-card-text>
      </v-card>

</template>

<script>
 // eslint-disable-next-line
import {applog} from '@/services/applog.js'
export default {
     name: 'Navbar',
     data(){
        return {
            hover: false,
        }
     },
     props:{
        brandingObject:{
          type:Object
        }
     },
     methods:{
        openSettings(){
            this.$applog('Navbar - openSettings:');
            this.$router.push({ name: 'startup', params: { connectioncounts:'1' } });
        },
        getCoreURL()
        {
           let __url= "https://crmtogether.com?utm_source=accelerator&utm_medium=inapp&utm_campaign=inapplink";
           try{
              this.$appContainer.OpenExternalURL(__url);
              return;
          }catch(e){
              this.$applog('Navbar - getCoreURL ERROR:'+e.message);
          }     
        },   
        getSecondaryURL()
        {
          this.$applog("getSecondaryURL");
          let __url = this.brandingObject.secondaryURL+"?utm_source=accelerator&utm_medium=inapp&utm_campaign=inapplink";
          //okay need to open in default browswe when in our outlook client
          try{
              this.$appContainer.OpenExternalURL(__url);
              return;
          }catch(e){
              this.$applog('Navbar - getCoreURL ERROR:'+e.message);
          }          
        }
     }
}
</script>

<style scoped>

.brandedimagehover{
  cursor:pointer;
}

.slimcard div{
  padding: 0px !important;
}
</style>
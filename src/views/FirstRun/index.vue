<template>
<div>
   <div class="text-center">
    <h2 class="ml-4">{{ $t('firstrun-screen.crmtogether') }}</h2>
     <h3 class="ml-4">{{ $t('firstrun-screen.accelerator') }}</h3>
     </div>
      <v-list
      subheader
      three-line
    >
    <v-list-item>
      <v-list-item-content>   
        <v-list-item-title class="headline mb-1">
          {{ $t('firstrun-screen.viewcontext') }}
        </v-list-item-title>
        <v-list-item-subtitle>
           {{ $t('firstrun-screen.viewcontextdesc') }}
        </v-list-item-subtitle>
      </v-list-item-content>

    </v-list-item>         
      <v-list-item>    
          <v-list-item-content>    
        <v-list-item-title class="headline mb-1">
           {{ $t('firstrun-screen.create') }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ $t('firstrun-screen.createdesc') }}
        </v-list-item-subtitle>   
      </v-list-item-content>

    </v-list-item>        
      <v-list-item>   
          <v-list-item-content>    
        <v-list-item-title class="headline mb-1">
             {{ $t('firstrun-screen.fileemails') }}
        </v-list-item-title>
        <v-list-item-subtitle>
            {{ $t('firstrun-screen.fileemailsdesc') }}
       </v-list-item-subtitle>                  
      </v-list-item-content>

    </v-list-item>
 </v-list>

    <div class="text-center">
            <v-btn
      dark
      color="black"
      @click="redirecToStartUp()"
    >
         {{ $t('firstrun-screen.getstarted') }}
    </v-btn>
  </div>
  
  </div>


</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;


//vue page object
export default {
  name: 'firstrun',
  methods:{
    redirecToStartUp(){
      Storage.set({ key: "firstrun", value: "Y"});
      this.$router.push({ path: '/startup' });
    }
  }
}
</script>

<style scoped>
</style>
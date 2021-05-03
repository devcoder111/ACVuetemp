<template>
 <v-list >
      <v-list-item-group color="primary" v-model="item">
        <v-list-item @click="activateTab(1)">
          <v-list-item-icon>
            <v-icon>mdi-email</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="$t('navbar.email')"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="activateTab(3)" >
          <v-list-item-icon>
            <v-icon>mdi-comment</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="$t('navbar.customfields')"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="activateTab(4)" 
        v-show="showdocstab" >
          <v-list-item-icon>
            <v-icon>mdi-file-document</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="$t('navbar.documents')"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

    <v-skeleton-loader
          :loading="loading"    
          v-show="loading"
          type="list-item@3"
        ></v-skeleton-loader>
     
      </v-list-item-group>
    </v-list>

</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'

export default {
     name: 'Navbar',
     props:{
         dataObject:{
            type:Object
         },
         showdocstab:{
           type:Boolean,
           default:false
         }
    },
    data() {
        return {
          loading:true,
          item: 0
        }
     },        
     methods:{   
         activateTab(index){
            this.$applog('Navbar activateTab-'+index);
            this.$emit('activateTab',index);
         },
     },
     created(){
        this.loading=false;
     }
}
</script>

<style>

</style>

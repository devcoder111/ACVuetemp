<template>
    <v-list dense shaped>
        
        <v-list-item-group color="primary" v-model="item">
            <v-list-item @click="activateTab(1)">
            <v-list-item-icon>
                <v-icon>mdi-format-list-text</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title v-text="$t('navbar.general')"></v-list-item-title>
            </v-list-item-content>
            </v-list-item>
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
         }
     },
     data: () => ({
       item: 0
     }),        
     methods:{
         activateTab(index){
            this.$applog('AttachDocuments Navbar activateTab-'+index);
            this.$emit('activateTab',index);
         },

     }
}
</script>

<style>

</style>

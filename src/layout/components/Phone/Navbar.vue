<template>
<v-list dense shaped>
    
      <v-list-item-group color="primary" v-model="item">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-calendar-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="$t('navbar.notes')"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

</v-list>

</template>

<script>
export default {
     name: 'Navbar',
     props:{
         dataObject:{
            type:Object
         }
     },
     data: () => ({
       item: 0
     })
}
</script>

<style>

</style>

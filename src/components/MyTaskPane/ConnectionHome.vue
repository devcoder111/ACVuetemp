<template>
  <v-card 
    class="mx-auto"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      src="https://crmtogether.com/wp-content/uploads/2015/10/hero-partners.jpg"
    >
      <v-card-title><span v-html="getTitle()"></span></v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0"></v-card-subtitle>

    <v-card-text class="text--primary">
      <div v-html="getDetails()"></div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="orange"
        text
      >
        Share
      </v-btn>

    </v-card-actions>
  </v-card>

</template>

<script>

export default {
  name: 'ConnectionHome',
  props:{
      dataObject: {
          type:Object
      }
  },
  methods:{
    getIcon(){
      return this.dataObject.icon;
    },
    getTitle(){
      return this.dataObject.title;
    },    
    getDetails(){
      return this.dataObject.details;
    },
  } 
}
</script>

<style scoped>

</style>

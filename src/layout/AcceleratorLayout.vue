<template>
  <v-app>
    <router-view/>
  </v-app>
</template>
<script>

export default {
  name: 'AcceleratorLayout',
  created(){
    console.log("AcceleratorLayout created");
   
  }

}
</script>

<style scoped>


html {
    font-size: 14px;
}
.v-input {
    font-size: 1em;
}
.v-label {
    font-size: 1em;
    height: 26px !important;
}
</style>

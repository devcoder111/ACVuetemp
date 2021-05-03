<template>
<v-container>
<div class="ScreenStructure">
  <div>
    <slot name="header"/>
  </div>
  <v-main>
    <slot name="content"/>
  </v-main>
</div>
</v-container>
</template>

<script>
//vue page object
export default {
  name: 'ScreenStructure'
}
</script>

<style scoped>
.ScreenStructure{
  width:100%;
  padding-bottom: 60px !important;
}
.el-header{
  padding: 0 0px !important;
}
</style>

<template>
  <v-app ts_comp="LayoutMyTaskPane">
    <v-main ts_comp="LayoutMyTaskPane_main">
          <slot name="header"/>
          <slot name="main"/>
    </v-main>
    <v-footer  padless app>
        <slot name="footer"/>     
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'LayoutMyTaskPane'
}
</script>

<style>

.container{
  padding:0px !important;
  max-width:768px !important;
}
html {
    font-size: 14px;
    overflow-y: hidden;
}
.v-input {
    font-size: 1em;
}
.v-label {
    font-size: 1em;
    height: 26px !important;
}

</style>

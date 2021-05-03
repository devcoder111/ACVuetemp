<template>
  <v-app ts_comp="SplashLayout">
    <v-main ts_comp="SplashLayout_main">
          <slot name="main"/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'SplashLayout'
}
</script>

<style scoped>

</style>

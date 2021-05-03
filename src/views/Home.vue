<template>
  <div class="home">
    <img alt="CRM Together logo" width="200px" src="img/logo-wide-trans - pen.png">
    <HelloWorld msg="Welcome to the CRM Together Vue App"/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    
  }
}

</script>

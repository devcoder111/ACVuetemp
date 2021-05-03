<template>
  <component v-bind:is="layout"></component>
</template>
<script>
import AcceleratorLayout from "./layout/AcceleratorLayout";

export default {
  name: "app",
  computed: {
    layout() {
      return this.$store.getters.layout;
    },
  },
  components: {
    "accelerator-layout": AcceleratorLayout,
  },
  methods: {
    setLayout(layout) {
      this.$store.commit("SET_LAYOUT", layout);
    },
  },
};
</script>

<style>
.fieldCaption {
  font-weight: bold;
}
/*fix for selects cutting off text 
https://github.com/vuetifyjs/vuetify/issues/9576
PROBLEM IS THAT ON A LARGE FONT WE STILL HAVE THE ISSUE
*/
.v-select__selection--comma {
  overflow: unset;
}

.v-list-item__title,
.v-list-item__subtitle {
  overflow: unset;
}
.v-select__selections {
  line-height: 30px;
}
</style>

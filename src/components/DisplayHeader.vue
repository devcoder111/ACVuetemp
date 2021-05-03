<template>
  <div
    ts_comp="DisplayHeader"
    class="mx-auto"
    tile
    :style="getDisplayHeaderStyle()"
  >
    <v-skeleton-loader
      :loading="loading"
      v-show="loading"
      type="list-item-avatar, list-item-two-line"
    ></v-skeleton-loader>

    <v-row align="end">
      <v-col align-self="center" class="child-flex" cols="2">
        <v-avatar
          v-show="!loading"
          class="profile"
          :size="getAvatarSize()"
          tile
        >
          <v-icon
            :size="getSize()"
            :color="dataObject.screenMetadata.tilecolor"
            >{{ dataObject.screenMetadata.entityIcon }}</v-icon
          >
        </v-avatar>
      </v-col>
      <v-col align-self="start" class="pa-0" cols="9" color="info">
        <v-list-item v-show="!loading" color="rgba(0, 0, 0, .4)">
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ dataObject.screenMetadata.entityName }}</v-list-item-title
            >
            <v-list-item-subtitle>
              {{ dataObject.screenMetadata.entityName2 }}</v-list-item-subtitle
            >
            <v-list-item-subtitle>
              {{ dataObject.screenMetadata.entityName3 }}</v-list-item-subtitle
            >
            <v-list-item-subtitle>{{
              dataObject.screenMetadata.activitydataText1
            }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{
              dataObject.screenMetadata.activitydataText2
            }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{
              dataObject.screenMetadata.activitydataText3
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col align-self="center" class="pa-0" cols="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              v-show="!loading"
              size="30"
              @click="toggleBookmark()"
              @mouseover="hover = true"
              @mouseleave="hover = false"
              :class="{ bookmarkimagehover: hover }"
              :color="getBookmarkIconColor()"
              >{{ getBookmarkIcon() }}</v-icon
            >
          </template>
          <span>{{ getBookmarkText() }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "DisplayHeader",
  data() {
    return {
      hover: false,
    };
  },
  props: {
    dataObject: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    getDisplayHeaderStyle() {
      return (
        "background-color : " +
        window.vueAppInstance.$vuetify.theme.themes["light"].displayheader
      );
    },
    getAvatarSize() {
      if (this.$vuetify.breakpoint.width > this.$extrasmall) {
        return 120;
      } else {
        return 30;
      }
    },
    getSize() {
      if (this.$vuetify.breakpoint.width > this.$extrasmall) {
        return 90;
      } else {
        return 45;
      }
    },
    toggleBookmark() {
      this.$emit("toggleBookmark");
      this.dataObject.screenMetadata.isbookmarked = !this.dataObject
        .screenMetadata.isbookmarked;
    },
    getBookmarkText() {
      if (this.dataObject.screenMetadata.isbookmarked)
        return this.$i18n.t("taskpane-screen.removebookmark");
      return this.$i18n.t("taskpane-screen.addbookmark");
    },
    getBookmarkIcon() {
      if (this.dataObject.screenMetadata.isbookmarked)
        return "mdi-bookmark-check-outline";
      return "mdi-bookmark-plus-outline";
    },
    getBookmarkIconColor() {
      if (this.dataObject.screenMetadata.isbookmarked) return "green";
      return "black";
    },
  },
};
</script>

<style scoped>
.bookmarkimagehover {
  cursor: pointer;
}

.row {
  margin: 0px !important;
}
</style>

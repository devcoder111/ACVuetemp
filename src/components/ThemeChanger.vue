<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn large icon dark v-on="on">
        <v-icon size="30" color="primary">mdi-palette</v-icon>
      </v-btn>
    </template>
    <v-card>
      <!--
            removed for now
      <v-list-item>
        <v-list-item-content
          ><v-list-item-title class="font-weight-bold">
            Dark Mode</v-list-item-title
          >
        </v-list-item-content>
        <v-list-item-action
          ><v-switch v-model="$vuetify.theme.dark" />
        </v-list-item-action>
      </v-list-item>
      -->
      <v-divider />
      <v-card-text>
        <v-card
          class="my-2"
          :disabled="$vuetify.theme.themes.name === theme.name"
          @click="setTheme(theme)"
          hover
          outlined
          v-for="(theme, index) in themes"
          :key="index"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ theme.name }}</v-list-item-title
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-avatar
                color="success"
                size="30"
                v-if="$vuetify.theme.themes.name === theme.name"
              >
                <v-icon>mdi-check</v-icon>
              </v-avatar>
            </v-list-item-action>
          </v-list-item>
          <!--
          <div class="my-2">
            <v-chip
              class="mx-1"
              label
              :color="theme.dark[key]"
              v-for="(key, index) in Object.keys(theme.dark)"
              :key="index"
            >
              {{ key }}</v-chip
            >
          </div>
          -->
          <div class="my-2">
            <span v-for="(key, index) in Object.keys(theme.light)" :key="index">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    class="mx-1"
                    label
                    :color="theme.light[key]"
                    v-bind="attrs"
                    v-on="on"
                  >
                  </v-chip>
                </template>
                <span>{{ key }}</span>
              </v-tooltip>
            </span>

            <!-- <v-chip
              class="mx-1"
              label
              :color="theme.light[key]"
              v-for="(key, index) in Object.keys(theme.light)"
              :key="index"
            >
              {{ key }}</v-chip
            > -->
          </div>
        </v-card>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="menu = false" color="grey">Close</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<!-- code from https://github.com/eyuelberga/vuetify-dynamic-theme/tree/master/src -->

<script>
import ThemeFactoryClass from "@/services/themefactory";

export default {
  name: "ThemeChanger",
  data: () => ({
    menu: false,
    themes: new ThemeFactoryClass().themes,
  }),
  methods: {
    setTheme(theme) {
      // close menu
      this.menu = false;
      const name = theme.name;
      const dark = theme.dark;
      const light = theme.light;
      // set themes
      Object.keys(dark).forEach((i) => {
        this.$vuetify.theme.themes.dark[i] = dark[i];
      });
      Object.keys(light).forEach((i) => {
        this.$vuetify.theme.themes.light[i] = light[i];
      });
      // also save theme name to disable selection
      this.$vuetify.theme.themes.name = name;
      window.vueAppInstance.$localStorage.set("apptheme", name);
    },
  },
};
</script>
<style scoped></style>

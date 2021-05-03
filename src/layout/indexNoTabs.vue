<template>
<v-app ts_comp="defaultLayoutNoTabs">
  <v-app-bar app color="primary" dark>
    <!-- -->
     <slot name="header"/>
  </v-app-bar>
  <!-- Sizes your content based upon application components -->
  <v-main>
    <!-- Provides the application the proper gutter -->
  <v-container  >
    <v-row >
       <v-col cols="24"
      >
    <slot name="main"/>

      </v-col>
    </v-row>
  </v-container>

  </v-main>

  <v-footer app>
    <!-- -->  
        <slot name="footer"/>
  </v-footer>
</v-app>
</template>

<script>

import ThemeFactoryClass from '@/services/themefactory'

export default {
  name: 'LayoutNoTabs',
  methods:{
      setTheme(theme) {
        // close menu
        this.menu = false;
        const name = theme.name;
        const dark = theme.dark;
        const light = theme.light;
        // set themes
        Object.keys(dark).forEach(i => {
          this.$vuetify.theme.themes.dark[i] = dark[i];
        });
        Object.keys(light).forEach(i => {
          this.$vuetify.theme.themes.light[i] = light[i];
        });
        // also save theme name to disable selection
        this.$vuetify.theme.themes.name = name;
        window.vueAppInstance.$localStorage.set('apptheme',name);
      }       
  },
  created(){      
    this.$applog('LayoutNoTabs created:');
    if (window.vueAppInstance.$localStorage.get('appfontSize')!=null)
    {
      this.fontsize=window.vueAppInstance.$localStorage.get('appfontSize');
      this.$applog('SystemContainer appfontSize set:'+this.fontsize);
    }
    if (window.vueAppInstance.$localStorage.get('apptheme')!=null)      
    {
      this.$vuetify.theme.themes.name=window.vueAppInstance.$localStorage.get('apptheme');
      this.$applog('SystemContainer theme set:'+this.$vuetify.theme.themes.name);
      let themes=(new ThemeFactoryClass()).themes;
      //get the theme
      for(var ii=0;ii<themes.length;ii++)
      {
        let themeObj=themes[ii];
        if (themeObj.name==this.$vuetify.theme.themes.name)
        {
          this.setTheme(themeObj);
        }
      }
    }
  }
}
</script>

<style>
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

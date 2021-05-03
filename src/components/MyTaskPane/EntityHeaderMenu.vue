<template>
  <v-toolbar
    dense
    id="EntityHeaderMenu"
    class="EntityHeaderMenu"
    :color="getColour()"
    flat
    dark
  >
    <v-btn
      icon
      id="EntityHeaderMenu_Home"
      v-on:click="showHome()"
      v-show="
        instanceSettings.screenMetadata.hasHome == true && searchMode == false
      "
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">
            mdi-home
          </v-icon>
        </template>
        <span>{{ $t("taskpane-screen.Home") }}</span>
      </v-tooltip>
    </v-btn>
    <v-btn
      icon
      id="EntityHeaderMenu_CloseSearch"
      v-on:click="closeSearch()"
      v-show="searchMode == true"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-btn
      icon
      id="EntityHeaderMenu_ShowSearch"
      v-on:click="showSearch()"
      v-show="
        instanceSettings.screenMetadata.hasSearch == true && searchMode == false
      "
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">
            {{ getSearchFilterIcon() }}
          </v-icon>
        </template>
        <span>{{ getSearchFilterText() }}</span>
      </v-tooltip>
    </v-btn>

    <v-spacer></v-spacer>
    <v-btn
      v-if="$vuetify.breakpoint.width > $extrasmall"
      class="ma-2"
      color="primary"
      depressed
      v-on:click="fileEmail()"
      v-show="showFileEmail()"
      id="EntityHeaderMenu_FileEmail"
    >
      <v-icon left>
        mdi-email-plus
      </v-icon>
      {{ $t("taskpane-screen.FileEmail") }}
    </v-btn>
    <v-btn
      v-else
      class="ma-2"
      :class="tinyscreen() && cttinybutton"
      color="primary"
      depressed
      v-on:click="fileEmail()"
      v-show="showFileEmail()"
      id="EntityHeaderMenu_FileEmail2"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon dark v-bind="attrs" v-on="on">
            mdi-email-plus
          </v-icon>
        </template>
        <span>{{ $t("taskpane-screen.FileEmail") }}</span>
      </v-tooltip>
    </v-btn>

    <v-btn
      v-if="$vuetify.breakpoint.width > $small"
      class="ma-2"
      color="primary"
      depressed
      v-on:click="LogCall()"
      v-show="showLogCall()"
      id="EntityHeaderMenu_LogCall"
    >
      <v-icon left>
        mdi-phone-plus
      </v-icon>
      {{ $t("taskpane-screen.LogCall") }}
    </v-btn>
    <v-btn
      v-else
      color="primary"
      :class="tinyscreen() && cttinybutton"
      depressed
      v-on:click="LogCall()"
      v-show="showLogCall()"
      id="EntityHeaderMenu_LogCall2"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon dark v-bind="attrs" v-on="on">
            mdi-phone-plus
          </v-icon>
        </template>
        <span>{{ $t("taskpane-screen.LogCall") }}</span>
      </v-tooltip>
    </v-btn>

    <v-menu
      offset-y
      icon
      v-show="
        instanceSettings.screenMetadata.newEntities.length > 0 &&
          searchMode == false
      "
      id="EntityHeaderMenu_New"
      color="accent"
      left
    >
      <template v-slot:activator="{ on: onMenu }">
        <v-btn icon dark>
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-icon v-on="{ ...onMenu, ...tooltip }">mdi-plus </v-icon>
            </template>
            <span>{{ $t("taskpane-screen.NewEntity") }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-list>
        <DialogButton
          v-for="item in instanceSettings.screenMetadata.newEntities"
          :key="item.name"
          :item="item"
          @click.native="openNewDialog(item.name)"
        >
        </DialogButton>
      </v-list>
    </v-menu>

    <div
      v-show="
        instanceSettings.screenMetadata.hasNew == true &&
          viewEntityMode == true &&
          searchMode == false &&
          homeMode == false
      "
    >
      <v-menu offset-y icon id="EntityHeaderMenu_Options1" color="accent" left>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-btn icon dark>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  mdi-dots-vertical
                </v-icon>
              </template>
              <span>{{ $t("taskpane-screen.Options") }}</span>
            </v-tooltip>
          </v-btn>
        </template>
        <v-list>
          <DialogButton
            v-for="item in instanceSettings.screenMetadata.options"
            :key="item.name"
            :item="item"
            @click.native="executeOption(item)"
          >
          </DialogButton>
        </v-list>
      </v-menu>
    </div>

    <!--option 2 wrapper div is to fix v-menu show not working-->
    <div
      v-show="
        instanceSettings.screenMetadata.hasOptions == true && searchMode == true
      "
    >
      <v-menu offset-y icon id="EntityHeaderMenu_Options2" color="accent" left>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <v-icon>
                  mdi-dots-vertical
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("taskpane-screen.Options") }}</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item
            v-show="instanceSettings.screenMetadata.hasBookmarks == true"
          >
            <v-list-item-action>
              <v-btn
                class="my-2"
                text
                tile
                large
                @click="
                  openOptions2Menu = false;
                  getBookmarks();
                "
              >
                <v-icon color="blue" left>mdi-bookmark</v-icon>
                {{ $t("taskpane-screen.Bookmarks") }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item
            v-show="instanceSettings.screenMetadata.hasHistory == true"
          >
            <v-list-item-action>
              <v-btn
                class="my-2"
                text
                tile
                large
                @click="
                  openOptions2Menu = false;
                  getHistory();
                "
              >
                <v-icon color="green" left>mdi-clock</v-icon>
                {{ $t("taskpane-screen.History") }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item
            v-show="
              showParseEmail() &&
                instanceSettings.screenMetadata.hasParseEmail == true
            "
          >
            <v-list-item-action>
              <v-btn
                class="my-2"
                text
                tile
                large
                @click="
                  openOptions2Menu = false;
                  parseEmail();
                "
              >
                <v-icon color="purple" left>mdi-email</v-icon>
                {{ $t("taskpane-screen.ParseEmail") }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-list-item v-if="this.$route.params.container != 'inspector'">
            <v-list-item-action>
              <v-btn
                class="my-2"
                text
                tile
                large
                @click="
                  openOptions2Menu = false;
                  logout();
                "
              >
                <v-icon color="purple" left>mdi-logout </v-icon>
                {{ $t("taskpane-screen.logout") }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
import DialogButton from "@/components/MyTaskPane/DialogButton";

export default {
  name: "EntityHeaderMenu",
  components: {
    DialogButton,
  },
  props: {
    hasTag: {
      type: Boolean,
      default: false,
    },
    instanceSettings: {
      type: Object,
    },
    propSearchMode: {
      type: Boolean,
      default: false,
    },
    propHomeMode: {
      type: Boolean,
      default: true,
    },
    tab: {
      type: Object,
    },
    propViewEntityMode: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    propSearchMode: function(newVal, oldVal) {
      // watch it
      this.$applog(
        "EntityHeaderMenu Prop propSearchMode changed: ",
        newVal,
        " | was: ",
        oldVal
      );
      this.searchMode = newVal;
    },
    propHomeMode: function(newVal, oldVal) {
      // watch it
      this.$applog(
        "EntityHeaderMenu Prop propHomeMode changed: ",
        newVal,
        " | was: ",
        oldVal
      );
      this.homeMode = newVal;
    },
    propViewEntityMode: function(newVal, oldVal) {
      // watch it
      this.$applog(
        "EntityHeaderMenu Prop propViewEntityMode changed: ",
        newVal,
        " | was: ",
        oldVal
      );
      this.viewEntityMode = newVal;
    },
  },
  data() {
    return {
      cttinybutton:'cttinybutton',
      searchMode: false,
      homeMode: true,
      viewEntityMode: false,
      propSearchModeDialog: false,
    };
  },
  methods: {
    tinyscreen(){
      // eslint-disable-next-line
      return (window.vueAppInstance.$vuetify.breakpoint.width < (this.$extrasmall-50));
    },
    getSearchFilterIcon() {
      let res = "mdi-magnify";
      if (this.searchMode) res = "mdi-filter";
      return res;
    },
    getSearchFilterText() {
      let res = this.$i18n.t("taskpane-screen.Search");
      if (this.searchMode) res = this.$i18n.t("taskpane-screen.Filter");
      return res;
    },
    logout() {
      this.$emit("executeOption", "logout");
    },
    showParseEmail() {
      let res = true;
      if (this.$route.params.container == "inspector") res = false;
      return res;
    },
    showLogCall() {
      let res =
        this.instanceSettings.screenMetadata.hasLogCall == true &&
        this.searchMode == false;
      if (this.$route.params.container == "inspector") res = false;
      return res;
    },
    LogCall() {
      this.$applog("EntityHeaderMenu.vue LogCall()");
      this.$emit("LogCall");
    },
    showFileEmail() {
      let res =
        this.instanceSettings.screenMetadata.hasFileEmail == true &&
        this.searchMode == false;
      if (this.$route.params.container == "inspector") res = false;
      return res;
    },
    getColour() {
      let _tagindex = 3;
      let _defaultColour = "secondary";

      //assumption..focus is first!!!
      if (this.instanceSettings.screenMetadata.options.length > 0) {
        if (this.instanceSettings.screenMetadata.options[0].value)
          _defaultColour = "blue";
        else if (this.instanceSettings.screenMetadata.options[_tagindex].value)
          _defaultColour = "yellow";
      }
      return _defaultColour;
    },

    getHistory() {
      this.$applog("EntityHeaderMenu - getHistory:");
      this.$emit("getHistory");
    },
    getBookmarks() {
      this.$applog("EntityHeaderMenu - getBookmarks:");
      this.$emit("getBookmarks");
    },
    openNewDialog(_entity) {
      this.$applog("EntityHeaderMenu - openNewDialog:" + _entity);
      this.$emit("openNewDialog", _entity);
    },
    executeOption(_item) {
      this.$applog("EntityHeaderMenu - executeOption:" + JSON.stringify(_item));
      this.openOptions1Menu = false;
      this.$emit("executeOption", _item);
    },
    showHome() {
      this.$applog("EntityHeaderMenu.vue showHome()");
      this.homeMode = true;
      this.viewEntityMode = false;
      this.$emit("showHome");
    },
    fileEmail() {
      this.$applog("EntityHeaderMenu.vue fileEmail()");
      this.$emit("fileEmail");
    },
    parseEmail() {
      this.$applog("EntityHeaderMenu.vue parseEmail()");
      this.$emit("parseEmail");
    },
    showSearch() {
      this.$applog("EntityHeaderMenu.vue showSearch()");
      if (this.searchMode) {
        this.propSearchModeDialog = true;
      }
      this.searchMode = true;
      this.viewEntityMode = false;
      this.$emit("showSearch");
    },
    closeSearch() {
      this.$applog("EntityHeaderMenu.vue closeSearch()");
      this.searchMode = false;
      this.propSearchModeDialog = false;
      this.$emit("closeSearch");
    },
  },
  created() {
    console.log("WIDTH:" + this.$vuetify.breakpoint.width);
  },
};
</script>

<style scoped>
.EntityHeaderMenu {
  max-width: 100%;
}

.cttinybutton{
  min-width: unset !important;
}
</style>

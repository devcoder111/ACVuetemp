<template>
  <EntityViewer>
    <template v-slot:entityviewerheader>
      <DisplayHeader
        :dataObject="entityDataObject"
        @toggleBookmark="toggleBookmark"
        :loading="loading"
      >
      </DisplayHeader>
    </template>

    <template v-slot:entityviewercontent>
      <div>
        <v-tabs
          show-arrows
          ts_comp="Tabs_ViewEntity"
          v-model="activeTabName"
          class=""
          :centered="false"
          :grow="true"
          :vertical="false"
          :right="false"
          :left="true"
          :icons-and-text="false"
          @change="selectTab"
        >
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab
            :ts_comp="'Tabs_ViewEntity' + tab.tabName"
            v-for="tab in entityDataObject.screenMetadata.tabs"
            :key="tab.tabName"
            :href="`#tabview-${tab.tabName}`"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ getTabIcon(tab) }}
                </v-icon>
              </template>
              <span>{{ tab.tabCaption }}</span>
            </v-tooltip>
          </v-tab>

          <v-tab-item
            tscomp="mytaskpane_viewentitytabbar"
            class="mytaskpane_viewentitytabbar"
            v-for="tab in entityDataObject.screenMetadata.tabs"
            :key="tab.tabName"
            :value="`tabview-${tab.tabName}`"
          >
            <component
              :is="tab.component"
              :entityDataObject="entityDataObject"
              :tabDataObject="tabDataObject"
              :activeTabName="activeTabName"
              @selectEntity="selectEntity"
              :loading="tabloading"
              @linkSearch="linkSearch"
              @applyListFilter="applyListFilter"
              @timeline="timeline"
              @selectRowExternalLink="selectRowExternalLink"
              class="tab-component"
            ></component>
          </v-tab-item>
        </v-tabs>
      </div>
    </template>
  </EntityViewer>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//vue
import EntityViewer from "@/layout/components/MyTaskPane/EntityViewer";

import DisplayHeader from "@/components/DisplayHeader";
import EntityViewX from "@/components/MyTaskPane/EntityViewX";
import EntityListX from "@/components/MyTaskPane/EntityListX";
import EntityViewFrame from "@/components/MyTaskPane/EntityViewFrame";
import EntityTimeLineX from "@/components/MyTaskPane/EntityTimeLineX";
import EntityReportX from "@/components/MyTaskPane/EntityReportX";

//vue page object
export default {
  name: "ViewEntity",
  components: {
    EntityViewer,
    DisplayHeader,
    EntityViewX,
    EntityListX,
    EntityViewFrame,
    EntityTimeLineX,
    EntityReportX,
  },
  props: {
    tabloading: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    entityDataObject: {
      type: Object,
    },
    tabDataObject: {
      type: Object,
    },
  },
  watch: {
    entityDataObject: function(newVal, oldVal) {
      // watch it
      this.$applog(
        "Prop entityDataObject changed: ",
        newVal,
        " | was: ",
        oldVal
      );
      this.$applog(JSON.stringify(newVal));
      if (newVal.screenMetadata.tabs.length > 0) {
        this.activeTabName = newVal.screenMetadata.tabs[0].tabName;
      }
    },
  },
  data() {
    return {
      activeTabName: "",
    };
  },
  methods: {
    timeline() {
      this.$emit("timeline");
    },
    applyListFilter(filters) {
      this.$applog("ViewEntity applyListFilter:" + JSON.stringify(filters));
      this.$emit("applyListFilter", filters);
    },
    toggleBookmark() {
      this.$emit("toggleBookmark");
    },
    linkSearch(section) {
      this.$emit("linkSearch", section);
    },
    selectTab(index) {
      this.$applog("ViewEntity selectTab:" + index);
      this.activeTabName = index;
      this.$emit("ViewEntitySelectTab", index);
    },
    selectEntity(entity, obj) {
      this.$applog("ViewEntity selectEntity:" + JSON.stringify(obj));
      this.activeTabName = this.activeTab;
      this.$emit("selectEntity", entity, obj);
    },
    selectRowExternalLink(url) {
      this.$applog("ViewEntity selectRowExternalLink:" + url);
      this.$emit("selectRowExternalLink", url);
    },
    getTabIcon(tab) {
      return tab.tabIcon;
    },
    getTabTip(tab) {
      return tab.tabCaption;
    },
  },
};
</script>

<style scoped>
.mytaskpane_viewentitytabbar {
  overflow: auto;
}
</style>

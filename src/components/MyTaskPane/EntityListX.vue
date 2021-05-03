<template>
  <div tscomp="EntityListX" class="EntityListXClass">
    <v-skeleton-loader
      type="table-heading, table-thead, table-row@3"
      :loading="loading"
      v-show="loading"
    ></v-skeleton-loader>

    <v-card>
      <v-card-text
        class="customfilterarea"
        v-if="
          tabDataObject &&
            tabDataObject.screenMetadata &&
            tabDataObject.screenMetadata.filterscreen &&
            tabDataObject.screenMetadata.filterscreen.formElements &&
            tabDataObject.screenMetadata.filterscreen.formElements.length > 0
        "
      >
        <component
          v-for="(formItem, idx) in tabDataObject.screenMetadata.filterscreen
            .formElements"
          :key="idx"
          :ref="formItem.name"
          :is="formItem.componentType"
          :autofocus="idx == 0"
          v-model="tabDataObject.screenMetadata.filterscreen.formElements[idx]"
          :formElements="tabDataObject.screenMetadata.filterscreen.formElements"
        >
        </component>
        <v-btn icon color="primary" @click="applyListFilter()">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </v-card-text>
      <!-- {{ tabDataObject.data.tableData }} -->
      <v-data-table
        v-if="
          tabDataObject && tabDataObject.data && tabDataObject.data.tableData
        "
        :headers="getHeaders()"
        :items="tabDataObject.data.tableData"
        item-key="entityid"
        class=""
        :loading="loading"
        loading-text=""
        :show-expand="showExpandOption()"
        :single-expand="singleExpand"
        :expanded="expanded"
        :items-per-page="itemsPerPage"
        mobile-breakpoint="0"
        hide-default-footer
        :locale="this.$i18n.locale"
        :footer-props="{
          'items-per-page-text': this.$i18n.t('common.rowsperpage'),
        }"
      >
      <!--
        Temporarily commented out for a release
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{ tabDataObject.data.title }}</v-toolbar-title>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="ml-8 primary"
                  v-if="tabDataObject.data.title == 'Opportunity List'"
                  @click="timelineView"
                  ><v-icon size="20">mdi-timeline</v-icon></v-btn
                >
              </template>
              <span>{{ $t("taskpane-screen.timelinelist") }}</span>
            </v-tooltip>

            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
-->
        <template v-slot:[`header.__Select__`]="{ header }">
          {{ header.text.toUpperCase() }}
        </template>

        <template v-slot:[`item.__Select__`]="{ item }">
          <v-btn small @click="selectRow(item)" :color="item.color" icon>
            <v-icon> {{ item.icon }}</v-icon>
          </v-btn>
          <v-btn
            v-if="item.externallink && item.externallink.url != ''"
            small
            @click="selectRowExternalLink(item)"
            :color="item.color"
            icon
          >
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td colspan="4" v-html="getExpandedMarkup(headers, item)"></td>
        </template>
      </v-data-table>
    </v-card>
    <!-- <v-dialog
      class="timeline-dialog"
      v-model="timelineDialog"
      max-width="600"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      persistent
      scrollable
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title class="headline primary white--text">
          TimeLine
          
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
            <v-timeline-item
              v-for="(item, i) in items"
              :key="i"
              :color="item.color"
              :icon="item.icon"
              fill-dot
            >
              <v-card :color="item.color" dark>
                <v-card-title class="title">
                  Lorem Ipsum Dolor
                </v-card-title>
                <v-card-text class="white text--primary">
                  <p>
                    Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
                    scaevola imperdiet nec ut, sed euismod convenire principes
                    at. Est et nobis iisque percipit, an vim zril disputando
                    voluptatibus, vix an salutandi sententiae.
                  </p>
                  <v-btn :color="item.color" class="mx-0" outlined>
                    Button
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

         
          <v-btn
            tile
            large
            outlined
            class="ma-2"
            color="red"
            @click="timelineDialog = false"
          >
            <v-icon>mdi-close</v-icon>{{ $t("common.close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//note: i had to structure this component with
//v-if="tabDataObject.linked==true"
//as v-show was not working in el-table-column

//form components
import MyFormInput from "@/components/FormElements/MyFormInput";
import MyFormSelect from "@/components/FormElements/MyFormSelect";
import MyFormCheckbox from "@/components/FormElements/MyFormCheckbox";
import MyFormDate from "@/components/FormElements/MyFormDate";
import MyFormDateTime from "@/components/FormElements/MyFormDateTime";
import MyFormNumber from "@/components/FormElements/MyFormNumber";
import MyFormRadioGroup from "@/components/FormElements/MyFormRadioGroup";
import MyFormRemoteLookup from "@/components/FormElements/MyFormRemoteLookup";
import MyFormSelectMultiple from "@/components/FormElements/MyFormSelectMultiple";
import MyFormSwitch from "@/components/FormElements/MyFormSwitch";
import MyFormTextArea from "@/components/FormElements/MyFormTextArea";
import MyFormTime from "@/components/FormElements/MyFormTime";
import MyFormCurrency from "@/components/FormElements/MyFormCurrency";
import MyFormURL from "@/components/FormElements/MyFormURL";
import MyFormDivider from "@/components/FormElements/MyFormDivider";
import MyFormPhone from "@/components/FormElements/MyFormPhone";
import MyFormEmail from "@/components/FormElements/MyFormEmail";
import MyFormLabelOnly from "@/components/FormElements/MyFormLabelOnly";

export default {
  name: "EntityListX",
  components: {
    MyFormInput,
    MyFormSelect,
    MyFormCheckbox,
    MyFormDate,
    MyFormDateTime,
    MyFormNumber,
    MyFormRadioGroup,
    MyFormRemoteLookup,
    MyFormSelectMultiple,
    MyFormSwitch,
    MyFormTextArea,
    MyFormTime,
    MyFormCurrency,
    MyFormURL,
    MyFormDivider,
    MyFormPhone,
    MyFormEmail,
    MyFormLabelOnly,
  },
  data() {
    return {
      expanded: [],
      singleExpand: true,
      itemsPerPage: 20,
      timelineDialog: false,
      items: [
        {
          color: "red lighten-2",
          icon: "mdi-star",
        },
        {
          color: "purple darken-1",
          icon: "mdi-book-variant",
        },
        {
          color: "green lighten-1",
          icon: "mdi-airballoon",
        },
        {
          color: "indigo",
          icon: "mdi-buffer",
        },
      ],
    };
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    entityDataObject: {
      type: Object,
    },
    tabDataObject: {
      type: Object,
    },
    activeTabName: {
      type: String,
    },
  },
  methods: {
    timelineView() {
      // this.popupCenter({ url: "timeline", title: "Timeline", w: 400, h: 300 });
      this.$emit("timeline", "aaa");
    },
    applyListFilter() {
      this.$applog("EntityListX applyListFilter:");
      this.$emit(
        "applyListFilter",
        this.tabDataObject.screenMetadata.filterscreen.formElements
      );
    },
    showExpandOption() {
      if (this.tabDataObject.data.tableColumns) {
        if (this.tabDataObject.data.tableColumns.length < 4) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    getExpandedMarkup(headers, item) {
      let res = "";
      for (var rr = 3; rr < this.tabDataObject.data.tableColumns.length; rr++) {
        res +=
          '<span _from="EntityViewX" class="fieldCaption">' +
          this.tabDataObject.data.tableColumns[rr].text +
          ":</span><br><p>" +
          item[this.tabDataObject.data.tableColumns[rr].value] +
          "</p>";
      }
      return res;
    },
    getHeaders() {
      //only show first 3 items
      var res = [];
      let cols = 3;
      if (this.tabDataObject.data.tableColumns.length < 3)
        cols = this.tabDataObject.data.tableColumns.length;
      for (var rr = 0; rr < cols; rr++) {
        res.push(this.tabDataObject.data.tableColumns[rr]);
      }
      return res;
    },
    selectRow(item) {
      this.$applog(
        "EntityListX selectRow:" + item.entity + "=" + item.entityid
      );
      this.$emit("selectEntity", item.entity, item);
    },
    selectRowExternalLink(item) {
      this.$applog(
        "EntityListX selectRowExternalLink:" + item.externallink.url
      );
      this.$emit("selectRowExternalLink", item.externallink.url);
    },
  },
  created() {
    this.$applog("EntityListX created");
  },
};
</script>

<style scoped>
.EntityListXClass {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 340px) !important;
  min-height: calc(100vh - 340px) !important;
}
.customfilterarea {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  letter-spacing: 0.0125em;
  line-height: 2rem;
  word-break: break-all;
  padding-bottom: 0px;
}
</style>

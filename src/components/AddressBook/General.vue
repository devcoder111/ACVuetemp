<template>
  <v-form>
    <v-text-field
      ref="searchbox"
      v-model="search"
      prepend-icon="mdi-magnify"
      :label="$t('addressbook-screen.inputsearch')"
      single-line
      hide-details
      autofocus
      @input="change"
    ></v-text-field>

    <v-skeleton-loader
      type="table-heading, table-thead, table-row@3"
      :loading="tableloading"
      v-show="tableloading"
    ></v-skeleton-loader>
    <v-data-table
      :headers="dataObject.data.tableColumns"
      :items="dataObject.data.tableData"
      item-key="name"
      class="elevation-1"
      loading="data_loading"
      loading-text=""
      mobile-breakpoint="0"
      :search="search"
      :items-per-page="5"
      :locale="this.$i18n.locale"
      :footer-props="tablefooterprops"
    >
      <template v-slot:[`header.__Select__`]="{ header }">
        {{ header.text.toUpperCase() }}
      </template>

      <template slot="item" slot-scope="items">
        <tr class="selectablerow" @click="selectRow(items.item)">
          <td
            v-for="itemcol in dataObject.data.tableColumns"
            :key="itemcol.value"
          >
            {{ items.item[itemcol.value] }}
          </td>
        </tr>
      </template>

      <!--
    <template v-slot:[`item.__Select__`]="{ item }">
      <v-btn small
      @click="selectRow(item)"
      :color="item.tilecolor"
      icon
        >
       <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    -->
    </v-data-table>

    <v-textarea
      name="input-2-1"
      :label="getLabelTo()"
      :value="this.toList"
      hint=""
      :row-height="rowHeight"
      :rows="rows"
      @focus="this.toFocus"
    ></v-textarea>
    <v-textarea
      name="input-2-1"
      :label="getLabelCC()"
      :value="this.ccList"
      hint=""
      :row-height="rowHeight"
      :rows="rows"
      v-show="showCC()"
      @focus="this.ccFocus"
    ></v-textarea>
    <v-textarea
      name="input-2-1"
      class="mb-14"
      :label="getLabelBCC()"
      :value="this.bccList"
      hint=""
      :row-height="rowHeight"
      :rows="rows"
      @focus="this.bccFocus"
      v-show="showBCC()"
    ></v-textarea>
  </v-form>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export default {
  name: "General",
  data() {
    return {
      search: "",
      awaitingSearch: false,
      toList: [],
      ccList: [],
      bccList: [],
      rowHeight: 24,
      rows: 1,
      activeList: null,
      activeListIndex: 0,
      tablefooterprops: {
        "items-per-page-text": "",
        "disable-items-per-page": true,
      },
    };
  },
  props: {
    tableloading: {
      type: Boolean,
      default: false,
    },
    dataProvider: {
      type: Object,
    },
    dataObject: {
      type: Object,
    },
  },
  methods: {
    setFocus() {
      if (this.$refs.searchbox) this.$refs.searchbox.focus();
    },
    showCC() {
      let res = true;
      if (this.$route.params.containercontext == "task") res = false;
      return res;
    },
    showBCC() {
      let res = true;
      if (
        this.$route.params.containercontext == "task" ||
        this.$route.params.containercontext == "appointment"
      )
        res = false;
      return res;
    },
    getLabelTo() {
      let res = this.$i18n.t("addressbook-screen.to"); //email and task have TO
      if (this.$route.params.containercontext == "appointment")
        res = this.$i18n.t("addressbook-screen.required");
      return res;
    },
    getLabelCC() {
      let res = this.$i18n.t("addressbook-screen.cc");
      if (this.$route.params.containercontext == "appointment")
        res = this.$i18n.t("addressbook-screen.optional");
      return res;
    },
    getLabelBCC() {
      let res = this.$i18n.t("addressbook-screen.bcc");
      if (this.$route.params.containercontext == "appointment")
        res = this.$i18n.t("addressbook-screen.resource");
      return res;
    },
    change() {
      this.$applog("addressbook general change:" + this.search);
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.$emit("change", this.search);
          this.awaitingSearch = false;
        }, 1500); // 1.5 sec delay
      }
      this.awaitingSearch = true;
    },
    focusInput() {
      this.$refs.searchbox.$el.focus();
    },
    toFocus() {
      this.activeListIndex = 0;
      this.activeList = this.toList;
    },
    ccFocus() {
      this.activeListIndex = 1;
      this.activeList = this.ccList;
    },
    bccFocus() {
      this.activeListIndex = 2;
      this.activeList = this.bccList;
    },
    selectRow(item) {
      this.$applog("addressbook select row:" + JSON.stringify(item));
      //type 1=to, 2=cc
      if (!this.activeList.includes(item.emailaddress)) {
        this.activeList.push(item.emailaddress);
      }
      this.$emit("selectItem", item, this.activeListIndex);
    },
  },
  mounted() {
    this.focusInput();
  },
  created() {
    this.activeList = this.toList;
    Storage.get({ key: "connections" }).then((connections) => {
      Storage.get({ key: "activeTabName" }).then((activeTabName) => {
        let tabObj = JSON.parse(connections.value);
        if (
          this.$route.params.connection &&
          this.$route.params.connection != "default"
        ) {
          this.connection = this.$route.params.connection;
        } else if (activeTabName && activeTabName.value) {
          this.connection = activeTabName.value;
        } else {
          this.connection = tabObj[0].tabName;
        }
      });
    });
    // setInterval(() => {
    //    this.setFocus();
    //     }, 500); // 0.5 sec delay
  },
};
</script>

<style scoped>
.selectablerow {
  cursor: pointer;
}
</style>

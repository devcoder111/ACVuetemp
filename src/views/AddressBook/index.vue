<template>
  <Layout>
    <template v-slot:header>
      <v-col class="text-left ml-2 mt-1" cols="20">
        <h5>{{ $t("addressbook-screen.title") }}</h5>
      </v-col>
      <v-col cols="4" class="text-right mr-1 mt-2">
        <MyFormSelect
          v-show="connectionSelect.options.length > 1"
          v-model="connectionSelect"
          @change="filterChange"
        ></MyFormSelect>
      </v-col>
    </template>
    <template v-slot:aside>
      <navbar :dataObject="dataObject" />
    </template>
    <template v-slot:main>
      <div>
        <div id="General" v-show="isGeneralVisible">
          <div id="GeneralHeader" class="Header">
            <v-skeleton-loader
              v-if="screenloading"
              type="list-item-one-line"
            ></v-skeleton-loader>
            <v-icon>mdi-email-search</v-icon>
            {{ $t("addressbook-screen.header") }}
          </div>
          <div name="tabone">
            <v-skeleton-loader
              v-if="screenloading"
              type="card-heading@3, text@9, list-item-two-line"
            ></v-skeleton-loader>
            <div>
              <AddressBookGeneral
                :dataProvider="dataProvider"
                :dataObject="dataObject"
                :tableloading="tableloading"
                @change="change"
                @selectItem="selectItem"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <v-spacer></v-spacer>
      <v-btn
        tile
        large
        outlined
        class="ma-2"
        color="accent"
        @click="submitClick()"
        :loading="loading"
      >
        <v-icon>mdi-check</v-icon>{{ $t("common.okay") }}
      </v-btn>

      <v-btn tile large outlined class="ma-2" color="red" @click="closeClick()">
        <v-icon>mdi-close</v-icon>{{ $t("common.cancel") }}
      </v-btn>
    </template>
  </Layout>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//vue
import Layout from "@/layout/indexNoTabs";
import AddressBookGeneral from "@/components/AddressBook/General";
import MyFormSelect from "@/components/FormElements/MyFormSelect";

//classes
import DataFactoryClass from "@/services/dataFactory";
import {
  AddressBookScreenMetadata,
  AddressBookData,
} from "@/services/AddressBook/data.js";

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

//vue page object
export default {
  name: "addressbook",
  _DataFactory: [],
  components: {
    Layout,
    AddressBookGeneral,
    MyFormSelect,
  },
  props: {},
  data() {
    return {
      screenloading: true,
      tableloading: true,
      loading: false,
      dataProvider: {
        type: Object,
      },
      connectionSelect: {
        name: "connectionSelect",
        value: { text: "", value: "" },
        caption: "",
        options: [],
      },
      dataObject: {
        type: Object,
      },
      isGeneralVisible: true,
    };
  },
  methods: {
    filterChange() {
      this.$applog("addressbook filterChange:");
      this.dataProvider = this._DataFactory.getDataService(
        this.connectionSelect.value.value,
        this.connectionSelect.value.value
      );
    },
    change(searchtext) {
      this.$applog("addressbook Search() " + searchtext);
      this.tableloading = true;
      var _that = this;
      this.dataProvider
        .addressBookGetData(searchtext)
        .then((response) => {
          this.dataObject = response;
          this.$applog(response);
          _that.tableloading = false;
        })
        .catch((e) => this.$applog("AddressBook Search ERROR:" + e));
    },
    async submitClick() {
      this.loading = true;
      this.$applog("addressbook submitClick()");

      await this.dataProvider
        .actioned("AddressBook", "update", JSON.stringify(this.dataObject))
        .then((response) => {
          this.$applog("AddressBook response:" + response);
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.$applog("AddressBook submitClick ERROR:" + e.message);
        });
    },
    selectItem(item, _type) {
      this.$applog(
        "addressbook main selectItem()" + JSON.stringify(item) + "=" + _type
      );
      if (_type == 0) {
        if (!this.dataObject.data.to.includes(item.emailaddress))
          this.dataObject.data.to.push(item.emailaddress);
      } else if (_type == 1) {
        if (!this.dataObject.data.cc.includes(item.emailaddress))
          this.dataObject.data.cc.push(item.emailaddress);
      } else if (_type == 2) {
        if (!this.dataObject.data.bcc.includes(item.emailaddress))
          this.dataObject.data.bcc.push(item.emailaddress);
      }
    },
    closeClick() {
      this.$applog("emailtemplates cancelClick()");
      this.dataProvider.actioned("AddressBook", "close", "");
    },
    activateTab(index) {
      this.$applog("emailtemplates activateTab-" + index);
      this.isGeneralVisible = true;
    },
  },
  created() {
    //get our data provider and fetch our data
    this.tableloading = true;
    this.$applog("AddressBook created()");
    this.screenloading = true;
    let _screenmetadata = new AddressBookScreenMetadata();
    let _data = new AddressBookData();
    this.dataObject = {
      screenMetadata: _screenmetadata,
      data: _data,
    };
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

        this._DataFactory = new DataFactoryClass();
        this.dataProvider = this._DataFactory.getDataService(
          this.connection,
          this.connection
        );
        for (var rr = 0; rr < tabObj.length; rr++) {
          this.connectionSelect.options.push({
            text: tabObj[rr].tabName,
            value: tabObj[rr].tabName,
          });
        }
        this.connectionSelect.value = {
          text: this.connection,
          value: this.connection,
        };
        this.screenloading = false;
        this.tableloading = false;
      });
    });
  },
};
</script>

<style></style>

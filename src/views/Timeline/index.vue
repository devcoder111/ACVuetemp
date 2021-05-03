<template>
  <div>
    <Layout>
      <template v-slot:header>
        <!-- <h5>{{ $t("parseemail-screen.title") }}</h5> -->
        <h5>Timeline</h5>
      </template>
      <template v-slot:aside>
        <navbar @activateTab="activateTab" :dataObject="dataObject" />
      </template>
      <template v-slot:main>
        <!-- <div>
        <div id="General">
          <div id="GeneralHeader" class="Header">
            <v-icon>mdi-email-search</v-icon>
            {{ $t("parseemail-screen.header") }}
          </div>
          <div name="tabone">
            <TimelineGeneral
              :dataObject="dataObject"
              @selectParseEmailItem="selectParseEmailItem"
            />
          </div>
        </div>
      </div> -->
        <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
          <v-timeline-item
            v-for="(item, i) in timelineTabData.data.tableData"
            :key="i"
            color="primary"
            :icon="item.icon"
            fill-dot
          >
            <v-card color="primary" dark>
              <v-card-title class="title">
                {{ item.comm_action }}
              </v-card-title>
              <v-card-text class="white text--primary">
                <div
                  v-for="(tableCol, j) in timelineTabData.data.tableColumns"
                  :key="j"
                >
                  <div
                    v-if="
                      tableCol.value != '__Select__' &&
                        item[tableCol.value] != ''
                    "
                  >
                    <span
                      ><b>{{ tableCol.text }}</b> :
                    </span>
                    <span>
                      {{ item[tableCol.value] }}
                    </span>
                  </div>
                </div>
                <v-btn
                  color="primary"
                  class="mx-0"
                  outlined
                  @click="summarize(item)"
                >
                  Summary
                </v-btn>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </template>
      <template v-slot:footer>
        <v-spacer></v-spacer>
        <v-btn
          tile
          large
          outlined
          class="ma-2"
          color="red"
          @click="closeClick()"
        >
          <v-icon>mdi-close</v-icon>{{ $t("common.cancel") }}
        </v-btn>
      </template>
    </Layout>
    <v-dialog
      class="summary-dialog"
      v-model="summaryDialog"
      max-width="600px"
      persistent
      scrollable
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title class="headline primary white--text"
          >Summary</v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <EntityViewX
            :entityDataObject="summaryData"
            :tabDataObject="timelineTabData"
            @ViewEntitySelectTab="ViewEntitySelectTab"
            @selectEntity="selectEntity"
            :loading="loading"
            :tabloading="tabloading"
            @toggleBookmark="toggleBookmark"
            @linkSearch="linkSearch"
            @applyListFilter="applyListFilter"
            @timeline="timeline"
            @selectRowExternalLink="selectRowExternalLink"
          />

          <!-- <div
            v-for="(tableCol, j) in timelineTabData.data.tableColumns"
            :key="j"
          >
            <span>{{ tableCol.text }} : </span>
            <span>
              {{ summaryData[tableCol.value] }}
            </span>
          </div> -->
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
            @click="summaryDialog = false"
          >
            <v-icon>mdi-close</v-icon>{{ $t("common.close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//vue
import Layout from "@/layout/indexNoTabs";
// import ViewEntity from "@/layout/components/MyTaskPane/ViewEntity";
import EntityViewX from "@/components/MyTaskPane/EntityViewX";
// import TimelineGeneral from "@/components/Timeline/General";

//classes
import DataFactoryClass from "@/services/dataFactory";
import {
  ParseEmailScreenMetadata,
  ParseEmailData,
} from "@/services/ParseEmail/data.js";

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

//vue page object
export default {
  name: "timeline",
  _DataFactory: [],
  components: {
    Layout,
    // ViewEntity,
    EntityViewX,
  },
  data() {
    return {
      loading: false,
      summaryData: [],
      summaryDialog: false,
      timelineTabData: [],
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
      dataProvider: {
        type: Object,
      },
      dataObject: {
        type: Object,
      },
    };
  },
  methods: {
    summarize(item) {
      this.summaryDialog = true;
      this.loading = true;
      // this.summaryData = item;
      this.dataProvider
        .selectEntity("opportunity", item.entityid)
        .then((response) => {
          this.summaryData = response;
          this.loading = false;
        })
        .catch((e) => {
          this.$applog(e);
        });
    },
    async selectParseEmailItem(selectItem) {
      this.$applog("parseemail selectParseEmailItem()");
      let res = {
        screenMetadata: {
          method: "parseemail",
        },
        data: selectItem,
      };
      await this.dataProvider.QueueMessage(res);
      this.dataProvider.actioned("ParseEmail", "close", "");
    },
    closeClick() {
      this.dataProvider.actioned("ParseEmail", "close", "");
    },
  },

  created() {
    //get our data provider and fetch our data
    this.$applog("parseemail created()");
    let _screenmetadata = new ParseEmailScreenMetadata();
    let tabData = window.vueAppInstance.$localStorage.get("tabData");
    this.timelineTabData = JSON.parse(tabData);

    let _data = new ParseEmailData();
    this.dataObject = {
      screenMetadata: _screenmetadata,
      data: _data,
    };

    Storage.get({ key: "connections" }).then((connections) => {
      Storage.get({ key: "activeTabName" }).then((activeTabName) => {
        let tabObj = JSON.parse(connections.value);
        if (this.$route.params.connection) {
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

        this.dataProvider
          .parseEmailGetData()
          .then((response) => {
            let emailAddresses = response.emailAddresses;
            this.dataObject = {
              screenMetadata: {},
              data: {
                tableColumns: [
                  { text: "Email", value: "EmailAddress" },
                  { text: "", value: "__Select__" },
                ],
                tableData: [],
              },
            };
            for (var i = 0; i < emailAddresses.length; i++) {
              let lineitem = {
                count: i,
                EmailAddress: emailAddresses[i],
                entityid: emailAddresses[i],
              };
              this.dataObject.data.tableData.push(lineitem);
            }
          })
          .catch((e) => this.$applog(e));
      });
    });
  },
};
</script>

<style></style>

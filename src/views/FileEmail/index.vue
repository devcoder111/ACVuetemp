<template>
  <Layout>
    <template v-slot:header>
      <h5>{{ $t("fileemail-screen.title") }}</h5>
    </template>
    <template v-slot:aside>
      <v-skeleton-loader
        v-if="screenloading"
        type="list-item-three-line"
      ></v-skeleton-loader>
      <navbar
        v-if="!screenloading && !showErrorSceeen"
        @activateTab="activateTab"
        :dataObject="dataObject"
        :showdocstab="showdocstab"
      />
    </template>
    <template v-slot:main>
      <div>
        <div id="General" v-if="showErrorSceeen">
          <v-banner @click:icon="alert">
            <v-icon slot="icon" color="error" size="36">
              mdi-alert-circle
            </v-icon>
            {{ $t("fileemail-screen.somethinghasgonewrong") }}
            <br />
            {{ onScreenErrorMessage }}
          </v-banner>
        </div>
        <div
          id="General"
          v-if="dataObject && dataObject.screenMetadata && !showErrorSceeen"
          v-show="isGeneralVisible"
        >
          <v-skeleton-loader
            v-if="screenloading"
            type="card-heading"
          ></v-skeleton-loader>
          <v-card id="GeneralHeader" v-if="!screenloading">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  <v-icon size="50">{{
                    dataObject.screenMetadata.entityIcon
                  }}</v-icon>
                  {{ dataObject.screenMetadata.entityName }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <div name="tabone">
            <v-skeleton-loader
              v-if="screenloading"
              type="card-heading@3, text@9, list-item-two-line"
            ></v-skeleton-loader>
            <FileEmailGeneral v-if="!screenloading" v-model="dataObject" />
          </div>
        </div>

        <div
          id="Attachments"
          v-if="dataObject && dataObject.screenMetadata && !showErrorSceeen"
          v-show="isAttachmentsVisible"
        >
          <v-card id="AttachmentsHeader">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  <v-icon size="50">{{
                    dataObject.screenMetadata.entityIcon
                  }}</v-icon>
                  {{ dataObject.screenMetadata.entityName }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>

          <div name="tabtwo">
            <FileEmailAttachments v-model="dataObject" />
          </div>
        </div>

        <div
          id="Communications"
          v-if="dataObject && dataObject.screenMetadata"
          v-show="isCommsVisible"
        >
          <v-card id="CommunicationsHeader">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  <v-icon size="50">{{
                    dataObject.screenMetadata.entityIcon
                  }}</v-icon>
                  {{ dataObject.screenMetadata.entityName }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <div name="tabthree">
            <FileEmailComms
              v-if="
                dataObject &&
                  dataObject.screenMetadata &&
                  dataObject.screenMetadata.screensetup &&
                  dataObject.screenMetadata.screensetup.comm_screen_metadata
              "
              v-show="
                dataObject.screenMetadata.screensetup.comm_screen_metadata
                  .screenMetadata != null
              "
              v-model="
                dataObject.screenMetadata.screensetup.comm_screen_metadata
                  .screenMetadata.screens[0]
              "
              :dataProvider="dataProvider"
            />
          </div>
        </div>

        <div
          id="Documents"
          v-if="dataObject && dataObject.screenMetadata"
          v-show="isDocumentsVisible"
        >
          <v-card id="DocumentsHeader">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  <v-icon size="50">{{
                    dataObject.screenMetadata.entityIcon
                  }}</v-icon>
                  {{ dataObject.screenMetadata.entityName }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <div name="tabfour">
            <FileEmailDocuments
              v-if="
                dataObject &&
                  dataObject.screenMetadata &&
                  dataObject.screenMetadata.screensetup &&
                  dataObject.screenMetadata.screensetup.comm_screen_metadata
              "
              v-show="
                dataObject.screenMetadata.screensetup.library_screen_metadata
                  .screenMetadata != null
              "
              v-model="
                dataObject.screenMetadata.screensetup.library_screen_metadata
                  .screenMetadata.screens[0]
              "
              :dataProvider="dataProvider"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <v-spacer></v-spacer>

      <v-skeleton-loader
        :loading="screenloading"
        v-show="screenloading"
        type="button"
      ></v-skeleton-loader>
      <v-skeleton-loader
        :loading="screenloading"
        v-show="screenloading"
        type="button"
      ></v-skeleton-loader>

      <v-btn
        v-if="!showErrorSceeen && !screenloading"
        tile
        large
        outlined
        class="ma-2"
        color="accent"
        @click="fileEmailClick()"
        :loading="loading"
      >
        <v-icon>mdi-check</v-icon>{{ $t("fileemail-screen.save") }}
      </v-btn>
      <v-btn
        v-if="!screenloading"
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
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//vue
import Layout from "@/layout/index";
import Navbar from "@/layout/components/FileEmail/Navbar";
import FileEmailGeneral from "@/components/FileEmail/General";
import FileEmailAttachments from "@/components/FileEmail/Attachments";
import FileEmailComms from "@/components/FileEmail/Comms";
import FileEmailDocuments from "@/components/FileEmail/Documents";
//classes
import { EmailData, EmailAttachment } from "@/services/data.js";
import { FileEmailScreenMetadata } from "@/services/FileEmail/data.js";
import DataFactoryClass from "@/services/dataFactory";

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

//vue page object
export default {
  name: "fileemail",
  _DataFactory: [],
  components: {
    Layout,
    Navbar,
    FileEmailGeneral,
    FileEmailAttachments,
    FileEmailComms,
    FileEmailDocuments,
  },
  data() {
    return {
      onScreenErrorMessage: "",
      showErrorSceeen: false,
      screenloading: true,
      loading: false,
      dataProvider: {
        type: Object,
      },
      dataObject: {
        type: Object,
      },
      showdocstab: {
        type: Boolean,
        default: false,
      },
      isGeneralVisible: true,
      isAttachmentsVisible: false,
      isCommsVisible: false,
      isDocumentsVisible: false,
      connection: "",
    };
  },
  watch: {
    dataObject: {
      // This will let Vue know to look inside the object
      deep: true,
      // We have to move our method to a handler field
      handler: function() {
        this.showdocstab = false;
        for (
          var i = 0;
          i < this.dataObject.EmailList[0].attachments.length;
          i++
        ) {
          let __obj = this.dataObject.EmailList[0].attachments[i];
          if (__obj.value) this.showdocstab = true;
        }
      },
    },
  },
  methods: {
    async fileEmailClick() {
      this.loading = true;
      this.$applog("fileEmailClick");
      this.$applog(JSON.stringify(this.dataObject));
      //compose is when we are sending an email
      if (this.$route.params.containercontext == "compose") {
        this.dataProvider.actioned(
          "FileEmail",
          "ok",
          JSON.stringify(this.dataObject)
        );
        this.loading = false;
      } else {
        await this.dataProvider
          .fileEmail(this.dataObject)
          .then((response) => {
            this.$applog("fileEmailClick complete response:");
            this.$applog(JSON.stringify(response));
            this.$router.push({ name: "blanko", params: {} });
            this.dataProvider.actioned("FileEmail", "ok", "");
            this.loading = false;
          })
          .catch((e) => {
            this.$applog("fileEmailClick ERROR:" + e.message);
          });
      }
    },
    closeClick() {
      this.$applog("FileEmail closeClick()");
      this.dataProvider.actioned("FileEmail", "close", "");
      this.$applog("FileEmail closeClick() blanko");
      this.$router.push({ name: "blanko", params: {} });
    },
    activateTab(index) {
      this.$applog("file email activateTab-" + index);
      this.hideAllSections();
      switch (index) {
        case 2:
          this.isAttachmentsVisible = true;
          break;
        case 3:
          this.isCommsVisible = true;
          break;
        case 4:
          this.isDocumentsVisible = true;
          break;
        default:
          this.isGeneralVisible = true;
      }
    },
    hideAllSections() {
      this.isGeneralVisible = false;
      this.isAttachmentsVisible = false;
      this.isCommsVisible = false;
      this.isDocumentsVisible = false;
    },
    getCache(cacheMethod, cacheMethodParams) {
      //nte we dont care how old the cache is as logging into crm resets it
      console.log(
        "getCache FileEmail:" +this.connection + ":"+ cacheMethod + ":" + JSON.stringify(cacheMethodParams)
      );
      let _datacache = window.vueAppInstance.$localStorage.get(
        this.connection + "_" + cacheMethod
      );
      console.log(_datacache);
      if (_datacache == null) _datacache = "[]";
      let _datacacheObj = JSON.parse(_datacache);
      console.log(_datacacheObj.length);
      for (var i = 0; i < _datacacheObj.length; i++) {
        var _record = _datacacheObj[i];
        console.log("cache:" + _record.params);
        if (_record.params == JSON.stringify(cacheMethodParams)) {
          console.log("cache found:");
          return _record.response;
        }
      }
      //if _datacacheObj.length>100...then clean up old data TODO
      console.log("not found");
      return null;
    },    
    async loaddata() {
      this.$applog("FileEmail loaddata start");
      //get our data provider and fetch our data
      Storage.get({ key: "connections" }).then((connections) => {
        Storage.get({ key: "activeTabName" }).then((activeTabName) => {
          this.$applog("FileEmail loaddata #1");
          let tabObj = JSON.parse(connections.value);
          if (this.$route.params.connection) {
            this.connection = this.$route.params.connection;
          } else if (activeTabName && activeTabName.value) {
            this.connection = activeTabName.value;
          } else {
            this.connection = tabObj[0].tabName;
          }
          this.$applog("fileEmail connection:" + this.connection);
          this._DataFactory = new DataFactoryClass();

          this.dataProvider = this._DataFactory.getDataService(
            this.connection,
            this.connection
          );
          //init dataobject
          let metadata = new FileEmailScreenMetadata();
          let emails = [];
          let noemail = new EmailData();
          emails.push(noemail);
          this.dataObject = {
            screenMetadata: metadata,
            EmailList: emails,
          };

          //sample attachment
          let noatt = new EmailAttachment();
          noatt.name = "test";
          noatt.value = false;
          noatt.caption = "testdoc.docx";
          noemail.attachments.push(noatt);

          let _that = this;
          this.$applog("fileEmail loaddata fileEmailGetData");
          this.$applog(JSON.stringify(this.$route.params));
          
          this.dataProvider
            .fileEmailGetData(
              this.$route.params.entity,
              this.$route.params.entityid,
              this.$route.params.containercontext
            )
            .then((response) => {
              this.$applog("fileEmailGetData returned 30april21-A");
              this.$applog(JSON.stringify(response));
              this.dataObject = response;
              this.screenloading = false;
              //get screen setup....?
              //try the cache first
              let _cachedSetup=null;
              if ((_that.dataProvider)&&(_that.dataProvider.lastUserObject)&&(_that.dataProvider.lastUserObject.username))
              {
                _cachedSetup=_that.getCache("getScreenSetupFileEmail", { username:_that.dataProvider.lastUserObject.username });
              }
               this.$applog("fileEmailGetData returned 30april21-C");
              if (_cachedSetup!=null)
              {
                 this.$applog("fileEmailGetData returned 30april21-f");
                  _that.instanceSettings = response;
                   this.$applog("fileEmailGetData returned 30april21-g"+_that.$appContainer.classname);
                    _that.$appContainer.setInstanceSettings(
                      _that.dataProvider.connectionName,
                      JSON.stringify(_that.instanceSettings)
                    );
                    return;
              }
              this.$applog("fileEmailGetData returned 30april21-X"  );
              _that.dataProvider
                .getScreenSetup()
                .then((response) => {
                  _that.instanceSettings = response;
                  _that.setCache("getScreenSetupFileEmail", { username:_that.dataProvider.lastUserObject.username },response);
                  try {
                    this.$appContainer.setInstanceSettings(
                      _that.dataProvider.connectionName,
                      JSON.stringify(_that.instanceSettings)
                    );
                  } catch (err) {
                    // eslint-disable-next-line
                    vueAppInstance.$applog(
                      "setInstanceSettings ERROR not defined:" + err.message
                    );
                  }
                })
                .catch((e) => {
                  // eslint-disable-next-line
                  vueAppInstance.$applog(
                    "getScreenSetup ERROR in fileEmailGetData:" + e.message
                  );
                });
            })
            .catch((e) => {
              this.screenloading = false;
              this.$applog("fileEmail loaddata ERROR:" + e.message);
              this.showErrorSceeen = true;
              this.onScreenErrorMessage =
                "ERROR: #234 fileEmailGetData: " + e.message;
            });
        });
      });
    },
  },
  created() {
    this.$applog("fileEmail created");
    this.loaddata();
  },
};
</script>

<style scoped></style>

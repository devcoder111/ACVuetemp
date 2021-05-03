<template>
  <v-app>
    <v-container class="grey lighten-5" fluid>
      <v-row>
        <v-col cols="24">
          <v-card class="mx-auto">
            <v-toolbar color="black" dark>
              <v-toolbar-title>{{
                $t("startup-screen.settings")
              }}</v-toolbar-title>
            </v-toolbar>

            <v-list two-line subheader>
              <v-subheader>{{ this.addconnection }}</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ getSageCRMTitle() }}</v-list-item-title>
                  <v-list-item-subtitle
                    class="wrap-text"
                    v-html="getSageCRMTitleRequires()"
                  >
                  </v-list-item-subtitle>
                  <div class="my-2">
                    <v-btn
                      v-show="showAddNewConnection()"
                      color="black"
                      dark
                      large
                      @click="
                        newConnection(
                          'MyTaskPaneEntityDataSageCRMAcceleratorClass'
                        )
                      "
                    >
                      <v-icon dark>{{ plusMinusIcon }}</v-icon></v-btn
                    >
                  </div>
                  <!--       
          <v-list-item-subtitle v-show="!showAddNewConnection()">
               {{$t('startup-screen.maxconnections')}}</v-list-item-subtitle>
               -->
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-dialog
              v-model="addNewConnection"
              persistent
              class="new-connection-dialog"
              max-width="600px"
              scrollable
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <v-card tscomp="tsnewconnection" class="editconnection">
                <v-card-title class="primary white--text">
                  <span>{{ $t("startup-screen.newconnection") }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    large
                    @click="addNewConnection = false"
                    class="white--text"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-form>
                    <MyFormUrl
                      v-model="data_url"
                      @changedValue="changedDataUrl"
                    />
                    <MyFormUserName v-model="data_username" />
                    <MyFormPassword v-model="data_password" />
                    <v-alert
                      v-model="success"
                      close-text="Connection Success"
                      dark
                      type="success"
                    >
                      {{ $t("startup-screen.connectionsuccess") }}
                    </v-alert>

                    <v-alert
                      v-model="alert"
                      close-text="Connection Failed"
                      type="error"
                    >
                      {{ $t("startup-screen.connectionfailed") }}
                    </v-alert>
                    <MyFormCheckbox v-model="data_rememberme" />
                    <MyFormInput v-model="data_connectionName" />
                    <MyFormInput v-model="data_connectionCaption" />
                    <MyFormCheckbox v-model="data_enabled" />
                    <MyFormNumber v-model="data_order" />
                  </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn
                    tile
                    large
                    outlined
                    class="ma-2"
                    color="black"
                    @click="resetForm()"
                  >
                    <v-icon>mdi-close</v-icon
                    >{{ $t("startup-screen.clear") }} </v-btn
                  ><v-spacer></v-spacer>
                  <v-btn
                    tile
                    large
                    outlined
                    class="ma-2"
                    color="black"
                    @click="submitForm()"
                    :loading="testOrSaveLoading"
                  >
                    <v-icon>mdi-check</v-icon>{{ this.testButtonCaption }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-divider></v-divider>

            <v-list v-show="this.tabs.length > 0" subheader two-line flat>
              <v-subheader>{{ this.existingconnections }}</v-subheader>

              <v-list-item v-for="tab in tabs" :key="tab.tabCaption">
                <v-list-item-action>
                  <div class="actionlist">
                    <v-btn color="black" dark small @click="editConnection(tab)"
                      ><v-icon dark>
                        mdi-pencil
                      </v-icon></v-btn
                    >
                    &nbsp;
                    <v-btn
                      color="error"
                      dark
                      small
                      @click="deleteConnection(tab)"
                      ><v-icon dark>
                        {{ getDeleteIcon(tab) }}
                      </v-icon></v-btn
                    >
                    <v-btn
                      dark
                      small
                      v-show="
                        confirmConnectionDelete &&
                          tab.tabName == tabToDelete.tabName
                      "
                      @click="deleteConnectionConfirm(tab)"
                    >
                      {{ $t("startup-screen.confirmdelete") }}</v-btn
                    >
                  </div>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ tab.tabCaption }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content> </v-list-item-content>
              </v-list-item>

              <v-dialog
                v-model="editConnectionFlag"
                persistent
                max-width="600px"
                scrollable
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <v-card
                  tscomp="tseditconnection"
                  v-show="editConnectionFlag == true"
                  class="editconnection"
                >
                  <v-card-title class="primary white--text">
                    <span>{{ $t("startup-screen.editconnection") }}</span>
                    <v-spacer></v-spacer>
                    <v-btn
                      icon
                      large
                      @click="editConnectionFlag = false"
                      class="white--text"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <v-form>
                      <MyFormUrl v-model="data_url" />
                      <MyFormUserName v-model="data_username" />
                      <MyFormPassword v-model="data_password" />
                      <MyFormCheckbox v-model="data_rememberme" />
                      <MyFormInput v-model="data_connectionName" />
                      <MyFormInput v-model="data_connectionCaption" />
                      <MyFormCheckbox v-model="data_enabled" />
                      <MyFormNumber v-model="data_order" />
                    </v-form>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      tile
                      large
                      outlined
                      class="ma-2"
                      color="black"
                      @click="submitFormEdit()"
                    >
                      <v-icon>mdi-check</v-icon
                      >{{ $t("startup-screen.connect") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>

                <v-alert
                  v-model="successEdit"
                  close-text="Connection Updated"
                  dark
                  type="success"
                >
                  {{ $t("startup-screen.connectionupdated") }}
                </v-alert>
              </v-dialog>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row align="center" justify="space-around">
        <v-col cols="24" align="center">
          <v-btn
            v-show="this.tabs.length > 0"
            @click="backToApp()"
            x-large
            block
            color="primary"
          >
            {{ $t("startup-screen.openapplication") }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row align="center" justify="space-around">
        <v-col cols="24" align="left">
          <v-card>
            <v-card-text>
              {{ $t("startup-screen.selecttheme") }}
              <ThemeChanger />
              <div>{{ $t("startup-screen.fontsize") }}</div>
            </v-card-text>
            <v-card-actions>
              <v-slider
                v-model="fontsize"
                max="40"
                min="12"
                thumb-label="always"
              ></v-slider>
            </v-card-actions>
            <v-card-text>
              <v-select
                :items="languages"
                v-model="curLanguage"
                item-text="key"
                :label="languageCaption"
                return-object
                v-on:change="onChangeLanguage"
                dense
              >
              </v-select
            ></v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row align="center" justify="space-around">
        <v-col cols="24" align="center">
          <v-card>
            <v-card-text>
              <p>{{ $t("startup-screen.version") }}: 1.0.0.1</p>
              <p>{{ siteUrl }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-footer padless app>
        <v-card flat tile width="100%" class="text-center">
          <v-card-text>
            <v-btn class="mx-2" text width="60px">
              <a
                elevation="0"
                @click="getCoreURL()"
                target="_blank"
                class="text-center"
              >
                <v-img
                  v-if="$vuetify.breakpoint.width > $extrasmall"
                  max-height="20"
                  max-width="80"
                  src="assets/logo_alt_wide.png"
                  style="text-align:center"
                  :class="{ brandedimagehover: hover }"
                >
                </v-img>
                <v-img
                  v-else
                  max-height="30"
                  max-width="30"
                  src="assets/icon-80.png"
                  style="text-align:center"
                  :class="{ brandedimagehover: hover }"
                >
                </v-img>
              </a>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-container>
  </v-app>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
import { AppConnection } from "@/services/MyTaskPane/appConnections";
import DataFactoryClass from "@/services/dataFactory";

import MyFormUrl from "@/components/FormElements/MyFormURL";
import MyFormUserName from "@/components/FormElements/MyFormUserName";
import MyFormPassword from "@/components/FormElements/MyFormPassword";
import MyFormCheckbox from "@/components/FormElements/MyFormCheckbox";
import MyFormInput from "@/components/FormElements/MyFormInput";
import MyFormNumber from "@/components/FormElements/MyFormNumber";
import ThemeChanger from "@/components/ThemeChanger";

import { Plugins } from "@capacitor/core";
import i18n from "@/plugins/i18n";
const { Storage } = Plugins;

//vue page object
export default {
  name: "startup",
  components: {
    MyFormUrl,
    MyFormUserName,
    MyFormPassword,
    MyFormCheckbox,
    MyFormInput,
    MyFormNumber,
    ThemeChanger,
  },
  data() {
    return {
      //   languages: ["English UK", "English NA", "German", "French", "Spanish"],
      languages: [
        { key: "English UK", value: "en-GB" },
        { key: "English NA", value: "en-US" },
        { key: "German", value: "de" },
        { key: "France", value: "fr" },
        { key: "Spanish", value: "es" },
      ],

      curLanguage: { key: "English UK", value: "en-GB" },
      siteUrl: "",
      hover: false,
      fontsize: 18,
      testOrSaveLoading: false,
      localStorage: {
        connections: {
          type: Array,
          default: [],
        },
      },
      successEdit: false,
      languageCaption: this.$i18n.t("startup-screen.language"),
      testButtonCaption: this.$i18n.t("startup-screen.connect"),
      addconnection: this.$i18n.t("startup-screen.addconnection"),
      existingconnections: this.$i18n.t("startup-screen.existingconnections"),
      alert: false,
      success: false,
      confirmConnectionDelete: false,
      tabToDelete: null,
      tabToEdit: null,
      addNewConnection: false,
      editConnectionFlag: false,
      selectedTab: null,
      tabs: [],
      activeTabName: "",
      btnSubmitState: "",
      plusMinusIcon: "mdi-plus",
      editIcon: "mdi-pencil",
      deleteIcon: "mdi-delete",

      data_url: {
        name: "URL",
        caption:
          this.$i18n.t("startup-screen.url") +
          "-(https://crm.yourserver.com/crm/)",
        defaultValue: "https://",
        value: "",
        required: true,
        httpsRequired: false,
      },
      data_username: {
        name: "Username",
        caption: this.$i18n.t("startup-screen.username"),
        value: "",
      },
      data_password: {
        name: "Password",
        caption: this.$i18n.t("startup-screen.password"),
        value: "",
      },
      data_connectionName: {
        name: "ConnectionName",
        caption: this.$i18n.t("startup-screen.connectionname"),
        value: "",
        readonly: false,
      },
      data_connectionCaption: {
        name: "ConnectionCaption",
        caption: this.$i18n.t("startup-screen.connectioncaption"),
        value: "",
      },
      data_rememberme: {
        name: "RememberMe",
        caption: this.$i18n.t("startup-screen.rememberme"),
        value: true,
      },
      data_enabled: {
        name: "Enabled",
        caption: this.$i18n.t("startup-screen.enabled"),
        value: true,
      },
      data_order: {
        name: "Order",
        caption: this.$i18n.t("startup-screen.order"),
        value: 1,
      },
      data_connectiontype: { name: "Order", caption: "", value: "" },
    };
  },
  mounted() {
    // this.curLanguage = this.$i18n.locale || { key: "English UK", value: "en-GB" }
    Storage.get({ key: "appLanguageData" }).then((data) => {
      console.log("appLanguageData", data.value);
      if (data.value == null) {
        console.log("appLanguageData null");
        this.curLanguage = { key: "English UK", value: "en-GB" };
      } else {
        Storage.get({ key: "appLanguage" }).then((data1) => {
          console.log("appLanguageData not null", data1.value);
          this.curLanguage = {
            key: data.value,
            value: data1.value,
          };
        });
      }
      //TO TEST LANGUAGES....
      // i18n.locale = 'en';
    });
  },
  watch: {
    fontsize: function(newVal) {
      // watch it
      console.log("fontsize:" + newVal);
      console.log(
        "document.body.style.fontSize:" + document.body.style.fontSize
      );
      document.documentElement.style.fontSize = newVal + "px";
      //store this....
      window.vueAppInstance.$localStorage.set("appfontSize", newVal);
    },
    // curLanguage: function(newVal) {
    //   console.log("curLanguage:" + newVal.key + ", " + newVal.value);
    //   i18n.locale = newVal;
    //   Storage.set({ key: "appLanguageData", value: newVal.key });
    //   Storage.set({ key: "appLanguage", value: newVal.value }).then(() => {
    //     location.reload();
    //   });
    //   window.vueAppInstance.$localStorage.set("curLanguage", newVal);
    // },
  },
  methods: {
    onChangeLanguage() {
      var newVal = this.curLanguage;
      console.log("curLanguage:" + newVal.key + ", " + newVal.value);
      i18n.locale = newVal;
      Storage.set({ key: "appLanguageData", value: newVal.key });
      Storage.set({ key: "appLanguage", value: newVal.value }).then(() => {
        location.reload();
      });
    },
    changedDataUrl(val) {
      this.data_url.value = val;
    },
    getSageCRMTitle() {
      if (this.$store.getters.appMode == "MX") {
        return this.$i18n.t("startup-screen.SageCRMTitleMX");
      } else {
        return this.$i18n.t("startup-screen.SageCRMTitle");
      }
    },
    getSageCRMTitleRequires() {
      if (this.$store.getters.appMode == "MX") {
        return this.$i18n.t("startup-screen.SageCRMTitleRequiresMX");
      } else {
        return this.$i18n.t("startup-screen.SageCRMTitleRequires");
      }
    },
    showAddNewConnection() {
      let _connectioncounts = 1;
      if (this.$route.params.connectioncounts) {
        _connectioncounts = this.$route.params.connectioncounts;
      }
      if (this.tabs.length > _connectioncounts - 1) {
        this.addconnection = "";
        this.existingconnections = this.$i18n.t(
          "startup-screen.existingconnection"
        );
        return false;
      }
      return true;
    },
    getEditIcon(tab) {
      if (this.tabToEdit != null && tab.tabName == this.tabToEdit.tabName)
        return "mdi-minus";
      else return "mdi-pencil";
    },
    getDeleteIcon(tab) {
      if (this.tabToDelete != null && tab.tabName == this.tabToDelete.tabName)
        return "mdi-minus";
      else return "mdi-delete";
    },
    openSite() {
      let __url =
        "https://crmtogether.com?utm_source=accelerator&utm_medium=inapp&utm_campaign=inapplink";
      this.$appContainer.OpenExternalURL(__url);
    },
    editConnection(_tab) {
      this.$applog("startup editConnection:");
      this.editConnectionFlag = !this.editConnectionFlag;
      if (this.editConnectionFlag) {
        this.editIcon = "mdi-minus";
        this.tabToEdit = _tab;
      } else {
        this.editIcon = "mdi-pencil";
        this.tabToEdit = null;
      }
      this.tabToDelete = null;
      this.data_url.value = _tab.dataurl;
      this.data_username.value = _tab.username;
      this.data_password.value = _tab.password;
      this.data_rememberme.value = _tab.rememberMe;
      this.data_connectionName.value = _tab.tabName;
      this.data_connectionName.readonly = true;
      this.data_connectionCaption.value = _tab.tabCaption;
      this.data_enabled.value = _tab.enabled;
      this.data_order.value = _tab.order;
    },
    deleteConnection(_tab) {
      this.confirmConnectionDelete = !this.confirmConnectionDelete;
      this.editConnectionFlag = false;
      this.tabToDelete = _tab;
      this.tabToEdit = null;
      if (this.confirmConnectionDelete) {
        this.deleteIcon = "mdi-minus";
      } else {
        this.deleteIcon = "mdi-delete";
        this.tabToDelete = null;
      }
    },
    deleteConnectionConfirm(_tab) {
      for (var x = 0; x < this.tabs.length; x++) {
        if (this.tabs[x].tabName == _tab.tabName) {
          this.tabs.splice(x, 1);
          break;
        }
      }
      Storage.set({ key: "connections", value: JSON.stringify(this.tabs) });
    },
    backToApp() {
      if (this.$store.getters.appMode == "MX") {
        this.$router.push({ name: "mytaskpanemx" });
      } else {
        this.$router.push({ name: "mytaskpane" });
      }
    },
    newConnection(connectorType) {
      this.addNewConnection = !this.addNewConnection;
      //later on we check for other connections

      this.data_username.value = "";
      this.data_password.value = "";
      this.data_connectionName.value = "";
      this.data_connectionCaption.value = "";
      this.data_rememberme.value = true;
      this.data_enabled.value = true;
      this.data_order.value = this.tabs.length + 1;

      this.data_connectionName.value = "SageCRM";
      this.data_connectionCaption.value = "Sage CRM";
      this.data_connectiontype.value = connectorType;
      this.data_connectionName.readonly = false;
      this.editConnectionFlag = false;
    },
    async submitFormEdit() {
      this.$applog("startup submitFormEdit");
      let _DataFactory = new DataFactoryClass();
      this.dataProvider = _DataFactory.getDataService("SageCRM");
      //save mode
      let connection = new AppConnection();
      connection.tabName = this.data_connectionName.value;
      connection.tabCaption = this.data_connectionCaption.value;
      connection.tabClass = "sagecrm";
      connection.tabAction = "summary";
      connection.enabled = this.data_enabled.value;
      connection.username = this.data_username.value;
      connection.password = this.data_password.value;
      connection.rememberMe = this.data_rememberme.value;
      connection.provider = "SystemContainer";
      connection.connectionClass =
        "MyTaskPaneEntityDataSageCRMAcceleratorClass";
      connection.dataurl = this.data_url.value;
      connection.order = this.data_order.value;
      this.btnSubmitState = "";
      //delete the tab
      this.deleteConnectionConfirm(this.tabToEdit);

      this.tabs.push(connection);
      Storage.set({ key: "connections", value: JSON.stringify(this.tabs) });

      this.resetForm();
      this.addNewConnection = false;
      this.editConnectionFlag = false;
      this.editIcon = "mdi-pencil";
      this.tabToEdit = null;
    },
    async submitForm() {
      this.$applog("startup submitForm");
      this.testOrSaveLoading = true;
      let _DataFactory = new DataFactoryClass();
      this.dataProvider = _DataFactory.getDataService("SageCRM");

      let form = {
        url: this.data_url.value,
        username: this.data_username.value,
        password: this.data_password.value,
        name: this.data_connectionName.value,
        connectiontype: this.data_connectiontype.value,
        caption: this.data_connectionCaption.value,
        rememberme: this.data_rememberme.value,
        enabled: this.data_enabled.value,
        order: this.data_order.value,
        appName: "Accelerator",
      };

      if (this.btnSubmitState == "") {
        this.dataProvider
          .validateConnection(form)
          .then((response) => {
            let _loggedin = false;
            if (response) {
              _loggedin = response.loggedin;
            }
            if (_loggedin) {
              //store object...used in other screensv
              this.testButtonCaption = "Save";
              this.alert = false;
              this.success = true;
              this.btnSubmitState = "save";

              //save mode
              let connection = new AppConnection();
              connection.tabName = this.data_connectionName.value;
              connection.tabCaption = this.data_connectionCaption.value;
              connection.tabClass = "sagecrm";
              connection.tabAction = "summary";
              connection.enabled = this.data_enabled.value;
              connection.username = this.data_username.value;
              connection.password = this.data_password.value;
              connection.rememberMe = this.data_rememberme.value;
              connection.provider = "SystemContainer";
              connection.connectionClass =
                "MyTaskPaneEntityDataSageCRMAcceleratorClass";
              connection.dataurl = this.data_url.value;
              this.btnSubmitState = "";
              //save to localstorage
              this.tabs.push(connection);

              Storage.set({
                key: "connections",
                value: JSON.stringify(this.tabs),
              });

              //mx item..put back later?--this line actually messed up our connections in AC
              //this.$store.commit('add_connection', connection);

              this.resetForm();
              this.addNewConnection = false;
              this.testOrSaveLoading = false;
            } else {
              this.alert = true;
              this.success = false;
            }
            this.testOrSaveLoading = false;
          })
          .catch((e) => {
            this.alert = true;
            this.success = false;
            this.testOrSaveLoading = false;
            console.error(e);
          });
      } else {
        console.log("save mode");
      }
    },
    resetAlerts() {
      this.alert = false;
      this.success = false;
      this.testButtonCaption = this.$i18n.t("startup-screen.connect");
      this.confirmConnectionDelete = false;
      this.testOrSaveLoading = false;
    },
    resetForm() {
      this.$applog("startup resetForm");
      this.data_url.value = "https://";
      this.data_username.value = "";
      this.data_password.value = "";
      this.data_connectionName.value = "SageCRM";
      this.data_connectionCaption.value = "SageCRM";
      this.data_rememberme.value = true;
      this.testButtonCaption = this.$i18n.t("startup-screen.connect");
      this.plusMinusIcon = "mdi-plus";
      this.confirmConnectionDelete = false;
      this.data_connectionName.readonly = false;
      this.resetAlerts();
    },
  },
  created() {
    this.$on("changedValue", function(val) {
      console.log("Changed Value", val);
    });
    if (window.vueAppInstance.$localStorage.get("appfontSize") != null)
      this.fontsize = window.vueAppInstance.$localStorage.get("appfontSize");
    Storage.get({ key: "connections" }).then((connections) => {
      this.tabs =
        connections.value != null ? JSON.parse(connections.value) : [];
    });
    console.log("siteurl1");
    this.siteUrl = window.location.href;
    console.log("siteurl", this.siteUrl);
  },
};
</script>

<style scoped>
.new-connection-dialog {
  max-height: 90%;
}
.actionlist {
  padding: 10px;
}
.poweredby {
  font-size: 0.6em !important;
}
.editconnection {
  overflow-y: scroll;
}
.wrap-text {
  white-space: unset;
}
</style>

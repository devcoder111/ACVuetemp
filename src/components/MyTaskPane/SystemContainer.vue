<template>
  <ScreenStructure>
    <template v-slot:header>
      <EntityHeaderMenu
        v-show="loggedin"
        :instanceSettings="instanceSettings"
        :tab="tab"
        @showHome="showHome"
        @showSearch="showSearch"
        :loading="loading"
        @closeSearch="closeSearch"
        :propSearchMode="propSearchMode"
        :propHomeMode="propHomeMode"
        :propViewEntityMode="propViewEntityMode"
        @fileEmail="fileEmail"
        @LogCall="LogCall"
        @parseEmail="parseEmail"
        @openNewDialog="openNewDialog"
        @executeOption="executeOption"
        @getBookmarks="getBookmarks"
        @getHistory="getHistory"
      >
      </EntityHeaderMenu>
    </template>

    <template v-slot:content>
      <EntitySearchResults
        @selectEntity="selectEntity"
        :loading="loading"
        :dataObject="searchData"
        v-show="loggedin && showSearchResultsKey == true"
        :instanceSettings="instanceSettings"
        @entitySearch="entitySearch"
        @changeSelectEntiry="changeSelectEntiry"
      />

      <ViewEntity
        :entityDataObject="entityData"
        :tabDataObject="tabData"
        v-show="loggedin && showEntityKey == true"
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

      <MyCRM
        v-show="loggedin && showHomeKey == true && MyCRMData != null"
        :loading="loading"
        :dataObject="MyCRMData"
        @getSalesList="getSalesList"
        @getCasesList="getCasesList"
      />

      <Login
        v-show="!loggedin"
        @submitForm="login"
        @isloggedin="isloggedin"
        :tab="tab"
        :showalert="loginAlert"
        :trylogin="trylogin"
        :login_loading="showloading"
      />

      <input
        type="hidden"
        :id="getHiddenEntity()"
        :name="getHiddenEntity()"
        :ref="getHiddenEntity()"
        value=""
      />
      <input
        type="hidden"
        :id="getHiddenEntityId()"
        :name="getHiddenEntityId()"
        :ref="getHiddenEntityId()"
        value=""
      />

      <v-dialog
        v-model="centerDialogVisible"
        persistent
        max-width="600px"
        scrollable
        :fullscreen="getFullScreen()"
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-card-title class="primary white--text">
            <span v-if="dialogScreenMetadata.screens != null">{{
              dialogScreenMetadata.screens[0].title
            }}</span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              large
              @click="centerDialogVisible = false"
              class="white--text"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="NewEntityForm"
              name="NewEntityForm"
              v-model="valid"
              lazy-validation
            >
              <br />
              <div
                v-if="
                  dialogScreenMetadata.screens != null &&
                    dialogScreenMetadata.screens[0].content != ''
                "
                v-html="dialogScreenMetadata.screens[0].content"
              ></div>
              <div
                v-for="(formScreen, idxScreen) in dialogScreenMetadata.screens"
                :key="idxScreen"
              >
                <v-divider v-show="formScreen.subheader != ''"></v-divider>
                <v-subheader
                  v-show="formScreen.subheader != ''"
                  :style="sectionStyle"
                >
                  <v-icon :style="sectionStyle">{{
                    formScreen.subheadericon
                  }}</v-icon>
                  {{ formScreen.subheader }}
                </v-subheader>

                <component
                  v-for="(formItem, idx) in formScreen.formElements"
                  :key="idx"
                  :ref="formItem.name"
                  :is="formItem.componentType"
                  :dataProvider="dataProvider"
                  :autofocus="idx == 0"
                  v-model="formScreen.formElements[idx]"
                  :formElements="formScreen.formElements"
                  @MyFormRemoteLookupChanged="MyFormRemoteLookupChanged"
                ></component>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              tile
              large
              outlined
              class="ma-2"
              color="accent"
              @click="createEntity()"
              :loading="saving"
            >
              <v-icon>mdi-check</v-icon>{{ $t("common.save") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar" timeout="3000">
        {{ $t("common.validationfailmessage") }}

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            {{ $t("common.close") }}
          </v-btn>
        </template>
      </v-snackbar>
    </template>
  </ScreenStructure>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//vue
import ScreenStructure from "@/layout/components/MyTaskPane/ScreenStructure";
import DataFactoryClass from "@/services/dataFactory";
import ThemeFactoryClass from "@/services/themefactory";
import EntityHeaderMenu from "@/components/MyTaskPane/EntityHeaderMenu";
import EntitySearchResults from "@/components/MyTaskPane/EntitySearchResults";
import ViewEntity from "@/layout/components/MyTaskPane/ViewEntity";
import MyCRM from "@/components/MyTaskPane/MyCRM";
import Login from "@/components/Login";
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

//services
import {
  MyTaskPaneScreenSetupMetadata,
  MyTaskPaneEntityScreenMetadata,
} from "@/services/MyTaskPane/data";
import { EntityData } from "@/services/data";

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

//vue page object
export default {
  name: "SystemContainer",
  _DataFactory: [],
  components: {
    ScreenStructure,
    EntityHeaderMenu,
    EntitySearchResults,
    ViewEntity,
    Login,
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
    MyCRM,
    MyFormPhone,
    MyFormEmail,
    MyFormLabelOnly,
  },
  props: {
    activeTabName: {
      type: String,
    },
    tab: {
      type: Object,
    },
    connectionDataObject: {
      type: Object,
    },
    propsearchData: {
      type: Object,
    },
  },
  computed: {
    sectionStyle() {
      return {
        "background-color":
          window.vueAppInstance.$vuetify.theme.themes["light"].secondary,
        color: "White",
      };
    },
  },
  watch: {
    propsearchData: function(newVal, oldVal) {
      // watch it
      this.$applog(
        "Prop propsearchData changed: ",
        newVal.searchText,
        " | was: ",
        oldVal
      );
      if (this.activeTabName == this.tab.tabName) {
        this.searchData = this.getEmptySearch();
        this.entitySearch("", newVal.searchText);
      }
    },
  },
  data() {
    return {
      lasttabName: "",
      snackbar: false,
      trylogin: false,
      saving: false,
      valid: true,
      loginAlert: false,
      currentemail: null,
      loggedin: false,
      userObject: {
        type: Object,
      },
      showloading: false,
      loading: false,
      tabloading: false,
      dataProvider: {
        type: Object,
      },
      instanceSettings: {
        type: Object,
      },
      hasHome: true,
      hasOptions: true,
      hasNew: true,

      showHomeKey: true,
      showSearchResultsKey: false,
      showEntityKey: false,
      propSearchMode: false,
      propHomeMode: true,
      propViewEntityMode: false,

      MyCRMData: {
        type: Object,
      },

      activeScreen: "loading",
      searchData: {
        type: Object,
      },
      entityData: {
        type: Object,
      },
      tabData: {
        type: Object,
      },
      centerDialogVisible: false,
      dialogScreenMetadata: {
        type: Object,
      },
      dialogTitle: "no dialog title set",
      lastActiveView: "",
    };
  },
  methods: {
    changeSelectEntiry() {
      var data = {
        tableData: [],
        tableColumns: [],
        searchString: "",
      };
      this.searchData.data = data;
    },
    getFullScreen() {
      if (this.$vuetify.breakpoint.width > 600) return false;
      return true;
    },
    getHiddenEntity() {
      let res = "entity_" + this.tab.tabName;
      return res;
    },
    getHiddenEntityId() {
      let res = "entityid_" + this.tab.tabName;
      return res;
    },
    toggleBookmark() {
      this.dataProvider
        .toggleBookmark(
          this.entityData.screenMetadata.entity,
          this.entityData.screenMetadata.entityid
        )
        .then((response) => {
          this.$applog("toggleBookmark ok:" + JSON.stringify(response.data));
        })
        .catch((e) => {
          this.$applog("toggleBookmark fail:" + e);
        });
    },
    MyFormRemoteLookupChanged(val) {
      this.$applog(
        "SystemContainer MyFormRemoteLookupChanged:" +
          val.name +
          "==" +
          JSON.stringify(val)
      );
      for (var y = 0; y < this.dialogScreenMetadata.screens.length; y++) {
        let _screen = this.dialogScreenMetadata.screens[y];
        for (var i = 0; i < _screen.formElements.length; i++) {
          var elm = _screen.formElements[i];
          if (
            elm.componentType == "MyFormRemoteLookup" &&
            elm.filterObjectName == val.name
          ) {
            this.$applog(val.name + " ????? " + elm.name);
            let query = {
              fieldname: elm.name,
              entity: elm.entity,
              value: "",
              filter: "",
            };
            //filter object is another lookup
            this.$applog(
              "SystemContainer MyFormRemoteLookup this.value: " +
                JSON.stringify(elm)
            );
            let filterObjectName = elm.filterObjectName;
            if (filterObjectName != null) {
              //get the object with value 'filterObjectName'
              query.filter = {
                entity: val.value.value.entity,
                entityid: val.value.value.entityid,
              };
            }
            this.$applog(
              "SystemContainer query query.query: " + JSON.stringify(query)
            );
            this.$applog(
              "SystemContainer MyFormRemoteLookupChanged remoteLookup response data X:" +
                elm.name
            );
            this.dataProvider
              .getRemoteData(elm, query)
              .then((response) => {
                //get the field
                var _elm = this.getField(response.data.fieldname);
                this.$applog(
                  "response.data.fieldname: " + response.data.fieldname
                );
                this.$applog(
                  "SystemContainer MyFormRemoteLookupChanged remoteLookup response data:" +
                    _elm.name
                );
                _elm.options = response.data.options;
              })
              .catch((e) => console.error(e));
          }
        }
      }
    },
    getField(fieldName) {
      for (var y = 0; y < this.dialogScreenMetadata.screens.length; y++) {
        let _screen = this.dialogScreenMetadata.screens[y];
        for (var i = 0; i < _screen.formElements.length; i++) {
          var e = _screen.formElements[i];
          if (e.name == fieldName) {
            return e;
          }
        }
      }
      return null;
    },
    validate() {
      let res = this.$refs.NewEntityForm.validate();
      this.snackbar = !res;
      return res;
    },
    createEntity() {
      //this.$applog('SystemContainer createEntity:'+this.validate());
      this.saving = true;
      if (!this.validate()) {
        this.saving = false;
        return false;
      }

      let _that = this;
      this.dataProvider
        .createEntity(this.dialogScreenMetadata)
        .then((response) => {
          this.$applog("SystemContainer createEntity response:");
          this.$applog(JSON.stringify(response));
          this.centerDialogVisible = false;
          if (response) {
            //alert('created');//showtoast popup?
          }
          this.saving = false;
          //open entity now in summary
          this.$applog(
            "SystemContainer createEntity selectEntity:" +
              response.data.entity +
              "=" +
              response.data.entityid
          );
          this.selectEntity(response.data.entity, response.data);
        })
        .catch((e) => {
          this.$applog(e);
          alert("ERROR createEntity:" + e.message);
          _that.loggedin = false;
          this.saving = false;
          _that.trylogin = true;
        });
    },
    linkSearch(section) {
      //note: propsearchData is a watcher...this does the search call
      this.$emit("linkSearch", section);
    },
    setupHiddenFields(entity, entityid) {
      this.$refs[this.getHiddenEntity()].value = entity;
      this.$refs[this.getHiddenEntityId()].value = entityid;
      document.getElementById("active_entity").value = entity;
      document.getElementById("active_entityid").value = entityid;
    },
    selectRowExternalLink(url) {
      this.$applog("SystemContainer selectRowExternalLink:");
      this.$appContainer.OpenExternalURL(url);
    },
    selectEntity(entity, obj) {
      this.loading = true;
      this.$applog("SystemContainer selectEntity:" + JSON.stringify(obj));
      this.resetAllKeys();
      let _that = this;
      //set this connections data context...used in outlook for sending on inspectors
      this.setupHiddenFields(entity, obj.entityid);
      const payload = {
        entity: entity,
        entityId: obj.entityid,
      };
      this.$store.dispatch("entityStore/selectEntity", payload);
      console.log("dataprovider", this.dataProvider, this.activeTabName);
      //check our cache
      let cachedResponse = this.getCache("selectEntity", payload);
      if (cachedResponse != null) {
        this.entityData = cachedResponse;
        this.tabData = cachedResponse;
        this.propViewEntityMode = true;
        this.lastActiveView = "entity";
        this.loading = false;
      }
      this.dataProvider
        .selectEntity(entity, obj.entityid)
        .then((response) => {
          if (cachedResponse != null) {
            //only update the data if its different...
            let _entityData = JSON.stringify(this.entityData); //set from cache
            let _response = JSON.stringify(response);
            if (_entityData != _response) {
              this.entityData = response;
              this.tabData = response;
              //add to cache now..
              this.setCache("selectEntity", payload, response);
            }
          } else {
            this.entityData = response;
            this.tabData = response;
            //add to cache now..
            this.setCache("selectEntity", payload, response);
          }
          this.propViewEntityMode = true;
          this.lastActiveView = "entity";
          this.loading = false;
        })
        .catch((e) => {
          this.$applog(e);
          _that.loggedin = false;
          _that.trylogin = true;
        });
      this.showEntityKey = true;
    },
    getCache(cacheMethod, cacheMethodParams) {
      console.log(
        "getCache:" + cacheMethod + ":" + JSON.stringify(cacheMethodParams)
      );
      let _datacache = window.vueAppInstance.$localStorage.get(
        this.activeTabName + "_" + cacheMethod
      );
      console.log(_datacache);
      if (_datacache == null) _datacache = "[]";
      let _datacacheObj = JSON.parse(_datacache);
      console.log(_datacacheObj.length);
      for (var i = 0; i < _datacacheObj.length; i++) {
        var _record = _datacacheObj[i];
        console.log("cache:" + _record.params);
        if (_record.params == JSON.stringify(cacheMethodParams)) {
          //check cached date...
          let cachedDateTime = new Date(_record.cachedDateTime);
          var difference = new Date().getTime() - cachedDateTime.getTime(); // This will give difference in milliseconds
          var resultInMinutes = Math.round(difference / 60000);
          if (resultInMinutes < 5) {
            ///maybe 5 minutes is too short?
            return _record.response;
          } else {
            console.log("too OLD");
            //we remove from the recordset and resave
            _datacacheObj.splice(i, 1);
            window.vueAppInstance.$localStorage.set(
              this.activeTabName + "_" + cacheMethod,
              JSON.stringify(_datacacheObj)
            );
            return null;
          }
        }
      }
      //if _datacacheObj.length>100...then clean up old data TODO
      console.log("not found");
      return null;
    },
    setCache(cacheMethod, cacheMethodParams, responseToCache) {
      let _datacache = window.vueAppInstance.$localStorage.get(
        this.activeTabName + "_" + cacheMethod
      );
      if (_datacache == null) {
        _datacache = "[]";
      }
      let _datacacheObj = JSON.parse(_datacache);
      let newObjForCache = {
        params: JSON.stringify(cacheMethodParams),
        response: responseToCache,
        cachedDateTime: Date().toString(),
      };
      //check do we already have the record...
      for (var i = 0; i < _datacacheObj.length; i++) {
        var _record = _datacacheObj[i];
        if (_record.params == JSON.stringify(cacheMethodParams)) {
          _datacacheObj.splice(i, 1); //remove the old record....
        }
      }
      _datacacheObj.push(newObjForCache);
      let _datacacheStr = JSON.stringify(_datacacheObj);
      console.log("adding to cache");
      window.vueAppInstance.$localStorage.set(
        this.activeTabName + "_" + cacheMethod,
        _datacacheStr
      );
    },
    getHistory() {
      this.$applog("SystemContainer - getHistory:");
      this.popupCenter({ url: "history", title: "History", w: 400, h: 300 });
    },
    getSalesList() {
      this.$applog("SystemContainer - getSalesList:");
      this.loading = true;
      this.resetAllKeys();
      let _that = this;
      this.setupHiddenFields("", "");
      this.dataProvider
        .getSalesList()
        .then((response) => {
          this.$applog("dataProvider - getSalesList:" + response);
          this.searchData = response;
          this.loading = false;
        })
        .catch((e) => {
          this.$applog(e);
          _that.loggedin = false;
          _that.trylogin = true;
        });
      this.showSearchResultsKey = true;
      this.propSearchMode = true;
      this.propHomeMode = true;
      this.propViewEntityMode = false;
    },
    getCasesList() {
      this.$applog("SystemContainer - getCasesList:");
      this.loading = true;
      this.resetAllKeys();
      let _that = this;
      this.setupHiddenFields("", "");
      this.dataProvider
        .getCasesList()
        .then((response) => {
          this.$applog("dataProvider - getCasesList:" + response);
          this.searchData = response;
          this.loading = false;
        })
        .catch((e) => {
          console.error(e);
          _that.loggedin = false;
          _that.trylogin = true;
        });
      this.showSearchResultsKey = true;
      this.propSearchMode = true;
      this.propHomeMode = true;
      this.propViewEntityMode = false;
    },
    getBookmarks() {
      this.$applog("SystemContainer - getBookmarks:");
      this.loading = true;
      this.resetAllKeys();
      let _that = this;
      this.dataProvider
        .getBookmarks()
        .then((response) => {
          this.$applog("dataProvider - getBookmarks:" + response);
          this.searchData = response;
          this.loading = false;
        })
        .catch((e) => {
          this.$applog(e);
          _that.loggedin = false;
          _that.trylogin = true;
        });
      this.showSearchResultsKey = true;
      this.propSearchMode = true;
      this.propHomeMode = true;
      this.propViewEntityMode = false;
    },
    openNewDialog(_entity) {
      this.$applog("SystemContainer - openNewDialog:" + _entity);
      //we have this.entityData which is our context
      //get the screen metadata
      let _that = this;
      this.dataProvider
        .getFormMetadata(_entity, this.entityData)
        .then((response) => {
          this.$applog(
            "SystemContainer - getFormMetadata:" +
              JSON.stringify(response.data.screenMetadata.screens)
          );
          this.dialogScreenMetadata = response.data.screenMetadata;
          this.dialogTitle = response.data.screenMetadata.screens[0].title;
          this.centerDialogVisible = true;
          // eslint-disable-next-line
          this.currentemail = vueAppInstance.$mailbox.getCurrentItem();
          this.$applog("SystemContainer - openNewDialog analyseCurrentEmail");
          let emailAnalysed = _that.analyseCurrentEmail();
          this.$applog(
            "SystemContainer - emailAnalysed:" + JSON.stringify(emailAnalysed)
          );

          for (var i = 0; i < this.dialogScreenMetadata.screens.length; i++) {
            let screenobj = this.dialogScreenMetadata.screens[i];
            for (var j = 0; j < screenobj.formElements.length; j++) {
              var formObj = screenobj.formElements[j];
              var formnameasString = new String(formObj.name);
              this.$applog(
                "SystemContainer - analyseCurrentEmail formnameasString:" +
                  formnameasString
              );
              if (!formObj.value) formObj.value = ""; //initialise the value
              //should move these to some mapping object (from screensetup maybe?)..so custom entities can benefit also ....todo..
              if (formObj.name == "lead_personemail") {
                if (emailAnalysed.emailaddresses.length > 0) {
                  formObj.value = emailAnalysed.emailaddresses[0].emailAddress;
                }
              } else if (formObj.name == "lead_personphonenumber") {
                if (emailAnalysed.phonenumbers.length > 0)
                  formObj.value = emailAnalysed.phonenumbers[0];
              } else if (
                formObj.name == "lead_personfaxnumber" ||
                formObj.name == "lead_personmobilenumber"
              ) {
                if (emailAnalysed.phonenumbers.length > 1)
                  formObj.value = emailAnalysed.phonenumbers[1];
              } else if (
                formObj.name == "lead_description" ||
                formObj.name == "case_description" ||
                formObj.name == "oppo_description"
              ) {
                formObj.value = emailAnalysed.subject;
              } else if (
                formObj.name == "lead_details" ||
                formObj.name == "case_problemnote" ||
                formObj.name == "oppo_note"
              ) {
                formObj.value = emailAnalysed.body;
              } else if (
                formObj.name == "comp_name" ||
                formObj.name == "lead_companyname"
              ) {
                formObj.value = emailAnalysed.name;
                formObj.value = this.capitalize(formObj.value);
              } else if (formObj.name == "lead_personphonenumber") {
                if (emailAnalysed.phonenumbers.length > 0) {
                  formObj.value = {
                    areacode_value: "",
                    countrycode_value: "",
                    phonenumber_value: emailAnalysed.phonenumbers[0],
                  };
                }
              } else if (
                formObj.name == "comp_website" ||
                formObj.name == "pers_website" ||
                formObj.name == "lead_companywebsite"
              ) {
                formObj.value = emailAnalysed.domain;
              } else if (
                formObj.name == "lead_personfirstname" ||
                formObj.name == "pers_firstname"
              ) {
                formObj.value = emailAnalysed.personfirstname;
              } else if (
                formObj.name == "lead_personlastname" ||
                formObj.name == "pers_lastname"
              ) {
                formObj.value = emailAnalysed.personlastname;
                formObj.value = this.capitalize(formObj.value);
              } else if (formnameasString.indexOf("phonefield_Business") == 0) {
                if (emailAnalysed.phonenumbers.length > 0)
                  formObj.value.phonenumber_value =
                    emailAnalysed.phonenumbers[0];
              } else if (formnameasString.indexOf("phonefield_Mobile") == 0) {
                if (emailAnalysed.phonenumbers.length > 1)
                  formObj.value.phonenumber_value =
                    emailAnalysed.phonenumbers[1];
              } else if (formnameasString.indexOf("emailfield_Business") == 0) {
                if (emailAnalysed.emailaddresses.length > 0)
                  formObj.value = emailAnalysed.emailaddresses[0].emailAddress;
              } else if (formnameasString.indexOf("emailfield_Sales") == 0) {
                if (emailAnalysed.emailaddresses.length > 1)
                  formObj.value = emailAnalysed.emailaddresses[1].emailAddress;
              } else if (formnameasString.indexOf("emailfield_Support") == 0) {
                if (emailAnalysed.emailaddresses.length > 2)
                  formObj.value = emailAnalysed.emailaddresses[2].emailAddress;
              }
              ////////////////////////////////////////////
              this.$applog(
                "SystemContainer - analyseCurrentEmail value:" + formObj.value
              );
            }
          }
        })
        .catch((e) => {
          this.$applog(
            "SystemContainer - openNewDialog analyseCurrentEmail ERROR:" +
              e.message
          );
          _that.loggedin = false;
          _that.trylogin = true;
        });
    },
    capitalize(val) {
      val = new String(val);
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    },
    analyseCurrentEmail() {
      this.$applog("analyseCurrentEmail");
      let res = {
        fromemail: "",
        subject: "",
        body: "",
        domain: "",
        name: "",
        fullpersonname: "",
        personfirstname: "",
        personlastname: "",
        emailaddresses: [],
        phonenumbers: [],
        postaladdress: "",
        emailtag: "",
        emailtagEntity: "",
        emailtagEntityId: 0,
      };
      if (typeof this.currentemail === "string") {
        this.currentemail = JSON.parse(this.currentemail);
      }
      this.$applog(
        "analyseCurrentEmail currentemail:" + JSON.stringify(this.currentemail)
      );
      if (!this.currentemail) {
        //if in dev mode for example..
        return res;
      }
      res.subject = this.currentemail.subject;
      res.body = this.currentemail.body;
      if (this.currentemail.sentItem) {
        if (this.currentemail.to.length > 0) {
          res.fullpersonname = this.currentemail.to[0].displayName;
        }
      } else {
        res.fullpersonname = this.currentemail.fullName;
      }
      let _fname = new String(res.fullpersonname);

      let _fnamearr = _fname.split(" ");
      res.personfirstname = _fnamearr[0];
      res.personlastname = _fname.substr(_fnamearr[0].length + 1);

      if (this.currentemail.sentItem && this.currentemail.to.length > 0) {
        this.$applog("analyseCurrentEmail #4");
        res.emailaddresses.push(this.currentemail.to[0]);
      } else {
        this.$applog("analyseCurrentEmail #5");
        this.$applog("analyseCurrentEmail #6:" + this.currentemail.from);
        res.emailaddresses.push(this.currentemail.from);
      }
      if (res.emailaddresses.length > 0) {
        this.$applog("analyseCurrentEmail #9");
        this.$applog(
          "analyseCurrentEmail #10:" + JSON.stringify(res.emailaddresses)
        );
        let _emailadd = new String(res.emailaddresses[0].emailAddress);
        let _emailadd_arr = _emailadd.split("@");

        res.domain = _emailadd_arr[1];
        let domainarr = res.domain.split(".");
        res.name = domainarr[0];
      }

      if (res.phonenumbers.length > 0)
        res.phonenumbers.push(res.phonenumbers[0].number);
      return res;
    },

    popupCenter({ url, title, w, h }, _datastring) {
      this.$applog("popupCenter url:" + url);
      let urlname = new String(url);
      this.$applog("popupCenter urlname:" + urlname);

      let _loc = new String(window.location.href);
      let _locarr = _loc.split("/#/");
      let fullurl = _locarr[0] + "/#/" + url;
      this.$applog("popupCenter fullurl:" + fullurl);

      this.$applog(
        "this.dataProvider.lastEntityResult=" +
          JSON.stringify(this.dataProvider.lastEntityResult)
      );

      let _oururlquery = "/" + this.activeTabName;
      let params =
        "{connection:'" + this.activeTabName + "',entity:'',entityid:''}";
      if (url == "fileemail/read") {
        this.$applog("**fileemail**");
        urlname = "fileemail";
        params =
          "{containercontext:'read',connection:'" +
          this.activeTabName +
          "',entity:'',entityid:''}";
        if (this.dataProvider.lastEntityResult != null) {
          _oururlquery +=
            "/" +
            this.dataProvider.lastEntityResult.screenMetadata.entity +
            "/" +
            this.dataProvider.lastEntityResult.screenMetadata.entityid;
          params =
            "{containercontext:'read',connection:'" +
            this.activeTabName +
            "'," +
            "entity:'" +
            this.dataProvider.lastEntityResult.screenMetadata.entity +
            "'," +
            "entityid:'" +
            this.dataProvider.lastEntityResult.screenMetadata.entityid +
            "'}";
        }
      } else if (url != "history") {
        this.$applog("**history**");
        if (this.dataProvider.lastEntityResult != null) {
          _oururlquery +=
            "/" +
            this.dataProvider.lastEntityResult.screenMetadata.entity +
            "/" +
            this.dataProvider.lastEntityResult.screenMetadata.entityid;
          params =
            "{connection:'" +
            this.activeTabName +
            "'," +
            "entity:'" +
            this.dataProvider.lastEntityResult.screenMetadata.entity +
            "'," +
            "entityid:'" +
            this.dataProvider.lastEntityResult.screenMetadata.entityid +
            "'}";
        }
      } else {
        params = "{connection:'" + this.activeTabName + "'}";
      }

      url = fullurl + _oururlquery;

      this.$applog("popup url=" + fullurl);
      try {
        this.$applog("popupCenter");
        this.$applog("urlname:" + urlname);
        this.$applog("url:" + url);
        this.$applog("params:" + JSON.stringify(params));
        this.$appContainer.popupCenter(urlname, url, _datastring, params);
        return;
      } catch (e) {
        this.$applog("popupCenter ERROR" + e.message);
      }
      //CODE FROM
      //https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
      // Fixes dual-screen position                             Most browsers      Firefox
      const dualScreenLeft =
        window.screenLeft !== undefined ? window.screenLeft : window.screenX;
      //const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

      const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;
      // const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      const systemZoom = width / window.screen.availWidth;
      const left = (width - w) / 2 / systemZoom + dualScreenLeft;
      //const top = (height - h) / 2 / systemZoom + dualScreenTop
      const top = 100;

      const newWindow = window.open(
        url,
        title,
        `
                scrollbars=yes,
                width=${w / systemZoom},
                height=${h / systemZoom},
                top=${top},
                left=${left}
                `
      );
      if (window.focus) newWindow.focus();
    },
    executeOption(_item) {
      let sitem = JSON.stringify(_item); //we do this weird thing as it seems to revert when in tag email...might be IE issue
      let _sitem = JSON.parse(sitem);

      if (_item == "logout") {
        this.loading = false;
        this.dataProvider.logout();
        this.loggedin = false;
        return;
      }
      this.$applog("SystemContainer - executeOption:" + _item.name);

      let _option = _item.name;
      let _data = {
        entity: this.entityData,
        email: this.currentemail,
      };
      if (_option == "focus") {
        this.checkweHaveCurrentEmail();
        this.dataProvider.toggleFocus();
        if (this.dataProvider.getFocus()) {
          _item.caption = this.$i18n.t("common.releasefocus");
          _item.value = true;
        } else {
          _item.caption = this.$i18n.t("common.Focus");
          _item.value = false;
        }
      } else if (_option == "replytagemail") {
        this.checkweHaveCurrentEmail();
        this.$appContainer.replytagemail(JSON.stringify(_data));
      } else if (_option == "getDocuments") {
        this.$appContainer.getDocuments(JSON.stringify(_data));
      } else if (_option == "tagemail") {
        this.$applog("SystemContainer - OPTION tagemail:" + _sitem.value);
        if (_sitem.value === true) {
          this.$appContainer.removeTag(
            this.dataProvider.ScreenSetup.tagPrefixSuffix
          );
          _item.caption = this.$i18n.t("common.AddTag");
          _item.value = false;
        } else {
          this.$appContainer.tagEmail(JSON.stringify(_data));
          _item.caption = this.$i18n.t("common.removetag");
          _item.value = true;
        }
      } else if (_option == "task") {
        this.popupCenter(
          { url: "task", title: this.$i18n.t("common.task"), w: 400, h: 300 },
          JSON.stringify(_data)
        );
      } else if (_option == "newtask") {
        this.$appContainer.newtask(JSON.stringify(_data));
      } else if (_option == "newappt") {
        this.$appContainer.newappt(JSON.stringify(_data));
      } else if (_option == "newemail") {
        this.$appContainer.newemail(JSON.stringify(_data));
      } else {
        alert("SystemContainer - executeOption not found:" + _option);
        this.$applog("SystemContainer - OPTION NOT FOUND:");
      }
    },
    hasTag() {
      this.$applog("SystemContainer - hasTag()");
      let _tagindex = 3;
      let tagarray = this.dataProvider.ScreenSetup.tagPrefixSuffix.split(",");
      this.instanceSettings.screenMetadata.options[_tagindex].value = false;
      if (this.currentemail && this.currentemail.subject != null) {
        if (this.currentemail.subject.indexOf(tagarray[0]) > -1)
          this.instanceSettings.screenMetadata.options[_tagindex].value = true;
      }
      if (this.currentemail && this.currentemail.body != null) {
        if (this.currentemail.body.indexOf(tagarray[0]) > -1)
          this.instanceSettings.screenMetadata.options[_tagindex].value = true;
      }
      if (this.$route.params.container == "compose") {
        _tagindex = 3;
      }
      if (this.instanceSettings.screenMetadata.options[_tagindex].value) {
        this.instanceSettings.screenMetadata.options[
          _tagindex
        ].caption = this.$i18n.t("common.removetag");
      } else {
        this.instanceSettings.screenMetadata.options[
          _tagindex
        ].caption = this.$i18n.t("common.AddTag");
      }
      this.$applog("SystemContainer - hasTag() END");
      return this.instanceSettings.screenMetadata.options[_tagindex].value;
    },
    checkweHaveCurrentEmail() {
      //this is to make sure we have a current item
      this.$applog("SystemContainer -  checkweHaveCurrentEmail");
      // eslint-disable-next-line
      this.currentemail = vueAppInstance.$mailbox.getCurrentItem();
      this.hasTag();
    },
    emailSearch(emailAddress) {
      this.loading = true;
      this.resetAllKeys();

      this.dataProvider
        .emailSearch(emailAddress)
        .then((response) => {
          this.searchData = response;
          this.loading = false;
        })
        .catch((e) => this.$applog(e));

      this.showSearchResultsKey = true;
      this.propSearchMode = true;
      this.propHomeMode = true;
    },
    async entitySearch(
      _entity,
      _searchstring,
      showNewIfNoRecord,
      _itemsPerPage,
      _page,
      _sortBy,
      _sortDesc
    ) {
      this.loading = true;
      this.$applog("SystemContainer - entitySearch:" + showNewIfNoRecord);
      let _that = this;
      await this.dataProvider
        .entitySearch(
          _entity,
          _searchstring,
          _itemsPerPage,
          _page,
          _sortBy,
          _sortDesc
        )
        .then((response) => {
          if (response.data.data.recordcount == 0) {
            this.$applog("SystemContainer entitySearch- recordcount:0");
            this.searchData = response.data;
            this.loading = false;
            this.showSearchResultsKey = true;
            this.propSearchMode = true;
            this.propHomeMode = true;
            if (showNewIfNoRecord === true) {
              this.$applog(
                "SystemContainer entitySearch- openNewDialog: " +
                  this.dataProvider.ScreenSetup.defaultSearchEntity
              );
              this.showSearch();
              this.openNewDialog(
                this.dataProvider.ScreenSetup.defaultSearchEntity
              );
            }
          } else if (response.data.data.recordcount > 1) {
            this.$applog(
              "SystemContainer entitySearch- recordcount:" +
                response.data.data.recordcount
            );
            this.searchData = response.data;
            this.loading = false;
            this.showSearchResultsKey = true;
            this.propSearchMode = true;
            this.propHomeMode = true;
            if (_entity == "__email__") {
              this.$applog(
                "SystemContainer-selectEntity :" +
                  response.data.data.tableData[0].entity +
                  "=" +
                  response.data.data.tableData[0]
              );
              //select the first item..but we have the full results there too
              this.selectEntity(
                response.data.data.tableData[0].entity,
                response.data.data.tableData[0]
              );
            }
          } else {
            //otherwise its a selectentity result
            //get the details and call selectentity
            this.$applog("SystemContainer entitySearch- recordcount:1");
            this.searchData = response.data;
            this.loading = false;
            this.showSearchResultsKey = true;
            this.propSearchMode = true;
            this.propHomeMode = true;
            this.$applog(
              "SystemContainer-selectEntity :" +
                response.data.data.tableData[0].entity +
                "=" +
                response.data.data.tableData[0]
            );
            this.selectEntity(
              response.data.data.tableData[0].entity,
              response.data.data.tableData[0]
            );
          }
        })
        .catch((e) => {
          this.$applog("SystemContainer - entitySearch ERROR:" + e.message);
          _that.loggedin = false;
          _that.trylogin = true;
        });
    },
    timeline() {
      console.log("timeline");
      this.popupCenter({ url: "timeline", title: "timeline", w: 300, h: 300 });
    },
    applyListFilter(filters) {
      //called from viewentity....when there is a filter on a list
      this.$applog("SystemContainer applyListFilter:");
      this.entityData.screenMetadata.filterscreen = {
        formElements: filters,
      };
      this.ViewEntitySelectTab(this.lasttabName);
    },
    ViewEntitySelectTab(tabName) {
      //the props of the ViewEntity must be set here as this controls the views witin the tab only
      this.$applog("SystemContainer ViewEntitySelectTab:" + tabName);
      this.lasttabName = tabName;
      if (tabName == "tabview-Summary") {
        //we do this so its not run after we select an entity
        return;
      }
      this.$applog(JSON.stringify(this.entityData));
      this.$applog("****************");
      let _that = this;
      this.tabData = null;
      this.tabloading = true;
      //todo...add in caching here too!!!
      this.dataProvider
        .getTabContent(this.entityData, tabName)
        .then((response) => {
          _that.tabData = response;
          _that.tabloading = false;
          _that.entityData.screenMetadata.filterscreen = {};
          // _that.$root.$emit("tabData", response);
          window.vueAppInstance.$localStorage.set(
            "tabData",
            JSON.stringify(response)
          );
          // alert(JSON.parse(response));
        })
        .catch((e) => {
          this.$applog(e);
          _that.loggedin = false;
          _that.loading = false;
          _that.trylogin = true;
        });
    },
    getTab(tab) {
      this.$applog("getTab:" + tab);
      for (var i = 0; i < this.entityData.screenMetadata.tabs.length; i++) {
        var _tab = this.entityData.screenMetadata.tabs[i];
        if (_tab.tabName == tab) {
          return _tab;
        }
      }
      return null;
    },
    showHome() {
      this.$applog("showHome");
      this.resetAllKeys();
      this.showHomeKey = true;
      this.propHomeMode = true;
      this.lastActiveView = "home";
      this.setupHiddenFields("", "");
      //get my crm data...
      let _that = this;
      if (
        this.$route.params.searchstring != "" &&
        this.$route.params.searchstring + "" != "undefined"
      ) {
        this.$applog("search on:" + this.$route.params.searchstring);
        this.entitySearch("", this.$route.params.searchstring);
      } else {
        this.dataProvider
          .getMyCRM()
          .then((response) => {
            _that.MyCRMData = response;
          })
          .catch((e) => {
            this.$applog(e);
            _that.loggedin = false;
            _that.trylogin = true;
          });
      }
    },
    fileEmail() {
      this.$applog("SystemContainer fileEmail");
      //should open dialog to save email
      //router....
      //'/fileemail/:containercontext?/:connection?/:entity?/:entityid?/',
      this.popupCenter({
        url: "fileemail/read",
        title: "File Email",
        w: 300,
        h: 300,
      });
    },
    LogCall() {
      this.$applog("SystemContainer LogCall");
      //should open dialog to save email
      //router....
      //'/fileemail/:containercontext?/:connection?/:entity?/:entityid?/',
      this.popupCenter({ url: "logcall", title: "Log Call", w: 300, h: 300 });
    },
    queueHandler() {
      this.$applog("SystemContainer queueHandler");
      let requestQueue2 = [];
      Storage.get({ key: "dialogmessageq" }).then((_queue) => {
        if (_queue.value == null) {
          this.$applog("SystemContainer queueHandler empty");
          return;
        }
        requestQueue2 = JSON.parse(_queue.value);

        for (var i = 0; i < requestQueue2.length; i++) {
          let _request = requestQueue2[i];
          if (_request.screenMetadata.method == "history") {
            this.$applog("SystemContainer history");
            this.selectEntity(_request.data.entity, {
              entityid: _request.data.entityid,
              entity: _request.data.entity,
            });
          } else if (_request.screenMetadata.method == "parseemail") {
            this.$applog("SystemContainer queueHandler parseemail");
            this.$applog(JSON.stringify(_request));
            if (this.currentemail == null) {
              //for testing in browser only
              this.currentemail = {
                from: "",
                fullname: "",
              };
            }
            this.currentemail.from.emailAddress = _request.data.entityid;
            this.$applog(
              "this.currentemail.from.emailAddress=" +
                this.currentemail.from.emailAddress
            );
            let _pers = new String(_request.data.entityid);
            let _persarr = _pers.split("@");
            this.currentemail.from.displayName = _persarr[0];
            this.$applog(
              "this.currentemail.from.emailAddress=" +
                this.currentemail.from.displayName
            );
            this.currentemail.from.fullName = _persarr[0];
            this.$applog(
              "this.currentemail.from.emailAddress=" +
                this.currentemail.from.fullName
            );
            this.currentemail.fullName = _persarr[0];
            this.$applog(
              "this.currentemail.fullName=" + this.currentemail.fullName
            );
            this.$applog("SystemContainer parseemail");
            this.$applog("currentemail=" + JSON.stringify(this.currentemail));
            this.$applog("SystemContainer parseemail entitySearch");
            this.entitySearch("__email__", this.currentemail, true);
          } else {
            this.$applog(
              "Cannot find ProcessQueueMessage Method: " +
                JSON.stringify(_request)
            );
            alert(
              "Cannot find ProcessQueueMessage Method: " +
                JSON.stringify(_request)
            );
          }
        }
        this.$applog("SystemContainer parseemail clear dialogmessageq");
        Storage.set({ key: "dialogmessageq", value: JSON.stringify([]) });
      });
    },
    mailboxChange() {
      this.$applog("SystemContainer mailboxChange");
      this.centerDialogVisible = false; //hide any dialog

      this.$applog("SystemContainer mailboxChange getCurrentItem");
      try {
        // eslint-disable-next-line
        this.currentemail = vueAppInstance.$mailbox.getCurrentItem();
      } catch (e) {
        this.$applog("SystemContainer mailboxChange getCurrentItem Error");
        throw "mailboxChange error!";
      }
      if (this.currentemail == null) {
        this.$applog("SystemContainer mailboxChange Exit");
        throw "mailboxChange error!";
      }
      this.$applog("SystemContainer mailboxChange currentemail");
      this.$applog(JSON.stringify(this.currentemail));

      //focus/sticky/freeze
      if (!this.dataProvider.getFocus()) {
        if (this.currentemail)
          this.entitySearch("__email__", this.currentemail, true);
      } else {
        this.$applog("SystemContainer mailboxChange FOCUS mode");
      }
      this.$applog("SystemContainer mailboxChange before hasTag");
      this.hasTag(); //must call this here as we might have focus on a tagged item but we want to tag other emails
    },
    parseEmail() {
      this.$applog("SystemContainer - ParseEmail:");
      this.popupCenter({
        url: "parseemail",
        title: "Parse Email",
        w: 400,
        h: 300,
      });
    },
    showSearch() {
      this.$applog("SystemContainer showSearch");
      this.resetAllKeys();
      this.propSearchMode = true;
      this.showSearchResultsKey = true;
    },
    closeSearch() {
      this.$applog("SystemContainer closeSearch");
      this.resetAllKeys();
      this.showSearchResultsKey = false;
      this.propSearchMode = false;
      if (this.lastActiveView != "") {
        if (this.lastActiveView == "entity") {
          this.propViewEntityMode = true;
          this.showEntityKey = true;
        } else if (this.lastActiveView == "home") {
          this.propHomeMode = true;
          this.showHomeKey = true;
        }
      }
    },
    resetAllKeys() {
      this.showHomeKey = false;
      this.showSearchResultsKey = false;
      this.activeScreen = "loading";
      this.showEntityKey = false;
      this.propSearchMode = false;
      this.propHomeMode = false;
      this.propViewEntityMode = false;
    },
    getEmptyInstanceSettings() {
      return {
        screenMetadata: new MyTaskPaneScreenSetupMetadata(),
        data: null,
      };
    },
    getEmptyEntity() {
      let _screenmetadata = new MyTaskPaneEntityScreenMetadata();
      _screenmetadata.container = "coreempty";
      (_screenmetadata.entity = "none"),
        (_screenmetadata.entityid = "-1"),
        (_screenmetadata.entityName = ""),
        (_screenmetadata.entityIcon = "");
      let _tab = {
        tabName: "empty",
        tabCaption: "_",
        component: "EntityViewX",
        enabled: true,
        selected: true,
      };
      _screenmetadata.tabs.push(_tab);

      let _entitydata = new EntityData();
      let _list = [];
      _list.push(_entitydata);
      return {
        screenMetadata: _screenmetadata,
        data: _list,
      };
    },
    getEmptySearch() {
      console.log("getEmptySearch");
      return {
        screenMetadata: {
          tabs: [],
        },
        data: {
          tableData: [],
          tableColumns: [],
          searchString: "",
        },
      };
    },
    getScreenSetup() {
      //fetch the data

      this.$applog("SystemContainer getScreenSetup");
      let _that = this;
      this.dataProvider
        .getScreenSetup()
        .then((response) => {
          _that.instanceSettings = response;
          try {
            this.$appContainer.setInstanceSettings(
              this.dataProvider.connectionName,
              JSON.stringify(_that.instanceSettings)
            );
          } catch (err) {
            this.$applog("getScreenSetup ERROR:" + err.message);
          }
          _that.loggedin = true;
          this.$applog("vueAppInstance.$mailbox.assignHandler");
          // eslint-disable-next-line
          vueAppInstance.$mailbox.assignHandler(_that.mailboxChange);
          this.$applog("vueAppInstance.$mailbox.assignQueueHandler");
          // eslint-disable-next-line
          vueAppInstance.$mailbox.assignQueueHandler(_that.queueHandler);
          try {
            _that.mailboxChange();
          } catch (noemail) {
            _that.showHome();
          }
        })
        .catch((e) => {
          this.$applog("getScreenSetup ERROR:" + e.message);
          _that.loggedin = false;
          _that.trylogin = true;
          Storage.set({ key: this.tab.tabName + "_authobject", value: null });
          //to do..show error message?
        });
    },
    async isloggedin() {
      this.userObject = this.dataProvider.lastUserObject;
      this.loggedin = true;
      this.getScreenSetup();
    },
    async login(logindata) {
      this.showloading = true;
      logindata.appName = "Accelerator";

      this.$applog("SystemContainer logindata:" + JSON.stringify(logindata));

      this.userObject = {};
      let _that = this;
      this.dataProvider
        .login(logindata)
        .then((response) => {
          _that.userObject = response;
          _that.loggedin = response.loggedin;
          if (_that.loggedin) {
            Storage.set({
              key: this.tab.tabName + "_authobject",
              value: JSON.stringify(this.dataProvider.lastUserObject),
            });
            _that.$applog("SystemContainer login getScreenSetup:");
            _that.getScreenSetup();
            _that.showloading = false;
          } else {
            this.loginAlert = true;
          }
          _that.showloading = false;
        })
        .catch((e) => {
          _that.loggedin = false;
          _that.showloading = false;
          _that.trylogin = true;
          this.$applog("login ERROR:" + e.message);
        });
    },
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
  mounted() {},
  created() {
    this.$applog("SystemContainer created:");

    if (window.vueAppInstance.$localStorage.get("appfontSize") != null) {
      let _fontsize = window.vueAppInstance.$localStorage.get("appfontSize");
      this.$applog("SystemContainer appfontSize set:" + _fontsize);
      document.documentElement.style.fontSize = _fontsize + "px";
    }
    if (window.vueAppInstance.$localStorage.get("apptheme") != null) {
      this.$vuetify.theme.themes.name = window.vueAppInstance.$localStorage.get(
        "apptheme"
      );
      this.$applog(
        "SystemContainer theme set:" + this.$vuetify.theme.themes.name
      );
      let themes = new ThemeFactoryClass().themes;
      //get the theme
      for (var ii = 0; ii < themes.length; ii++) {
        let themeObj = themes[ii];
        if (themeObj.name == this.$vuetify.theme.themes.name) {
          this.setTheme(themeObj);
        }
      }
    }

    this.instanceSettings = this.getEmptyInstanceSettings();
    this.searchData = this.getEmptySearch();
    this.entityData = this.getEmptyEntity();
    this.listData = this.getEmptySearch();

    this._DataFactory = new DataFactoryClass();
    this.dataProvider = this._DataFactory.getDataService(
      this.tab,
      this.activeTabName
    );
    this.dataProvider.syscontainer = this;
  },
};
</script>

<style scoped></style>

<template>
  <Layout>
    <template v-slot:header>
      <v-col class="text-left ml-2 mt-1" cols="20">
        <h5>{{ $t("emailtemplates-screen.title") }}</h5>
      </v-col>
      <v-col cols="4" class="text-right mr-1 mt-2">
        <MyFormSelect
          v-show="connectionSelect.options.length > 1"
          v-model="connectionSelect"
          @change="filterChange"
        ></MyFormSelect>
      </v-col>
    </template>
    <template v-slot:main>
      <div>
        <div id="General">
          <v-skeleton-loader
            v-if="screenloading"
            type="card-heading"
          ></v-skeleton-loader>
          <v-card
            id="GeneralHeader"
            v-show="dataObject.screenMetadata.entityIcon != null"
          >
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

          <div id="GeneralHeader" class="Header">
            <v-icon>mdi-file-plus-outline</v-icon>
            {{ $t("emailtemplates-screen.header") }}
          </div>
          <div name="tabone">
            <v-skeleton-loader
              v-if="screenloading"
              type="card-heading@3, text@9, list-item-two-line"
            ></v-skeleton-loader>
            <EmailTemplatesGeneral
              :dataObject="dataObject"
              :emailTemplate="templateData"
              @selectItem="selectItem"
              @change="templatefilterchange"
              @useTemplate="useTemplate"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <v-spacer></v-spacer>
      <v-btn tile large outlined class="ma-2" color="red" @click="closeClick()">
        <v-icon>mdi-close</v-icon>{{ $t("common.close") }}
      </v-btn>
    </template>
  </Layout>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//vue
import Layout from "@/layout/indexNoTabs";
import EmailTemplatesGeneral from "@/components/EmailTemplates/General";
import MyFormSelect from "@/components/FormElements/MyFormSelect";
//classes
import DataFactoryClass from "@/services/dataFactory";
import { EmailTemplateScreenMetadata } from "@/services/EmailTemplates/data.js";
import { Data } from "@/services/data";

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

//vue page object
export default {
  name: "emailtemplates",
  _DataFactory: [],
  components: {
    Layout,
    EmailTemplatesGeneral,
    MyFormSelect,
  },
  data() {
    return {
      screenloading: true,
      templateData: {
        type: Object,
      },
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
    };
  },
  methods: {
    templatefilterchange(value) {
      this.dataProvider
        .emailTemplatesGetData(
          value,
          this.$route.params.entity,
          this.$route.params.entityid
        )
        .then((response) => {
          this.dataObject = response;
          this.screenloading = false;
          this.$applog("EmailTemplates data=" + JSON.stringify(response));
        })
        .catch((e) => {
          this.screenloading = false;
          this.$applog("EmailTemplate filterChange ERROR:" + e.message);
        });
    },
    filterChange() {
      this.$applog("addressbook filterChange:");
      this.screenloading = true;
      this.dataProvider = this._DataFactory.getDataService(
        this.connectionSelect.value.value,
        this.connectionSelect.value.value
      );
      let _screenmetadata = new EmailTemplateScreenMetadata();
      let _data = new Data();
      this.dataObject = {
        screenMetadata: _screenmetadata,
        data: _data,
      };
      this.dataProvider
        .emailTemplatesGetData(
          "",
          this.$route.params.entity,
          this.$route.params.entityid
        )
        .then((response) => {
          this.dataObject = response;
          this.screenloading = false;
          this.$applog("EmailTemplates data=" + JSON.stringify(response));
        })
        .catch((e) => {
          this.screenloading = false;
          this.$applog("EmailTemplate filterChange ERROR:" + e.message);
        });
    },
    useTemplate(template) {
      this.$applog("emailtemplates main selectItem(" + template.entityid + ")");
      var _that = this; //IE seems to need this...
      this.dataProvider
        .emailTemplateGetContent(
          template.entityid,
          this.$route.params.entity,
          this.$route.params.entityid
        )
        .then(function(response) {
          _that.$applog("EmailTemplates emailTemplateGetContent START:");
          _that.$applog(JSON.stringify(response));
          _that.$applog("EmailTemplates emailTemplateGetContent END:");
          _that.dataProvider.actioned(
            "EmailTemplates",
            "Merge",
            JSON.stringify(response)
          );
          _that.templateData = response.data;
        })
        .catch(function(response) {
          //handle error
          this.$applog(
            "emailtemplates - emailTemplateGetContent ERROR=" + response
          );
          alert("emailtemplates emailTemplateGetContent error");
        });
    },
    selectItem(template) {
      this.$applog("emailtemplates main selectItem(" + template.entityid + ")");
      var _that = this; //IE seems to need this...
      this.dataProvider
        .emailTemplateGetContent(
          template.entityid,
          this.$route.params.entity,
          this.$route.params.entityid
        )
        .then(function(response) {
          _that.$applog("EmailTemplates emailTemplateGetContent START:");
          _that.$applog(JSON.stringify(response));
          _that.$applog("EmailTemplates emailTemplateGetContent END:");
          // _that.dataProvider.actioned(
          //   "EmailTemplates",
          //   "Merge",
          //   JSON.stringify(response)
          // );
          _that.templateData = response.data;
        })
        .catch(function(response) {
          //handle error
          this.$applog(
            "emailtemplates - emailTemplateGetContent ERROR=" + response
          );
          alert("emailtemplates emailTemplateGetContent error");
        });
    },
    closeClick() {
      this.$applog("emailtemplates cancelClick()");
      this.dataProvider.actioned("EmailTemplates", "close", "");
    },
  },
  created() {
    //get our data provider and fetch our data
    this.$applog("EmailTemplates created()");
    this.screenloading = true;
    let _screenmetadata = new EmailTemplateScreenMetadata();
    let _data = new Data();
    this.dataObject = {
      screenMetadata: _screenmetadata,
      data: _data,
    };
    let _that = this;
    Storage.get({ key: "connections" }).then((connections) => {
      Storage.get({ key: "activeTabName" }).then((activeTabName) => {
        let tabObj = JSON.parse(connections.value);
        if (this.$route.params.connection) {
          _that.connection = this.$route.params.connection;
        } else if (activeTabName && activeTabName.value) {
          _that.connection = activeTabName.value;
        } else {
          _that.connection = tabObj[0].tabName;
        }

        _that._DataFactory = new DataFactoryClass();
        _that.dataProvider = this._DataFactory.getDataService(
          _that.connection,
          _that.connection
        );
        for (var rr = 0; rr < tabObj.length; rr++) {
          _that.connectionSelect.options.push({
            text: tabObj[rr].tabName,
            value: tabObj[rr].tabName,
          });
        }
        _that.connectionSelect.value = {
          text: this.connection,
          value: this.connection,
        };

        _that.dataProvider
          .emailTemplatesGetData(
            "",
            this.$route.params.entity,
            this.$route.params.entityid
          )
          .then((response) => {
            _that.dataObject = response;
            this.screenloading = false;
            this.$applog("EmailTemplates data=" + JSON.stringify(response));
          })
          .catch((e) => {
            this.screenloading = false;
            this.$applog("EmailTemplates ERROR:" + e.message);
          });
      });
    });
  },
};
</script>

<style></style>

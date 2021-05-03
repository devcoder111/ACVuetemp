<template>
  <Layout>
    <template v-slot:header>
      <v-col class="text-left ml-2 mt-1" cols="20">
        <h5>{{ $t("task-screen.title") }}</h5>
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
        <div id="Task">
          <v-card id="GeneralHeader" v-if="!screenloading">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  <v-icon size="50">{{
                    Entitydata.screenMetadata.entityIcon
                  }}</v-icon>
                  {{ Entitydata.screenMetadata.entityName }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <div name="tabtwo">
            <v-form ref="NewTaskForm" name="NewTaskForm" lazy-validation>
              <TaskGeneral
                :dataObject="dataObject"
                :dataProvider="dataProvider"
              />
            </v-form>
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
        @click="saveTaskClick()"
        :loading="loading"
      >
        <v-icon>mdi-check</v-icon>{{ $t("common.save") }}
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
import Layout from "@/layout/index";
import Navbar from "@/layout/components/Task/Navbar";
import TaskGeneral from "@/components/Task/General";
import MyFormSelect from "@/components/FormElements/MyFormSelect";
//classes
import DataFactoryClass from "@/services/dataFactory";
import { TaskScreenMetadata } from "@/services/Task/data.js";
import { Data, EntityData, ScreenMetadata } from "@/services/data";

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

//vue page object
export default {
  name: "task",
  _DataFactory: [],
  components: {
    Layout,
    Navbar,
    TaskGeneral,
    MyFormSelect,
  },
  data() {
    return {
      screenloading: true,
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
      Entitydata: {
        type: Object,
        default: function() {
          let ed = new EntityData();
          this.Entitydata.screenMetadata = new ScreenMetadata();
          ed.screenMetadata.entityIcon = "";
          ed.screenMetadata.entityName = "";
          return ed;
        },
      },
      dataObject: {
        type: Object,
      },
    };
  },
  methods: {
    filterChange() {
      this.$applog("task filterChange:");
      this.dataProvider = this._DataFactory.getDataService(
        this.connectionSelect.value.value,
        this.connectionSelect.value.value
      );
      let _screenmetadata = new TaskScreenMetadata();
      let _data = new Data();
      this.dataObject = {
        screenMetadata: _screenmetadata,
        data: _data,
      };
      let _that = this;
      this.Entitydata = new EntityData();
      this.Entitydata.screenMetadata = new ScreenMetadata();
      this.Entitydata.screenMetadata.entityIcon = "";
      this.Entitydata.screenMetadata.entityName = "";
      this.dataProvider
        .selectEntity(this.$route.params.entity, this.$route.params.entityid)
        .then((response) => {
          this.Entitydata = response;
          this.dataProvider
            .getFormMetadata("communication", this.Entitydata)
            .then((response) => {
              this.dataObject = response.data;
            })
            .catch((e) => {
              this.$applog(e);
              _that.loggedin = false;
            });
        })
        .catch((e) => {
          this.$applog(e);
          _that.loggedin = false;
        });
    },
    validate() {
      let res = this.$refs.NewTaskForm.validate();
      return res;
    },
    saveTaskClick() {
      this.loading = true;
      if (!this.validate()) {
        this.loading = false;
        return;
      }
      this.$applog("saveTaskClick()");
      this.$applog("POST data2:" + JSON.stringify(this.dataObject));
      this.dataObject.entity = this.$route.params.entity;
      this.dataObject.entityid = this.$route.params.entityid;
      let ourdate = new Date();
      this.dataObject.actiondatetime =
        ourdate.getFullYear() +
        "-" +
        ourdate.getMonth() +
        "-" +
        ourdate.getDate() +
        " " +
        ourdate.getHours() +
        ":" +
        ourdate.getMinutes();

      let crmdata = {};
      crmdata.data = this.dataProvider.privateParseData(
        this.dataObject.screenMetadata
      );
      crmdata.contextentity = this.dataObject.entity; //eg when we create a communication from thew new task screen
      crmdata.contextentityid = this.dataObject.entityid;
      crmdata.actiondatetime = this.dataObject.actiondatetime;
      crmdata.entity = this.dataObject.screenMetadata.screens[0].entity;

      let _that = this;
      this.dataProvider
        .createTask(crmdata)
        .then(() => {
          //maybe check if there was an error?..todo
          try {
            this.dataProvider.actioned("Task", "close", "");
            _that.loading = false;
          } catch (e) {
            setTimeout(function() {
              window.close();
            }, 750);
          }
        })
        .catch((e) => alert("ERROR: createTask:" + e));
    },
    closeClick() {
      this.$applog("phone cancelClick()");
      this.dataProvider.actioned("Task", "close", "");
    },
  },
  created() {
    //get our data provider and fetch our data
    this.$applog("phone created()");
    this.$applog("params:" + JSON.stringify(this.$route.params));
    let _screenmetadata = new TaskScreenMetadata();
    let _data = new Data();
    this.dataObject = {
      screenMetadata: _screenmetadata,
      data: _data,
    };
    let _that = this;
    this.Entitydata = new EntityData();
    this.Entitydata.screenMetadata = new ScreenMetadata();
    this.Entitydata.screenMetadata.entityIcon = "";
    this.Entitydata.screenMetadata.entityName = "";
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

        this.dataProvider
          .selectEntity(this.$route.params.entity, this.$route.params.entityid)
          .then((response) => {
            this.Entitydata = response;
            this.screenloading = false;
            this.dataProvider
              .getFormMetadata("communication", this.Entitydata)
              .then((response) => {
                this.dataObject = response.data;
              })
              .catch((e) => {
                this.$applog(e);
                _that.loggedin = false;
              });
          })
          .catch((e) => {
            this.$applog(e);
            _that.loggedin = false;
          });
      });
    });
  },
};
</script>

<style scoped></style>

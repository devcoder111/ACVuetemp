<template>
  <v-form>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      :label="$t('emailtemplates-screen.inputsearch')"
      single-line
      hide-details
      autofocus
      ref="searchfilteremailtemplates"
      @input="change"
    ></v-text-field>

    <v-data-table
      :headers="dataObject.data.tableColumns"
      :items="dataObject.data.tableData"
      item-key="name"
      class="elevation-1"
      loading="data_loading"
      loading-text=""
      :search="search"
      mobile-breakpoint="0"
      :locale="this.$i18n.locale"
      :footer-props="tablefooterprops"
    >
      <template v-slot:[`header.__Select__`]="{ header }">
        {{ header.text.toUpperCase() }}
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <p class="cursor-point">{{ item.name }}</p>
      </template>
      <template v-slot:[`item.__Select__`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              @click="selectRow(item)"
              color="primary"
              icon
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-file-document-multiple-outline</v-icon>
            </v-btn>
          </template>
          <span>Preview Template</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog
      class="preview-template-dialog"
      v-model="previewTemplateDialog"
      max-width="600px"
      persistent
      scrollable
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title class="headline primary white--text">
          {{
            emailTemplate.emailtemplate == undefined
              ? ""
              : emailTemplate.emailtemplate.name
          }}
          <!-- {{ emailTemplateData.name }} -->
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="emailTemplate.emailtemplate != undefined">
          <div class="d-flex justify-end">
            <v-btn
              tile
              large
              outlined
              class="ma-2"
              color="accent"
              @click="prevTemplate"
              :disabled="prevBtnFlag"
            >
              <v-icon>mdi-arrow-left</v-icon>Prev
            </v-btn>
            <v-btn
              tile
              large
              outlined
              class="ma-2"
              @click="nextTemplate"
              :disabled="nextBtnFlag"
            >
              Next<v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
          <div v-if="emailTemplate.documentlinks != undefined">
            <p>Attachments:</p>

            <p
              v-for="(document, index) in emailTemplate.documentlinks"
              :key="index"
              class="attachmentWrapper"
            >
              <span v-if="document.filename.split('.')[1] == 'pdf'"
                ><v-icon>mdi-file-pdf</v-icon></span
              >
              <span
                v-else-if="
                  document.filename.split('.')[1] == 'doc' ||
                    document.filename.split('.')[1] == 'docx'
                "
                ><v-icon>mdi-file-word</v-icon></span
              >
              <span v-else-if="document.filename.split('.')[1] == 'txt'"
                ><v-icon>mdi-text-box-outline</v-icon></span
              >
              <span
                v-else-if="
                  document.filename.split('.')[1] == 'xls' ||
                    document.filename.split('.')[1] == 'xlsx'
                "
                ><v-icon>mdi-file-excel</v-icon></span
              >
              <span
                v-else-if="
                  document.filename.split('.')[1] == 'png' ||
                    document.filename.split('.')[1] == 'jpeg' ||
                    document.filename.split('.')[1] == 'gif' ||
                    document.filename.split('.')[1] == 'bmp' ||
                    document.filename.split('.')[1] == 'jpg'
                "
                ><v-icon>mdi-file-image</v-icon></span
              >
              <span v-else><v-icon>mdi-file-question-outline</v-icon></span>

              <a :href="document.link">{{ document.filename }}</a>
            </p>
          </div>
          <div v-html="emailTemplate.emailtemplate.email"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            tile
            large
            outlined
            class="ma-2"
            color="accent"
            @click="useTemplate"
          >
            <v-icon>mdi-check</v-icon>{{ $t("common.use") }}
          </v-btn>
          <v-btn
            tile
            large
            outlined
            class="ma-2"
            color="red"
            @click="previewTemplateDialog = false"
          >
            <v-icon>mdi-close</v-icon>{{ $t("common.close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";

//todo..phase 2...show preview of email template

export default {
  name: "General",
  data() {
    return {
      previewNumber: 0,
      prevBtnFlag: false,
      nextBtnFlag: false,
      previewTemplateDialog: false,
      emailTemplateData: this.emailTemplate.emailtemplate,
      search: "",
      awaitingSearch: false,
      tablefooterprops: {
        "items-per-page-text": "",
        "disable-items-per-page": false,
      },
    };
  },
  props: {
    dataObject: {
      type: Object,
    },
    emailTemplate: {
      type: Object,
    },
  },
  watch: {
    emailTemplate: function(newVal) {
      // watch it
      // this.$applog(
      //   "EntitySearchResults Prop propSearchMode changed: ",
      //   newVal,
      //   " | was: ",
      //   oldVal
      // );
      console.log("newVal", newVal);
      // this.data_loading = !this.data_loading;
    },
  },
  methods: {
    useTemplate() {
      this.$emit(
        "useTemplate",
        this.dataObject.data.tableData[this.previewNumber]
      );

      this.previewTemplateDialog = false;
    },
    prevTemplate() {
      this.previewNumber = this.previewNumber - 1;
      console.log("preview Number", this.previewNumber);
      this.selectRow(this.dataObject.data.tableData[this.previewNumber]);
      console.log("preview Number1", this.previewNumber);
    },
    nextTemplate() {
      this.previewNumber = this.previewNumber + 1;
      this.selectRow(this.dataObject.data.tableData[this.previewNumber]);
    },
    setFocus() {
      if (this.$refs.searchfilteremailtemplates)
        this.$refs.searchfilteremailtemplates.focus();
    },
    change() {
      this.$applog("EmailTemplates General change event");
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.$emit("change", this.search);
          this.awaitingSearch = false;
        }, 1500); // 1.5 sec delay
      }
      this.awaitingSearch = true;
    },
    selectRow(item) {
      // rows.splice(index, 1);
      this.previewNumber = this.dataObject.data.tableData.findIndex(
        (x) => x === item
      );
      if (this.previewNumber == 0) {
        this.prevBtnFlag = true;
      } else {
        this.prevBtnFlag = false;
      }
      if (this.previewNumber == this.dataObject.data.tableData.length - 1) {
        this.nextBtnFlag = true;
      }
      if (this.previewNumber != this.dataObject.data.tableData.length - 1) {
        this.nextBtnFlag = false;
      }
      console.log("Item idex", this.previewNumber);
      this.$applog("emailtemplates select row:" + JSON.stringify(item));
      this.$emit("selectItem", item);
      this.previewTemplateDialog = true;
    },
  },
  created() {
    setInterval(() => {
      this.setFocus();
    }, 500); // 0.5 sec delay
    console.log("dataOject", this.dataObject);
  },
};
</script>

<style scoped>
.selectablerow {
  cursor: pointer;
}
.attachmentWrapper {
  border: 1px solid;
  padding: 10px;
}
.attachmentWrapper i {
  padding-right: 10px;
}
</style>

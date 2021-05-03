<template>
  <v-form>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      :label="$t('attachdocs-screen.inputsearch')"
      single-line
      hide-details
      autofocus
      ref="searchfilterattachdocuments"
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

      <!-- <template slot="item" slot-scope="items">
        <tr class="selectablerow" @click="selectRow(items.item)">
          <td
            v-for="itemcol in dataObject.data.tableColumns"
            :key="itemcol.value"
          >
            {{ items.item[itemcol.value] }}
          </td>
        </tr>
      </template> -->
      <!-- <template v-slot:[`item.value`]="{ item }">
        <p>{{ item.value }}</p>
      </template> -->

      <template v-slot:[`item.filename`]="{ item }">
        <div>
          <p class="attachFilename" @click="selectRow(item)">
            {{ item.filename }}
          </p>
        </div>
      </template>
      <template v-slot:[`item.note`]="{ item }">
        <p class="attachFilename" @click="selectRow(item)">
          {{ item.note }}
        </p>
      </template>
      <template v-slot:[`item.__Select__`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <!-- <v-btn small color="primary" icon dark v-bind="attrs" v-on="on"> -->
            <a
              v-bind="attrs"
              v-on="on"
              style="text-decoration: none"
              :href="item.link"
              ><v-icon color="primary">mdi-attachment</v-icon></a
            >
            <!-- </v-btn> -->
          </template>
          <span>Preview</span>
        </v-tooltip>
      </template>

      <!-- REMOVED THIS...WHOLE LINE CAN BE CLICKED NOW  -->
      <!-- <template v-slot:[`item.__Select__`]="{ item }">
        <v-btn small @click="selectRow(item)" :color="item.tilecolor" icon>
          <v-icon>mdi-attachment</v-icon>
        </v-btn>
      </template> -->
    </v-data-table>
  </v-form>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
export default {
  name: "General",
  data() {
    return {
      search: "",
      awaitingSearch: false,
      tablefooterprops: {
        "items-per-page-text": "",
        "disable-items-per-page": true,
      },
    };
  },
  props: {
    dataObject: {
      type: Object,
    },
  },
  methods: {
    setFocus() {
      if (this.$refs.searchfilterattachdocuments)
        this.$refs.searchfilterattachdocuments.focus();
    },
    change() {
      this.$applog("Attachments General change event");
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.$emit("change", this.search);
          this.awaitingSearch = false;
        }, 1500); // 1.5 sec delay
      }
      this.awaitingSearch = true;
    },
    selectRow(index) {
      //rows.splice(index, 1);
      console.log("selectRow", index);
      this.$applog("attachdocuments select row:" + JSON.stringify(index));
      this.$emit("selectItem", index);
    },
  },
  created() {
    // setInterval(() => {
    //   this.setFocus();
    // }, 500); // 0.5 sec delay
  },
};
</script>

<style scoped>
.selectablerow {
  cursor: pointer;
}
.attachFilename {
  height: 100%;
  display: table-cell;
  cursor: pointer;
}
</style>

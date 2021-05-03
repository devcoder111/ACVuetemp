<template>
  <v-form>
    <v-data-table
      :headers="dataObject.data.tableColumns"
      :items="dataObject.data.tableData"
      item-key="name"
      class="elevation-1"
      loading="data_loading"
      loading-text=""
      mobile-breakpoint="0"
      :search="search"
      :items-per-page="10"
      :locale="this.$i18n.locale"
      :footer-props="{
        'items-per-page-text': this.$i18n.t('common.rowsperpage'),
      }"
    >
      <template v-slot:[`header.__Select__`]="{ header }">
        {{ header.text.toUpperCase() }}
      </template>

      <template v-slot:[`item.EmailAddress`]="{ item }">
        <div class="cursor-point">
          <p @click="selectRow(item)">{{ item.EmailAddress }}</p>
        </div>
      </template>

      <!-- <template v-slot:[`item.__Select__`]="{ item }">
      <v-btn small
      @click="selectRow(item)"
      :color="item.tilecolor"
      icon
        >
       <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>  -->
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
    };
  },
  props: {
    dataObject: {
      type: Object,
    },
  },
  methods: {
    selectRow(item) {
      this.$applog("ParseEmail General selectRow");
      this.$applog(JSON.stringify(item));
      this.$emit("selectParseEmailItem", item);
    },
  },
};
</script>

<style></style>

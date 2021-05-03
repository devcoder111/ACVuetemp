<template>
  <div tscomp="EntitySearchResults" class="EntitySearchResults">
    <v-card class="EntitySearchResultsCard" elevation="0">
      <v-card-text>
        <v-form ref="SearchForm" name="SearchForm" lazy-validation>
          <div>
            <v-select
              :label="$t('taskpane-screen.Select')"
              v-model="searchinputselect"
              :items="instanceSettings.screenMetadata.searchEntities"
              item-text="caption"
              item-value="name"
              persistent-hint
              return-object
              hide-details
              ref="SearchFormSelect"
              v-on:focus="selectFocused"
              v-on:blur="selectBlur"
              v-on:change="onChangeEntity"
            ></v-select>
          </div>
          <div>
            <v-text-field
              :label="$t('taskpane-screen.PleaseInput')"
              v-model="searchinput"
              single-line
              hide-details
              autofocus
              ref="SearchFormInput"
              v-on:keydown.13="goSearch()"
            >
              <v-btn
                slot="append"
                id="EntityHeaderMenu_dosearch"
                tile
                dense
                outlined
                class="ma-2"
                color="accent"
                v-on:click="goSearch()"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-magnify
                    </v-icon>
                  </template>
                  <span>{{ $t("taskpane-screen.Go") }}</span>
                </v-tooltip>
                {{ $t("taskpane-screen.Go") }}
              </v-btn>
            </v-text-field>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-skeleton-loader
      type="table-heading, table-thead, table-row@10"
      :loading="loading"
      v-show="loading"
    ></v-skeleton-loader>

    <span
      v-show="!loading && dataObject.data.tableColumns.length > 0"
      class="searchresultsfor"
    >
      {{ $t("taskpane-screen.searchresultsfor") }}&nbsp;'{{
        dataObject.data.searchstring
      }}'
    </span>
    <v-data-table
      v-show="!loading"
      :headers="getHeaders()"
      :items="dataObject.data.tableData"
      :show-expand="showExpandOption()"
      :single-expand="singleExpand"
      :expanded="expanded"
      item-key="entityid"
      class="EntitySearchResultsClass"
      :items-per-page="itemsPerPage"
      :server-items-length="dataObject.data.recordcount"
      :options.sync="options"
      mobile-breakpoint="0"
      :locale="this.$i18n.locale"
      :hide-default-footer="checkHideFooter()"
      :footer-props="{
        'items-per-page-text': this.$i18n.t('common.rowsperpage'),
        'disable-items-per-page': checkDisableItemsPerPage(),
        'items-per-page-options': [5, 10, 15, 20],
      }"
    >
      <template v-slot:[`header.__Select__`]="{ header }">
        {{ header.text.toUpperCase() }}
      </template>

      <template v-slot:[`item.__Select__`]="{ item }">
        <v-btn small @click="selectRow(item)" :color="item.tilecolor" icon>
          <v-icon> {{ item.tileicon }}</v-icon>
        </v-btn>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td colspan="4" v-html="getExpandedMarkup(headers, item)"></td>
      </template>
    </v-data-table>
    <!-- <div class="d-flex">
      <div>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              outlined
              v-bind="attrs"
              v-on="on"
              style="padding: 0px; font-weight: 600"
            >
              {{ itemsPerPage }}
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in [5, 10, 15, 20, 25, 50, 100]"
              :key="index"
              link
              @click="itemsPerPage = item"
            >
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-pagination
        v-model="page"
        :length="pageCount"
        :total-visible="6"
        color="#7972C0"
      ></v-pagination>
    </div> -->
  </div>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
export default {
  name: "EntitySearchResults",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    dataObject: {
      type: Object,
    },
    instanceSettings: {
      type: Object,
    },
  },
  data() {
    return {
      entirySearchResult: {},
      disableSelectFocus: false,
      searchinput: "",
      searchinputselect: { name: "company", caption: "Company" },
      expanded: [],
      singleExpand: true,
      data_loading: false,
      itemsPerPage: 10,
      options: {},
      totalEntity: 0,
      entities: [],
      optionsChangedCound: 0,
      page: 1,
      // pageCount: 0,
    };
  },
  computed: {},
  watch: {
    dataObject: function(newVal, oldVal) {
      // watch it
      this.$applog(
        "EntitySearchResults Prop propSearchMode changed: ",
        newVal,
        " | was: ",
        oldVal
      );
      console.log("newVal", newVal);
      this.data_loading = !this.data_loading;
    },
    options: {
      handler(newVal) {
        this.optionsChangedCound += 1;
        console.log("options newVal", newVal);
        this.itemsPerPage = newVal.itemsPerPage;
        this.page = newVal.page;
        if (this.optionsChangedCound != 1) this.Search();
        console.log("options was changed1", this.optionsChangedCound);
        console.log("totalamount", this.dataObject);
      },
      deep: true,
    },
  },
  methods: {
    checkHideFooter() {
      if (this.dataObject.data.page) return false;
      return true;
    },
    checkDisableItemsPerPage() {
      if (this.dataObject.data.page) return false;
      return true;
    },
    onChangeEntity() {
      console.log("onChangeEntity", this.searchinputselect.name);
      // this.entirySearchResult = {};
      this.$emit("changeSelectEntiry", this.searchinputselect.name);
    },
    selectFocused() {
      this.disableSelectFocus = true;
    },
    selectBlur() {
      this.disableSelectFocus = false;
    },
    showExpandOption() {
      if (this.dataObject.data.tableColumns) {
        if (this.dataObject.data.tableColumns.length < 4) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    getExpandedMarkup(headers, item) {
      let res = "";
      for (var rr = 3; rr < this.dataObject.data.tableColumns.length; rr++) {
        res +=
          '<span _from="EntitySearchResults" class="fieldCaption">' +
          this.dataObject.data.tableColumns[rr].text +
          ":</span><br><p>" +
          item[this.dataObject.data.tableColumns[rr].value] +
          "</p>";
      }
      return res;
    },
    getHeaders() {
      //only show first 3 items
      var res = [];
      let cols = 3;
      if (this.dataObject.data.tableColumns.length < 3)
        cols = this.dataObject.data.tableColumns.length;
      for (var rr = 0; rr < cols; rr++) {
        res.push(this.dataObject.data.tableColumns[rr]);
      }
      return res;
    },
    selectRow(item) {
      this.$applog("EntitySearchResults selectRow()");
      this.$emit("selectEntity", item.entity, item);
    },
    goSearch() {
      this.page = 1;
      this.options.page = 1;
      this.Search();
    },
    Search() {
      this.$applog(
        "EntitySearchResults.vue Search()" +
          JSON.stringify(this.searchinputselect) +
          "=" +
          this.searchinput
      );
      const { sortBy, sortDesc } = this.options;
      console.log("sort", sortBy, sortDesc);

      this.entitySearch(
        this.searchinputselect.name,
        this.searchinput,
        this.itemsPerPage,
        this.page,
        sortBy,
        sortDesc
      );
      this.propSearchModeDialog = false;
    },
    entitySearch(
      _entity,
      _searchstring,
      _itemsPerPage,
      _page,
      _sortBy,
      _sortDesc
    ) {
      this.$applog("EntitySearchResults - entitySearch - itemsPerPage - page");
      this.$emit(
        "entitySearch",
        _entity,
        _searchstring,
        null,
        _itemsPerPage,
        _page,
        _sortBy,
        _sortDesc
      );
    },
    setFocus() {
      if (!this.disableSelectFocus) {
        if (this.$refs.SearchFormInput) this.$refs.SearchFormInput.focus();
      }
    },
  },
  created() {
    this.$applog("EntitySearchResults created()");
    this.entirySearchResult = this.dataObject.data.tableData;
    /*
       --MR removed this as it was stopping data entry when in search mode and New company was clicked
       setInterval(() => {
         this.setFocus();
          }, 500); // 0.5 sec delay
          */
  },
};
</script>

<style>
.searchresultsfor {
  font-size: 0.7em;
  font-weight: 500;
  color: black;
}

.iconfirst .v-data-table__wrapper table tr td:first-child {
  width: 65px;
}

.EntitySearchResultsClass {
  max-height: calc(100vh - 320px) !important;
  border-radius: 0px !important;
  box-shadow: unset !important;
}

.EntitySearchResultsCard {
  border-radius: 0px !important;
  box-shadow: 1px;
}
.EntitySearchResults {
  overflow: auto;
}
</style>

<template>
  <div class="EntityReportX">
    <v-skeleton-loader
      type="table-heading, table-thead, table-row@3"
      :loading="loading"
      v-show="loading"
    ></v-skeleton-loader>

    <v-card>
      <v-card-title v-if="tabDataObject">
        {{ tabDataObject.name }}
      </v-card-title>

      <v-card-text v-if="tabDataObject">
        <component
          v-for="(formItem, idx) in tabDataObject.reportdetails"
          :key="idx"
          :ref="formItem.name"
          :is="formItem.type"
          :chart-data="formItem.data"
        >
        </component>
      </v-card-text>
      <v-card-actions>
        <v-btn color="deep-purple lighten-2" text>
          Reserve
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
/*
POC here showing how we could 


*/

// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//note: i had to structure this component with
//v-if="tabDataObject.linked==true"
//as v-show was not working in el-table-column

//form components
//import MyFormLabelOnly from '@/components/FormElements/MyFormLabelOnly'
import DoughnutChart from "@/components/charts/DoughnutChart";

export default {
  name: "EntityReportX",
  data() {
    return {
      data: {
        datasets: [
          {
            data: [4],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
        labels: ["Logged"],
      },
    };
  },
  components: {
    // MyFormLabelOnly
    DoughnutChart,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    entityDataObject: {
      type: Object,
    },
    tabDataObject: {
      type: Object,
    },
    activeTabName: {
      type: String,
    },
  },
  methods: {},
  created() {
    this.$applog("EntityReportX created");
  },
};
</script>

<style scoped>
.EntityReportX {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 340px) !important;
  min-height: calc(100vh - 340px) !important;
}
</style>

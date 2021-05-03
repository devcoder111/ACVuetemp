<template>
  <div>
    <div>
      <v-text-field
        v-bind="$attrs"
        v-model="value.value"
        :label="value == null ? '' : value.caption"
        :name="value == null ? '' : value.name"
        :ref="value.name"
        :readonly="value == null ? false : value.readonly"
        :required="value == null ? false : value.required"
        :rules="rules"
        v-on:change="onChange"
      ></v-text-field>
    </div>
    <div
      v-if="hasOnChange()"
      v-html="ct_body"
      style=" float: relative;"
      class="block v-messages theme--light warning--text"
    ></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyFormInput",
  data() {
    return {
      ct_body: "",
    };
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return { name: "MyFormInputNotSet", value: "", caption: "not set" };
      },
    },
  },
  computed: {
    rules() {
      const rules = [];

      if (this.value.maxLength) {
        const rule = (v) =>
          (v || "").length <= this.value.maxLength ||
          "Maximum characters allowed: " + this.value.maxLength;

        rules.push(rule);
      }

      if (this.value.required) {
        const rule = (v) => !!v || "Required";

        rules.push(rule);
      }
      return rules;
    },
  },
  methods: {
    hasOnChange() {
      if (this.value.dedupeurl) {
        return true;
      } else {
        return false;
      }
    },
    onChange() {
      var _that = this;
      console.log("on change event");
      if (
        this.value.dedupeurl != "" &&
        this.value.dedupeurl + "" != "undefined"
      ) {
        //console.log(this.value.onchange);
        axios
          .get(this.value.dedupeurl + "&v=" + this.value.value)
          .then((response) => {
            _that.ct_body = response.data;
          })
          .catch((e) => {
            console.log("on change event ERROR:" + e.message);
          });
      }
    },
  },
};
</script>

<style scoped>
.textfielddiv {
  display: none;
}
.textfielddivshow {
  display: unset;
}
</style>

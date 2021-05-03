<template>
  <v-text-field
    v-bind="$attrs"
    v-model="value.value"
    :label="value == null ? '' : value.caption"
    :name="value == null ? '' : value.name"
    :ref="value.name"
    :readonly="value == null ? false : value.readonly"
    :required="value == null ? false : value.required"
    :clearable="!value.readonly"
    :rules="rules"
  ></v-text-field>
</template>

<script>
//MyFormInputPlain-created this as the one we changed MyFormInput was messing up the file email screen
export default {
  name: "MyFormInputPlain",
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
};
</script>

<style scoped></style>

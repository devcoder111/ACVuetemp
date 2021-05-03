<template>
  <div>
    <v-text-field
      prepend-icon="mdi-web"
      :label="value.caption"
      v-model="urlVal"
      :name="value.name"
      :clearable="true"
      :readonly="value == null ? false : value.readonly"
      :required="value == null ? false : value.required"
      :rules="[rules.hashttps]"
    >
    </v-text-field>
    <p v-if="urlErrorFlag" class="errorUrl" style="color: red">
      {{ $t("startup-screen.urlerrorMsg") }}
    </p>
  </div>
</template>

<script>
export default {
  name: "MyFormURL",
  data() {
    return {
      urlErrorFlag: false,
      rules: {
        hashttps: (value) => {
          let _valid = true;
          if (value.includes("eware.dll")) {
            value = value.split("eware.dll", 1)[0];
            this.urlErrorFlag = true;

            window.setInterval(() => {
              this.urlErrorFlag = false;
            }, 5000);

            this.urlVal = value;
          }
          if (value) _valid = value.indexOf("https://") == 0;
          if (!this.value.httpsRequired) return true;

          if (value == "" && !this.value.required) {
            _valid = true;
          } else {
            _valid = false;
          }
          this.value.valid = _valid;

          return (
            _valid || window.vueAppInstance.$i18n.t("common.httpsrequired")
          );
        },
      },
    };
  },
  watch: {
    urlErrorFlag(data) {
      console.log("urlErrorFlag", data);
    },
  },
  computed: {
    urlVal: {
      get() {
        if (this.value) {
          return this.value.value;
        } else {
          return "";
        }
      },
      set(newVal) {
        // this.urlVal = newVal;
        this.$emit("changedValue", newVal);
        console.log("newval", newVal);
      },
    },
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          name: "MyFormInputNotSet",
          value: "",
          caption: "not set",
          required: false,
          valid: true,
          httpsRequired: false,
        };
      },
    },
  },
};
</script>

<style scoped>
.errorUrl {
  padding-left: 30px;
  font-size: 1.5em;
}
</style>

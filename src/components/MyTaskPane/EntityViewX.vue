<template>
  <div
    tscomp="EntityViewX"
    class="EntityViewXClass"
    v-if="
      entityDataObject != null &&
        entityDataObject.data != null &&
        entityDataObject.data.length > 0
    "
  >
    <v-container fluid>
      <v-row dense>
        <v-col
          cols="12"
          v-for="section in entityDataObject.data[0].sections"
          :key="section.name"
          :id="section.name"
        >
          <v-skeleton-loader
            type="article,list-item-three-line"
            :loading="loading"
            v-show="loading"
          ></v-skeleton-loader>

          <v-card id="EntityViewXVCard" v-show="!loading" class="mx-auto my-1">
            <div class="EntityViewXCardClass">
              <span
                class="title EntityViewXCardClassTitle"
                tscomp="sectionHeader"
                >{{ section.title }}</span
              >

              <span
                v-show="section.externallink.url != '' || section.btnSearch"
                :color="section.tilecolor"
              >
                <v-btn
                  @click="externalClick(section)"
                  v-show="section.externallink.url != ''"
                  icon
                  :color="section.externallink.color"
                >
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
                <v-btn
                  @click="internallink(section)"
                  v-show="section.internallink.entity != ''"
                  :color="section.internallink.color"
                  icon
                >
                  <v-icon>{{ section.internallink.icon }}</v-icon>
                </v-btn>
              </span>
            </div>
            <v-card-text>
              <div
                v-for="sectionData in section.data"
                :key="sectionData.name"
                tscomp="EntityViewXCardSection"
              >
                <template v-if="sectionData.displayvalue != ''">
                  <input
                    type="hidden"
                    :id="sectionData.name"
                    :value="sectionData.value"
                  />
                  <span
                    _from="EntityView"
                    :ts_type="sectionData.type"
                    class="fieldCaption"
                    >{{ sectionData.caption }}:</span
                  >
                  <br />
                  <p>
                    <v-btn
                      @click="internallink(sectionData)"
                      v-show="sectionData.internallink.entity != ''"
                      :color="sectionData.internallink.color"
                      icon
                    >
                      <v-icon>{{ sectionData.internallink.icon }}</v-icon>
                    </v-btn>
                    <template v-if="sectionData.type == '13'">
                      <a
                        @click="externalClickLink(sectionData.displayvalue)"
                        class="externalLinkUnderline"
                      >
                        {{ sectionData.displayvalue }}
                      </a>
                    </template>
                    <template v-else-if="sectionData.type == 'phone'">
                      <a
                        :href="'tel:' + sectionData.displayvalue"
                        target="Blank"
                      >
                        {{ sectionData.displayvalue }}
                      </a>
                    </template>
                    <template
                      v-else-if="
                        sectionData.type == 'email' || sectionData.type == '12'
                      "
                    >
                      <a
                        :href="'mailto:' + sectionData.displayvalue"
                        target="Blank"
                      >
                        {{ sectionData.displayvalue }}
                      </a>
                    </template>
                    <template v-else-if="sectionData.externallink.url != ''">
                      <a
                        @click="externalClickLink(sectionData.externallink.url)"
                        class="externalLinkUnderline"
                        :style="getExternalLinkStyle(sectionData.externallink)"
                      >
                        {{ sectionData.displayvalue }}
                      </a>
                    </template>
                    <template v-else>
                      <span
                        v-if="
                          sectionData.displayvalue &&
                            sectionData.displayvalue.length > 200 &&
                            !readMoreActivated &&
                            readMoreActivatedFieldName != sectionData.name
                        "
                        style="white-space: pre-line"
                        >{{ sectionData.displayvalue.slice(0, 200) }}
                        <a
                          class=""
                          v-if="
                            sectionData.displayvalue &&
                              sectionData.displayvalue.length > 200 &&
                              !readMoreActivated &&
                              readMoreActivatedFieldName != sectionData.name
                          "
                          @click="activateReadMore(sectionData.name)"
                          href="#"
                        >
                          {{ $t("common.readmore") }}
                        </a>
                      </span>
                      <span
                        v-else
                        style="white-space: pre-line"
                        class="screentextvalue"
                        v-html="getSmartDisplay(sectionData)"
                      ></span>
                    </template>
                  </p>
                </template>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// eslint-disable-next-line
import { applog } from "@/services/applog.js";
//This is the display of cards (usually seen on a summary screen)
export default {
  name: "EntityViewX",
  props: {
    loading: {
      type: Boolean,
      default: false,
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
  watch: {
    loading: {
      handler() {
        //we use this to reset the readme flags...clever
        this.readMoreActivated = false;
        this.readMoreActivatedFieldName = "";
      },
    },
  },
  data() {
    return {
      activeSectionNames: [],
      readMoreActivated: false,
      readMoreActivatedFieldName: "",
    };
  },
  methods: {
    activateReadMore(fieldName) {
      this.readMoreActivatedFieldName = fieldName;
      this.readMoreActivated = true;
    },
    getSmartDisplay(sectionData) {
      let res = sectionData.displayvalue;

      return res;
    },
    getExternalLinkStyle(externallink) {
      return "color:" + externallink.color;
    },
    linkSearch(section) {
      //search in first connection..only in email window
      this.$emit("linkSearch", section);
    },
    externalClick(section) {
      //search in first connection..only in email window
      this.$applog("EntityViewX externalClick:" + section.externallink.url);
      this.externalClickLink(section.externallink.url);
    },
    externalClickLink(url) {
      this.$appContainer.OpenExternalURL(url);
    },
    internallink(section) {
      //search in first connection..only in email window
      this.$applog(
        "EntityViewX internallink:" + JSON.stringify(section.internallink)
      );
      this.$emit(
        "selectEntity",
        section.internallink.entity,
        section.internallink
      );
    },
  },
  computed: {
    sectionStyle() {
      return {
        "background-color":
          window.vueAppInstance.$vuetify.theme.themes["light"].secondary,
      };
    },
  },
  created() {
    this.$applog("EntityViewX created");
    if (this.entityDataObject && this.entityDataObject.data) {
      for (var i = 0; i < this.entityDataObject.data[0].sections.length; i++) {
        var section = this.entityDataObject.data[0].sections[i];
        if (!section.closed) {
          this.activeSectionNames.push(section.name);
        }
      }
    }
  },
};
</script>

<style scoped>
.readmore {
  display: none;
}

.EntityViewXClass {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 340px) !important;
  min-height: calc(100vh - 340px) !important;
}

#EntityViewXVCard {
  padding-left: 8px;
  padding-right: 8px;
  box-shadow: unset !important;
  border-radius: unset !important;
}

.EntityViewXCardClass {
  max-height: 55px;
  background: #f3f2f1;
}

.EntityViewXCardClassTitle {
  font-size: 1.1em !important;
}

.v-card__title {
  line-height: 1rem;
}
.externalLinkUnderline {
  text-decoration: underline;
}

p {
  margin-bottom: 1px;
}

.screentextvalue {
  font-weight: 500;
}
</style>

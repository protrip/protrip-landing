<template>
  <div>
    <div>
      <v-navigation-drawer
        v-model="drawer"
        app
        temporary
        width="1200px"
        color="#3077C5"
      >
        <div class="flex flex-row-reverse">
          <v-icon class="mt-40 mr-40 cursor-pointer" color="#ffffff" @click="close"> mdi-arrow-left</v-icon>
        </div>
        <div class="wheel-modal" v-if="prizes && prizes.length">
          <FortuneWheel
            :disabled="wheelDisable"
            class="flex-1 lucky-wheel mb-40"
            style="width: 50%"
            :canvas="canvasOptions"
            :prizes="prizes"
            :verify="canvasVerify"
            :use-weight="true"
            @rotateStart="onCanvasRotateStart"
            @rotateEnd="onRotateEnd"
          />
          <div v-if="!prize" class="flex-1 flex-column pl-40">
            <div class="text-white" v-html="wheelContent.body_html">

            </div>
            <v-row>
              <v-col cols="12">
                <div>
                  <v-form v-model="valid">
                    <v-row class="mt-15">
                      <v-col cols="12" md="12" class="py-0">
                        <v-text-field
                          :label="$t('full_name')"
                          :solo="true"
                          v-model="customer.name"
                          placeholder="Name"
                          :rules="[
                            v => !!v || $t('name_required'),
                          ]"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="py-0">
                        <v-text-field
                          :rules=" [
                            v => !!v || $t('phone_required'),
                            v => !!v && validatePhone(v) || $t('phone_incorrect')
                          ]"
                          :solo="true"
                          v-model="customer.phoneNumber"
                          :label="$t('phone_number')"
                          :placeholder="$t('phone_number')"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" v-if="inValidPlay" class="text-white">
                        {{ $t('wheel_play_invalid') }}
                      </v-col>
                    </v-row>
                    <v-btn
                      class="btn-custom-md mt-12 text-capitalize"
                      color="error"
                      elevation="0"
                      :disabled="!valid || buttonDisabled"
                      :loading="submitting"
                      @click="play"
                    >
                      {{ $t('wheel_play') }}
                    </v-btn>

                  </v-form>
                </div>
              </v-col>
            </v-row>
          </div>
          <div v-else class="flex-1 flex-column pl-40 text-white">
            <v-row class="mt-15">
              <v-col cols="12" md="12">
                <h1 class="text-white"> {{ $t('wheel_play_congra') }} </h1>

                <h2 class="text-white">{{ prize.title }}</h2>
                <h2 class="text-white">{{ prize.description }}</h2>
              </v-col>
            </v-row>

          </div>
        </div>
      </v-navigation-drawer>
    </div>

  </div>
</template>
<script>
import FortuneWheel from 'vue-fortune-wheel';
import 'vue-fortune-wheel/lib/vue-fortune-wheel.css';
import pageServices from "@/services/apis/pageServices";
import {validatePhoneNumber} from "~/core/utils/phone";
import luckyCampaignService from "@/services/apis/luckyCampaignService";
import {sleep} from "@/core/utils/common";

export default {
  name: 'PromoModal',
  components: {
    FortuneWheel,
  },
  data() {
    return {
      wheelContent: {},
      wheelDisable: true,
      drawer: false,
      canvasVerify: true, // Whether the turntable in canvas mode is enabled for verification
      canvasOptions: {
        borderWidth: 6,
        borderColor: '#ffffff',
        textDirection: 'vertical',
        fontSize: 28,
        textLength: 10
      },
      colors: [
        "#EB1F63",
        "#4251B6",
        "#148BC5",
        "#F44236",
        "#2297F5",
        "#888888",
        "#01BDD6",
        "#039688",
        "#FF5521",
        "#4DB151",
        "#73A03A",
        "#ABB82D",
        "#6939BA",
        "#E0CB1E",
        "#9E28B5",
        "#E8AB00",
        "#607D8D",
        "#EF9200",
        "#7B5449",
        "#48606C",
      ],
      prizes: [],
      codes: [],
      valid: false,
      rules: {
        name: [
          v => !!v || this.$t('name_required'),
        ],
      },
      customer: {
        name: '',
        phoneNumber: ''
      },
      submitting: false,
      inValidPlay: false,
      prize: undefined,
      buttonDisabled: false,
    }
  },
  props: {
    title: String,
    detail: String,
  },
  async fetch() {
    await this.wheelInit()
  },
  mounted() {
    this.init()
  },
  methods: {
    async wheelInit() {
      const res = await luckyCampaignService.getCodes({campaign_id: 1})
      if (res && res.success) {
        this.codes = res.codes
        this.prizes = res.codes.map((c, i) => {
          return {
            id: c.id, //* The unique id of each prize, an integer greater than 0
            name: c.display_code, // Prize name, display value when type is canvas (this parameter is not needed when type is image)
            value: c.title, //* Prize value, return value after spinning
            bgColor: this.colors[i], // Background color (no need for this parameter when type is image)
            color: '#ffffff', // Font color (this parameter is not required when type is image)
            // probability: 40, //* Probability, up to 4 decimal places (the sum of the probabilities of all prizes
            weight: c.probability // Weight, if useWeight is true, the probability is calculated by weight (weight must be an integer), so probability is invalid
          }
        })
      }
    },
    async init() {
      const res = await pageServices.getPageDetail({handle: 'wheel'})
      if (res && res.success) {
        this.wheelContent = res.page
        await sleep(1500)
        this.drawer = true
      }
    },
    onCanvasRotateStart(rotate) {
      if (this.canvasVerify) {
        const verified = true // true: the test passed the verification, false: the test failed the verification
        this.DoServiceVerify(verified, 500).then((verifiedRes) => {
          if (verifiedRes) {
            rotate() // Call the callback, start spinning
            this.canvasVerify = false // Turn off verification mode
          } else {
          }
        })
        return
      }
      // console.log('onCanvasRotateStart')
    },
    async onRotateEnd(prize) {
      this.wheelDisable = true
      const code = this.codes.find((e) => {
        return e.display_code === prize.name
      })
      this.prize = code
      try {
        await luckyCampaignService.submitReward(1, {
          reward: {
            phone_number: this.customer.phoneNumber,
            code: code.code,
          }
        })
      } catch (e) {
      }
    },
    // Simulate the request back-end interface, verified: whether to pass the verification, duration: delay time
    DoServiceVerify(verified, duration) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(verified)
        }, duration)
      })
    },
    async play() {
      try {
        this.submitting = true
        const lValid = await luckyCampaignService.checkValid(1, {
          reward: {
            phone_number: this.customer.phoneNumber,
          }
        })
        if (!lValid || !lValid.success) {
          this.inValidPlay = true
        } else {
          this.inValidPlay = false
          this.buttonDisabled = true
          this.wheelDisable = false
          await sleep(1000)
          document.getElementsByClassName('fw-btn__btn')[0].click()
        }
        this.submitting = false
      } catch (e) {
      }

    },
    close() {
      this.drawer = false
    },
    validatePhone(v) {
      return validatePhoneNumber(v)
    }
  },
}
</script>

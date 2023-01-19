<template>
  <div>
    <!-- -----------------------------------------------
    Banner
    ----------------------------------------------- -->
    <Banner @search="onApplyFilterSearch" />
    <!--  -----------------------------------------------
    ./ Banner
    ----------------------------------------------- -->
    <!-- -----------------------------------------------
    Top Featured
    ----------------------------------------------- -->
    <div v-show="loading">
      <div class="blog-component mini-spacer mt-36">
        <HomeLoading />
      </div>
    </div>
    <div id="main-div" v-show="!loading">
      <div class="blog-component mini-spacer mt-36">
        <v-container>
          <!-- -----------------------------------------------
              Start Blog Text
          ----------------------------------------------- -->
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
              <div class="text-black" v-html="page.body_html"></div>
            </v-col>
          </v-row>


        </v-container>
      </div>
      <div v-if="page.use_form" class="coming-wrapper" ref="coming-soon">
        <v-container>
          <!-- -----------------------------------------------
              Start Coming Soon
          ----------------------------------------------- -->
          <v-row>
            <v-col cols="12" lg="6" md="6" sm="12">
              <Contact :outline="false" :solo="true" />
            </v-col>
            <v-col></v-col>
          </v-row>

          <!-- -----------------------------------------------
              End Coming Soon
          ----------------------------------------------- -->
        </v-container>
      </div>
      <!-- -----------------------------------------------
      ./ Coming Soon
      ----------------------------------------------- -->
    </div>
  </div>
</template>

<script>
import Banner from '@/components/protrip/Banner'
import HomeLoading from '@/components/protrip/HomeLoading'
import Contact from '~/vuetify-package/nextkit/components/custom/contact/Contact'
import pageServices from "@/services/apis/pageServices";
import {cloneDeep} from "lodash";

export default {
  data() {
    return {
      loading: true,
      page: {}
    }
  },
  components: {
    Banner,
    HomeLoading,
    Contact,
  },
  async fetch() {
    await this.init()
  },
  async mounted() {
    await this.$vuetify.goTo('#main-div', {duration: 2000, easing: 'easeInQuad'})

  },
  computed: {
  },
  methods: {
    async init() {
      try {
        this.loading = true
        const [res] = await Promise.all([pageServices.getPageDetail({handle: this.$route.params.handle})])
        if (res.page) {
          this.page = cloneDeep({...res.page})
          this.loading = false
        } else if (!res.success && res.error_message === 'not_found') {
        }
      } catch (err) {
        await this.$router.push({name: 'coming-soon'})
      }
    },
    onApplyFilterSearch(filter) {
      this.$router.push({ name: 'search', query: filter })
    },
  },
}
</script>

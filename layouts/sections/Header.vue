<template>
  <div>
    <!-- -----------------------------------------------
          Start Header
    ----------------------------------------------- -->
    <v-app-bar
      app
      elevate-on-scroll
      class="app-header protrip-nav"
      :class="bg"
      elevation="4"
      :collapse="false"
    >
      <v-container class="py-0 fill-height">
        <!-- Logo -->
        <v-app-bar-nav-icon class="mobile-menu" @click.stop="$emit('drawerChange')"></v-app-bar-nav-icon>
        <Logo/>

        <v-spacer></v-spacer>
        <!-- Desktop view Navigation -->
        <div
          class="navigation"
          v-bind:class="[isActive ? 'd-block' : '']"
          @click="isActive = !isActive"
        >
          <ul class="navbar-nav">
            <v-tabs
              background-color="transparent"
              @change="onChangeRoute"
              :value="tab"
              color="white"
            >
              <v-tab
                v-for="(route, index) in routesBar"
                :href="route.key"
                :key="index"
              >
                <h3 class="text-capitalize font-weight-500" :class="customColor">{{
                    $t(route.value)
                  }}</h3>
              </v-tab>
            </v-tabs>
            <li class="nav-item">
              <!-- login-regiter -->
              <v-menu
                :close-on-content-click="false"
                :nudge-width="100"
                offset-y
                :close-on-click="true">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    elevation="0"
                    v-bind="attrs"
                    v-on="on"
                    class="text-capitalize transparent"
                    active-class="transparent"
                    depressed
                  >
                    <country-flag :country="language.flag" size="big"/>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(lang, index) in languages"
                    :key="index"
                  >
                    <v-list-item-title>
                      <v-btn
                        elevation="0"
                        class="text-capitalize transparent"
                        active-class="transparent"
                        depressed
                        @click="onChangeLang(lang.locale)"
                      >
                        <country-flag :country="lang.flag" size="normal" class="mr-2 mb-1"/>
                        {{ $t(lang.label) }}
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </li>
          </ul>
        </div>

      </v-container>
    </v-app-bar>
    <!-- -----------------------------------------------
          End Header
    ----------------------------------------------- -->
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'Header',
  props: {
    background: {
      type: String,
      default: () => 'transparent',
    },
    textColor: {
      type: String,
      default: () => 'white--text',
    },
    routesBar: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Logo: () => import('@/layouts/sections/Logo'),
  },
  data() {
    return {
      isActive: false,
      drawer: false,
      bg: 'transparent',
      items: [...Array(4)].map((_, i) => `Item ${i}`),
      languages: [
        {
          flag: 'vn',
          locale: 'vi',
          label: 'vietnamese',
        },
        {
          flag: 'us',
          locale: 'en',
          label: 'english',
        },
        {
          flag: 'fr',
          locale: 'fr',
          label: 'french',
        },
      ],
      language: {
        flag: 'vn',
        locale: 'vi',
        label: 'Vietnamese',
      },
      locale: 'vi',
      currentRoute: 'search',
      customColor: 'white--text',
    }
  },
  mounted() {
    if (localStorage.getItem('locale')) {
      this.$i18n.locale = localStorage.getItem('locale')
      this.onChangeLang(this.$i18n.locale)
    }
    window.onscroll = () => {
      if (document.documentElement.scrollTop >= 20) {
        this.bg = 'white'
        this.customColor = 'black--text'
      } else {
        this.bg = this.background
        this.customColor = 'white--text'
      }
    }
    this.bg = this.background
  },
  computed: {
    tab() {
      switch (this.$route.name) {
        case '', 'trip', 'search':
          return 'search'
        case 'page-handle':
          return `/page/${this.$route.params.handle}`
        default:
          return this.$route.name
      }
    }
  },
  methods: {
    ...mapActions('locale', ['setLocale']),
    toggleClass(event) {
      this.isActive = !this.isActive
    },
    onChangeLang(locale) {
      const language = this.languages.find((item) => item.locale === locale)
      this.language = language
      this.locale = locale

      this.setLocale(this.locale)
      localStorage.setItem('locale', this.locale)
      this.$i18n.locale = this.locale
    },
    onChangeRoute(name) {
      console.log(name)
    },
  },
  watch: {
    background: {
      handler: function (val) {
        this.bg = val
      },
      deep: true,
    },
  },
}
</script>

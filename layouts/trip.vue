<template>
  <v-app dark class="product">
    <!--v-if="$route.name!=='login'"-->
    <Header :background="background" @drawerChange="drawer = !drawer" :routes-bar="routesBar"/>
    <div>
      <v-main>
        <nuxt />
      </v-main>
    </div>

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item  v-for="(route, index) in routesBar">
            <v-list-item-title >
              <a :href="route.key">
                {{
                  $t(route.value)
                }}
              </a>
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <Footer />
  </v-app>
</template>

<script>
export default {
  data(){
    return {
      background: 'bg-danger-grediant',
      textNav: 'white--text',
      drawer: false,
      group: null,
      routesBar: [
        {
          key: '/page/flights',
          value: 'flights',
        },
        {
          key: '/page/hotels',
          value: 'hotel',
        },
        {
          key: 'search',
          value: 'tours',
        },
        {
          key: '/page/travel-cars',
          value: 'cars',
        },
        {
          key: '/page/visa',
          value: 'visa',
        },
        {
          key: '/page/playing-tickets',
          value: 'playing_tickets',
        },
      ],
    }
  },
  head: {
    script: [
      { hid: 'woay', src: 'https://woay.space/w/4cac5298-4693-4ccc-9c95-ee60e19a057b/popup.js', defer: true }
    ]
  },
  components: {
    Header: () => import("@/layouts/sections/Header"),
    Footer: () => import("@/layouts/sections/Footer")
  },
  mounted() {

  },
  methods: {}
};
</script>

<style></style>

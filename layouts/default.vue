<template>
  <v-app dark>
    <!--v-if="$route.name!=='login'"-->
    <Header @drawerChange="drawer = !drawer" :routes-bar="routesBar" />
    <div class="protrip-main">
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
  name: "default",
  components: {
    Header: () => import("@/layouts/sections/Header"),
    Footer: () => import("@/layouts/sections/Footer")
  },
  head: {
    script: [
      { hid: 'woay', src: 'https://woay.space/w/4cac5298-4693-4ccc-9c95-ee60e19a057b/popup.js', defer: true },
      { hid: 'wheel', src: 'https://www.wheelofpopups.com/api/v10193/widget.js', defer: true }
    ]
  },
  data(){
    return {
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
  methods: {}
};
</script>

<style></style>

<template>
  <v-app dark>
    <!--v-if="$route.name!=='login'"-->
    <Header />
    <div class="protrip-main">
      <v-main>
        <nuxt />
      </v-main>
    </div>

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
      { hid: 'woay', src: 'https://woay.space/w/4cac5298-4693-4ccc-9c95-ee60e19a057b/popup.js', defer: true }
    ]
  },
  methods: {}
};
</script>

<style></style>

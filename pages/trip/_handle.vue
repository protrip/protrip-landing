<template>
  <div class="product-detail">
    <v-container>
      <div v-show="isLoading">
        <v-skeleton-loader type="article, actions"></v-skeleton-loader>
      </div>
      <div v-show="!isLoading">
        <v-row>
          <v-col lg="8" md="8" sm="12">
            <!--    Carousel    -->
            <div class="mb-16">
              <v-carousel hide-delimiters v-model="currentImg" class="elevation-8">
                <v-carousel-item v-for="i in productDetail.images" :key="i.id" :src="i.src">
                  <!--                <v-img :src="i.src"></v-img>-->
                </v-carousel-item>
              </v-carousel>
              <ImageSlide
                :images="productDetail.images"
                @onSelectImage="(id) => (currentImg = id)"
                :current.sync="currentImg"
              />
            </div>

            <!--    Description    -->
            <div class="product-detail__description">
              <h1>{{ $t('description') }}</h1>
              <div>
                <div class="text-black" v-html="productDetail.long_description"></div>
              </div>
            </div>
          </v-col>
          <v-col lg="4" md="4" sm="12">
            <div>
              <h1>{{ productDetail.title }}</h1>
              <div class="product-price">
                <div class="d-flex align-center">
                  <p class="text-capitalize mr-8 my-0">{{ $t('from_price') }}:</p>
                  <p
                    v-show="productDetail.compare_at_price !== productDetail.price"
                    class="mr-4 text--strike-through my-0"
                  >{{ productDetail.compare_at_price | formatPrice }}</p
                  >
                  <v-chip class="ma-2" color="pink" label text-color="white">
                    <v-icon left> mdi-label</v-icon>
                    <b class="font-weight-bold">{{ productDetail.price | formatPrice }} </b>
                  </v-chip>
                </div>
                <v-rating
                  v-model="rating"
                  background-color="orange lighten-3"
                  color="orange"
                ></v-rating>
              </div>

              <div class="d-flex product-price" v-show="productDetail.short_description">
                <p class="black--text">{{ productDetail.short_description }}</p>
              </div>
              <!--    Button register tour        -->
              <div>
                <v-btn
                  class="w-100"
                  color="error"
                  @click="$vuetify.goTo('#contact-form', { duration: 1000, easing: 'easeInQuad' })"
                >
                  <span class="font-weight-bold">
                    {{ $t('checkout') }}
                  </span>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <!--     Form contact     -->
        <Contact id="contact-form"/>
      </div>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import {cloneDeep} from 'lodash'
import {formatCurrency} from '~/core/utils/currency'
import ImageSlide from '~/components/shared/ImagesCustom/ImageSlide'
import Contact from '~/vuetify-package/nextkit/components/custom/contact/Contact'
import tourisServices from "@/services/apis/tourisServices";

export default {
  head() {
    return {
      title: this.productDetail.title,
      description: this.productDetail.seo_description && this.productDetail.seo_description.legnth
        ? this.productDetail.seo_description
        : this.productDetail.short_description,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.productDetail.seo_title
            ? this.productDetail.seo_title
            : this.productDetail.title,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.productDetail.seo_description && this.productDetail.seo_description.legnth
            ? this.productDetail.seo_description
            : this.productDetail.short_description,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.productDetail.img_src,
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `${process.env.BASE_DOMAIN}/handle/${this.productDetail.handle}`,
        },
        {
          hid: 'title',
          name: 'title',
          content: this.productDetail.seo_title
            ? this.productDetail.seo_title
            : this.productDetail.title,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.productDetail.seo_title
            ? this.productDetail.seo_title
            : this.productDetail.title,
        },
        {
          hid: 'img',
          name: 'img',
          content: this.productDetail.img_src,
        },
        {
          hid: 'image',
          name: 'image',
          content: this.productDetail.img_src,
        },
        {
          hid: 'url',
          name: 'url',
          content: `${process.env.BASE_DOMAIN}/handle/${this.productDetail.handle}`,
        },
      ],
    }
  },
  layout: 'trip',
  name: 'TripDetail',
  components: {Contact, ImageSlide},
  data() {
    return {
      productDetail: {},
      currentImg: null,
      rating: 4,
      isLoading: true,
    }
  },
  computed: {},
  async fetch() {
    await this.init()
  },
  filters: {
    formatPrice(price) {
      return formatCurrency(price)
    },
  },
  methods: {
    ...mapActions('trip', {
      fetchDetailTrip: 'fetchDetailTrip',
    }),
    async init() {
      const handle = this.$route.params.handle
      const promise = [tourisServices.getDetailTour({handle: handle})]
      const [trip] = await Promise.all(promise)
      this.productDetail = cloneDeep({...trip, ...trip.trip})
      this.isLoading = false
    },
  },
}
</script>

<style scoped>
</style>

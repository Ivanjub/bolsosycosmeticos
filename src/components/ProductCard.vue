<template>
  
<div class="card">

    <!-- Swiper de imágenes -->
    <swiper
      v-if="images.length"
      :slides-per-view="1"
      loading="lazy"
      :modules="[Pagination]"
      pagination
      class="product-swiper" >

      <swiper-slide v-for="img in images" :key="img">
        <img :src="img"
        loading="lazy"
        decoding="async"
        alt="Producto"
        class="swiper-lazy" />

        <div class="swiper-lazy-preloader"></div>
      </swiper-slide>
    </swiper>

    <!-- fallback -->
    <img v-else src="/no-image.png" />

    <h3>{{ product.name }}</h3>
    <p class="price">$ {{ formatPrice(product.price) }}</p>
    <button @click="addToCart(product); cambiarTexto('Agregado')">Agregar</button>

       
  </div>

</template>

<script>

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import { addToCart } from '@/store/cart'
import { formatPrice } from '@/utils/format'
import { getPublicImage } from '../supabase'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default {
  name: 'ProductCard',
  components: {
    Swiper,
    SwiperSlide
  },

  props: {
    product: {
      type: Object,
      required: true
    }
  },

  setup() {
    return {
      Pagination,
      addToCart,
      formatPrice
    }
  },

  computed: {
    images() {
      return this.product.images
        ? this.product.images.map(path => getPublicImage(path))
        : []
    }
  },

  methods: {
    cambiarTexto() {
        this.texto = "Agregado"
    }
  }
}

</script>

<style scoped>
.card {
  width: 220px;
  border-radius: 10px;
  padding: 15px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,.1);
  text-align: center;
   
}

img {
  border-radius: 8px;
}

.price {
  color: #d63384;
  font-weight: bold;
}

button {
  margin-top: 10px;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: #d63384;
  letter-spacing: 0.5px;
  color: white;
  cursor: pointer;
  
}
button:active {
  background: #8e6394;
}

.product-swiper img {
  width: 100%;
  height: 300px;
  object-fit: flex;
}

.swiper-lazy-preloader {
  width: 24px;
  height: 24px;
}

</style>

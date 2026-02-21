<template>
  <article class="card">
    <div class="media">
      <swiper
        v-if="images.length"
        :slides-per-view="1"
        :modules="[Pagination]"
        :pagination="{ clickable: true }"
        class="product-swiper"
      >
        <swiper-slide v-for="img in images" :key="img">
          <img :src="img" loading="lazy" decoding="async" :alt="product.name" class="swiper-lazy" />
          <div class="swiper-lazy-preloader"></div>
        </swiper-slide>
      </swiper>

      <img v-else src="/no-image.png" :alt="product.name" class="fallback-image" />
      <span v-if="product.category" class="chip">{{ product.category }}</span>
    </div>

    <div class="content">
      <h3>{{ product.name }}</h3>
      <p class="price">$ {{ formatPrice(product.price) }}</p>

      <button @click="addToCart(product)">Agregar al carrito</button>
    </div>
  </article>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import { addToCart } from '@/store/cart'
import { formatPrice } from '@/utils/format'
import { getPublicImage } from '../supabase'

import 'swiper/css'
import 'swiper/css/pagination'

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
        ? this.product.images.map((path) => getPublicImage(path))
        : []
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #f0d4e1;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 24px rgba(17, 24, 39, 0.14);
}

.media {
  position: relative;
  padding: 10px 10px 0;
}

.content {
  padding: 12px 14px 14px;
  border-top: 1px solid #f0f0f0;
}

.chip {
  display: inline-flex;
  position: absolute;
  left: 14px;
  top: 14px;
  margin: 0;
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(248, 193, 217, 0.95);
  color: #4b2438;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
}

h3 {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 500;
  color: #222f3a;
  line-height: 1.3;
  min-height: 40px;
}

.price {
  margin: 0;
  color: #2a120f;
  font-weight: 700;
  font-size: 30px;
  line-height: 1.05;
}

button {
  margin-top: 12px;
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #2a120f;
  border-radius: 8px;
  background: #2a120f;
  color: #fffaf8;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #120605;
  color: #ffffff;
}

.product-swiper img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 6px;
}

.fallback-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 6px;
}

.swiper-lazy-preloader {
  width: 24px;
  height: 24px;
}

:deep(.swiper-pagination-bullet) {
  background: #ffffff;
  opacity: 0.9;
}

:deep(.swiper-pagination-bullet-active) {
  background: #d63384;
}

@media (max-width: 768px) {
  .content {
    padding: 10px 10px 12px;
  }

  .price {
    font-size: 24px;
  }

  .product-swiper img,
  .fallback-image {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .card {
    border-radius: 10px;
  }

  h3 {
    min-height: 36px;
    font-size: 14px;
  }

  .price {
    font-size: 21px;
  }

  button {
    padding: 9px 10px;
    font-size: 13px;
  }

  .product-swiper img,
  .fallback-image {
    height: 155px;
  }
}
</style>

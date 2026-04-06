<template>
  <article class="card" :class="{ added: addedPulse }">
    <div class="media">
      <swiper
        v-if="images.length"
        :slides-per-view="1"
        :modules="[Pagination]"
        :pagination="{ clickable: true }"
        @swiper="onCardSwiper"
        class="product-swiper"
      >
        <swiper-slide v-for="(img, index) in images" :key="img">
          <img
            :src="img"
            loading="lazy"
            decoding="async"
            :alt="product.name"
            class="swiper-lazy"
            @click="openGallery(index)"
          />
          <div class="swiper-lazy-preloader"></div>
        </swiper-slide>
      </swiper>

      <button
        v-if="images.length > 1"
        class="card-nav prev"
        aria-label="Imagen anterior"
        @click.stop="prevCardImage"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <button
        v-if="images.length > 1"
        class="card-nav next"
        aria-label="Imagen siguiente"
        @click.stop="nextCardImage"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <img v-else src="/no-image.png" :alt="product.name" class="fallback-image" @click="openGallery(0)" />
      <span v-if="product.category" class="chip">{{ product.category }}</span>
    </div>

    <div class="content">
      <h3>{{ product.name }}</h3>
      <p class="price">$ {{ formatPrice(product.price) }}</p>

      <button :class="{ added: addedPulse }" @click="handleAdd" :disabled="!canAddToCart">
        {{ addedPulse ? "Agregado" : canAddToCart ? "Agregar al carrito" : "Sin stock" }}
      </button>
      <p v-if="product.stock !== undefined && product.stock !== null" class="stock-label">
        Stock: {{ product.stock - inCartQuantity }} disponible
      </p>
    </div>
  </article>

  <div v-if="galleryOpen" class="gallery-overlay" @click="closeGallery">
    <div class="gallery-modal" @click.stop>
      <button class="gallery-close" @click="closeGallery">×</button>

      <div
        class="gallery-main"
        @pointerdown="onGalleryPointerDown"
        @pointermove="onGalleryPointerMove"
        @pointerup="onGalleryPointerUp"
        @pointercancel="onGalleryPointerUp"
        @pointerleave="onGalleryPointerUp"
      >
        <div class="gallery-backdrop" :style="galleryBackdropStyle"></div>
        <button class="gallery-nav prev" @click.stop="prevImage" aria-label="Foto anterior">
          <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <img
          :src="galleryImages[selectedImageIndex]"
          :alt="product.name"
          class="gallery-main-image"
          draggable="false"
          @dragstart.prevent
        />

        <button class="gallery-nav next" @click.stop="nextImage" aria-label="Foto siguiente">
          <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div class="gallery-actions">
        <span>{{ selectedImageIndex + 1 }} / {{ galleryImages.length }}</span>
      </div>

      <div class="gallery-bottom">
        <div class="thumbs">
          <button
            v-for="(img, index) in galleryImages"
            :key="img + index"
            :class="{ active: index === selectedImageIndex }"
            @click="selectImage(index)"
          >
            <img :src="img" :alt="`${product.name} ${index + 1}`" />
          </button>
        </div>

        <div class="gallery-product">
          <h3 class="gallery-product-name">{{ product.name }}</h3>
          <p class="gallery-product-price">$ {{ formatPrice(product.price) }}</p>
          <button :class="{ added: addedPulse }" @click="handleAdd">
            {{ addedPulse ? "Agregado" : "Agregar al carrito" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import { addToCart, cart } from '@/store/cart'
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

  computed: {
    inCartQuantity() {
      const item = cart.items.find((product) => product.id === this.product.id)
      return item ? item.quantity : 0
    },

    canAddToCart() {
      const stock = Number(this.product?.stock)
      return !Number.isFinite(stock) || this.inCartQuantity < stock
    },

    images() {
      return this.product.images
        ? this.product.images.map((path) => getPublicImage(path))
        : []
    },
    galleryImages() {
      return this.images.length ? this.images : ['/no-image.png']
    },
    galleryBackdropStyle() {
      const url = this.galleryImages[this.selectedImageIndex]
      return {
        backgroundImage: `url('${url}')`
      }
    }
  },

  data() {
    return {
      addedPulse: false,
      addPulseTimeout: null,
      galleryOpen: false,
      selectedImageIndex: 0,
      galleryTouchStartX: null,
      galleryTouchStartY: null,
      galleryTouchDeltaX: 0,
      galleryTouchDeltaY: 0,
      galleryPointerDown: false,
      galleryPointerId: null,
      cardSwiper: null
    }
  },

  setup() {
    return {
      Pagination,
      addToCart,
      formatPrice
    }
  },

  methods: {
    handleAdd() {
      addToCart(this.product)
      this.addedPulse = true

      if (this.addPulseTimeout) clearTimeout(this.addPulseTimeout)

      this.addPulseTimeout = setTimeout(() => {
        this.addedPulse = false
      }, 700)
    },
    openGallery(index) {
      this.selectedImageIndex = index
      this.galleryOpen = true
    },
    closeGallery() {
      this.galleryOpen = false
    },
    selectImage(index) {
      this.selectedImageIndex = index
    },
    nextImage() {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.galleryImages.length
    },
    prevImage() {
      const max = this.galleryImages.length - 1
      this.selectedImageIndex = this.selectedImageIndex === 0 ? max : this.selectedImageIndex - 1
    },
    onGalleryPointerDown(event) {
      if (event.target && event.target.closest && event.target.closest('.gallery-nav')) return
      if (event.button !== 0) return
      this.galleryPointerDown = true
      this.galleryPointerId = event.pointerId
      if (event.currentTarget && event.currentTarget.setPointerCapture) {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      this.galleryTouchStartX = event.clientX
      this.galleryTouchStartY = event.clientY
      this.galleryTouchDeltaX = 0
      this.galleryTouchDeltaY = 0
    },
    onGalleryPointerMove(event) {
      if (!this.galleryPointerDown || this.galleryTouchStartX === null) return
      this.galleryTouchDeltaX = event.clientX - this.galleryTouchStartX
      if (this.galleryTouchStartY !== null) {
        this.galleryTouchDeltaY = event.clientY - this.galleryTouchStartY
      }
    },
    onGalleryPointerUp(event) {
      if (!this.galleryPointerDown) return
      this.galleryPointerDown = false

      if (
        event &&
        event.currentTarget &&
        event.currentTarget.releasePointerCapture &&
        this.galleryPointerId !== null
      ) {
        event.currentTarget.releasePointerCapture(this.galleryPointerId)
      }
      this.galleryPointerId = null

      const threshold = 40
      const absX = Math.abs(this.galleryTouchDeltaX)
      const absY = Math.abs(this.galleryTouchDeltaY)
      const isHorizontalSwipe = absX >= threshold && absX > absY * 1.2

      if (isHorizontalSwipe) {
        if (this.galleryTouchDeltaX < 0) this.nextImage()
        else this.prevImage()
      }

      this.galleryTouchStartX = null
      this.galleryTouchStartY = null
      this.galleryTouchDeltaX = 0
      this.galleryTouchDeltaY = 0
    },
    onCardSwiper(swiper) {
      this.cardSwiper = swiper
    },
    prevCardImage() {
      if (!this.cardSwiper) return
      this.cardSwiper.slidePrev()
    },
    nextCardImage() {
      if (!this.cardSwiper) return
      this.cardSwiper.slideNext()
    },
    handleKeydown(event) {
      if (!this.galleryOpen) return

      if (event.key === 'Escape') {
        this.closeGallery()
        return
      }

      if (event.key === 'ArrowRight') {
        this.nextImage()
        return
      }

      if (event.key === 'ArrowLeft') {
        this.prevImage()
      }
    }
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },

  beforeUnmount() {
    if (this.addPulseTimeout) clearTimeout(this.addPulseTimeout)
    window.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>

<style scoped>
:where(.card, .gallery-modal) {
  --accent-dark: #2a120f;
  --accent-dark-hover: #120605;
  --accent-soft: #d63384;
  --nav-bg: rgba(42, 18, 15, 0.78);
  --nav-bg-hover: rgba(42, 18, 15, 0.95);
}

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

.card.added {
  animation: cardPulse 0.6s ease;
}

.media {
  position: relative;
  padding: 10px 10px 0;
}

.product-swiper,
.fallback-image {
  background: #fff;
  border: 1px solid #f1e1e9;
}

.card-nav,
.gallery-nav {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  background: var(--nav-bg);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 2;
}

.card-nav.prev {
  left: 16px;
}

.card-nav.next {
  right: 16px;
}

.card-nav {
  width: 32px;
  height: 32px;
}

.card-nav:hover,
.gallery-nav:hover {
  background: var(--nav-bg-hover);
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
  border: 1px solid var(--accent-dark);
  border-radius: 8px;
  background: var(--accent-dark);
  color: #fffaf8;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: var(--accent-dark-hover);
  color: #ffffff;
}

button.added {
  background: var(--accent-soft);
  border-color: var(--accent-soft);
}

.product-swiper img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 6px;
  cursor: zoom-in;
}

.fallback-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 6px;
  cursor: zoom-in;
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

  .card-nav {
    width: 28px;
    height: 28px;
  }
}

@keyframes cardPulse {
  0% { transform: scale(1); }
  35% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.gallery-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 14px;
}

.gallery-modal {
  width: min(860px, 100%);
  background: #ffffff;
  border-radius: 14px;
  padding: 14px;
  position: relative;
  height: min(92vh, 760px);
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto auto;
  gap: 10px;
  overflow: hidden;
}

.gallery-close {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #f4d8e5;
  color: #35111f;
  font-size: 20px;
  line-height: 1;
  display: grid;
  place-items: center;
  padding: 0;
  z-index: 4;
}

.gallery-main {
  border: 1px solid #f0d4e1;
  border-radius: 10px;
  overflow: hidden;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  touch-action: pan-y;
  background: #faf7f9;
  position: relative;
}

.gallery-backdrop {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  filter: blur(18px) saturate(0.95);
  transform: scale(1.12);
  opacity: 0.45;
  pointer-events: none;
}

.gallery-main-image {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center center;
  cursor: default;
  user-select: none;
  -webkit-user-drag: none;
  display: block;
  position: relative;
  z-index: 1;
}

.gallery-nav {
  width: 40px;
  height: 40px;
}

.gallery-nav.prev {
  left: 8px;
}

.gallery-nav.next {
  right: 8px;
}

.nav-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2.6;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.gallery-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.gallery-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 320px);
  align-items: end;
  gap: 10px;
  width: 100%;
}

.gallery-product {
  border: none;
  border-radius: 0;
  padding: 9px 2px 0;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: none;
  width: min(270px, 100%);
  justify-self: end;
  transform: translate(-16px, -6px);
}

.gallery-product-name {
  margin: 0 0 4px;
  min-height: 0;
  font-size: 14px;
  font-weight: 600;
  color: #202c37;
}

.gallery-product-price {
  margin: 0;
  font-size: 18px;
  line-height: 1.15;
  color: #2a120f;
}

.gallery-product button {
  margin-top: 8px;
  padding: 10px 12px;
  font-size: 14px;
}

.thumbs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 8px;
}

.thumbs button {
  margin: 0;
  padding: 0;
  border: 2px solid transparent;
  background: transparent;
  border-radius: 8px;
}

.thumbs button.active {
  border-color: #d63384;
}

.thumbs img {
  width: 100%;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
}

@media (max-width: 640px) {
  .gallery-modal {
    height: min(94vh, 680px);
    padding: 10px;
  }

  .gallery-nav {
    width: 34px;
    height: 34px;
  }

  .thumbs {
    display: flex;
    overflow-x: auto;
    gap: 8px;
    padding-bottom: 2px;
  }

  .gallery-bottom {
    grid-template-columns: 1fr;
  }

  .gallery-product {
    width: 100%;
    transform: none;
  }

  .thumbs button {
    flex: 0 0 64px;
  }
}
</style>

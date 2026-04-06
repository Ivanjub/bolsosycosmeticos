<script setup>
import { computed, ref, watch } from "vue"
import CartDrawer from "@/components/CartDrawer.vue"
import { cart } from "@/store/cart"

const isOpen = ref(false)
const cartPulse = ref(false)

const cartCount = computed(() => cart.items.length)

const toggleCart = () => {
  isOpen.value = !isOpen.value
}

watch(cartCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    cartPulse.value = true
    setTimeout(() => {
      cartPulse.value = false
    }, 450)
  }
})
</script>

<template>
  <div class="header">
    <button class="cart-icon" :class="{ pulse: cartPulse }" @click="toggleCart" aria-label="Abrir carrito">
      🛒
      <span v-if="cartCount">{{ cartCount }}</span>
    </button>

    <CartDrawer :isOpen="isOpen" @close="toggleCart" />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  background: transparent;
}

.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 24px;
  transform-origin: center;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #2a120f;
  color: #fffaf8;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 18px rgba(26, 11, 9, 0.22);
}

.cart-icon:hover {
  background: #140605;
}

.cart-icon.pulse {
  animation: cartBounce 0.45s ease;
}

.cart-icon span {
  position: absolute;
  top: -6px;
  right: -7px;
  background: #d63384;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  padding: 0 4px;
}

@media (max-width: 640px) {
  .cart-icon {
    width: 40px;
    height: 40px;
    font-size: 21px;
  }
}

@keyframes cartBounce {
  0% {
    transform: scale(1);
  }

  35% {
    transform: scale(1.2);
  }

  60% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}
</style>

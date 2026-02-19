<script setup>
import CartDrawer from "@/components/CartDrawer.vue"

import { cart } from "@/store/cart"
import { ref, computed } from "vue"

const isOpen = ref(false)

const cartCount = computed(() =>
  cart.items.reduce((acc, item) => acc + item.quantity, 0)
)

const toggleCart = () => (isOpen.value = !isOpen.value)

</script>

<template>
  <header class="header">
    <!-- <h1>Tienda Cosméticos</h1> -->

    <div class="cart-icon" @click="toggleCart">
      🛒
      <span v-if="cartCount">{{ cartCount }}</span>
    </div>

    <CartDrawer :isOpen="isOpen" @close="toggleCart" />
  </header>
  
</template>

<style scoped> 

.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 25px;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 10px;
  margin-left: 50px;
  background: black;
  color: white;
}

/* numero de productos sobre el carrito */
.cart-icon span {
  position: absolute;
  top: -8px;
  right: -10px;
  background: red;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  padding: 3px 6px;
}

</style>
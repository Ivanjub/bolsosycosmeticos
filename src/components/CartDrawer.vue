<script setup>
import { cart, removeFromCart, clearCart } from "@/store/cart"
import { sendToWhatsApp } from "@/utils/checkout"
import { formatPrice } from "@/utils/format"

defineProps(["isOpen"])
defineEmits(["close"])

const total = () =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const checkout = () => {
        sendToWhatsApp(cart.items, total())
  }
</script>

<template>
  
  <div v-if="isOpen" class="overlay" @click="$emit('close')"></div>

  <div :class="['drawer', { open: isOpen }]">

    <h2>Tu carrito</h2>

    <div v-if="cart.items.length === 0">
      Carrito vacío
    </div>

    <div v-else>
      <div v-for="item in cart.items" :key="item.id" class="item">
        <img :src="item.image" />
        
        <div>
          <p>{{ item.name }}</p>
          <p>Cant: {{ item.quantity }}</p>
          <p>${{ formatPrice(item.price * item.quantity) }}</p>
        </div>

        <button @click="removeFromCart(item.id)">❌</button>
      </div>

      <h3>Total: ${{ formatPrice(total()) }}</h3>

      <button class="btn-clear" @click="clearCart">
        Vaciar carrito
      </button>

      <button class="btn-buy" @click="checkout">
        Finalizar compra
      </button>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: black;
  color: white;
}

.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 22px;
}

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

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

.drawer {
  position: fixed;
  top: 0;
  right: -400px;
  width: 350px;
  height: 100%;
  background: #f8c1d9;
  color: black;
  padding: 20px;
  z-index: 999;
  transition: .3s;
  overflow-y: auto;
}

.drawer.open {
  right: 0;
}

.item {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.item img {
  width: 60px;
}

.btn-buy {
  width: 100%;
  background: black;
  color: white;
  padding: 12px;
  margin-top: 10px;
}
.btn-clear {
  width: 100%;
  background: red;
  color: white;
  padding: 12px;
  margin-top: 10px;
}

</style>
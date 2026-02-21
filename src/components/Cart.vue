<template>
  <div class="cart">
    <h2>Carrito</h2>

    <div v-if="cart.items.length === 0">
      Carrito vacío
    </div>

    <div v-else>
      <div v-for="item in cart.items" :key="item.id" class="cart-item">
        <img :src="item.image" width="50" />
        
        <p>{{ item.name }}</p>
        <p>Cantidad: {{ item.quantity }}</p>
        <p>${{ item.price * item.quantity }}</p>

        <button @click="removeFromCart(item.id)">
          Eliminar
        </button>
      </div>

      <h3>Total: ${{ total() }}</h3>

      <button @click="clearCart">
        Vaciar carrito
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartView"
}
</script>


<script setup>
import { cart, removeFromCart, clearCart } from "@/store/cart"

const total = () => {
  return cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
}
</script>


<style scoped>
.cart {
  background: #f4f4f4;
  padding: 20px;
  margin-top: 20px;
}

.cart-item {
  display: flex;
  gap: 10px;
  /* align-items: center; */
  margin-bottom: 10px;
}
</style>

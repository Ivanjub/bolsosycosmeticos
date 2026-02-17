<script setup>
import { removeFromCart } from "@/store/cart"

defineProps({
  item: Object
})
</script>

<template>
  <div class="cart-item">
    <img :src="item.image" />

    <div class="info">
      <p>{{ item.name }}</p>
      <p>Cantidad: {{ item.quantity }}</p>
      <p>${{ item.price * item.quantity }}</p>
    </div>

    <button @click="removeFromCart(item.id)">❌</button>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { addToCart, decreaseItemQuantity, removeFromCart } from "@/store/cart"
import { formatPrice } from "@/utils/format"
import { getPublicImage } from "@/supabase"

const props = defineProps({
  item: Object
})

const imageUrl = computed(() => {
  if (props.item?.image) return props.item.image

  const firstImage = Array.isArray(props.item?.images) ? props.item.images[0] : null
  return getPublicImage(firstImage)
})

const canIncrease = computed(() => {
  const stock = Number(props.item?.stock)
  return !Number.isFinite(stock) || props.item.quantity < stock
})
</script>

<template>
  <div class="cart-item">
    <img :src="imageUrl" :alt="item.name" />

    <div class="info">
      <p class="name">{{ item.name }}</p>
      <p class="subtotal">${{ formatPrice(item.price * item.quantity) }}</p>

      <div class="qty-controls">
        <button type="button" class="qty-btn" @click="decreaseItemQuantity(item.id)">-</button>
        <span>{{ item.quantity }}</span>
        <button type="button" class="qty-btn" @click="addToCart(item)" :disabled="!canIncrease">+</button>
      </div>
      <p v-if="item.stock !== undefined && item.stock !== null" class="stock-note">
        {{ item.quantity >= item.stock ? 'Límite de stock alcanzado' : 'Stock disponible: ' + (item.stock - item.quantity) }}
      </p>
    </div>

    <button type="button" class="remove-btn" @click="removeFromCart(item.id)">Eliminar</button>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.64);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.cart-item img {
  width: 68px;
  height: 68px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.info {
  flex: 1;
}

.name {
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.25;
}

.subtotal {
  margin: 0 0 8px;
  font-weight: 700;
  color: #2c1a17;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #2c1a17;
  background: #fffdfc;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.qty-btn:hover {
  background: #f2e4de;
}

.remove-btn {
  border: none;
  background: #f8d4d1;
  color: #7f1d1d;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.remove-btn:hover {
  background: #f2b9b5;
}

@media (max-width: 480px) {
  .cart-item {
    align-items: flex-start;
    gap: 8px;
    padding: 8px;
  }

  .cart-item img {
    width: 56px;
    height: 56px;
  }

  .name {
    font-size: 13px;
  }

  .qty-controls {
    gap: 6px;
  }

  .qty-btn {
    width: 26px;
    height: 26px;
  }

  .remove-btn {
    padding: 6px 8px;
    font-size: 11px;
  }
}
</style>

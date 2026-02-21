<script setup>
import { computed, ref, watch } from "vue"
import { cart, clearCart } from "@/store/cart"
import { sendToWhatsApp } from "@/utils/checkout"
import { formatPrice } from "@/utils/format"
import checkoutForm from "./checkoutForm.vue"
import CartItem from "./CartItem.vue"

defineProps(["isOpen"])
defineEmits(["close"])

const showCheckout = ref(false)

const itemCount = computed(() =>
  cart.items.reduce((sum, item) => sum + item.quantity, 0)
)

const total = () => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const handleClearCart = () => {
  clearCart()
  showCheckout.value = false
}

const processOrder = (client) => {
  sendToWhatsApp(cart.items, total(), client)
  clearCart()
  showCheckout.value = false
}

watch(itemCount, (count) => {
  if (count === 0) showCheckout.value = false
})
</script>

<template>
  <div v-if="isOpen" class="overlay" @click="$emit('close')"></div>

  <div :class="['drawer', { open: isOpen }]">
    <div class="drawer-header">
      <h2 class="title">Tu carrito</h2>
      <button type="button" class="close-btn" @click="$emit('close')" aria-label="Cerrar carrito">x</button>
    </div>

    <div v-if="cart.items.length === 0" class="empty-state">
      <p class="empty-title">Aun no agregas productos</p>
      <p class="empty-subtitle">Explora el catalogo y agrega tus favoritos.</p>
    </div>

    <div v-else class="content">
      <p class="items-count">{{ itemCount }} producto(s)</p>

      <CartItem v-for="item in cart.items" :key="item.id" :item="item" />

      <div class="summary">
        <h3 class="total">Total: ${{ formatPrice(total()) }}</h3>

        <button class="btn-clear" @click="handleClearCart">
          Vaciar carrito
        </button>

        <button class="btn-buy" @click="showCheckout = true">Finalizar compra</button>
      </div>
    </div>

    <checkoutForm v-if="showCheckout && itemCount > 0" @confirm="processOrder" />
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0.45);
}

.drawer {
  --drawer-bg: linear-gradient(180deg, #ffe7d7 0%, #ffd2c8 100%);
  --drawer-text: #2c1a17;
  --drawer-muted: #74524b;
  --drawer-accent: #1f1f1f;
  --drawer-accent-hover: #000000;
  position: fixed;
  top: 0;
  right: -400px;
  width: 370px;
  height: 100%;
  background: var(--drawer-bg);
  color: var(--drawer-text);
  padding: 18px 18px 24px;
  z-index: 999;
  transition: 0.3s;
  overflow-y: auto;
  box-shadow: -14px 0 30px rgba(0, 0, 0, 0.22);
  font-family: "Avenir Next", "Montserrat", "Segoe UI", sans-serif;
}

.drawer.open {
  right: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.title {
  margin: 0;
  font-size: 1.35rem;
  letter-spacing: 0.3px;
}

.close-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
  color: var(--drawer-text);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.16);
}

.content {
  margin-top: 10px;
}

.empty-state {
  margin-top: 16px;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.38);
}

.empty-title {
  margin: 0 0 6px;
  font-weight: 700;
}

.empty-subtitle {
  margin: 0;
  color: var(--drawer-muted);
  font-size: 14px;
}

.items-count {
  margin: 10px 0 14px;
  font-size: 14px;
  color: var(--drawer-muted);
}

.summary {
  margin-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.16);
  padding-top: 14px;
}

.total {
  margin: 0;
}

.btn-buy,
.btn-clear {
  width: 100%;
  border: none;
  border-radius: 10px;
  background: var(--drawer-accent);
  color: white;
  padding: 12px 14px;
  margin-top: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-buy:hover,
.btn-clear:hover {
  background: var(--drawer-accent-hover);
  transform: translateY(-1px);
}

.btn-clear {
  background: #5f3b37;
}

.btn-clear:hover {
  background: #4e2f2c;
}
</style>

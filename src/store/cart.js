import { reactive, watch } from "vue"

const storedCart = localStorage.getItem("cart")

export const cart = reactive({
  items: storedCart ? JSON.parse(storedCart) : []
})

// guardar automáticamente en localStorage
watch(
  () => cart.items,
  (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart))
  },
  { deep: true }
)

// funciones
export function addToCart(product) {
  const existing = cart.items.find(p => p.id === product.id)

  if (existing) {
    existing.quantity++
  } else {
    cart.items.push({ ...product, quantity: 1 })
  }
}

export function removeFromCart(id) {
  cart.items = cart.items.filter(p => p.id !== id)
}

export function clearCart() {
  cart.items = []
}

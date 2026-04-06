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
  const stock = Number(product?.stock)
  const hasStockLimit = Number.isFinite(stock)

  if (existing) {
    if (hasStockLimit && existing.quantity >= stock) return
    existing.quantity++
  } else {
    if (hasStockLimit && stock <= 0) return
    cart.items.push({ ...product, quantity: 1 })
  }
}

export function decreaseItemQuantity(id) {
  const existing = cart.items.find(p => p.id === id)
  if (!existing) return

  if (existing.quantity > 1) {
    existing.quantity--
    return
  }

  removeFromCart(id)
}

export function removeFromCart(id) {
  cart.items = cart.items.filter(p => p.id !== id)
}

export function clearCart() {
  cart.items = []
}

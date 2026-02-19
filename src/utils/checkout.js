export function sendToWhatsApp(cartItems, total) {

  const phone = "56989646126" // NÚMERO DE VENTA EN FORMATO INTERNACIONAL (SIN SIGNO +)

  let message = "Hola! Quiero comprar:%0A%0A"

  cartItems.forEach(item => {
    message += `🛍 ${item.name} x${item.quantity} - $${item.price * item.quantity}%0A`
  })

  message += `%0A💰 Total: $${total}`

  const url = `https://wa.me/${phone}?text=${message}`

  window.open(url, "_blank")
}
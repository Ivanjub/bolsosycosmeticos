<script setup>
import { computed, reactive, ref } from "vue"

const emit = defineEmits(["confirm"])
const submitted = ref(false)
const paymentOptions = ["Transferencia", "Efectivo", "Pago contra entrega"]
const phonePattern = /^[0-9+\s()-]{8,20}$/

const client = reactive({
  name: "",
  phone: "",
  address: "",
  comuna: "",
  payment: "Transferencia"
})

const errors = computed(() => {
  const name = client.name.trim()
  const phone = client.phone.trim()
  const address = client.address.trim()
  const comuna = client.comuna.trim()

  return {
    name: name.length >= 3 ? "" : "Ingresa un nombre de al menos 3 caracteres.",
    phone: phonePattern.test(phone) ? "" : "Ingresa un telefono valido (8 a 20 caracteres).",
    address: address.length >= 5 ? "" : "Ingresa una direccion de al menos 5 caracteres.",
    comuna: comuna.length >= 2 ? "" : "Ingresa una comuna valida.",
    payment: paymentOptions.includes(client.payment) ? "" : "Selecciona un metodo de pago."
  }
})

const hasErrors = computed(() => Object.values(errors.value).some(Boolean))

const submit = () => {
  submitted.value = true
  if (hasErrors.value) return

  emit("confirm", {
    ...client,
    name: client.name.trim(),
    phone: client.phone.trim(),
    address: client.address.trim(),
    comuna: client.comuna.trim()
  })
}
</script>

<template>
  <form class="checkout-form" @submit.prevent="submit">
    <h3>Datos del cliente</h3>

    <input v-model.trim="client.name" :class="{ invalid: submitted && errors.name }" placeholder="Nombre" required />
    <p v-if="submitted && errors.name" class="error">{{ errors.name }}</p>

    <input v-model.trim="client.phone" :class="{ invalid: submitted && errors.phone }" placeholder="Telefono" required />
    <p v-if="submitted && errors.phone" class="error">{{ errors.phone }}</p>

    <input
      v-model.trim="client.address"
      :class="{ invalid: submitted && errors.address }"
      placeholder="Direccion"
      required
    />
    <p v-if="submitted && errors.address" class="error">{{ errors.address }}</p>

    <input v-model.trim="client.comuna" :class="{ invalid: submitted && errors.comuna }" placeholder="Comuna" required />
    <p v-if="submitted && errors.comuna" class="error">{{ errors.comuna }}</p>

    <select v-model="client.payment" :class="{ invalid: submitted && errors.payment }">
      <option v-for="option in paymentOptions" :key="option">{{ option }}</option>
    </select>
    <p v-if="submitted && errors.payment" class="error">{{ errors.payment }}</p>

    <button type="submit">Confirmar pedido</button>
  </form>
</template>

<style scoped>
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.checkout-form input,
.checkout-form select {
  padding: 10px;
  border: 1px solid #ddd;
}

.checkout-form .invalid {
  border-color: #c62828;
}

.error {
  margin: -4px 0 0;
  color: #c62828;
  font-size: 12px;
}

.checkout-form button {
  background: black;
  color: white;
  padding: 12px;
}
</style>

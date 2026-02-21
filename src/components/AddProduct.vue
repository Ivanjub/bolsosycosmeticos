<template>
  <div class="add-product">
    <h3>Agregar Nuevo Producto</h3>

    <form @submit.prevent="addProduct">
      <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="message success">{{ successMessage }}</p>

      <label for="category">Categoria:</label>
      <select id="category" v-model="category" required>
        <option value="bolsos">Bolsos</option>
        <option value="maquillaje">Maquillaje</option>
        <option value="facial">Cuidado Facial</option>
        <option value="capilar">Cuidado Capilar</option>
      </select>

      <label for="name">Nombre:</label>
      <input id="name" type="text" v-model.trim="name" maxlength="120" required />

      <label for="price">Precio:</label>
      <input id="price" type="number" v-model.number="price" min="1" step="1" required />

      <label for="description">Descripcion:</label>
      <textarea id="description" v-model.trim="description" maxlength="500"></textarea>

      <label for="image">Imagenes:</label>
      <input id="image" ref="fileInputRef" type="file" multiple @change="onFilesSelected" accept="image/*" />

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "GUARDANDO..." : "GUARDAR PRODUCTO" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const MAX_FILES = 6
const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const emit = defineEmits(['product-added'])

const name = ref('')
const price = ref(0)
const description = ref('')
const category = ref('bolsos')
const selectedFiles = ref([])
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const fileInputRef = ref(null)

const validateFiles = (files) => {
  if (files.length > MAX_FILES) {
    return `Puedes subir maximo ${MAX_FILES} imagenes.`
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Formato de imagen no permitido. Usa JPG, PNG o WEBP.'
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Cada imagen debe pesar maximo ${MAX_FILE_SIZE_MB}MB.`
    }
  }

  return ''
}

const validateForm = () => {
  if (!category.value) return 'Selecciona una categoria.'
  if (!name.value || name.value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (!Number.isFinite(price.value) || price.value <= 0) return 'El precio debe ser mayor a 0.'

  return validateFiles(selectedFiles.value)
}

const onFilesSelected = (e) => {
  const files = Array.from(e.target.files || [])
  const fileError = validateFiles(files)

  if (fileError) {
    errorMessage.value = fileError
    selectedFiles.value = []
    if (fileInputRef.value) fileInputRef.value.value = ''
    return
  }

  errorMessage.value = ''
  selectedFiles.value = files
}

const uploadImages = async (productId) => {
  const paths = []

  for (const file of selectedFiles.value) {
    const filePath = `productos/${productId}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (error) throw error

    paths.push(filePath)
  }

  return paths
}

const addProduct = async () => {
  if (isSubmitting.value) return

  errorMessage.value = ''
  successMessage.value = ''

  const validationError = validateForm()
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  isSubmitting.value = true
  let createdProductId = null

  try {
    const normalizedCategory = category.value.trim().toLowerCase()

    const basePayload = {
      name: name.value.trim(),
      price: Number(price.value),
      description: description.value.trim(),
      category: normalizedCategory,
      images: []
    }

    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert(basePayload)
      .select()
      .single()

    if (insertError) throw insertError

    createdProductId = product.id

    const imagePaths = await uploadImages(product.id)

    const { error: updateError } = await supabase
      .from('products')
      .update({ images: imagePaths })
      .eq('id', product.id)

    if (updateError) throw updateError

    successMessage.value = 'Producto guardado correctamente.'

    name.value = ''
    price.value = 0
    description.value = ''
    category.value = 'bolsos'
    selectedFiles.value = []
    if (fileInputRef.value) fileInputRef.value.value = ''

    emit('product-added')
  } catch (error) {
    if (createdProductId) {
      await supabase.from('products').delete().eq('id', createdProductId)
    }

    console.error('Error guardando producto:', error)
    errorMessage.value = 'No se pudo guardar el producto. Revisa los datos e intenta de nuevo.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.add-product {
  margin-top: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  margin: 0;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 14px;
}

.error {
  background: #ffe5e5;
  color: #8b0000;
}

.success {
  background: #e8f7e8;
  color: #1e6b1e;
}

input,
textarea,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

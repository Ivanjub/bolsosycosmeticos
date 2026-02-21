<template>
  <section class="add-product">
    <div class="header">
      <h3>Agregar Nuevo Producto</h3>
      <p>Completa la ficha del producto para publicarlo en el catalogo.</p>
    </div>

    <form class="form-card" @submit.prevent="addProduct">
      <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="message success">{{ successMessage }}</p>

      <div class="fields-grid">
        <div class="field">
          <label for="category">Categoria</label>
          <select id="category" v-model="category" required>
            <option value="bolsos">Bolsos</option>
            <option value="maquillaje">Maquillaje</option>
            <option value="facial">Cuidado Facial</option>
            <option value="capilar">Cuidado Capilar</option>
          </select>
        </div>

        <div class="field">
          <label for="price">Precio</label>
          <input id="price" type="number" v-model.number="price" min="1" step="1" required />
        </div>
      </div>

      <div class="field">
        <label for="name">Nombre</label>
        <input id="name" type="text" v-model.trim="name" maxlength="120" required />
      </div>

      <div class="field">
        <label for="description">Descripcion</label>
        <textarea id="description" v-model.trim="description" maxlength="500"></textarea>
      </div>

      <div class="field">
        <label for="image">Imagenes</label>
        <input id="image" ref="fileInputRef" type="file" multiple @change="onFilesSelected" accept="image/*" />
        <small class="helper">{{ selectedFiles.length }} archivo(s) seleccionado(s)</small>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "GUARDANDO..." : "GUARDAR PRODUCTO" }}
      </button>
    </form>
  </section>
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
  --panel-bg: linear-gradient(145deg, #fff5ee 0%, #ffe7dc 100%);
  --panel-border: rgba(116, 72, 67, 0.22);
  --text-main: #2d1916;
  --text-soft: #6f4d46;
  --accent: #281210;
  --accent-hover: #140907;
  margin-top: 20px;
}

.header {
  margin-bottom: 14px;
}

.header h3 {
  margin: 0 0 4px;
  color: var(--text-main);
  font-size: 1.35rem;
}

.header p {
  margin: 0;
  color: var(--text-soft);
  font-size: 14px;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 16px 32px rgba(40, 22, 18, 0.12);
}

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  color: var(--text-main);
  font-weight: 600;
  font-size: 14px;
}

.helper {
  color: var(--text-soft);
  font-size: 12px;
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
  padding: 10px;
  border: 1px solid rgba(109, 74, 66, 0.28);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.86);
  color: var(--text-main);
}

textarea {
  min-height: 90px;
  resize: vertical;
}

button {
  width: 100%;
  border: none;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  padding: 12px;
  letter-spacing: 0.4px;
  box-shadow: 0 10px 22px rgba(20, 8, 7, 0.24);
  transition: all 0.2s ease;
  cursor: pointer;
}

button:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 640px) {
  .form-card {
    padding: 12px;
    border-radius: 12px;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .add-product {
    margin-top: 12px;
  }

  .header h3 {
    font-size: 1.2rem;
  }

  .header p {
    font-size: 13px;
  }

  input,
  textarea,
  select,
  button {
    font-size: 14px;
  }
}
</style>

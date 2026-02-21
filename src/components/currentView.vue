<template>
  <div id="app">
    <nav class="menu">
      <button
        v-for="category in categories"
        :key="category.value"
        @click="selectCategory(category.value)"
      >
        {{ category.label }}
      </button>

      <button v-if="isDev" @click="currentView = 'add'">Agregar producto</button>

      <headHeader></headHeader>
    </nav>

    <div class="contenedor">
      <ProductList v-if="currentView === 'products'" :products="filteredProducts" />

      <AddProduct v-if="currentView === 'add'" @product-added="handleProductAdded" />
    </div>
  </div>

  <br>

  <footer id="footer">
    <div class="contacto">
      <h4>Contacto</h4>
      <p><strong>Fono:</strong> <a href="tel:+56989646126">+56 9 8964 6126</a></p>

      <a
        href="https://wa.me/+56989646126"
        target="_blank"
        style="display:inline-flex;align-items:center;background:#25D366;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          width="20"
          style="margin-right:8px"
        />
        Contactar por WhatsApp
      </a>

      <p><strong>Email:</strong> <a href="mailto:ivan.guerrero@sistventas.cl">ivan.guerrero@sistemaventas.cl</a></p>
      <p>© Sistema 2026 - Creado por <a href="">SoporteAFTA</a>- Desarrollo web</p>
    </div>
  </footer>
</template>

<script setup>
const isDev = process.env.NODE_ENV === 'development'
</script>

<script>
import { supabase } from '../supabase'
import ProductList from './ProductList.vue'
import AddProduct from './AddProduct.vue'
import headHeader from './headHeader.vue'

export default {
  name: 'currentView',

  components: {
    ProductList,
    AddProduct,
    headHeader
  },

  data() {
    return {
      products: [],
      currentView: 'products',
      selectedCategory: 'all'
    }
  },

  computed: {
    categories() {
      const list = [{ value: 'all', label: 'Todos' }]
      const unique = new Set()

      this.products.forEach((product) => {
        const normalized = this.normalizeCategory(product.category)
        if (normalized) unique.add(normalized)
      })

      Array.from(unique)
        .sort((a, b) => a.localeCompare(b))
        .forEach((category) => {
          list.push({
            value: category,
            label: this.formatCategoryLabel(category)
          })
        })

      return list
    },

    filteredProducts() {
      if (this.selectedCategory === 'all') return this.products

      return this.products.filter((product) => {
        const productCategory = this.normalizeCategory(product.category)
        return productCategory === this.selectedCategory
      })
    }
  },

  async mounted() {
    await this.loadProducts()
  },

  methods: {
    normalizeCategory(category) {
      return (category || '').trim().toLowerCase()
    },

    formatCategoryLabel(category) {
      if (!category) return ''
      return category.charAt(0).toUpperCase() + category.slice(1)
    },

    async loadProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) {
        console.error(error)
        return
      }

      this.products = data

      if (
        this.selectedCategory !== 'all' &&
        !this.categories.some((category) => category.value === this.selectedCategory)
      ) {
        this.selectedCategory = 'all'
      }
    },

    async handleProductAdded() {
      this.currentView = 'products'
      await this.loadProducts()
    },

    selectCategory(category) {
      this.selectedCategory = category
      this.currentView = 'products'
    }
  }
}
</script>

<style>
.menu {
  display: flex;
  justify-content: center;
  gap: 10px;
  background: #f8c1d9;
  padding: 15px;
}

.menu button {
  background: white;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.menu button:hover {
  background: #ffe3ef;
}

#footer {
  background: #111;
  color: #fff;
  padding: 20px;
  text-align: center;
}

#footer a {
  color: #4fc3f7;
  text-decoration: none;
}

.contacto {
  margin-top: 10px;
}

.contenedor {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 15px;
  align-content: center;
}
</style>

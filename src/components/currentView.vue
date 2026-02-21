<template>
  <div id="app">
    <nav class="menu">
      <div class="menu-categories">
        <button
          v-for="category in categories"
          :key="category.value"
          :class="{ active: selectedCategory === category.value && currentView === 'products' }"
          @click="selectCategory(category.value)"
        >
          {{ category.label }}
        </button>

        <button v-if="isDev" :class="{ active: currentView === 'add' }" @click="currentView = 'add'">
          Agregar producto
        </button>
      </div>

      <headHeader class="menu-cart"></headHeader>
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
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: linear-gradient(120deg, #f9d6cb 0%, #f4c7d7 100%);
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(116, 72, 67, 0.2);
  box-shadow: 0 10px 24px rgba(58, 32, 28, 0.14);
}

.menu-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.menu-categories button {
  background: rgba(255, 255, 255, 0.72);
  color: #3c1f1a;
  border: 1px solid rgba(116, 72, 67, 0.15);
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.menu-categories button:hover {
  background: #fff7ef;
  transform: translateY(-1px);
}

.menu-categories button.active {
  background: #2a120f;
  color: #fffaf8;
  border-color: #2a120f;
}

.menu-cart {
  margin-left: auto;
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

@media (max-width: 768px) {
  .menu {
    gap: 8px;
    padding: 10px;
    border-radius: 10px;
    align-items: flex-start;
  }

  .menu-categories {
    gap: 8px;
  }

  .menu-categories button {
    padding: 8px 12px;
    font-size: 13px;
  }

  .contenedor {
    margin: 12px auto;
    padding: 0 8px;
  }
}

@media (max-width: 480px) {
  .menu {
    flex-direction: column;
    align-items: stretch;
  }

  .menu-categories {
    justify-content: flex-start;
  }

  .menu-categories button {
    font-size: 12px;
  }

  .menu-cart {
    align-self: flex-end;
    margin-left: 0;
  }

  #footer {
    padding: 14px 10px;
  }
}
</style>

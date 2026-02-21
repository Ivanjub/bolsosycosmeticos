<template>
  <section class="catalog">
    <div class="catalog-header">
      <h2>Productos Disponibles</h2>
      <p>{{ products.length }} resultado(s)</p>
    </div>

    <div v-if="products.length === 0" class="empty">
      <h3>No hay productos en esta categoria</h3>
      <p>Prueba con otra categoria o agrega nuevos productos.</p>
    </div>

    <div v-else class="grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductList',
  components: { ProductCard },
  props: {
    products: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.catalog {
  background:
    radial-gradient(circle at 8% 14%, rgba(255, 214, 183, 0.65) 0%, rgba(255, 214, 183, 0) 45%),
    radial-gradient(circle at 92% 85%, rgba(243, 189, 189, 0.55) 0%, rgba(243, 189, 189, 0) 45%),
    #fff9f3;
  border: 1px solid rgba(121, 81, 71, 0.16);
  border-radius: 18px;
  padding: 18px;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 14px;
}

.catalog-header h2 {
  margin: 0;
  color: #2d1916;
  font-size: 1.4rem;
}

.catalog-header p {
  margin: 0;
  color: #7b544b;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
}

.empty {
  border: 1px dashed rgba(121, 81, 71, 0.28);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 28px 12px;
}

.empty h3 {
  margin: 0 0 6px;
  color: #2d1916;
}

.empty p {
  margin: 0;
  color: #7b544b;
}

@media (max-width: 640px) {
  .catalog {
    padding: 12px;
  }

  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .catalog {
    border-radius: 12px;
    padding: 10px;
  }

  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .catalog-header h2 {
    font-size: 1.15rem;
  }

  .catalog-header p {
    font-size: 12px;
  }
}
</style>

<script setup>
import { get } from '@/plugins/api'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const product = ref(null)
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  const productId = route.params.id
  if (!productId) {
    error.value = 'Product ID not found'
  }
  try {
    product.value = await get(`/api/v1/scarpe/${productId}`)
    loading.value = false
    console.log({ product: product.value })
  } catch (err) {
    console.error('Error fetching product:', err)
  }
})
</script>

<template>
  <LoadingSpinner v-if="loading"/>
  <div class="product-detail-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchProduct">Retry</button>
    </div>

    <!-- Product Display -->
    <div v-else-if="product" class="product-detail">
      <div class="product-image">
        <img :src="product.immagine_url" :alt="product.nome" />
        <span v-if="product.sconto > 0" class="badge"> Sconto {{ product.sconto }}% </span>
      </div>

      <div class="product-info">
        <span class="category">{{ product.categoria }}</span>
        <h1>{{ product.nome }}</h1>
        <p class="description">{{ product.descrizione }}</p>

        <div class="price-container">
          <span v-if="product.sconto > 0" class="old-price"> €{{ product.prezzo }} </span>
          <span class="new-price">€{{ product.prezzo_scontato || product.prezzo }}</span>
        </div>

        <div class="product-meta">
          <p><strong>Materiale:</strong> {{ product.materiale }}</p>
          <p>
            <strong>Disponibilità:</strong>
            <span :class="product.disponibilita ? 'in-stock' : 'out-of-stock'">
              {{ product.disponibilita ? 'In stock' : 'Out of stock' }}
            </span>
          </p>
          <p v-if="product.taglie_disponibili && product.taglie_disponibili.length">
            <strong>Taglie:</strong>
            {{ product.taglie_disponibili.join(', ') }}
          </p>
        </div>

        <button class="add-to-cart-btn" @click="addToCart" :disabled="!product.disponibilita">
          {{ product.disponibilita ? 'Aggiungi al Carrello' : 'Non Disponibile' }}
        </button>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="not-found">
      <h2>Product not found</h2>
      <router-link to="/">Back to products</router-link>
    </div>
  </div>
</template>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-state,
.error-state,
.not-found {
  text-align: center;
  padding: 40px;
}

.error-state button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.description {
  color: #555;
  line-height: 1.6;
}

.price-container {
  margin: 10px 0;
}

.old-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
  margin-right: 15px;
}

.new-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d32f2f;
}

.product-meta {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.product-meta p {
  margin: 5px 0;
}

.in-stock {
  color: #28a745;
  font-weight: bold;
}

.out-of-stock {
  color: #dc3545;
  font-weight: bold;
}

.add-to-cart-btn {
  padding: 15px 30px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #0056b3;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>

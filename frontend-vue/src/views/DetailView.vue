<template>
  <h1>Dettaglio Prodotto</h1>
  {{ product }}
</template>

<script setup>
import { get } from '@/plugins/api'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)
const error = ref('')

onMounted(async () => {
  const productId = route.params.id
  if (!productId){
    error.value = 'Product ID not found'
  }
  try {
   product.value = await get(`/api/v1/scarpe/${productId}`)
    
    console.log({ product: product.value })
  } catch (err) {
    console.error('Error fetching product:', err)
  }
})
</script>

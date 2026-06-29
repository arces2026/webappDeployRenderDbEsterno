<script setup>
import Grid from '@/components/Grid.vue'
import ProductList from '@/components/ProductList.vue'
import { onMounted, ref } from 'vue'
import { get } from '@/plugins/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const libri = ref([])
const autori = ref([])
const loading = ref(false)

const gridLibriColumns = ['titolo', 'anno', 'genere', 'autore.nome']
const radioSelection = ['titolo', 'anno', 'genere', 'autore.nome', 'all']
const gridAutoriColumns = ['nome', 'nazione']
const searchQuery = ref('')
const selectedField = ref('all')
console.log({ selectedField: selectedField.value })
onMounted(async () => {
  loading.value = true
  const data = await get('/api/v1/libri/')

  console.log({ libri: data })

  loading.value = false
  libri.value = data.results
 
  console.log(libri.value)

  const autori = await get('/api/v1/autori/')
  console.log({ autori: autori })
  autori.value = autori.results
  // console.log(autori.value);
})
</script>

<template>
  
  <main class="main">
    <form id="search">
      Cerca <input id="search-input" name="query" v-model="searchQuery" />
      <ul v-for="key in radioSelection" :key="key">
        <label for="key">{{ key }}</label>
        <input type="radio" name="radio" v-model="selectedField" :value="key" />
      </ul>
    </form>

    <ProductList></ProductList>
    <LoadingSpinner v-if="loading"/>
    <Grid
    
      style="width: 45%"
      :data="libri"
      :columns="gridLibriColumns"
      :filter-key="searchQuery"
      :selected-field="selectedField"
    >
    </Grid>

    <!-- <Grid
      style="width: 45%;"
      :data="autori"
      :columns="gridAutoriColumns"
      :filter-key="searchQuery">
    </Grid> -->
  </main>
</template>

<style>
.main {
  display: flex;
  justify-content: space-between;
}

form {
  background-color: #42b983;
  width: 35%;
  margin: 30px auto;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  color: white;
  text-transform: capitalize;
}
#search-input {
  width: 40%;
  padding: 5px;
  border-radius: 5px;
}

input {
  margin: 5px;
}
</style>

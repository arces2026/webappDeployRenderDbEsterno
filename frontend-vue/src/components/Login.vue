<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import Button from './ui/Button.vue'
import HeartIcon from './ui/HeartIcon.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
// const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await authStore.login(username.value, password.value)

  if (result.success) {
    successMessage.value = 'Redirecting...'
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } else {
    error.value = 'Invalid username or password'
  }
  loading.value = false
}
</script>
e

<template>
    <LoadingSpinner v-if="loading" id="spinner"/>
    <form>
      <input type="text" placeholder="Username" v-model="username" />
      <input type="password" placeholder="Password" v-model="password" />
      <Button type="submit" @click.prevent="handleLogin"> <span>Login</span><HeartIcon /> </Button>
      <p v-if="error">{{ error }}</p>
      <p v-else>{{ successMessage }}</p>
    </form>
</template>

<style scoped>
#spinner {
  position: absolute;
}
form {
  max-width: 400px;
}
input {
  padding: 5px;
}
</style>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 w-full">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium mb-1">Email</label>
          <input id="email" v-model="email" type="email" required class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium mb-1">Password</label>
          <input id="password" v-model="password" type="password" required class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
        </div>
        <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Register</button>
      </form>
      <p class="mt-4 text-center text-sm">
        Already have an account? <router-link to="/" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    await auth.register({ email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (err) {
    alert('Registration failed');
  }
};
</script>

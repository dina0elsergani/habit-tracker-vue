<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">HabitFlow</span>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-8">
          <router-link
            to="/"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Home
          </router-link>
          <router-link
            to="/dashboard"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Dashboard
          </router-link>
        </div>

        <!-- Theme Toggle & Mobile Menu -->
        <div class="flex items-center space-x-4">
          <button
            @click="themeStore.toggleTheme()"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <SunIcon v-if="themeStore.isDark" class="w-5 h-5 text-yellow-500" />
            <MoonIcon v-else class="w-5 h-5 text-gray-600" />
          </button>

          <!-- Mobile menu button -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <Bars3Icon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="mobile-menu">
        <div v-if="showMobileMenu" class="md:hidden pb-4 space-y-2">
          <router-link
            to="/"
            @click="showMobileMenu = false"
            class="block text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Home
          </router-link>
          <router-link
            to="/dashboard"
            @click="showMobileMenu = false"
            class="block text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Dashboard
          </router-link>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircleIcon, SunIcon, MoonIcon, Bars3Icon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '../stores/themeStore'

const themeStore = useThemeStore()
const showMobileMenu = ref(false)
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
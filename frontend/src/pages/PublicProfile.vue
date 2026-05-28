<template>
  <div v-if="resume" :class="[themeClass, 'min-h-screen transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 w-full block']">
    <div class="max-w-3xl mx-auto space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{{ resume.name || 'Anonymous' }}</h1>
        <p class="text-xl max-w-2xl mx-auto" :class="bioClass">{{ resume.bio || 'A mysterious individual.' }}</p>
      </div>

      <!-- Links -->
      <div v-if="resume.links && resume.links.length" class="flex justify-center gap-4 flex-wrap">
        <a v-for="link in resume.links" :key="link.platform" :href="link.url" target="_blank"
           class="inline-flex items-center px-4 py-2 border rounded-full shadow-sm text-sm font-medium hover:opacity-80 transition-opacity"
           :class="linkClass">
          {{ link.platform }}
        </a>
      </div>

      <!-- Sections -->
      <div v-if="resume.sections && resume.sections.length" class="space-y-12">
        <section v-for="section in resume.sections" :key="section.id" class="space-y-6">
          <h2 class="text-2xl font-bold border-b pb-2" :class="sectionHeaderClass">{{ section.title }}</h2>
          <div class="space-y-8">
            <div v-for="item in section.items" :key="item.id" class="relative pl-4 border-l-2" :class="itemBorderClass">
              <div class="absolute w-3 h-3 rounded-full -left-[7px] top-2" :class="bulletClass"></div>
              <h3 class="text-lg font-semibold">{{ item.title }}</h3>
              <p v-if="item.subtitle" class="text-sm font-medium mb-1" :class="subtitleClass">{{ item.subtitle }}</p>
              <p v-if="item.dateRange" class="text-xs mb-2 opacity-75">{{ item.dateRange }}</p>
              <p v-if="item.description" class="text-base whitespace-pre-wrap">{{ item.description }}</p>
              <a v-if="item.link" :href="item.link" target="_blank" class="text-sm underline mt-2 inline-block">View Link</a>
            </div>
          </div>
        </section>
      </div>

      <div v-if="!resume.sections || !resume.sections.length" class="text-center italic opacity-50 mt-12">
        Nothing to see here yet.
      </div>

      <div class="mt-20 pt-8 border-t text-center text-xs opacity-50">
        Built with Vibe Resume • {{ resume.views }} views
      </div>
    </div>
  </div>
  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-red-50 text-red-600 w-full">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">404</h1>
      <p>{{ error }}</p>
      <router-link to="/" class="mt-4 inline-block text-blue-500 hover:underline">Go Home</router-link>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center w-full">
    <div class="animate-pulse text-xl">Loading vibe...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../services/api';
import type { Resume } from '../../../shared/types/resume';

const route = useRoute();
const resume = ref<Resume | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  const slug = route.params.slug as string;
  try {
    resume.value = await api.get(`/resume/public/${slug}`);
  } catch (err) {
    error.value = 'Resume not found.';
  }
});

const themeClass = computed(() => {
  if (!resume.value) return 'bg-white text-gray-900';
  switch (resume.value.theme) {
    case 'dark': return 'bg-gray-900 text-gray-100';
    case 'vibe': return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white';
    default: return 'bg-white text-gray-900';
  }
});

const bioClass = computed(() => {
  if (!resume.value) return 'text-gray-600';
  return resume.value.theme === 'light' ? 'text-gray-600' : 'text-gray-300';
});

const linkClass = computed(() => {
  if (!resume.value) return 'border-gray-300 text-gray-700 bg-white';
  switch (resume.value.theme) {
    case 'dark': return 'border-gray-700 text-gray-300 bg-gray-800';
    case 'vibe': return 'border-pink-500/50 text-white bg-white/10 backdrop-blur-sm';
    default: return 'border-gray-300 text-gray-700 bg-white';
  }
});

const sectionHeaderClass = computed(() => {
  if (!resume.value) return 'border-gray-200';
  switch (resume.value.theme) {
    case 'dark': return 'border-gray-800';
    case 'vibe': return 'border-white/20';
    default: return 'border-gray-200';
  }
});

const itemBorderClass = computed(() => {
  if (!resume.value) return 'border-gray-200';
  switch (resume.value.theme) {
    case 'dark': return 'border-gray-700';
    case 'vibe': return 'border-pink-500/50';
    default: return 'border-gray-200';
  }
});

const bulletClass = computed(() => {
  if (!resume.value) return 'bg-gray-300';
  switch (resume.value.theme) {
    case 'dark': return 'bg-gray-600';
    case 'vibe': return 'bg-pink-500';
    default: return 'bg-blue-500';
  }
});

const subtitleClass = computed(() => {
  if (!resume.value) return 'text-blue-600';
  switch (resume.value.theme) {
    case 'dark': return 'text-blue-400';
    case 'vibe': return 'text-pink-300';
    default: return 'text-blue-600';
  }
});
</script>

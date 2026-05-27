<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6" v-if="resume">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Your Resume</h1>
        <div class="flex gap-4">
          <a :href="'/' + resume.slug" target="_blank" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">View Public</a>
          <button @click="handleLogout" class="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200">Logout</button>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <label for="slug" class="block text-sm font-medium mb-1">Public URL Slug</label>
          <input id="slug" v-model="resume.slug" @change="save" type="text" class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
        </div>

        <div>
          <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
          <input id="name" v-model="resume.name" @change="save" type="text" class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium mb-1">Bio</label>
          <textarea id="bio" v-model="resume.bio" @change="save" rows="4" class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
        </div>

        <div>
          <label for="theme" class="block text-sm font-medium mb-1">Theme</label>
          <select id="theme" v-model="resume.theme" @change="save" class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="vibe">Vibe</option>
          </select>
        </div>

        <hr class="my-6 border-gray-300 dark:border-gray-600">

        <h2 class="text-xl font-bold mb-4">Sections</h2>

        <div v-for="(section, sIndex) in resume.sections" :key="section.id" class="border p-4 rounded-md mb-4 dark:border-gray-600 relative">
          <button @click="removeSection(sIndex)" class="absolute top-2 right-2 text-red-500 hover:text-red-700">Remove</button>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label :for="'stitle' + sIndex" class="block text-sm font-medium mb-1">Section Title</label>
              <input :id="'stitle' + sIndex" v-model="section.title" @change="save" type="text" class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
            </div>
            <div>
              <label :for="'stype' + sIndex" class="block text-sm font-medium mb-1">Type</label>
              <select :id="'stype' + sIndex" v-model="section.type" @change="save" class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="experience">Experience</option>
                <option value="education">Education</option>
                <option value="projects">Projects</option>
                <option value="skills">Skills</option>
              </select>
            </div>
          </div>

          <div class="ml-4 space-y-4 border-l-2 pl-4 dark:border-gray-600">
            <div v-for="(item, iIndex) in section.items" :key="item.id" class="relative p-3 border rounded dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <button @click="removeItem(sIndex, iIndex)" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">Remove</button>

              <div class="grid grid-cols-2 gap-3 mb-2 pr-10">
                <input v-model="item.title" @change="save" :aria-label="'Item Title ' + iIndex" placeholder="Title (e.g. Software Engineer)" class="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600">
                <input v-model="item.subtitle" @change="save" :aria-label="'Item Subtitle ' + iIndex" placeholder="Subtitle (e.g. Google)" class="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600">
                <input v-model="item.dateRange" @change="save" :aria-label="'Item Date Range ' + iIndex" placeholder="Date (e.g. 2020-2023)" class="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600">
                <input v-model="item.link" @change="save" :aria-label="'Item Link ' + iIndex" placeholder="Link (Optional)" class="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600">
              </div>
              <textarea v-model="item.description" @change="save" :aria-label="'Item Description ' + iIndex" placeholder="Description" rows="2" class="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600"></textarea>
            </div>
            <button @click="addItem(sIndex)" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium">+ Add Item</button>
          </div>
        </div>

        <button @click="addSection" class="px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 w-full font-medium">
          + Add New Section
        </button>

        <div class="flex justify-end mt-8 border-t pt-4">
           <button @click="save" class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium shadow">Save Changes</button>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center mt-20">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useResumeStore } from '../stores/resume';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const store = useResumeStore();
const auth = useAuthStore();
const router = useRouter();

const resume = computed(() => store.resume);

onMounted(() => {
  store.fetchResume();
});

const save = () => {
  store.saveResume();
};

const handleLogout = () => {
  auth.logout();
  router.push('/');
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const addSection = () => {
  if (!resume.value) return;
  if (!resume.value.sections) resume.value.sections = [];
  resume.value.sections.push({
    id: generateId(),
    type: 'experience',
    title: 'New Section',
    items: []
  });
  save();
};

const removeSection = (index: number) => {
  if (!resume.value || !resume.value.sections) return;
  resume.value.sections.splice(index, 1);
  save();
};

const addItem = (sectionIndex: number) => {
  if (!resume.value || !resume.value.sections) return;
  resume.value.sections[sectionIndex].items.push({
    id: generateId(),
    title: '',
  });
  save();
};

const removeItem = (sectionIndex: number, itemIndex: number) => {
  if (!resume.value || !resume.value.sections) return;
  resume.value.sections[sectionIndex].items.splice(itemIndex, 1);
  save();
};
</script>

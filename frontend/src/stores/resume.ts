import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../services/api';
import { useAuthStore } from './auth';
import type { Resume } from '../../../shared/types/resume';

export const useResumeStore = defineStore('resume', () => {
  const resume = ref<Resume | null>(null);
  const isLoading = ref(false);
  const auth = useAuthStore();
  const isOffline = ref(!navigator.onLine);

  window.addEventListener('online', () => {
    isOffline.value = false;
    syncDraft();
  });
  window.addEventListener('offline', () => {
    isOffline.value = true;
  });

  const loadDraft = () => {
    const draft = localStorage.getItem('resume_draft');
    if (draft) {
      resume.value = JSON.parse(draft);
    }
  };

  const syncDraft = async () => {
    const draftStr = localStorage.getItem('resume_draft');
    if (draftStr && auth.token && !isOffline.value) {
      const draft = JSON.parse(draftStr);
      try {
        await api.put('/resume/me', draft, auth.token);
        console.log('Draft synced to server');
      } catch (e) {
        console.error('Failed to sync draft');
      }
    }
  };

  const fetchResume = async () => {
    if (!auth.token) return;

    // First, prefer local draft if offline or if we have unsynced edits
    const draft = localStorage.getItem('resume_draft');

    if (isOffline.value) {
      loadDraft();
      return;
    }

    isLoading.value = true;
    try {
      const data = await api.get('/resume/me', auth.token);

      // Merge strategy: if local draft is newer, keep it and sync
      if (draft) {
        const localDraft = JSON.parse(draft);
        if (new Date(localDraft.updatedAt) > new Date(data.updatedAt)) {
          resume.value = localDraft;
          syncDraft();
          return;
        }
      }

      resume.value = data;
      localStorage.setItem('resume_draft', JSON.stringify(data));
    } catch (e) {
      loadDraft();
    } finally {
      isLoading.value = false;
    }
  };

  const saveResume = async () => {
    if (!auth.token || !resume.value) return;
    resume.value.updatedAt = new Date().toISOString();
    localStorage.setItem('resume_draft', JSON.stringify(resume.value));

    if (!isOffline.value) {
      try {
        await api.put('/resume/me', resume.value, auth.token);
      } catch (e) {
        console.warn('Saved draft locally while offline');
      }
    }
  };

  return { resume, isLoading, isOffline, fetchResume, saveResume };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const setAuth = (newToken: string, newUser: any) => {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const login = async (credentials: any) => {
    const data = await api.post('/auth/login', credentials);
    setAuth(data.token, data.user);
  };

  const register = async (credentials: any) => {
    const data = await api.post('/auth/register', credentials);
    setAuth(data.token, data.user);
  };

  return { token, user, login, register, logout };
});

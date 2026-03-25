import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { login as apiLogin, register as apiRegister } from '@/api/auth';

export function useAuth() {
  const router = useRouter();
  const userStore = useUserStore();
  const loading = ref(false);

  const login = async (form) => {
    loading.value = true;
    try {
      const { token, userInfo } = await apiLogin(form);
      localStorage.setItem('token', token);
      userStore.setUser(userInfo);
      router.push('/');
    } catch (err) {
      console.error('登录失败', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (form) => {
    loading.value = true;
    try {
      await apiRegister(form);
      router.push('/login');
    } catch (err) {
      console.error('注册失败', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    userStore.clearUser();
    router.push('/login');
  };

  return { login, register, logout, loading };
}
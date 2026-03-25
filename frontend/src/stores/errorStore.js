import { defineStore } from 'pinia';
import * as errorApi from '@/api/error';

export const useErrorStore = defineStore('error', {
  state: () => ({
    errors: [],          // 当前用户的错题列表
    loading: false,      // 加载状态
    currentFilters: {    // 当前筛选条件
      subject: '',
      questionType: ''
    }
  }),
  getters: {
    // 获取科目列表（从错题中提取）
    subjects: (state) => {
      const set = new Set();
      state.errors.forEach(e => set.add(e.subject));
      return Array.from(set);
    }
  },
  actions: {
    // 加载错题列表
    async loadErrors(filters = {}) {
      this.loading = true;
      try {
        const res = await errorApi.getErrors(filters);
        this.errors = res.data;
        this.currentFilters = { ...filters };
      } catch (err) {
        console.error('加载错题失败', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // 添加错题
    async addError(errorData) {
      try {
        await errorApi.addError(errorData);
        // 刷新列表（保持当前筛选）
        await this.loadErrors(this.currentFilters);
      } catch (err) {
        console.error('添加错题失败', err);
        throw err;
      }
    },
    // 移除错题
    async removeError(errorId) {
      try {
        await errorApi.deleteError(errorId);
        // 刷新列表
        await this.loadErrors(this.currentFilters);
      } catch (err) {
        console.error('移除错题失败', err);
        throw err;
      }
    },
    // 重置筛选
    resetFilters() {
      this.currentFilters = { subject: '', questionType: '' };
      return this.loadErrors(this.currentFilters);
    }
  }
});
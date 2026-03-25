import { defineStore } from 'pinia';
import * as questionApi from '@/api/question';

export const useQuestionStore = defineStore('question', {
  state: () => ({
    questions: [],          // 当前加载的题目列表
    subjects: [],           // 所有科目列表
    questionTypes: [],      // 所有题型列表
    loading: false,         // 加载状态
    currentFilters: {       // 当前筛选条件（用于缓存）
      subject: '',
      year: '',
      questionType: ''
    }
  }),
  getters: {
    // 按科目分组（如果需要）
    questionsBySubject: (state) => {
      const map = {};
      state.questions.forEach(q => {
        if (!map[q.subject]) map[q.subject] = [];
        map[q.subject].push(q);
      });
      return map;
    }
  },
  actions: {
    // 加载科目列表
    async loadSubjects() {
      try {
        const res = await questionApi.getSubjects();
        this.subjects = res.data;
      } catch (err) {
        console.error('加载科目列表失败', err);
        // 降级使用默认科目
        this.subjects = ['数据结构', '计算机组成原理', '操作系统', '计算机网络'];
      }
    },
    // 加载题型列表
    async loadQuestionTypes() {
      try {
        const res = await questionApi.getQuestionTypes();
        this.questionTypes = res.data;
      } catch (err) {
        console.error('加载题型列表失败', err);
        this.questionTypes = ['单选题', '多选题', '简答题'];
      }
    },
    // 加载题目列表（带筛选）
    async loadQuestions(filters = {}) {
      this.loading = true;
      try {
        const res = await questionApi.getQuestions(filters);
        this.questions = res.data;
        this.currentFilters = { ...filters };
      } catch (err) {
        console.error('加载题目失败', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // 添加题目
    async addQuestion(questionData) {
      try {
        await questionApi.addQuestion(questionData);
        // 刷新列表（保持当前筛选）
        await this.loadQuestions(this.currentFilters);
      } catch (err) {
        console.error('添加题目失败', err);
        throw err;
      }
    },
    // 删除单个题目
    async deleteQuestion(id) {
      try {
        await questionApi.deleteQuestion(id);
        // 刷新列表
        await this.loadQuestions(this.currentFilters);
      } catch (err) {
        console.error('删除题目失败', err);
        throw err;
      }
    },
    // 批量删除
    async batchDeleteQuestions(ids) {
      try {
        const res = await questionApi.batchDeleteQuestions(ids);
        await this.loadQuestions(this.currentFilters);
        return res.data.deletedCount;
      } catch (err) {
        console.error('批量删除失败', err);
        throw err;
      }
    },
    // 重置筛选并重新加载
    resetFilters() {
      this.currentFilters = { subject: '', year: '', questionType: '' };
      return this.loadQuestions(this.currentFilters);
    }
  }
});
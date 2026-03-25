import { defineStore } from 'pinia';

export const useStatsStore = defineStore('stats', {
  state: () => ({
    totalCount: 0,
    answeredCount: 0,
    correctCount: 0,
    subjectStats: {},      // { '数据结构': { total: 0, correct: 0 } }
    historyList: []        // [{ date, total, accuracy }]
  }),
  getters: {
    accuracyRate: (state) => {
      if (state.answeredCount === 0) return 0;
      return ((state.correctCount / state.answeredCount) * 100).toFixed(1);
    }
  },
  actions: {
    // 从 localStorage 加载统计数据（未来可改为从后端接口获取）
    loadStatsData(username) {
      const key = `stats_${username}`;
      const savedStats = JSON.parse(localStorage.getItem(key) || '{}');

      if (savedStats.totalCount !== undefined) {
        this.totalCount = savedStats.totalCount;
        this.answeredCount = savedStats.answeredCount;
        this.correctCount = savedStats.correctCount;
        this.subjectStats = savedStats.subjectStats || {};
      } else {
        // 首次加载时，从题目和错题本计算
        const questions = JSON.parse(localStorage.getItem('questions') || '[]');
        const errorList = JSON.parse(localStorage.getItem(`errorList_${username}`) || '[]');
        const total = questions.length;
        const errorCount = errorList.length;
        const correct = total - errorCount;

        this.totalCount = total;
        this.answeredCount = total;
        this.correctCount = correct;
        this.subjectStats = this.calculateSubjectStats(questions, errorList);
      }
    },

    // 计算各科目正确率
    calculateSubjectStats(questions, errorList) {
      const stats = {};
      questions.forEach(q => {
        if (!stats[q.subject]) {
          stats[q.subject] = { total: 0, correct: 0 };
        }
        stats[q.subject].total++;
        const isError = errorList.some(e => e.id === q.id);
        if (!isError) stats[q.subject].correct++;
      });
      return stats;
    },

    // 加载历史刷题记录
    loadHistoryList(username) {
      const key = `history_${username}`;
      this.historyList = JSON.parse(localStorage.getItem(key) || '[]');
    },

    // 未来可添加从后端获取统计的方法
    async fetchFromApi(username) {
      // const res = await statsApi.getStats(username);
      // this.totalCount = res.data.totalCount;
      // ...
    }
  },
  persist: true, // 可选，让统计数据持久化
});
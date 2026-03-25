<template>
  <div class="stats">
    <h2>刷题统计</h2>
    <div class="cards">
      <div class="card">
        <h3>总题数</h3>
        <p>{{ statsStore.totalCount }}</p>
      </div>
      <div class="card">
        <h3>已答</h3>
        <p>{{ statsStore.answeredCount }}</p>
      </div>
      <div class="card">
        <h3>正确</h3>
        <p>{{ statsStore.correctCount }}</p>
      </div>
      <div class="card">
        <h3>正确率</h3>
        <p>{{ statsStore.accuracyRate }}%</p>
      </div>
    </div>

    <!-- 可视化图表 -->
    <div class="charts">
      <div ref="pieRef" class="chart-container"></div>
      <div ref="barRef" class="chart-container"></div>
    </div>

    <!-- 最近刷题记录 -->
    <div class="history" v-if="statsStore.historyList.length > 0">
      <h3>最近刷题记录</h3>
      <div class="history-list">
        <div class="history-item" v-for="(item, idx) in statsStore.historyList.slice(0, 5)" :key="idx">
          <span>{{ item.date }}</span>
          <span>总题数: {{ item.total }}</span>
          <span>正确率: {{ item.accuracy }}%</span>
        </div>
      </div>
    </div>

    <button @click="goBack" class="back-btn">返回首页</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useStatsStore } from '@/stores/statsStore'
import * as echarts from 'echarts'

const router = useRouter()
const userStore = useUserStore()
const statsStore = useStatsStore()

const pieRef = ref(null)
const barRef = ref(null)
let pieChart = null
let barChart = null

onMounted(() => {
  // 检查登录状态
  if (!userStore.user) {
    alert('请先登录')
    router.push('/login')
    return
  }

  // 加载统计数据
  const username = userStore.user.username
  statsStore.loadStatsData(username)
  statsStore.loadHistoryList(username)

  // 初始化图表
  initCharts()
})

// 初始化 ECharts 图表（监听 statsStore 变化，但这里只在 mounted 时初始化一次）
// 如果后续统计数据会动态更新，可以添加 watch，但当前是静态数据。
function initCharts() {
  // 正确率饼图
  pieChart = echarts.init(pieRef.value)
  const pieOption = {
    title: { text: '答题正确率', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '答题情况',
      type: 'pie',
      radius: '50%',
      data: [
        { value: statsStore.correctCount, name: '正确' },
        { value: statsStore.answeredCount - statsStore.correctCount, name: '错误' }
      ],
      emphasis: { itemStyle: { shadowBlur: 10 } }
    }]
  }
  pieChart.setOption(pieOption)

  // 科目正确率柱状图
  barChart = echarts.init(barRef.value)
  const subjects = Object.keys(statsStore.subjectStats)
  const correctRates = subjects.map(s => {
    const stat = statsStore.subjectStats[s]
    return ((stat.correct / stat.total) * 100).toFixed(1)
  })
  const barOption = {
    title: { text: '各科目正确率', left: 'center' },
    xAxis: { type: 'category', data: subjects },
    yAxis: { type: 'value', name: '正确率(%)' },
    series: [{
      name: '正确率',
      type: 'bar',
      data: correctRates,
      itemStyle: { color: '#409eff' }
    }]
  }
  barChart.setOption(barOption)
}

const goBack = () => {
  router.push('/')
}
 </script>
<style scoped>
.stats {
  min-height: 100vh;
  background: linear-gradient(135deg, #d6f4ff 0%, #a8dfff 100%);
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2b6cb0;
}
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.card {
  background: white;
  border: 1px solid #bee3f8;
  border-radius: 12px;
  padding: 1.2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.card h3 {
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
.card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2b6cb0;
}
.charts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.chart-container {
  width: 100%;
  height: 260px;
  background: white;
  border: 1px solid #bee3f8;
  border-radius: 12px;
  padding: 0.8rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  box-sizing: border-box;
}
.history {
  margin-bottom: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.history h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: #2d3748;
}
.history-list {
  max-width: 600px;
  margin: 0 auto;
}
.history-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 0.9rem;
}
.history-item:last-child {
  border-bottom: none;
}
.back-btn {
  display: block;
  margin: 0 auto;
  padding: 0.6rem 1.5rem;
  background: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}
.back-btn:hover {
  background: #2c5282;
}

/* 平板适配 */
@media (min-width: 768px) {
  .charts {
    flex-direction: row;
    justify-content: space-around;
  }
  .chart-container {
    width: 48%;
  }
}
</style>
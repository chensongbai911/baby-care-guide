// filepath: d:\car-di\src\components\baby\GrowthChart.vue
<template>
  <div class="growth-chart-container">
    <div class="chart-header">
      <div class="header-title">
        <span class="title-icon">📈</span>
        <h3>宝宝成长曲线</h3>
      </div>
      <div class="chart-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <div class="chart-body">
      <!-- SVG 图表 -->
      <svg class="growth-svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- 渐变定义 -->
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="currentColor" stop-opacity="0.3"/>
            <stop offset="100%" :stop-color="currentColor" stop-opacity="0.05"/>
          </linearGradient>

          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :stop-color="currentColor"/>
            <stop offset="50%" :stop-color="currentColorLight"/>
            <stop offset="100%" :stop-color="currentColor"/>
          </linearGradient>

          <!-- 发光效果 -->
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- 阴影效果 -->
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.1)"/>
          </filter>
        </defs>

        <!-- 背景网格 -->
        <g class="grid-lines">
          <line
            v-for="i in 5"
            :key="'h-'+i"
            :x1="50"
            :x2="570"
            :y1="50 + (i-1) * 50"
            :y2="50 + (i-1) * 50"
            stroke="#e5e7eb"
            stroke-width="1"
            stroke-dasharray="5,5"
          />
          <line
            v-for="i in 13"
            :key="'v-'+i"
            :x1="50 + (i-1) * 40"
            :x2="50 + (i-1) * 40"
            :y1="50"
            :y2="250"
            stroke="#e5e7eb"
            stroke-width="1"
            stroke-dasharray="5,5"
          />
        </g>

        <!-- Y轴标签 -->
        <g class="y-axis-labels">
          <text
            v-for="(label, i) in yAxisLabels"
            :key="'y-'+i"
            :x="40"
            :y="55 + i * 50"
            text-anchor="end"
            fill="#9ca3af"
            font-size="11"
          >
            {{ label }}
          </text>
        </g>

        <!-- X轴标签 -->
        <g class="x-axis-labels">
          <text
            v-for="i in 13"
            :key="'x-'+i"
            :x="50 + (i-1) * 40"
            :y="270"
            text-anchor="middle"
            fill="#9ca3af"
            font-size="11"
          >
            {{ i - 1 }}月
          </text>
        </g>

        <!-- 参考范围区域 -->
        <path
          :d="referenceAreaPath"
          fill="url(#chartGradient)"
          class="reference-area"
        />

        <!-- 数据曲线 -->
        <path
          :d="chartLinePath"
          fill="none"
          stroke="url(#lineGradient)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#glow)"
          class="data-line"
        />

        <!-- 数据点 -->
        <g class="data-points">
          <g
            v-for="(point, i) in dataPoints"
            :key="i"
            class="point-group"
            @mouseenter="hoveredPoint = i"
            @mouseleave="hoveredPoint = null"
          >
            <!-- 外圈光晕 -->
            <circle
              :cx="point.x"
              :cy="point.y"
              r="12"
              :fill="currentColor"
              opacity="0.1"
              class="point-glow"
            />
            <!-- 点本身 -->
            <circle
              :cx="point.x"
              :cy="point.y"
              r="6"
              :fill="currentColor"
              stroke="white"
              stroke-width="2"
              filter="url(#dropShadow)"
              class="point-dot"
              :class="{ 'active': hoveredPoint === i }"
            />

            <!-- 悬停提示 -->
            <g v-if="hoveredPoint === i" class="tooltip-group">
              <rect
                :x="point.x - 35"
                :y="point.y - 45"
                width="70"
                height="30"
                rx="8"
                fill="white"
                filter="url(#dropShadow)"
              />
              <text
                :x="point.x"
                :y="point.y - 25"
                text-anchor="middle"
                fill="#374151"
                font-size="12"
                font-weight="600"
              >
                {{ point.value }}{{ currentUnit }}
              </text>
            </g>
          </g>
        </g>

        <!-- 可爱的装饰元素 -->
        <g class="decorations">
          <text x="560" y="40" font-size="20" class="deco-emoji">{{ currentEmoji }}</text>
        </g>
      </svg>

      <!-- 图例 -->
      <div class="chart-legend">
        <div class="legend-item">
          <span class="legend-dot" :style="{ background: currentColor }"></span>
          <span class="legend-text">{{ currentLabel }}曲线</span>
        </div>
        <div class="legend-item">
          <span class="legend-area" :style="{ background: currentColor }"></span>
          <span class="legend-text">正常范围</span>
        </div>
      </div>
    </div>

    <!-- 数据输入区 -->
    <div class="data-input-section">
      <h4>📝 记录{{ babyStore.babyInfo.name }}的{{ currentLabel }}</h4>
      <div class="input-row">
        <el-select v-model="selectedMonth" placeholder="选择月龄" class="month-select">
          <el-option
            v-for="i in 13"
            :key="i-1"
            :label="`${i-1}个月`"
            :value="i-1"
          />
        </el-select>
        <el-input-number
          v-model="inputValue"
          :min="0"
          :max="activeTab === 'weight' ? 15 : 100"
          :step="0.1"
          :placeholder="`输入${currentLabel}`"
          class="value-input"
        />
        <el-button type="primary" @click="addDataPoint" :disabled="!inputValue">
          <span>➕ 添加记录</span>
        </el-button>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="stats-cards">
      <div class="stat-card" v-for="stat in currentStats" :key="stat.label">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-content">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBabyStore } from '@/stores/babyStore'
import { ElMessage } from 'element-plus'

const babyStore = useBabyStore()

const tabs = [
  { key: 'weight', label: '体重', icon: '⚖️', unit: 'kg', emoji: '👶' },
  { key: 'height', label: '身高', icon: '📏', unit: 'cm', emoji: '📐' },
  { key: 'head', label: '头围', icon: '🧠', unit: 'cm', emoji: '🎀' }
]

const activeTab = ref('weight')
const hoveredPoint = ref<number | null>(null)
const selectedMonth = ref(0)
const inputValue = ref<number | null>(null)

// 模拟数据 - 正常范围
const referenceData = {
  weight: {
    min: [3.2, 4.2, 5.0, 5.7, 6.2, 6.7, 7.1, 7.4, 7.7, 8.0, 8.2, 8.4, 8.6],
    max: [4.5, 5.8, 7.0, 7.8, 8.4, 9.0, 9.5, 9.8, 10.1, 10.4, 10.7, 11.0, 11.2]
  },
  height: {
    min: [48, 52, 55, 58, 60, 62, 64, 66, 67, 69, 70, 71, 72],
    max: [53, 58, 62, 65, 68, 70, 72, 74, 75, 77, 78, 79, 80]
  },
  head: {
    min: [33, 35, 37, 38, 39, 40, 41, 42, 43, 43.5, 44, 44.5, 45],
    max: [37, 39, 41, 42, 43, 44, 45, 46, 46.5, 47, 47.5, 48, 48.5]
  }
}

// 用户记录的数据
const userData = ref({
  weight: [3.5, 4.5, 5.5, 6.3, 7.0, 7.5, 8.0, 8.3, 8.7, 9.0, 9.3, 9.6, 9.9],
  height: [50, 55, 58, 62, 64, 66, 68, 70, 71, 73, 74, 75, 76],
  head: [35, 37, 39, 40, 41, 42, 43, 44, 45, 45.5, 46, 46.5, 47]
})

const currentColor = computed(() => {
  const colors = {
    weight: '#7c3aed',
    height: '#ec4899',
    head: '#06b6d4'
  }
  return colors[activeTab.value as keyof typeof colors]
})

const currentColorLight = computed(() => {
  const colors = {
    weight: '#a855f7',
    height: '#f472b6',
    head: '#22d3ee'
  }
  return colors[activeTab.value as keyof typeof colors]
})

const currentLabel = computed(() => {
  return tabs.find(t => t.key === activeTab.value)?.label || ''
})

const currentUnit = computed(() => {
  return tabs.find(t => t.key === activeTab.value)?.unit || ''
})

const currentEmoji = computed(() => {
  return tabs.find(t => t.key === activeTab.value)?.emoji || ''
})

const yAxisLabels = computed(() => {
  const ranges = {
    weight: ['12', '9', '6', '3', '0'],
    height: ['80', '65', '50', '35', '20'],
    head: ['50', '45', '40', '35', '30']
  }
  return ranges[activeTab.value as keyof typeof ranges]
})

const getYPosition = (value: number) => {
  const ranges = {
    weight: { min: 0, max: 12 },
    height: { min: 20, max: 80 },
    head: { min: 30, max: 50 }
  }
  const range = ranges[activeTab.value as keyof typeof ranges]
  return 250 - ((value - range.min) / (range.max - range.min)) * 200
}

const dataPoints = computed(() => {
  const data = userData.value[activeTab.value as keyof typeof userData.value]
  return data.map((value, i) => ({
    x: 50 + i * 40,
    y: getYPosition(value),
    value
  }))
})

const chartLinePath = computed(() => {
  const points = dataPoints.value
  if (points.length < 2) return ''

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    path += ` Q ${cpx} ${prev.y}, ${cpx} ${(prev.y + curr.y) / 2}`
    path += ` Q ${cpx} ${curr.y}, ${curr.x} ${curr.y}`
  }

  return path
})

const referenceAreaPath = computed(() => {
  const ref = referenceData[activeTab.value as keyof typeof referenceData]
  const minPoints = ref.min.map((v, i) => ({ x: 50 + i * 40, y: getYPosition(v) }))
  const maxPoints = ref.max.map((v, i) => ({ x: 50 + i * 40, y: getYPosition(v) }))

  let path = `M ${maxPoints[0].x} ${maxPoints[0].y}`

  // 上边界
  for (let i = 1; i < maxPoints.length; i++) {
    path += ` L ${maxPoints[i].x} ${maxPoints[i].y}`
  }

  // 连接到下边界
  for (let i = minPoints.length - 1; i >= 0; i--) {
    path += ` L ${minPoints[i].x} ${minPoints[i].y}`
  }

  path += ' Z'
  return path
})

const currentStats = computed(() => {
  const data = userData.value[activeTab.value as keyof typeof userData.value]
  const lastValue = data[data.length - 1]
  const firstValue = data[0]
  const growth = lastValue - firstValue

  return [
    { icon: '📊', value: `${lastValue}${currentUnit.value}`, label: '最新记录' },
    { icon: '📈', value: `+${growth.toFixed(1)}${currentUnit.value}`, label: '总增长' },
    { icon: '✨', value: '正常', label: '发育评估' }
  ]
})

const addDataPoint = () => {
  if (inputValue.value === null) return

  const data = userData.value[activeTab.value as keyof typeof userData.value]
  data[selectedMonth.value] = inputValue.value

  ElMessage.success(`已记录${selectedMonth.value}个月的${currentLabel.value}：${inputValue.value}${currentUnit.value}`)
  inputValue.value = null
}
</script>

<style scoped>
.growth-chart-container {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
}

.header-title h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.chart-tabs {
  display: flex;
  gap: 8px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 12px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #6b7280;
}

.tab-btn:hover {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.tab-btn.active {
  background: white;
  color: #7c3aed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  font-size: 16px;
}

.chart-body {
  position: relative;
}

.growth-svg {
  width: 100%;
  height: auto;
  max-height: 350px;
}

.reference-area {
  transition: opacity 0.3s ease;
}

.data-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

.point-dot {
  transition: all 0.3s ease;
  cursor: pointer;
}

.point-dot.active {
  r: 8;
}

.point-glow {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; r: 12; }
  50% { opacity: 0.2; r: 16; }
}

.tooltip-group {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.deco-emoji {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-area {
  width: 20px;
  height: 12px;
  border-radius: 4px;
  opacity: 0.3;
}

.data-input-section {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f7ff 0%, #fff5f7 100%);
  border-radius: 16px;
}

.data-input-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #374151;
}

.input-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.month-select {
  width: 140px;
}

.value-input {
  width: 150px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f7ff 0%, #fdf4ff 100%);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.15);
}

.stat-icon {
  font-size: 28px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #7c3aed;
}

.stat-label {
  font-size: 12px;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .chart-tabs {
    width: 100%;
    justify-content: center;
  }

  .input-row {
    flex-direction: column;
  }

  .month-select,
  .value-input {
    width: 100%;
  }
}
</style>

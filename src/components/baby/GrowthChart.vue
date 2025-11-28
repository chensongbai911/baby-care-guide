<template>
  <div class="growth-chart-container">
    <div class="chart-header">
      <div class="header-title">
        <span class="title-icon">📈</span>
        <h3>宝宝成长曲线</h3>
      </div>
      <div class="header-actions">
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
        <div class="action-buttons">
          <button class="action-btn" @click="exportData" title="导出数据">
            <span>📥</span>
          </button>
          <button class="action-btn" @click="printChart" title="打印图表">
            <span>🖨️</span>
          </button>
          <button class="action-btn" @click="shareChart" title="分享">
            <span>📤</span>
          </button>
        </div>
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
            {{ (i - 1) }}月
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
      <div class="input-header">
        <h4>📝 记录{{ babyStore.babyInfo.name }}的{{ currentLabel }}</h4>
        <button class="clear-btn" @click="clearCurrentData" v-if="hasData">
          <span>🗑️ 清空数据</span>
        </button>
      </div>
      <div class="input-row">
        <el-select v-model="selectedMonth" placeholder="选择月龄" class="month-select">
          <el-option
            v-for="i in 13"
            :key="i-1"
            :label="`${(i-1)}个月`"
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
          @keyup.enter="addDataPoint"
        />
        <el-button type="primary" @click="addDataPoint" :disabled="!inputValue">
          <span>➕ 添加记录</span>
        </el-button>
      </div>
      <div class="quick-actions">
        <button
          class="quick-btn"
          v-for="preset in quickPresets"
          :key="preset.label"
          @click="applyPreset(preset)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="stats-cards">
      <div
        class="stat-card"
        v-for="stat in currentStats"
        :key="stat.label"
        @click="handleStatClick(stat)"
        :class="{ clickable: stat.onClick }"
      >
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-content">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <div class="stat-trend" v-if="stat.trend">
          <span :class="['trend-icon', stat.trend]">
            {{ stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 数据记录列表 -->
    <div class="data-records" v-if="showRecords">
      <h4>📋 历史记录</h4>
      <div class="records-list">
        <div
          class="record-item"
          v-for="(record, index) in sortedRecords"
          :key="index"
          @click="editRecord(index)"
        >
          <div class="record-month">{{ index }}个月</div>
          <div class="record-value">{{ record }}{{ currentUnit }}</div>
          <div class="record-status">
            <span :class="['status-badge', getRecordStatus(index, record)]">
              {{ getStatusText(index, record) }}
            </span>
          </div>
          <button class="delete-btn" @click.stop="deleteRecord(index)">
            <span>✕</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBabyStore } from '@/stores/babyStore'
import { ElMessage, ElMessageBox } from 'element-plus'

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
const showRecords = ref(false)

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

const createSmoothPath = (points: Array<{x: number, y: number}>) => {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`

  let path = `M ${points[0]!.x} ${points[0]!.y}`

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!
    const curr = points[i]!
    const cpx = (prev.x + curr.x) / 2
    path += ` Q ${cpx} ${prev.y}, ${cpx} ${(prev.y + curr.y) / 2}`
    path += ` Q ${cpx} ${curr.y}, ${curr.x} ${curr.y}`
  }

  return path
}

const chartLinePath = computed(() => {
  return createSmoothPath(dataPoints.value)
})

const createRangePath = (minPoints: Array<{x: number, y: number}>, maxPoints: Array<{x: number, y: number}>) => {
  if (maxPoints.length === 0 || minPoints.length === 0) return ''

  let path = `M ${maxPoints[0]!.x} ${maxPoints[0]!.y}`

  for (let i = 1; i < maxPoints.length; i++) {
    path += ` L ${maxPoints[i]!.x} ${maxPoints[i]!.y}`
  }

  for (let i = minPoints.length - 1; i >= 0; i--) {
    path += ` L ${minPoints[i]!.x} ${minPoints[i]!.y}`
  }

  path += ' Z'
  return path
}

const referenceAreaPath = computed(() => {
  const ref = referenceData[activeTab.value as keyof typeof referenceData]
  const minPoints = ref.min.map((v, i) => ({ x: 50 + i * 40, y: getYPosition(v) }))
  const maxPoints = ref.max.map((v, i) => ({ x: 50 + i * 40, y: getYPosition(v) }))

  return createRangePath(minPoints, maxPoints)
})

const hasData = computed(() => {
  const data = userData.value[activeTab.value as keyof typeof userData.value]
  return data.some(v => v !== 0)
})

const sortedRecords = computed(() => {
  return userData.value[activeTab.value as keyof typeof userData.value]
})

const quickPresets = computed(() => {
  const presets = {
    weight: [
      { label: '⚡ 自动填充', value: 'auto' },
      { label: '📊 查看记录', value: 'records' }
    ],
    height: [
      { label: '⚡ 自动填充', value: 'auto' },
      { label: '📊 查看记录', value: 'records' }
    ],
    head: [
      { label: '⚡ 自动填充', value: 'auto' },
      { label: '📊 查看记录', value: 'records' }
    ]
  }
  return presets[activeTab.value as keyof typeof presets]
})

const currentStats = computed(() => {
  const data = userData.value[activeTab.value as keyof typeof userData.value]
  const lastValue = data[data.length - 1] || 0
  const firstValue = data[0] || 0
  const growth = lastValue - firstValue
  const avgGrowth = growth / 12

  return [
    {
      icon: '📊',
      value: `${lastValue}${currentUnit.value}`,
      label: '最新记录',
      trend: 'up' as const
    },
    {
      icon: '📈',
      value: `+${growth.toFixed(1)}${currentUnit.value}`,
      label: '总增长',
      trend: 'up' as const
    },
    {
      icon: '📉',
      value: `${avgGrowth.toFixed(2)}${currentUnit.value}/月`,
      label: '平均增长'
    },
    {
      icon: '✨',
      value: '正常',
      label: '发育评估',
      onClick: () => showDetailedAssessment()
    }
  ]
})

const addDataPoint = () => {
  if (inputValue.value === null) return

  const data = userData.value[activeTab.value as keyof typeof userData.value]
  data[selectedMonth.value] = inputValue.value

  ElMessage.success(`已记录${selectedMonth.value}个月的${currentLabel.value}：${inputValue.value}${currentUnit.value}`)
  inputValue.value = null
}

const applyPreset = (preset: { label: string; value: string }) => {
  if (preset.value === 'auto') {
    ElMessageBox.confirm(
      '将使用标准数据自动填充所有月份，是否继续？',
      '自动填充',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      const ref = referenceData[activeTab.value as keyof typeof referenceData]
      userData.value[activeTab.value as keyof typeof userData.value] = ref.min.map((min, i) => {
        const max = ref.max[i] || 0
        return Number(((min + max) / 2).toFixed(1))
      })
      ElMessage.success('已自动填充数据')
    }).catch(() => {})
  } else if (preset.value === 'records') {
    showRecords.value = !showRecords.value
  }
}

const clearCurrentData = () => {
  ElMessageBox.confirm(
    `确定要清空所有${currentLabel.value}数据吗？此操作不可恢复。`,
    '清空数据',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userData.value[activeTab.value as keyof typeof userData.value] = Array(13).fill(0)
    ElMessage.success('已清空数据')
  }).catch(() => {})
}

const exportData = () => {
  const data = {
    babyName: babyStore.babyInfo.name,
    exportDate: new Date().toLocaleDateString('zh-CN'),
    measurements: {
      weight: userData.value.weight,
      height: userData.value.height,
      head: userData.value.head
    },
    statistics: {
      weight: calculateStats('weight'),
      height: calculateStats('height'),
      head: calculateStats('head')
    }
  }

  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${babyStore.babyInfo.name}-成长数据-${new Date().toLocaleDateString('zh-CN')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success('数据已导出')
}

const calculateStats = (type: string) => {
  const data = userData.value[type as keyof typeof userData.value]
  const validData = data.filter(v => v > 0)

  if (validData.length === 0) return null

  const growth = validData[validData.length - 1]! - validData[0]!
  const avgGrowth = growth / (validData.length - 1)

  return {
    latest: validData[validData.length - 1],
    growth,
    avgGrowth: Number(avgGrowth.toFixed(2)),
    dataPoints: validData.length
  }
}

const printChart = () => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    ElMessage.error('无法打开打印窗口，请检查浏览器设置')
    return
  }

  const chartElement = document.querySelector('.growth-chart-container')
  if (!chartElement) return

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${babyStore.babyInfo.name}的成长曲线</title>
      <style>
        body {
          font-family: "Microsoft YaHei", sans-serif;
          padding: 20px;
          background: white;
        }
        .print-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .print-header h1 {
          color: #7c3aed;
          margin: 0 0 10px 0;
        }
        .print-date {
          color: #9ca3af;
          font-size: 14px;
        }
        .chart-section {
          margin: 20px 0;
          page-break-inside: avoid;
        }
        svg {
          max-width: 100%;
          height: auto;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <h1>👶 ${babyStore.babyInfo.name}的成长曲线</h1>
        <p class="print-date">打印日期：${new Date().toLocaleDateString('zh-CN')}</p>
      </div>
      ${chartElement.innerHTML}
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(printContent)
  printWindow.document.close()

  ElMessage.success('准备打印...')
}

const shareChart = async () => {
  const shareData = {
    babyName: babyStore.babyInfo.name,
    currentType: currentLabel.value,
    latestValue: sortedRecords.value[sortedRecords.value.length - 1],
    unit: currentUnit.value
  }

  const shareText = `👶 ${shareData.babyName}的${shareData.currentType}记录\n最新数据：${shareData.latestValue}${shareData.unit}\n\n来自宝宝成长记录 💕`

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${shareData.babyName}的成长曲线`,
        text: shareText
      })
      ElMessage.success('分享成功')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        copyToClipboard(shareText)
      }
    }
  } else {
    copyToClipboard(shareText)
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const getRecordStatus = (month: number, value: number) => {
  const ref = referenceData[activeTab.value as keyof typeof referenceData]
  const min = ref.min[month] || 0
  const max = ref.max[month] || 0

  if (value < min) return 'low'
  if (value > max) return 'high'
  return 'normal'
}

const getStatusText = (month: number, value: number) => {
  const status = getRecordStatus(month, value)
  const texts = {
    low: '偏低',
    high: '偏高',
    normal: '正常'
  }
  return texts[status]
}

const editRecord = (index: number) => {
  selectedMonth.value = index
  inputValue.value = userData.value[activeTab.value as keyof typeof userData.value][index] || null

  // 滚动到输入区域
  const inputSection = document.querySelector('.data-input-section')
  inputSection?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const deleteRecord = (index: number) => {
  ElMessageBox.confirm(
    `确定要删除${index}个月的记录吗？`,
    '删除记录',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userData.value[activeTab.value as keyof typeof userData.value][index] = 0
    ElMessage.success('已删除记录')
  }).catch(() => {})
}

const showDetailedAssessment = () => {
  const data = userData.value[activeTab.value as keyof typeof userData.value]
  const lastValue = data[data.length - 1] || 0
  const ref = referenceData[activeTab.value as keyof typeof referenceData]
  const min = ref.min[12] || 0
  const max = ref.max[12] || 0

  let assessment = ''
  let type = 'info'

  if (lastValue < min) {
    assessment = `${babyStore.babyInfo.name}的${currentLabel.value}偏低，建议咨询儿科医生，了解是否需要调整饮食或其他护理措施。`
    type = 'warning'
  } else if (lastValue > max) {
    assessment = `${babyStore.babyInfo.name}的${currentLabel.value}偏高，请关注宝宝的饮食和运动情况，必要时咨询医生。`
    type = 'warning'
  } else {
    assessment = `${babyStore.babyInfo.name}的${currentLabel.value}发育正常，保持良好的喂养和护理习惯！💪`
    type = 'success'
  }

  ElMessageBox.alert(assessment, '发育评估', {
    confirmButtonText: '知道了',
    type: type as any
  })
}

const handleStatClick = (stat: any) => {
  if (stat.onClick) {
    stat.onClick()
  }
}
</script>

<style scoped>
.growth-chart-container {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.header-title h3 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
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
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.tab-btn.active {
  background: white;
  color: #7c3aed;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15);
}

.tab-icon {
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.action-btn:hover {
  border-color: #7c3aed;
  background: #f5f3ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
}

.chart-body {
  margin-bottom: 32px;
  position: relative;
}

.growth-svg {
  width: 100%;
  height: auto;
  margin-bottom: 16px;
}

.data-line {
  animation: drawLine 1.5s ease-out;
}

@keyframes drawLine {
  from {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
  }
}

.point-dot {
  cursor: pointer;
  transition: all 0.3s ease;
}

.point-dot:hover,
.point-dot.active {
  r: 8;
  transform-origin: center;
}

.point-glow {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
    r: 12;
  }
  50% {
    opacity: 0.2;
    r: 15;
  }
}

.deco-emoji {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.legend-area {
  width: 20px;
  height: 12px;
  border-radius: 4px;
  opacity: 0.3;
}

.data-input-section {
  background: linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 100%);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 2px dashed #e5e7eb;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.input-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.clear-btn {
  padding: 8px 16px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.clear-btn:hover {
  background: #fecaca;
  transform: scale(1.05);
}

.input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.month-select,
.value-input {
  flex: 1;
  min-width: 150px;
}

.quick-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  color: #6b7280;
}

.quick-btn:hover {
  border-color: #7c3aed;
  color: #7c3aed;
  background: #f5f3ff;
  transform: translateY(-1px);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  padding: 20px;
  border-radius: 16px;
  border: 2px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #7c3aed;
}

.stat-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 13px;
  color: #9ca3af;
}

.stat-trend {
  font-size: 20px;
}

.trend-icon {
  display: inline-block;
  animation: trendPulse 2s infinite;
}

.trend-icon.up {
  color: #10b981;
}

.trend-icon.down {
  color: #ef4444;
}

@keyframes trendPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.data-records {
  background: #f9fafb;
  padding: 24px;
  border-radius: 16px;
  animation: slideDown 0.4s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

.data-records h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 16px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  background: white;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.record-item:hover {
  border-color: #7c3aed;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
}

.record-month {
  font-weight: 600;
  color: #7c3aed;
  min-width: 60px;
}

.record-value {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.record-status {
  min-width: 60px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.normal {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.low {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.high {
  background: #fee2e2;
  color: #991b1b;
}

.delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  opacity: 0;
}

.record-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #fecaca;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .growth-chart-container {
    padding: 20px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .chart-tabs {
    width: 100%;
    justify-content: space-between;
  }

  .tab-text {
    display: none;
  }

  .stats-cards {
    grid-template-columns: 1fr;
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

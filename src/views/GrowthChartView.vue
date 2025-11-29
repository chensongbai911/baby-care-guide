<template>
  <div class="growth-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <el-button class="back-btn" @click="router.back()" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-info">
          <h1>📈 成长曲线</h1>
          <p>记录宝宝的身高体重变化</p>
        </div>
        <div class="header-actions">
          <el-button class="action-btn" circle @click="showExportDialog = true">
            <el-icon><Download /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 宝宝信息概览 -->
    <div class="baby-overview">
      <div class="overview-card">
        <div class="baby-avatar">
          <span class="avatar-emoji">👶</span>
          <div class="gender-badge" :class="babyGender">
            {{ babyGender === 'boy' ? '♂' : '♀' }}
          </div>
        </div>
        <div class="baby-info">
          <h3>{{ babyStore.babyInfo.name || '我的宝贝' }}</h3>
          <p>{{ babyStore.currentMonth }} 月龄</p>
        </div>
        <el-dropdown @command="handleGenderChange">
          <el-button type="primary" plain size="small" round>
            {{ babyGender === 'boy' ? '男宝' : '女宝' }}
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="boy">👦 男宝宝</el-dropdown-item>
              <el-dropdown-item command="girl">👧 女宝宝</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 当前数据卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card weight" @click="scrollToChart('weight')">
          <div class="stat-icon-wrap">
            <span class="stat-icon">⚖️</span>
          </div>
          <div class="stat-content">
            <span class="stat-label">体重</span>
            <div class="stat-value-wrap">
              <span class="stat-value">{{ latestRecord?.weight || '--' }}</span>
              <span class="stat-unit">kg</span>
            </div>
            <div class="stat-compare" v-if="latestRecord && weightPercentile">
              <span :class="getPercentileClass(weightPercentile)">
                {{ getPercentileText(weightPercentile) }}
              </span>
            </div>
          </div>
          <div class="stat-trend" v-if="weightTrend !== 0">
            <el-icon :class="weightTrend > 0 ? 'up' : 'down'">
              <component :is="weightTrend > 0 ? 'Top' : 'Bottom'" />
            </el-icon>
            <span>{{ Math.abs(weightTrend).toFixed(2) }}kg</span>
          </div>
        </div>

        <div class="stat-card height" @click="scrollToChart('height')">
          <div class="stat-icon-wrap">
            <span class="stat-icon">📏</span>
          </div>
          <div class="stat-content">
            <span class="stat-label">身高</span>
            <div class="stat-value-wrap">
              <span class="stat-value">{{ latestRecord?.height || '--' }}</span>
              <span class="stat-unit">cm</span>
            </div>
            <div class="stat-compare" v-if="latestRecord && heightPercentile">
              <span :class="getPercentileClass(heightPercentile)">
                {{ getPercentileText(heightPercentile) }}
              </span>
            </div>
          </div>
          <div class="stat-trend" v-if="heightTrend !== 0">
            <el-icon :class="heightTrend > 0 ? 'up' : 'down'">
              <component :is="heightTrend > 0 ? 'Top' : 'Bottom'" />
            </el-icon>
            <span>{{ Math.abs(heightTrend).toFixed(1) }}cm</span>
          </div>
        </div>

        <div class="stat-card head" @click="scrollToChart('head')">
          <div class="stat-icon-wrap">
            <span class="stat-icon">🧒</span>
          </div>
          <div class="stat-content">
            <span class="stat-label">头围</span>
            <div class="stat-value-wrap">
              <span class="stat-value">
                {{ latestRecord?.headCircumference || '--' }}
              </span>
              <span class="stat-unit">cm</span>
            </div>
          </div>
        </div>

        <div class="stat-card bmi">
          <div class="stat-icon-wrap">
            <span class="stat-icon">📊</span>
          </div>
          <div class="stat-content">
            <span class="stat-label">BMI</span>
            <div class="stat-value-wrap">
              <span class="stat-value">{{ bmiValue || '--' }}</span>
              <span class="stat-unit"></span>
            </div>
            <div class="stat-compare" v-if="bmiValue">
              <span class="normal">{{ bmiStatus }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速添加 -->
    <div class="quick-add-section">
      <el-button
        type="primary"
        size="large"
        round
        class="add-btn"
        @click="openAddDialog"
      >
        <el-icon><Plus /></el-icon>
        记录成长数据
      </el-button>
    </div>

    <!-- 图表切换 -->
    <div class="chart-section" ref="chartSectionRef">
      <div class="section-header">
        <h2>📊 成长趋势</h2>
        <el-segmented
          v-model="chartType"
          :options="chartOptions"
          size="small"
        />
      </div>

      <div class="chart-card">
        <div class="chart-legend" v-if="growthRecords.length > 0">
          <div class="legend-item baby">
            <span class="legend-dot"></span>
            <span>宝宝数据</span>
          </div>
          <div class="legend-item standard-high">
            <span class="legend-line"></span>
            <span>97%</span>
          </div>
          <div class="legend-item standard-mid">
            <span class="legend-line"></span>
            <span>50%</span>
          </div>
          <div class="legend-item standard-low">
            <span class="legend-line"></span>
            <span>3%</span>
          </div>
        </div>

        <div class="chart-container">
          <div v-if="growthRecords.length === 0" class="empty-chart">
            <div class="empty-illustration">
              <span class="empty-icon">📈</span>
              <div class="empty-circles">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <p class="empty-title">还没有成长记录</p>
            <p class="empty-desc">记录宝宝的第一条成长数据吧</p>
            <el-button type="primary" round @click="openAddDialog">
              <el-icon><Plus /></el-icon>
              添加记录
            </el-button>
          </div>

          <!-- SVG 图表 -->
          <svg
            v-else
            class="growth-chart"
            viewBox="0 0 400 250"
            preserveAspectRatio="xMidYMid meet"
          >
            <!-- 网格线 -->
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #667eea; stop-opacity: 0.3;"
                />
                <stop
                  offset="100%"
                  style="stop-color: #667eea; stop-opacity: 0.05;"
                />
              </linearGradient>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" style="stop-color: #667eea;" />
                <stop offset="100%" style="stop-color: #764ba2;" />
              </linearGradient>
            </defs>

            <!-- Y轴标签 -->
            <g class="y-axis">
              <text
                v-for="(label, i) in yAxisLabels"
                :key="i"
                :x="35"
                :y="30 + i * 45"
                class="axis-label"
              >
                {{ label }}
              </text>
              <line
                v-for="i in 5"
                :key="'grid-' + i"
                x1="45"
                :y1="30 + (i - 1) * 45"
                x2="380"
                :y2="30 + (i - 1) * 45"
                class="grid-line"
              />
            </g>

            <!-- X轴标签 -->
            <g class="x-axis">
              <text
                v-for="month in xAxisMonths"
                :key="month"
                :x="getXPosition(month)"
                y="235"
                class="axis-label"
              >
                {{ month }}月
              </text>
            </g>

            <!-- WHO标准曲线 - 97% -->
            <path :d="standardPath97" class="standard-line high" fill="none" />
            <!-- WHO标准曲线 - 50% -->
            <path :d="standardPath50" class="standard-line mid" fill="none" />
            <!-- WHO标准曲线 - 3% -->
            <path :d="standardPath3" class="standard-line low" fill="none" />

            <!-- 宝宝数据区域 -->
            <path :d="areaPath" class="data-area" />
            <!-- 宝宝数据线 -->
            <path :d="linePath" class="data-line" fill="none" />

            <!-- 数据点 -->
            <g class="data-points">
              <circle
                v-for="(point, i) in chartPoints"
                :key="i"
                :cx="point.x"
                :cy="point.y"
                r="6"
                class="data-point"
                @click="showPointDetail(point)"
              />
              <circle
                v-for="(point, i) in chartPoints"
                :key="'inner-' + i"
                :cx="point.x"
                :cy="point.y"
                r="3"
                class="data-point-inner"
              />
            </g>
          </svg>
        </div>

        <!-- 图表提示 -->
        <div class="chart-tip" v-if="growthRecords.length > 0">
          <el-icon><InfoFilled /></el-icon>
          <span>点击数据点查看详情，灰色曲线为WHO标准参考</span>
        </div>
      </div>
    </div>

    <!-- 成长记录列表 -->
    <div class="records-section">
      <div class="section-header">
        <h2>📝 成长记录</h2>
        <el-button
          text
          type="primary"
          @click="showAllRecords = !showAllRecords"
        >
          {{ showAllRecords ? '收起' : '查看全部' }}
        </el-button>
      </div>

      <div class="records-timeline">
        <div
          v-for="(record, index) in displayRecords"
          :key="record.id"
          class="record-item"
          :class="{ latest: index === 0 }"
        >
          <div class="timeline-node">
            <div class="node-dot"></div>
            <div
              class="node-line"
              v-if="index < displayRecords.length - 1"
            ></div>
          </div>
          <div class="record-card">
            <div class="record-header">
              <div class="record-age">
                <span class="age-number">{{ record.ageMonth }}</span>
                <span class="age-unit">月龄</span>
              </div>
              <div class="record-date">{{ formatDate(record.date) }}</div>
              <div class="record-actions">
                <el-button text size="small" @click="editRecord(record)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button
                  text
                  size="small"
                  type="danger"
                  @click="deleteRecord(record)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="record-data">
              <div class="data-item">
                <span class="data-icon">⚖️</span>
                <span class="data-value">{{ record.weight }} kg</span>
              </div>
              <div class="data-item">
                <span class="data-icon">📏</span>
                <span class="data-value">{{ record.height }} cm</span>
              </div>
              <div class="data-item" v-if="record.headCircumference">
                <span class="data-icon">🧒</span>
                <span class="data-value">
                  {{ record.headCircumference }} cm
                </span>
              </div>
            </div>
            <div class="record-note" v-if="record.note">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ record.note }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="growthRecords.length === 0" class="empty-records">
        <p>暂无记录</p>
      </div>
    </div>

    <!-- WHO参考标准 -->
    <div class="reference-section">
      <div class="section-header" @click="showReference = !showReference">
        <h2>📖 WHO生长标准</h2>
        <el-icon :class="{ rotated: showReference }"><ArrowDown /></el-icon>
      </div>

      <el-collapse-transition>
        <div v-show="showReference" class="reference-content">
          <div class="reference-tabs">
            <el-segmented
              v-model="referenceType"
              :options="referenceOptions"
              size="small"
            />
          </div>
          <div class="reference-table">
            <div class="table-header">
              <span>月龄</span>
              <span>3%</span>
              <span>50%</span>
              <span>97%</span>
            </div>
            <div class="table-body">
              <div
                v-for="item in currentReferenceData"
                :key="item.month"
                class="table-row"
              >
                <span class="month-cell">{{ item.month }}月</span>
                <span>{{ item.p3 }}</span>
                <span class="highlight">{{ item.p50 }}</span>
                <span>{{ item.p97 }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingRecord ? '✏️ 编辑记录' : '📝 添加成长记录'"
      width="90%"
      :style="{ maxWidth: '500px' }"
      class="record-dialog"
    >
      <el-form :model="recordForm" label-position="top" class="record-form">
        <el-form-item label="📅 记录日期">
          <el-date-picker
            v-model="recordForm.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="🗓️ 宝宝月龄">
          <el-slider
            v-model="recordForm.ageMonth"
            :min="0"
            :max="12"
            :marks="monthMarks"
            show-stops
          />
        </el-form-item>

        <div class="form-row">
          <el-form-item label="⚖️ 体重 (kg)" class="half">
            <el-input-number
              v-model="recordForm.weight"
              :precision="2"
              :step="0.1"
              :min="0"
              :max="20"
              controls-position="right"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="📏 身高 (cm)" class="half">
            <el-input-number
              v-model="recordForm.height"
              :precision="1"
              :step="0.5"
              :min="0"
              :max="100"
              controls-position="right"
              style="width: 100%;"
            />
          </el-form-item>
        </div>

        <el-form-item label="🧒 头围 (cm)">
          <el-input-number
            v-model="recordForm.headCircumference"
            :precision="1"
            :step="0.5"
            :min="0"
            :max="60"
            controls-position="right"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="📝 备注">
          <el-input
            v-model="recordForm.note"
            type="textarea"
            :rows="2"
            placeholder="记录宝宝这个阶段的特别之处..."
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="cancelEdit" round>取消</el-button>
        <el-button type="primary" @click="saveRecord" round>
          {{ editingRecord ? '保存' : '添加' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog
      v-model="showExportDialog"
      title="📤 导出数据"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <div class="export-options">
        <div class="export-option" @click="exportData('json')">
          <el-icon><Document /></el-icon>
          <span>导出 JSON</span>
        </div>
        <div class="export-option" @click="exportData('csv')">
          <el-icon><Grid /></el-icon>
          <span>导出 CSV</span>
        </div>
      </div>
    </el-dialog>

    <!-- 数据点详情弹窗 -->
    <el-dialog
      v-model="showPointDialog"
      title="📊 数据详情"
      width="90%"
      :style="{ maxWidth: '350px' }"
    >
      <div class="point-detail" v-if="selectedPoint">
        <div class="detail-item">
          <span class="label">月龄</span>
          <span class="value">{{ selectedPoint.record.ageMonth }} 个月</span>
        </div>
        <div class="detail-item">
          <span class="label">日期</span>
          <span class="value">{{ formatDate(selectedPoint.record.date) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">{{ chartTypeLabel }}</span>
          <span class="value highlight">
            {{ getRecordValue(selectedPoint.record) }} {{ chartTypeUnit }}
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import {
  ArrowLeft,
  ArrowDown,
  Plus,
  Edit,
  Delete,
  Download,
  Top,
  Bottom,
  InfoFilled,
  ChatDotRound,
  Document,
  Grid,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const babyStore = useBabyStore()

// 数据类型
interface GrowthRecord {
  id: string
  date: Date
  ageMonth: number
  weight: number
  height: number
  headCircumference: number
  note?: string
}

interface ChartPoint {
  x: number
  y: number
  record: GrowthRecord
}

// 状态
const showAddDialog = ref(false)
const showExportDialog = ref(false)
const showPointDialog = ref(false)
const showAllRecords = ref(false)
const showReference = ref(false)
const editingRecord = ref<GrowthRecord | null>(null)
const selectedPoint = ref<ChartPoint | null>(null)
const chartSectionRef = ref<HTMLElement | null>(null)

const chartType = ref('weight')
const referenceType = ref('weight')
const babyGender = ref('boy')

const chartOptions = [
  { label: '体重', value: 'weight' },
  { label: '身高', value: 'height' },
  { label: '头围', value: 'head' },
]

const referenceOptions = [
  { label: '体重', value: 'weight' },
  { label: '身高', value: 'height' },
]

const monthMarks = {
  0: '0月',
  3: '3月',
  6: '6月',
  9: '9月',
  12: '12月',
}

const recordForm = ref({
  date: new Date(),
  ageMonth: babyStore.currentMonth,
  weight: 0,
  height: 0,
  headCircumference: 0,
  note: '',
})

const growthRecords = ref<GrowthRecord[]>([])

// WHO标准数据
const whoStandards = {
  weight: {
    boy: {
      p3: [2.5, 3.4, 4.3, 5.0, 5.6, 6.0, 6.4, 6.7, 6.9, 7.1, 7.4, 7.6, 7.7],
      p50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6],
      p97: [
        4.4,
        5.8,
        7.1,
        8.0,
        8.7,
        9.3,
        9.8,
        10.3,
        10.7,
        11.0,
        11.4,
        11.7,
        12.0,
      ],
    },
    girl: {
      p3: [2.4, 3.2, 3.9, 4.5, 5.0, 5.4, 5.7, 6.0, 6.3, 6.5, 6.7, 6.9, 7.0],
      p50: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9],
      p97: [
        4.2,
        5.5,
        6.6,
        7.5,
        8.2,
        8.8,
        9.3,
        9.8,
        10.2,
        10.6,
        10.9,
        11.2,
        11.5,
      ],
    },
  },
  height: {
    boy: {
      p3: [
        46.1,
        51.1,
        54.7,
        57.6,
        60.0,
        61.9,
        63.6,
        65.1,
        66.5,
        67.7,
        69.0,
        70.2,
        71.3,
      ],
      p50: [
        49.9,
        54.7,
        58.4,
        61.4,
        63.9,
        65.9,
        67.6,
        69.2,
        70.6,
        72.0,
        73.3,
        74.5,
        75.7,
      ],
      p97: [
        53.7,
        58.4,
        62.2,
        65.3,
        67.8,
        70.0,
        71.9,
        73.5,
        75.0,
        76.5,
        77.9,
        79.2,
        80.5,
      ],
    },
    girl: {
      p3: [
        45.4,
        50.0,
        53.2,
        55.8,
        58.0,
        59.9,
        61.5,
        62.9,
        64.3,
        65.6,
        66.8,
        68.0,
        69.2,
      ],
      p50: [
        49.1,
        53.7,
        57.1,
        59.8,
        62.1,
        64.0,
        65.7,
        67.3,
        68.7,
        70.1,
        71.5,
        72.8,
        74.0,
      ],
      p97: [
        52.9,
        57.5,
        61.1,
        64.0,
        66.4,
        68.5,
        70.3,
        72.0,
        73.5,
        75.0,
        76.4,
        77.8,
        79.2,
      ],
    },
  },
  head: {
    boy: {
      p3: [
        32.1,
        35.1,
        37.0,
        38.3,
        39.4,
        40.3,
        41.0,
        41.7,
        42.2,
        42.6,
        43.0,
        43.4,
        43.6,
      ],
      p50: [
        34.5,
        37.3,
        39.1,
        40.5,
        41.6,
        42.6,
        43.3,
        44.0,
        44.5,
        45.0,
        45.4,
        45.8,
        46.1,
      ],
      p97: [
        36.9,
        39.5,
        41.3,
        42.7,
        43.9,
        44.8,
        45.6,
        46.3,
        46.9,
        47.4,
        47.8,
        48.2,
        48.6,
      ],
    },
    girl: {
      p3: [
        31.5,
        34.2,
        35.8,
        37.1,
        38.1,
        38.9,
        39.6,
        40.2,
        40.7,
        41.2,
        41.5,
        41.9,
        42.2,
      ],
      p50: [
        33.9,
        36.5,
        38.3,
        39.5,
        40.6,
        41.5,
        42.2,
        42.8,
        43.4,
        43.8,
        44.2,
        44.6,
        44.9,
      ],
      p97: [
        36.2,
        38.9,
        40.7,
        42.0,
        43.1,
        44.0,
        44.8,
        45.5,
        46.0,
        46.5,
        46.9,
        47.3,
        47.7,
      ],
    },
  },
}

// 计算属性
const sortedRecords = computed(() => {
  return [...growthRecords.value].sort((a, b) => b.ageMonth - a.ageMonth)
})

const displayRecords = computed(() => {
  return showAllRecords.value
    ? sortedRecords.value
    : sortedRecords.value.slice(0, 3)
})

const latestRecord = computed(() => {
  return sortedRecords.value[0] || null
})

const previousRecord = computed(() => {
  return sortedRecords.value[1] || null
})

const weightTrend = computed(() => {
  if (!latestRecord.value || !previousRecord.value) return 0
  return latestRecord.value.weight - previousRecord.value.weight
})

const heightTrend = computed(() => {
  if (!latestRecord.value || !previousRecord.value) return 0
  return latestRecord.value.height - previousRecord.value.height
})

const bmiValue = computed(() => {
  if (
    !latestRecord.value ||
    !latestRecord.value.weight ||
    !latestRecord.value.height
  )
    return null
  const heightM = latestRecord.value.height / 100
  return (latestRecord.value.weight / (heightM * heightM)).toFixed(1)
})

const bmiStatus = computed(() => {
  if (!bmiValue.value) return ''
  const bmi = parseFloat(bmiValue.value)
  if (bmi < 14) return '偏瘦'
  if (bmi > 18) return '偏胖'
  return '正常'
})

const weightPercentile = computed(() => {
  if (!latestRecord.value) return null
  return calculatePercentile(
    'weight',
    latestRecord.value.weight,
    latestRecord.value.ageMonth,
  )
})

const heightPercentile = computed(() => {
  if (!latestRecord.value) return null
  return calculatePercentile(
    'height',
    latestRecord.value.height,
    latestRecord.value.ageMonth,
  )
})

const chartTypeLabel = computed(() => {
  if (chartType.value === 'weight') return '体重'
  if (chartType.value === 'height') return '身高'
  return '头围'
})

const chartTypeUnit = computed(() => {
  if (chartType.value === 'weight') return 'kg'
  return 'cm'
})

// 图表相关计算
const chartDataType = computed(
  () => chartType.value as 'weight' | 'height' | 'head',
)

const yAxisLabels = computed(() => {
  const ranges = {
    weight: [12, 9, 6, 3, 0],
    height: [85, 70, 55, 40, 25],
    head: [50, 45, 40, 35, 30],
  }
  return ranges[chartDataType.value]
})

const xAxisMonths = computed(() => [0, 3, 6, 9, 12])

const chartPoints = computed((): ChartPoint[] => {
  const sortedByAge = [...growthRecords.value].sort(
    (a, b) => a.ageMonth - b.ageMonth,
  )
  return sortedByAge.map((record) => ({
    x: getXPosition(record.ageMonth),
    y: getYPosition(getRecordValue(record)),
    record,
  }))
})

const linePath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  const points = chartPoints.value
  const first = points[0]
  if (!first) return ''
  if (points.length === 1) return `M ${first.x} ${first.y}`

  let path = `M ${first.x} ${first.y}`
  for (let i = 1; i < points.length; i++) {
    const pt = points[i]
    if (pt) path += ` L ${pt.x} ${pt.y}`
  }
  return path
})

const areaPath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  const points = chartPoints.value
  const baseline = 210
  const first = points[0]
  const last = points[points.length - 1]
  if (!first || !last) return ''

  let path = `M ${first.x} ${baseline}`
  path += ` L ${first.x} ${first.y}`
  for (let i = 1; i < points.length; i++) {
    const pt = points[i]
    if (pt) path += ` L ${pt.x} ${pt.y}`
  }
  path += ` L ${last.x} ${baseline} Z`
  return path
})

const standardPath97 = computed(() => generateStandardPath('p97'))
const standardPath50 = computed(() => generateStandardPath('p50'))
const standardPath3 = computed(() => generateStandardPath('p3'))

const currentReferenceData = computed(() => {
  const type = referenceType.value as 'weight' | 'height'
  const gender = babyGender.value as 'boy' | 'girl'
  const data = whoStandards[type][gender]

  return data.p50.map((_, i) => ({
    month: i,
    p3: data.p3[i] ?? 0,
    p50: data.p50[i] ?? 0,
    p97: data.p97[i] ?? 0,
  }))
})

// 方法
function getXPosition(month: number): number {
  return 45 + (month / 12) * 335
}

function getYPosition(value: number): number {
  const ranges = {
    weight: { min: 0, max: 12 },
    height: { min: 25, max: 85 },
    head: { min: 30, max: 50 },
  }
  const range = ranges[chartDataType.value]
  const normalized = (value - range.min) / (range.max - range.min)
  return 210 - normalized * 180
}

function getRecordValue(record: GrowthRecord): number {
  if (chartType.value === 'weight') return record.weight
  if (chartType.value === 'height') return record.height
  return record.headCircumference
}

function generateStandardPath(percentile: 'p3' | 'p50' | 'p97'): string {
  const type = chartDataType.value
  const gender = babyGender.value as 'boy' | 'girl'
  const data = whoStandards[type][gender][percentile]

  if (!data || data.length === 0) return ''

  let path = `M ${getXPosition(0)} ${getYPosition(data[0] ?? 0)}`
  for (let i = 1; i < data.length; i++) {
    path += ` L ${getXPosition(i)} ${getYPosition(data[i] ?? 0)}`
  }
  return path
}
function calculatePercentile(
  type: 'weight' | 'height',
  value: number,
  month: number,
): string | null {
  const gender = babyGender.value as 'boy' | 'girl'
  const data = whoStandards[type][gender]
  const idx = Math.min(month, 12)

  const p3Val = data.p3[idx] ?? 0
  const p50Val = data.p50[idx] ?? 0
  const p97Val = data.p97[idx] ?? 0

  if (value <= p3Val) return '<3%'
  if (value <= p50Val) return '3-50%'
  if (value <= p97Val) return '50-97%'
  return '>97%'
}

function getPercentileClass(percentile: string | null): string {
  if (!percentile) return ''
  if (percentile === '<3%' || percentile === '>97%') return 'warning'
  return 'normal'
}

function getPercentileText(percentile: string | null): string {
  return percentile || ''
}

function scrollToChart(type: string) {
  chartType.value = type
  chartSectionRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function handleGenderChange(command: string) {
  babyGender.value = command
  localStorage.setItem('babyGender', command)
}

function showPointDetail(point: ChartPoint) {
  selectedPoint.value = point
  showPointDialog.value = true
}

function openAddDialog() {
  editingRecord.value = null
  recordForm.value = {
    date: new Date(),
    ageMonth: babyStore.currentMonth,
    weight: 0,
    height: 0,
    headCircumference: 0,
    note: '',
  }
  showAddDialog.value = true
}

function editRecord(record: GrowthRecord) {
  editingRecord.value = record
  recordForm.value = {
    date: new Date(record.date),
    ageMonth: record.ageMonth,
    weight: record.weight,
    height: record.height,
    headCircumference: record.headCircumference,
    note: record.note || '',
  }
  showAddDialog.value = true
}

async function deleteRecord(record: GrowthRecord) {
  try {
    await ElMessageBox.confirm('确定删除这条记录吗？', '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    growthRecords.value = growthRecords.value.filter((r) => r.id !== record.id)
    saveRecords()
    ElMessage.success('已删除')
  } catch {
    // 取消
  }
}

function saveRecord() {
  if (recordForm.value.weight <= 0 && recordForm.value.height <= 0) {
    ElMessage.warning('请至少填写体重或身高')
    return
  }

  if (editingRecord.value) {
    const index = growthRecords.value.findIndex(
      (r) => r.id === editingRecord.value!.id,
    )
    if (index !== -1) {
      growthRecords.value[index] = {
        ...editingRecord.value,
        ...recordForm.value,
      }
    }
    ElMessage.success('已更新 ✨')
  } else {
    growthRecords.value.push({
      id: Date.now().toString(),
      ...recordForm.value,
    })
    ElMessage.success('已添加 🎉')
  }

  saveRecords()
  cancelEdit()
}

function cancelEdit() {
  showAddDialog.value = false
  editingRecord.value = null
}

function formatDate(date: Date): string {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(d.getDate()).padStart(2, '0')}`
}

function disabledDate(date: Date): boolean {
  return date > new Date()
}

function loadRecords() {
  const saved = localStorage.getItem('growthRecords')
  if (saved) {
    growthRecords.value = JSON.parse(saved).map((r: GrowthRecord) => ({
      ...r,
      date: new Date(r.date),
    }))
  }
  const savedGender = localStorage.getItem('babyGender')
  if (savedGender) {
    babyGender.value = savedGender
  }
}

function saveRecords() {
  localStorage.setItem('growthRecords', JSON.stringify(growthRecords.value))
}

function exportData(format: 'json' | 'csv') {
  if (growthRecords.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  let content: string
  let filename: string
  let type: string

  if (format === 'json') {
    content = JSON.stringify(growthRecords.value, null, 2)
    filename = 'growth-records.json'
    type = 'application/json'
  } else {
    const headers = ['日期', '月龄', '体重(kg)', '身高(cm)', '头围(cm)', '备注']
    const rows = growthRecords.value.map((r) => [
      formatDate(r.date),
      r.ageMonth,
      r.weight,
      r.height,
      r.headCircumference,
      r.note || '',
    ])
    content = [headers, ...rows].map((row) => row.join(',')).join('\n')
    filename = 'growth-records.csv'
    type = 'text/csv'
  }

  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)

  showExportDialog.value = false
  ElMessage.success('导出成功')
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.growth-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #f3e7ff 0%, #ffffff 30%, #e8f4f8 100%);
  padding-bottom: 40px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
  border-radius: 0 0 32px 32px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn,
.action-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
}

.header-info h1 {
  font-size: 22px;
  margin: 0 0 4px 0;
}

.header-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

/* 宝宝概览 */
.baby-overview {
  padding: 0 20px;
  margin-top: -20px;
  position: relative;
  z-index: 10;
}

.overview-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
}

.baby-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-emoji {
  font-size: 32px;
}

.gender-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
}

.gender-badge.boy {
  background: #42a5f5;
  color: white;
}

.gender-badge.girl {
  background: #ec407a;
  color: white;
}

.baby-info {
  flex: 1;
}

.baby-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #333;
}

.baby-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 数据卡片 */
.stats-section {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card.weight::before {
  background: linear-gradient(90deg, #66bb6a, #43a047);
}

.stat-card.height::before {
  background: linear-gradient(90deg, #42a5f5, #1976d2);
}

.stat-card.head::before {
  background: linear-gradient(90deg, #ffb74d, #f57c00);
}

.stat-card.bmi::before {
  background: linear-gradient(90deg, #ab47bc, #7b1fa2);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrap {
  margin-bottom: 8px;
}

.stat-icon {
  font-size: 28px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-value-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-unit {
  font-size: 14px;
  color: #666;
}

.stat-compare {
  margin-top: 4px;
}

.stat-compare span {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.stat-compare .normal {
  background: #e8f5e9;
  color: #43a047;
}

.stat-compare .warning {
  background: #fff3e0;
  color: #f57c00;
}

.stat-trend {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.stat-trend .up {
  color: #43a047;
}

.stat-trend .down {
  color: #e53935;
}

/* 快速添加 */
.quick-add-section {
  padding: 0 20px 20px;
  text-align: center;
}

.add-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
}

/* 图表区域 */
.chart-section {
  padding: 0 20px 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  margin: 0;
  color: #333;
}

.chart-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.chart-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.legend-line {
  width: 20px;
  height: 2px;
}

.legend-item.standard-high .legend-line {
  background: #ef9a9a;
}

.legend-item.standard-mid .legend-line {
  background: #a5d6a7;
}

.legend-item.standard-low .legend-line {
  background: #90caf9;
}

.chart-container {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-chart {
  text-align: center;
  padding: 40px 20px;
}

.empty-illustration {
  position: relative;
  margin-bottom: 20px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.5;
}

.empty-circles {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.empty-circles span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  animation: bounce 1.4s infinite ease-in-out;
}

.empty-circles span:nth-child(1) {
  animation-delay: -0.32s;
}
.empty-circles span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.empty-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: #999;
  margin: 0 0 20px 0;
}

/* SVG 图表 */
.growth-chart {
  width: 100%;
  height: auto;
}

.axis-label {
  font-size: 10px;
  fill: #999;
  text-anchor: middle;
}

.y-axis .axis-label {
  text-anchor: end;
}

.grid-line {
  stroke: #f0f0f0;
  stroke-width: 1;
}

.standard-line {
  stroke-width: 1.5;
  stroke-dasharray: 4 4;
}

.standard-line.high {
  stroke: #ef9a9a;
}

.standard-line.mid {
  stroke: #a5d6a7;
}

.standard-line.low {
  stroke: #90caf9;
}

.data-area {
  fill: url(#chartGradient);
}

.data-line {
  stroke: url(#lineGradient);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.data-point {
  fill: white;
  stroke: #667eea;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.data-point:hover {
  r: 8;
}

.data-point-inner {
  fill: #667eea;
  pointer-events: none;
}

.chart-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
}

/* 记录列表 */
.records-section {
  padding: 0 20px 20px;
}

.records-timeline {
  position: relative;
}

.record-item {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
}

.node-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #ddd;
  z-index: 1;
}

.record-item.latest .node-dot {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 0 0 2px #667eea;
}

.node-line {
  flex: 1;
  width: 2px;
  background: #eee;
  margin-top: 4px;
}

.record-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.record-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.record-age {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.age-number {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.age-unit {
  font-size: 12px;
  color: #666;
}

.record-date {
  flex: 1;
  font-size: 13px;
  color: #999;
}

.record-actions {
  display: flex;
}

.record-data {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.data-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.data-icon {
  font-size: 16px;
}

.data-value {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.record-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
}

.empty-records {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* 参考标准 */
.reference-section {
  padding: 0 20px;
}

.reference-section .section-header {
  cursor: pointer;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.reference-section .section-header .el-icon {
  transition: transform 0.3s ease;
}

.reference-section .section-header .el-icon.rotated {
  transform: rotate(180deg);
}

.reference-content {
  background: white;
  border-radius: 0 0 16px 16px;
  padding: 16px;
  margin-top: -8px;
}

.reference-tabs {
  margin-bottom: 16px;
}

.reference-table {
  font-size: 13px;
}

.table-header {
  display: grid;
  grid-template-columns: 60px repeat(3, 1fr);
  gap: 8px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
  font-weight: 500;
  color: #666;
  text-align: center;
}

.table-body {
  max-height: 300px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 60px repeat(3, 1fr);
  gap: 8px;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.month-cell {
  font-weight: 500;
  color: #333;
}

.table-row .highlight {
  color: #667eea;
  font-weight: 600;
}

/* 对话框 */
.record-dialog :deep(.el-dialog__header) {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.record-form .form-row {
  display: flex;
  gap: 16px;
}

.record-form .form-row .half {
  flex: 1;
}

/* 导出选项 */
.export-options {
  display: flex;
  gap: 16px;
}

.export-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-option:hover {
  background: #e8e8e8;
}

.export-option .el-icon {
  font-size: 32px;
  color: #667eea;
}

/* 数据点详情 */
.point-detail {
  padding: 10px 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  color: #666;
}

.detail-item .value {
  font-weight: 500;
  color: #333;
}

.detail-item .value.highlight {
  color: #667eea;
  font-size: 18px;
}

/* 响应式 */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-legend {
    gap: 12px;
  }
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .growth-view {
    max-width: 900px;
    margin: 0 auto;
  }
}
</style>

// filepath: d:\car-di\src\components\baby\SleepTracker.vue
<template>
  <div class="sleep-tracker">
    <div class="tracker-header">
      <div class="header-title">
        <span class="moon-icon">🌙</span>
        <h3>睡眠追踪</h3>
      </div>
      <div class="header-date">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          size="small"
          format="MM月DD日"
        />
      </div>
    </div>

    <!-- 圆形睡眠时钟 -->
    <div class="clock-container">
      <svg class="sleep-clock" viewBox="0 0 300 300">
        <defs>
          <!-- 睡眠时间渐变 -->
          <linearGradient id="sleepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="50%" stop-color="#8b5cf6"/>
            <stop offset="100%" stop-color="#a855f7"/>
          </linearGradient>

          <!-- 清醒时间渐变 -->
          <linearGradient id="awakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#f59e0b"/>
          </linearGradient>

          <!-- 发光滤镜 -->
          <filter id="sleepGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- 星星图案 -->
          <pattern id="starsPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <text x="10" y="15" font-size="8" opacity="0.3">✨</text>
            <text x="30" y="35" font-size="6" opacity="0.2">⭐</text>
          </pattern>
        </defs>

        <!-- 背景圆 -->
        <circle
          cx="150" cy="150" r="140"
          fill="url(#starsPattern)"
          stroke="#e5e7eb"
          stroke-width="2"
        />

        <!-- 24小时刻度 -->
        <g class="hour-markers">
          <g v-for="hour in 24" :key="hour">
            <line
              :x1="150 + 125 * Math.cos((hour - 6) * 15 * Math.PI / 180)"
              :y1="150 + 125 * Math.sin((hour - 6) * 15 * Math.PI / 180)"
              :x2="150 + 135 * Math.cos((hour - 6) * 15 * Math.PI / 180)"
              :y2="150 + 135 * Math.sin((hour - 6) * 15 * Math.PI / 180)"
              :stroke="hour % 6 === 0 ? '#6b7280' : '#d1d5db'"
              :stroke-width="hour % 6 === 0 ? 2 : 1"
            />
            <text
              v-if="hour % 3 === 0"
              :x="150 + 110 * Math.cos((hour - 6) * 15 * Math.PI / 180)"
              :y="150 + 110 * Math.sin((hour - 6) * 15 * Math.PI / 180)"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="#9ca3af"
              font-size="11"
              font-weight="500"
            >
              {{ hour === 24 ? '0' : hour }}时
            </text>
          </g>
        </g>

        <!-- 睡眠时段弧线 -->
        <g class="sleep-arcs">
          <path
            v-for="(period, index) in sleepPeriods"
            :key="index"
            :d="getArcPath(period.start, period.end, 95)"
            fill="none"
            stroke="url(#sleepGradient)"
            stroke-width="24"
            stroke-linecap="round"
            filter="url(#sleepGlow)"
            class="sleep-arc"
            :style="{ animationDelay: `${index * 0.2}s` }"
          />
        </g>

        <!-- 中心信息 -->
        <g class="center-info">
          <circle cx="150" cy="150" r="60" fill="white" filter="url(#sleepGlow)"/>

          <!-- 睡眠图标动画 -->
          <g class="sleep-icon-group">
            <text x="150" y="130" text-anchor="middle" font-size="28" class="sleep-emoji">
              {{ isCurrentlySleeping ? '😴' : '👶' }}
            </text>
          </g>

          <text x="150" y="155" text-anchor="middle" fill="#1f2937" font-size="18" font-weight="700">
            {{ totalSleepHours }}小时
          </text>
          <text x="150" y="175" text-anchor="middle" fill="#9ca3af" font-size="11">
            今日睡眠
          </text>
        </g>

        <!-- 当前时间指针 -->
        <g class="current-time-pointer" :transform="`rotate(${currentTimeAngle}, 150, 150)`">
          <line x1="150" y1="150" x2="150" y2="70" stroke="#ef4444" stroke-width="2"/>
          <circle cx="150" cy="70" r="4" fill="#ef4444"/>
          <circle cx="150" cy="150" r="6" fill="#ef4444"/>
        </g>

        <!-- 日夜分隔 -->
        <g class="day-night-indicators">
          <text x="150" y="30" text-anchor="middle" font-size="16">🌞</text>
          <text x="150" y="280" text-anchor="middle" font-size="16">🌙</text>
          <text x="280" y="155" text-anchor="middle" font-size="14">🌅</text>
          <text x="20" y="155" text-anchor="middle" font-size="14">🌆</text>
        </g>
      </svg>
    </div>

    <!-- 睡眠记录操作 -->
    <div class="sleep-actions">
      <el-button
        :type="isCurrentlySleeping ? 'danger' : 'primary'"
        size="large"
        round
        @click="toggleSleep"
        class="sleep-toggle-btn"
      >
        <span class="btn-icon">{{ isCurrentlySleeping ? '⏰' : '🛏️' }}</span>
        <span>{{ isCurrentlySleeping ? '记录醒来' : '记录入睡' }}</span>
      </el-button>
    </div>

    <!-- 今日睡眠记录 -->
    <div class="sleep-records">
      <h4>📋 今日睡眠记录</h4>
      <div class="records-list">
        <div
          v-for="(period, index) in sleepPeriods"
          :key="index"
          class="record-item"
        >
          <div class="record-icon">
            {{ period.type === 'night' ? '🌙' : '☀️' }}
          </div>
          <div class="record-info">
            <span class="record-time">
              {{ formatTime(period.start) }} - {{ formatTime(period.end) }}
            </span>
            <span class="record-duration">
              {{ calculateDuration(period.start, period.end) }}
            </span>
          </div>
          <el-tag :type="period.type === 'night' ? 'primary' : 'warning'" size="small">
            {{ period.type === 'night' ? '夜间睡眠' : '小睡' }}
          </el-tag>
        </div>

        <div v-if="sleepPeriods.length === 0" class="empty-records">
          <span class="empty-icon">😊</span>
          <p>今天还没有睡眠记录</p>
        </div>
      </div>
    </div>

    <!-- 睡眠统计卡片 -->
    <div class="sleep-stats">
      <div class="stat-card night">
        <div class="stat-icon">🌙</div>
        <div class="stat-content">
          <span class="stat-value">{{ nightSleepHours }}h</span>
          <span class="stat-label">夜间睡眠</span>
        </div>
      </div>
      <div class="stat-card nap">
        <div class="stat-icon">☀️</div>
        <div class="stat-content">
          <span class="stat-value">{{ napCount }}次</span>
          <span class="stat-label">白天小睡</span>
        </div>
      </div>
      <div class="stat-card quality">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <span class="stat-value">{{ sleepQuality }}</span>
          <span class="stat-label">睡眠质量</span>
        </div>
      </div>
    </div>

    <!-- 睡眠建议 -->
    <div class="sleep-tips">
      <div class="tips-header">
        <span class="tips-icon">💡</span>
        <h4>睡眠小贴士</h4>
      </div>
      <div class="tips-content">
        <p>{{ currentTip }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface SleepPeriod {
  start: number // 小时数 (0-24)
  end: number
  type: 'night' | 'nap'
}

const selectedDate = ref(new Date())
const isCurrentlySleeping = ref(false)

// 模拟睡眠数据
const sleepPeriods = ref<SleepPeriod[]>([
  { start: 21, end: 24, type: 'night' },
  { start: 0, end: 6.5, type: 'night' },
  { start: 9, end: 10.5, type: 'nap' },
  { start: 13, end: 15, type: 'nap' }
])

const currentTimeAngle = computed(() => {
  const now = new Date()
  const hours = now.getHours() + now.getMinutes() / 60
  return (hours - 6) * 15 // 6点在顶部
})

const totalSleepHours = computed(() => {
  let total = 0
  sleepPeriods.value.forEach(period => {
    let duration = period.end - period.start
    if (duration < 0) duration += 24
    total += duration
  })
  return total.toFixed(1)
})

const nightSleepHours = computed(() => {
  let total = 0
  sleepPeriods.value
    .filter(p => p.type === 'night')
    .forEach(period => {
      let duration = period.end - period.start
      if (duration < 0) duration += 24
      total += duration
    })
  return total.toFixed(1)
})

const napCount = computed(() => {
  return sleepPeriods.value.filter(p => p.type === 'nap').length
})

const sleepQuality = computed(() => {
  const hours = parseFloat(totalSleepHours.value)
  if (hours >= 14) return '优秀'
  if (hours >= 12) return '良好'
  if (hours >= 10) return '一般'
  return '需改善'
})

const sleepTips = [
  '0-3个月宝宝每天需要14-17小时睡眠，要保证充足的睡眠时间哦！',
  '建立固定的睡前仪式，如洗澡、按摩、讲故事，帮助宝宝更好入睡。',
  '保持房间温度在20-22°C，湿度在50-60%，创造舒适的睡眠环境。',
  '白天小睡不要太长，避免影响夜间睡眠质量。',
  '观察宝宝的疲劳信号，如揉眼睛、打哈欠，及时哄睡。'
]

const currentTip = computed(() => {
  const index = new Date().getDate() % sleepTips.length
  return sleepTips[index]
})

const getArcPath = (start: number, end: number, radius: number) => {
  const startAngle = (start - 6) * 15 * Math.PI / 180
  const endAngle = (end - 6) * 15 * Math.PI / 180

  const x1 = 150 + radius * Math.cos(startAngle)
  const y1 = 150 + radius * Math.sin(startAngle)
  const x2 = 150 + radius * Math.cos(endAngle)
  const y2 = 150 + radius * Math.sin(endAngle)

  let angleDiff = end - start
  if (angleDiff < 0) angleDiff += 24
  const largeArc = angleDiff > 12 ? 1 : 0

  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
}

const formatTime = (hour: number) => {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

const calculateDuration = (start: number, end: number) => {
  let duration = end - start
  if (duration < 0) duration += 24
  const h = Math.floor(duration)
  const m = Math.round((duration - h) * 60)
  return `${h}小时${m > 0 ? m + '分钟' : ''}`
}

const toggleSleep = () => {
  isCurrentlySleeping.value = !isCurrentlySleeping.value
  if (isCurrentlySleeping.value) {
    ElMessage.success('已记录入睡时间 🌙')
  } else {
    ElMessage.success('已记录醒来时间 ☀️')
  }
}
</script>

<style scoped>
.sleep-tracker {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
  border-radius: 24px;
  padding: 24px;
  color: white;
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.moon-icon {
  font-size: 28px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(5deg); }
}

.header-title h3 {
  margin: 0;
  font-size: 20px;
}

.clock-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.sleep-clock {
  width: 100%;
  max-width: 300px;
  height: auto;
}

.sleep-arc {
  animation: drawArc 1s ease forwards;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
}

@keyframes drawArc {
  to { stroke-dashoffset: 0; }
}

.sleep-emoji {
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.current-time-pointer {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.sleep-actions {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.sleep-toggle-btn {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 20px;
}

.sleep-records {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.sleep-records h4 {
  margin: 0 0 16px 0;
  font-size: 15px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.record-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.record-icon {
  font-size: 24px;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.record-time {
  font-weight: 600;
  font-size: 14px;
}

.record-duration {
  font-size: 12px;
  opacity: 0.8;
}

.empty-records {
  text-align: center;
  padding: 24px;
  opacity: 0.7;
}

.empty-icon {
  font-size: 36px;
}

.empty-records p {
  margin: 8px 0 0;
  font-size: 14px;
}

.sleep-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
}

.stat-label {
  font-size: 11px;
  opacity: 0.8;
}

.sleep-tips {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tips-icon {
  font-size: 20px;
}

.tips-header h4 {
  margin: 0;
  font-size: 15px;
}

.tips-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
}

@media (max-width: 480px) {
  .sleep-stats {
    grid-template-columns: 1fr;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
  }

  .stat-icon {
    margin-bottom: 0;
  }
}
</style>

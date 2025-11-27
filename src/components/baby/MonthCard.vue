<template>
  <div
    :class="['month-card', { 'active': isActive, 'completed': completionRate === 100 }]"
    @click="handleClick"
  >
    <div class="card-header">
      <div class="month-number">
        <span class="num">{{ month }}</span>
        <span class="unit">月</span>
      </div>
      <div class="status-badge" v-if="isActive">
        <span class="pulse-dot"></span>
        当前
      </div>
      <div class="check-badge" v-else-if="completionRate === 100">
        <el-icon><Check /></el-icon>
      </div>
    </div>

    <div class="card-body">
      <h3 class="month-title">{{ title }}</h3>
      <p class="month-summary">{{ summary }}</p>

      <div class="quick-stats" v-if="physicalData">
        <div class="stat">
          <el-icon><ScaleToOriginal /></el-icon>
          <span>{{ physicalData.weight }}</span>
        </div>
        <div class="stat">
          <el-icon><Histogram /></el-icon>
          <span>{{ physicalData.height }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="progress-section" v-if="milestonesCount && milestonesCount > 0">
        <div class="progress-info">
          <span class="label">里程碑</span>
          <span class="value">{{ completedMilestones }}/{{ milestonesCount }}</span>
        </div>
        <el-progress
          :percentage="completionRate"
          :stroke-width="6"
          :show-text="false"
          :color="progressColor"
        />
      </div>
      <div class="view-more">
        <span>查看详情</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBabyStore } from '@/stores/babyStore'
import { Check, ScaleToOriginal, Histogram, ArrowRight } from '@element-plus/icons-vue'

interface PhysicalData {
  weight: string
  height: string
  headCircumference: string
  description: string
}

const props = defineProps<{
  month: number
  title: string
  summary: string
  isActive?: boolean
  physicalData?: PhysicalData
  milestonesCount?: number
}>()

const emit = defineEmits<{
  click: [month: number]
}>()

const babyStore = useBabyStore()

// 计算该月龄里程碑完成率
const completedMilestones = computed(() => {
  const monthData = babyStore.allMonthsData.find(m => m.month === props.month)
  if (!monthData || !monthData.milestones.length) return 0
  return monthData.milestones.filter(m => babyStore.isMilestoneCompleted(m.title)).length
})

const completionRate = computed(() => {
  if (!props.milestonesCount) return 0
  return Math.round((completedMilestones.value / props.milestonesCount) * 100)
})

const progressColor = computed(() => {
  if (completionRate.value === 100) return '#67c23a'
  if (completionRate.value >= 50) return '#409eff'
  return '#e6a23c'
})

const handleClick = () => {
  emit('click', props.month)
}
</script>

<style scoped>
.month-card {
  background: linear-gradient(135deg, #ffffff 0%, #fefbff 50%, #fdf4ff 100%);
  border-radius: 28px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(168, 85, 247, 0.1);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.1);
}

.month-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  opacity: 0;
  transition: all 0.4s ease;
}

.month-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  transition: left 0.6s ease;
}

.month-card:hover::after {
  left: 100%;
}

.month-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 25px 50px rgba(124, 58, 237, 0.25);
  border-color: rgba(168, 85, 247, 0.4);
}

.month-card:hover::before {
  opacity: 1;
  height: 6px;
}

.month-card.active {
  border-color: #a855f7;
  background: linear-gradient(135deg, #faf5ff 0%, #fdf4ff 50%, #fce7f3 100%);
  animation: activeGlow 2s ease-in-out infinite;
}

@keyframes activeGlow {
  0%, 100% { box-shadow: 0 8px 30px rgba(168, 85, 247, 0.3); }
  50% { box-shadow: 0 12px 40px rgba(168, 85, 247, 0.5), 0 0 20px rgba(236, 72, 153, 0.2); }
}

.month-card.active::before {
  opacity: 1;
  height: 6px;
}

.month-card.completed {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%);
}

.month-card.completed::before {
  background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.month-number {
  display: flex;
  align-items: baseline;
  gap: 3px;
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.month-card:hover .month-number {
  transform: scale(1.1);
}

.month-number .num {
  font-size: 42px;
  font-weight: 900;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.month-number .unit {
  font-size: 16px;
  color: #a855f7;
  font-weight: 700;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.4);
  }
}

.check-badge {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  animation: checkBounce 0.6s ease-out;
}

@keyframes checkBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.card-body {
  flex: 1;
}

.month-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e1b4b;
  margin: 0 0 10px 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.month-card:hover .month-title {
  color: #7c3aed;
}

.month-summary {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.quick-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #7c3aed;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.stat:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
}

.stat .el-icon {
  font-size: 14px;
  color: #a855f7;
}

.card-footer {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 2px solid rgba(168, 85, 247, 0.1);
}

.progress-section {
  margin-bottom: 14px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-info .label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
}

.progress-info .value {
  font-size: 13px;
  color: #7c3aed;
  font-weight: 700;
}

:deep(.el-progress-bar__outer) {
  background: rgba(168, 85, 247, 0.15) !important;
  border-radius: 10px !important;
}

:deep(.el-progress-bar__inner) {
  border-radius: 10px !important;
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%) !important;
  transition: width 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
}

.view-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: #7c3aed;
  font-weight: 700;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.month-card:hover .view-more {
  opacity: 1;
  transform: translateY(0);
}

.view-more .el-icon {
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.month-card:hover .view-more .el-icon {
  transform: translateX(6px);
  animation: arrowBounce 1s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% { transform: translateX(6px); }
  50% { transform: translateX(12px); }
}
</style>

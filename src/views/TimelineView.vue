<template>
  <div class="timeline-view">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-content">
        <div class="hero-icon">📅</div>
        <h1>宝宝成长时间轴</h1>
        <p>0-12个月完整发育历程，见证每一个珍贵时刻</p>
        <div class="progress-overview">
          <div class="progress-ring">
            <el-progress type="circle" :percentage="overallProgress" :width="100" :stroke-width="8">
              <template #default>
                <span class="progress-value">{{ overallProgress }}%</span>
              </template>
            </el-progress>
          </div>
          <div class="progress-stats">
            <div class="stat-row">
              <span class="stat-label">总里程碑</span>
              <span class="stat-value">{{ totalMilestones }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">已完成</span>
              <span class="stat-value highlight">{{ completedCount }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">当前阶段</span>
              <span class="stat-value">{{ babyStore.currentMonth }}月龄</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间轴筛选 -->
    <div class="timeline-filter">
      <el-radio-group v-model="filterType" size="large">
        <el-radio-button label="all">全部阶段</el-radio-button>
        <el-radio-button label="current">当前及之前</el-radio-button>
        <el-radio-button label="upcoming">即将到来</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 时间轴内容 -->
    <div class="timeline-container">
      <div class="timeline-line"></div>

      <div
        v-for="(monthData, index) in filteredMonthsData"
        :key="monthData.month"
        :class="['timeline-item', {
          'passed': monthData.month < babyStore.currentMonth,
          'current': monthData.month === babyStore.currentMonth,
          'upcoming': monthData.month > babyStore.currentMonth
        }]"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <!-- 时间轴节点 -->
        <div class="timeline-node">
          <div class="node-inner">
            <span v-if="monthData.month < babyStore.currentMonth">✓</span>
            <span v-else-if="monthData.month === babyStore.currentMonth">●</span>
            <span v-else>{{ monthData.month }}</span>
          </div>
        </div>

        <!-- 内容卡片 -->
        <div class="timeline-card" @click="goToDetail(monthData.month)">
          <div class="card-ribbon" v-if="monthData.month === babyStore.currentMonth">
            当前阶段
          </div>

          <div class="card-header">
            <div class="month-info">
              <span class="month-badge">{{ monthData.month }}月</span>
              <h3>{{ monthData.title }}</h3>
            </div>
            <div class="completion-badge" v-if="getMonthCompletion(monthData.month) === 100">
              <el-icon><Trophy /></el-icon>
              已完成
            </div>
          </div>

          <p class="card-summary">{{ monthData.summary }}</p>

          <!-- 发育指标预览 -->
          <div class="development-preview">
            <div class="dev-item">
              <el-icon><ScaleToOriginal /></el-icon>
              <div class="dev-content">
                <span class="dev-label">体重</span>
                <span class="dev-value">{{ monthData.physicalDevelopment.weight }}</span>
              </div>
            </div>
            <div class="dev-item">
              <el-icon><Histogram /></el-icon>
              <div class="dev-content">
                <span class="dev-label">身高</span>
                <span class="dev-value">{{ monthData.physicalDevelopment.height }}</span>
              </div>
            </div>
          </div>

          <!-- 里程碑预览 -->
          <div class="milestones-section">
            <h4>🏆 关键里程碑</h4>
            <div class="milestone-list">
              <div
                v-for="milestone in monthData.milestones.slice(0, 3)"
                :key="milestone.title"
                :class="['milestone-item', { 'completed': babyStore.isMilestoneCompleted(milestone.title) }]"
              >
                <el-icon v-if="babyStore.isMilestoneCompleted(milestone.title)" class="check-icon">
                  <CircleCheckFilled />
                </el-icon>
                <el-icon v-else class="pending-icon">
                  <MoreFilled />
                </el-icon>
                <span>{{ milestone.title }}</span>
              </div>
            </div>
            <div class="milestone-progress">
              <el-progress
                :percentage="getMonthCompletion(monthData.month)"
                :stroke-width="8"
                :show-text="false"
              />
              <span class="progress-label">
                {{ getCompletedMilestones(monthData.month) }}/{{ monthData.milestones.length }} 已完成
              </span>
            </div>
          </div>

          <!-- 快捷标签 -->
          <div class="quick-tags">
            <el-tag size="small" type="info" v-if="monthData.careGuidelines.length">
              {{ monthData.careGuidelines.length }} 护理指南
            </el-tag>
            <el-tag size="small" type="warning" v-if="monthData.commonIssues.length">
              {{ monthData.commonIssues.length }} 常见问题
            </el-tag>
            <el-tag size="small" type="danger" v-if="monthData.safetyWarnings.length">
              {{ monthData.safetyWarnings.length }} 安全提醒
            </el-tag>
          </div>

          <div class="card-action">
            <span>查看完整指南</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部统计 -->
    <div class="timeline-footer">
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-icon">🎯</div>
          <div class="summary-text">
            <h3>成长旅程进行中</h3>
            <p>{{ babyStore.babyInfo.name }}已经完成了 {{ completedCount }} 个里程碑，继续加油！</p>
          </div>
          <el-button type="primary" @click="router.push('/checklist')">
            查看成长清单
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import {
  Trophy,
  ScaleToOriginal,
  Histogram,
  ArrowRight,
  CircleCheckFilled,
  MoreFilled
} from '@element-plus/icons-vue'
import type { BabyMonthData } from '@/types/baby'

const router = useRouter()
const babyStore = useBabyStore()

const filterType = ref('all')

const filteredMonthsData = computed(() => {
  switch (filterType.value) {
    case 'current':
      return babyStore.allMonthsData.filter((m: BabyMonthData) => m.month <= babyStore.currentMonth)
    case 'upcoming':
      return babyStore.allMonthsData.filter((m: BabyMonthData) => m.month > babyStore.currentMonth)
    default:
      return babyStore.allMonthsData
  }
})

const totalMilestones = computed(() => {
  return babyStore.allMonthsData.reduce((sum: number, month: BabyMonthData) => sum + month.milestones.length, 0)
})

const completedCount = computed(() => {
  return babyStore.completedMilestones.length
})

const overallProgress = computed(() => {
  if (totalMilestones.value === 0) return 0
  return Math.round((completedCount.value / totalMilestones.value) * 100)
})

const getCompletedMilestones = (month: number) => {
  const monthData = babyStore.allMonthsData.find((m: BabyMonthData) => m.month === month)
  if (!monthData) return 0
  return monthData.milestones.filter((m: { title: string }) => babyStore.isMilestoneCompleted(m.title)).length
}

const getMonthCompletion = (month: number) => {
  const monthData = babyStore.allMonthsData.find((m: BabyMonthData) => m.month === month)
  if (!monthData || !monthData.milestones.length) return 0
  const completed = getCompletedMilestones(month)
  return Math.round((completed / monthData.milestones.length) * 100)
}

const goToDetail = (month: number) => {
  babyStore.setCurrentMonth(month)
  router.push(`/month/${month}`)
}
</script>

<style scoped>
.timeline-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
}

/* 页面头部 */
.page-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 30px;
  border-radius: 0 0 40px 40px;
  margin-bottom: 40px;
  color: white;
  text-align: center;
}

.hero-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.page-hero h1 {
  font-size: 36px;
  margin: 0 0 12px 0;
  font-weight: 800;
}

.page-hero p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 30px 0;
}

.progress-overview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  background: rgba(255, 255, 255, 0.15);
  padding: 24px 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.progress-ring :deep(.el-progress__text) {
  color: white;
}

.progress-value {
  font-size: 24px;
  font-weight: 800;
}

.progress-stats {
  text-align: left;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: 6px 0;
}

.stat-label {
  font-size: 14px;
  opacity: 0.85;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.stat-value.highlight {
  color: #ffd93d;
}

/* 筛选器 */
.timeline-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

/* 时间轴容器 */
.timeline-container {
  position: relative;
  padding: 0 20px 40px 60px;
}

.timeline-line {
  position: absolute;
  left: 50px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #667eea, #764ba2, #f093fb);
  border-radius: 2px;
}

/* 时间轴项目 */
.timeline-item {
  position: relative;
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 时间轴节点 */
.timeline-node {
  position: absolute;
  left: -42px;
  top: 30px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.node-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s ease;
}

.timeline-item.passed .node-inner {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.timeline-item.current .node-inner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(102, 126, 234, 0.1);
  }
}

.timeline-item.upcoming .node-inner {
  background: white;
  border: 3px solid #dcdfe6;
  color: #909399;
}

/* 时间轴卡片 */
.timeline-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.timeline-card:hover {
  transform: translateX(10px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
}

.card-ribbon {
  position: absolute;
  top: 16px;
  right: -35px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 40px;
  font-size: 12px;
  font-weight: 600;
  transform: rotate(45deg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.month-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.month-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.completion-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.card-summary {
  color: #606266;
  line-height: 1.7;
  margin: 0 0 20px 0;
  font-size: 15px;
}

/* 发育指标预览 */
.development-preview {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.dev-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.dev-item .el-icon {
  font-size: 24px;
  color: #667eea;
}

.dev-content {
  display: flex;
  flex-direction: column;
}

.dev-label {
  font-size: 12px;
  color: #909399;
}

.dev-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

/* 里程碑部分 */
.milestones-section {
  margin-bottom: 20px;
}

.milestones-section h4 {
  font-size: 14px;
  color: #303133;
  margin: 0 0 12px 0;
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.milestone-item.completed {
  background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
  color: #11998e;
}

.check-icon {
  color: #11998e;
}

.pending-icon {
  color: #dcdfe6;
}

.milestone-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.milestone-progress .el-progress {
  flex: 1;
}

.progress-label {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

/* 快捷标签 */
.quick-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

/* 卡片操作 */
.card-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.3s ease;
}

.timeline-card:hover .card-action {
  opacity: 1;
}

.card-action .el-icon {
  transition: transform 0.3s ease;
}

.timeline-card:hover .card-action .el-icon {
  transform: translateX(4px);
}

/* 底部统计 */
.timeline-footer {
  padding: 0 20px;
  margin-bottom: 40px;
}

.summary-card {
  border-radius: 20px !important;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.summary-icon {
  font-size: 48px;
}

.summary-text {
  flex: 1;
}

.summary-text h3 {
  margin: 0 0 6px 0;
  font-size: 18px;
  color: #303133;
}

.summary-text p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-hero {
    padding: 40px 20px;
  }

  .page-hero h1 {
    font-size: 28px;
  }

  .progress-overview {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .timeline-container {
    padding-left: 40px;
  }

  .timeline-line {
    left: 30px;
  }

  .timeline-node {
    left: -32px;
    width: 32px;
    height: 32px;
  }

  .node-inner {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }

  .development-preview {
    flex-direction: column;
    gap: 12px;
  }

  .summary-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>

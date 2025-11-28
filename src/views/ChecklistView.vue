<template>
  <div class="checklist-view">
    <!-- 页面头部 -->
    <div class="page-header checklist-header">
      <div class="hero-content">
        <div class="hero-icon animate-bounce">✅</div>
        <h1 class="checklist-title">成长里程碑清单</h1>
        <p class="checklist-subtitle">记录{{ babyStore.babyInfo.name }}的每一个重要时刻</p>

        <!-- 总进度统计 -->
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-info">
              <span class="stat-value">{{ totalMilestones }}</span>
              <span class="stat-label">总里程碑</span>
            </div>
          </div>
          <div class="stat-card highlight">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <span class="stat-value">{{ completedCount }}</span>
              <span class="stat-label">已完成</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-value">{{ completionRate }}%</span>
              <span class="stat-label">完成率</span>
            </div>
          </div>
        </div>

        <!-- 总进度条 -->
        <div class="total-progress progress-section">
          <el-progress
            :percentage="completionRate"
            :stroke-width="12"
            :color="progressColors"
          >
            <template #default="{ percentage }">
              <span class="progress-text">{{ percentage }}% 完成</span>
            </template>
          </el-progress>
        </div>
      </div>
    </div>

    <!-- 月龄切换标签 -->
    <div class="month-tabs-wrapper">
      <div class="tabs-scroll">
        <div
          v-for="monthData in babyStore.allMonthsData"
          :key="monthData.month"
          :class="['month-tab', {
            'active': activeMonth === String(monthData.month),
            'completed': getMonthCompletion(monthData.month) === 100
          }]"
          @click="activeMonth = String(monthData.month)"
        >
          <span class="tab-month">{{ monthData.month }}月</span>
          <span class="tab-progress">{{ getMonthCompletion(monthData.month) }}%</span>
          <div class="tab-indicator" v-if="getMonthCompletion(monthData.month) === 100">
            <el-icon><Check /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前月龄内容 -->
    <div class="checklist-content" v-if="currentMonthData">
      <div class="month-header">
        <div class="month-title-section">
          <h2>{{ currentMonthData.title }}</h2>
          <p>{{ currentMonthData.summary }}</p>
        </div>
        <div class="month-stats">
          <el-progress
            type="dashboard"
            :percentage="getMonthCompletion(currentMonthData.month)"
            :width="100"
            :stroke-width="10"
          >
            <template #default>
              <div class="dashboard-content">
                <span class="dashboard-value">{{ getCompletedCount(currentMonthData.month) }}</span>
                <span class="dashboard-label">/ {{ currentMonthData.milestones.length }}</span>
              </div>
            </template>
          </el-progress>
        </div>
      </div>

      <!-- 里程碑网格 -->
      <div class="milestones-grid">
        <div
          v-for="(milestone, index) in currentMonthData.milestones"
          :key="milestone.title"
          :class="['milestone-card', { 'completed': isMilestoneCompleted(milestone.title) }]"
          @click="toggleMilestone(milestone.title)"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="card-check">
            <div class="check-circle">
              <el-icon v-if="isMilestoneCompleted(milestone.title)"><Check /></el-icon>
            </div>
          </div>
          <div class="card-content">
            <h3>{{ milestone.title }}</h3>
            <p>{{ milestone.description }}</p>
          </div>
          <div class="card-status">
            <el-tag
              :type="isMilestoneCompleted(milestone.title) ? 'success' : 'info'"
              effect="plain"
              size="small"
            >
              {{ isMilestoneCompleted(milestone.title) ? '已达成 🎉' : '待完成' }}
            </el-tag>
          </div>
          <div class="card-decoration" v-if="isMilestoneCompleted(milestone.title)">
            <span>🌟</span>
          </div>
        </div>
      </div>

      <el-empty
        v-if="currentMonthData.milestones.length === 0"
        description="该月龄暂无里程碑数据"
        :image-size="150"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="actions-section">
      <el-card class="actions-card">
        <div class="actions-content">
          <div class="actions-info">
            <h3>💾 数据管理</h3>
            <p>导出或重置您的成长记录数据</p>
          </div>
          <div class="actions-buttons">
            <el-button type="primary" size="large" @click="exportProgress">
              <el-icon><Download /></el-icon>
              导出记录
            </el-button>
            <el-button size="large" @click="importProgress">
              <el-icon><Upload /></el-icon>
              导入记录
            </el-button>
            <el-button type="danger" size="large" plain @click="resetProgress">
              <el-icon><RefreshLeft /></el-icon>
              重置记录
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 成就展示 -->
    <div class="achievements-section" v-if="completedCount > 0">
      <h2>🏅 成就展示</h2>
      <div class="achievements-grid">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          :class="['achievement-card', { 'unlocked': achievement.unlocked }]"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <h4>{{ achievement.title }}</h4>
            <p>{{ achievement.description }}</p>
          </div>
          <el-tag v-if="achievement.unlocked" type="success" size="small">已解锁</el-tag>
          <el-tag v-else type="info" size="small">未解锁</el-tag>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBabyStore } from '@/stores/babyStore'
import { Download, Upload, RefreshLeft, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const babyStore = useBabyStore()
const activeMonth = ref('0')
const fileInput = ref<HTMLInputElement | null>(null)

const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#409eff', percentage: 60 },
  { color: '#67c23a', percentage: 100 }
]

// 当前月龄数据
const currentMonthData = computed(() => {
  return babyStore.allMonthsData.find(m => m.month === parseInt(activeMonth.value))
})

// 计算总里程碑数
const totalMilestones = computed(() => {
  return babyStore.allMonthsData.reduce((sum, month) => sum + month.milestones.length, 0)
})

// 计算已完成数量
const completedCount = computed(() => {
  return babyStore.completedMilestones.length
})

// 计算完成率
const completionRate = computed(() => {
  if (totalMilestones.value === 0) return 0
  return Math.round((completedCount.value / totalMilestones.value) * 100)
})

// 获取指定月份的完成数
const getCompletedCount = (month: number) => {
  const monthData = babyStore.allMonthsData.find(m => m.month === month)
  if (!monthData) return 0
  return monthData.milestones.filter(m => babyStore.isMilestoneCompleted(m.title)).length
}

// 获取指定月份的完成率
const getMonthCompletion = (month: number) => {
  const monthData = babyStore.allMonthsData.find(m => m.month === month)
  if (!monthData || !monthData.milestones.length) return 0
  const completed = getCompletedCount(month)
  return Math.round((completed / monthData.milestones.length) * 100)
}

const isMilestoneCompleted = (title: string) => {
  return babyStore.isMilestoneCompleted(title)
}

const toggleMilestone = (title: string) => {
  babyStore.toggleMilestone(title)
  const isCompleted = babyStore.isMilestoneCompleted(title)
  if (isCompleted) {
    ElMessage({
      message: `🎉 太棒了！"${title}"已完成！`,
      type: 'success',
      duration: 2000
    })
  }
}

// 成就系统
const achievements = computed(() => [
  {
    id: 'first',
    icon: '🌱',
    title: '第一步',
    description: '完成第一个里程碑',
    unlocked: completedCount.value >= 1
  },
  {
    id: 'ten',
    icon: '⭐',
    title: '初露锋芒',
    description: '完成10个里程碑',
    unlocked: completedCount.value >= 10
  },
  {
    id: 'quarter',
    icon: '🌟',
    title: '四分之一',
    description: '完成25%的里程碑',
    unlocked: completionRate.value >= 25
  },
  {
    id: 'half',
    icon: '🏆',
    title: '半程冠军',
    description: '完成50%的里程碑',
    unlocked: completionRate.value >= 50
  },
  {
    id: 'master',
    icon: '👑',
    title: '育儿大师',
    description: '完成所有里程碑',
    unlocked: completionRate.value === 100
  }
])

const exportProgress = () => {
  const data = {
    babyInfo: babyStore.babyInfo,
    completedMilestones: babyStore.completedMilestones,
    exportDate: new Date().toISOString(),
    version: '1.0'
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${babyStore.babyInfo.name}-成长记录-${new Date().toLocaleDateString()}.json`
  a.click()
  URL.revokeObjectURL(url)

  ElMessage.success('成长记录已导出！📁')
}

const importProgress = () => {
  fileInput.value?.click()
}

const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.completedMilestones) {
        babyStore.completedMilestones = data.completedMilestones
        localStorage.setItem('completedMilestones', JSON.stringify(data.completedMilestones))
        ElMessage.success('成长记录导入成功！🎉')
      }
    } catch {
      ElMessage.error('文件格式错误，请选择正确的记录文件')
    }
  }
  reader.readAsText(file)
}

const resetProgress = () => {
  ElMessageBox.confirm(
    '确定要重置所有里程碑记录吗？此操作无法撤销。',
    '⚠️ 警告',
    {
      confirmButtonText: '确定重置',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    localStorage.removeItem('completedMilestones')
    babyStore.completedMilestones = []
    ElMessage.success('已重置所有记录')
  }).catch(() => {})
}
</script>

<style scoped>
.checklist-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 20px; /* 从 50px 30px 减小 */
  border-radius: 0 0 30px 30px;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 24px; /* 从 30px 减小 */
}

.checklist-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px; /* 从 60px 40px 减小 */
  border-radius: 0 0 40px 40px;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px; /* 从 40px 减小 */
}

.hero-icon {
  font-size: 48px; /* 从 64px 减小 */
  margin-bottom: 16px; /* 从 20px 减小 */
}

.animate-bounce {
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.page-header h1 {
  font-size: 26px; /* 从 32px 减小 */
  margin: 0 0 8px 0; /* 从 12px 减小 */
  font-weight: 800;
  position: relative;
  z-index: 1;
}

.checklist-title {
  font-size: 32px; /* 从 42px 减小 */
  font-weight: 800;
  margin: 0 0 8px 0; /* 从 12px 减小 */
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.page-subtitle {
  font-size: 14px; /* 从 16px 减小 */
  opacity: 0.9;
  margin: 0;
  position: relative;
  z-index: 1;
}

.checklist-subtitle {
  font-size: 15px; /* 从 18px 减小 */
  opacity: 0.9;
  margin-bottom: 20px; /* 从 24px 减小 */
  position: relative;
  z-index: 1;
}

/* 统计卡片 */
.stats-overview {
  display: flex;
  justify-content: center;
  gap: 12px; /* 从 16px 减小 */
  flex-wrap: wrap;
  margin-bottom: 20px; /* 从 30px 减小 */
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 20px; /* 从 16px 24px 减小 */
  border-radius: 16px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 10px; /* 从 12px 减小 */
  transition: all 0.3s ease;
  min-width: 120px; /* 从 140px 减小 */
}

.stat-card.highlight {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.stat-icon {
  font-size: 24px; /* 从 28px 减小 */
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px; /* 从 24px 减小 */
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  font-size: 11px; /* 从 12px 减小 */
  opacity: 0.9;
  margin-top: 4px;
}

/* 总进度条 */
.total-progress {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 16px; /* 从 20px 减小 */
}

.progress-section {
  background: rgba(255, 255, 255, 0.15);
  padding: 16px; /* 从 24px 减小 */
  border-radius: 20px;
  backdrop-filter: blur(10px);
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  margin-top: 20px; /* 从 24px 减小 */
}

.progress-text {
  font-size: 15px; /* 从 16px 减小 */
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; /* 从 12px 减小 */
  margin-top: 8px;
}

.progress-label {
  font-size: 13px; /* 从 14px 减小 */
  opacity: 0.9;
  margin-bottom: 8px; /* 从 12px 减小 */
}

/* 月龄标签 */
.month-tabs-wrapper {
  padding: 0 20px;
  margin-bottom: 30px;
  overflow-x: auto;
}

.tabs-scroll {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  min-width: max-content;
}

.month-tab {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 80px;
}

.month-tab:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.month-tab.active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.month-tab.completed .tab-indicator {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ffd93d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #333;
}

.tab-month {
  font-size: 16px;
  font-weight: 700;
}

.tab-progress {
  font-size: 12px;
  opacity: 0.8;
}

/* 内容区域 */
.checklist-content {
  padding: 0 20px;
  margin-bottom: 40px;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.month-title-section h2 {
  font-size: 24px;
  margin: 0 0 8px 0;
  color: #303133;
}

.month-title-section p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.dashboard-content {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.dashboard-value {
  font-size: 28px;
  font-weight: 800;
  color: #11998e;
}

.dashboard-label {
  font-size: 14px;
  color: #909399;
}

/* 里程碑网格 */
.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.milestone-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  overflow: hidden;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.milestone-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(17, 153, 142, 0.25);
  border-color: rgba(17, 153, 142, 0.4);
}

.milestone-card:active {
  transform: translateY(-4px) scale(0.98);
}

.milestone-card.completed {
  background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
  border-color: #38ef7d;
  animation: celebrate 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes celebrate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.card-check {
  position: absolute;
  top: 20px;
  right: 20px;
}

.check-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.milestone-card.completed .check-circle {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-color: transparent;
  color: white;
}

.card-content h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #303133;
  padding-right: 40px;
}

.card-content p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.card-status {
  display: flex;
  align-items: center;
}

.card-decoration {
  position: absolute;
  bottom: -10px;
  right: -10px;
  font-size: 60px;
  opacity: 0.15;
}

/* 操作区域 */
.actions-section {
  padding: 0 20px;
  margin-bottom: 40px;
}

.actions-card {
  border-radius: 20px !important;
}

.actions-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.actions-info h3 {
  font-size: 18px;
  margin: 0 0 6px 0;
  color: #303133;
}

.actions-info p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.actions-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 成就展示 */
.achievements-section {
  padding: 0 20px;
  margin-bottom: 60px;
}

.achievements-section h2 {
  font-size: 24px;
  margin: 0 0 24px 0;
  color: #303133;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.achievement-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.achievement-icon {
  font-size: 36px;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  font-size: 16px;
  margin: 0 0 4px 0;
  color: #303133;
}

.achievement-info p {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: 30px 20px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .stats-overview {
    flex-direction: column;
    align-items: center;
  }

  .stat-card {
    width: 100%;
    max-width: 300px;
  }

  .stat-card.highlight {
    transform: none;
  }

  .month-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .milestones-grid {
    grid-template-columns: 1fr;
  }

  .actions-content {
    flex-direction: column;
    text-align: center;
  }

  .actions-buttons {
    justify-content: center;
  }
}
</style>

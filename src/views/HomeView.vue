<template>
  <div class="home-view">
    <!-- 头部横幅 -->
    <div class="hero-section">
      <!-- SVG粒子动画背景 -->
      <ParticleAnimation />
      <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-emoji animate-float">👶</div>
        <h1 class="hero-title">新手爸爸育儿指南</h1>
        <p class="subtitle">陪伴宝宝0-12个月的成长之旅</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">13</span>
            <span class="stat-label">月龄阶段</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ totalMilestones }}</span>
            <span class="stat-label">成长里程碑</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">100+</span>
            <span class="stat-label">护理技巧</span>
          </div>
        </div>
        <div class="hero-buttons">
          <el-button type="primary" size="large" round @click="showBabyInfoDialog = true">
            <el-icon><User /></el-icon>
            {{ babyStore.babyInfo.name === '宝宝' ? '设置宝宝信息' : babyStore.babyInfo.name + '的成长档案' }}
          </el-button>
          <el-button size="large" round @click="goToDetail(babyStore.currentMonth)" class="secondary-btn">
            开始探索 →
          </el-button>
        </div>
      </div>
    </div>

    <!-- 当前月龄快速概览 -->
    <div class="current-section" v-if="currentMonthData">
      <div class="section-header">
        <h2><span class="icon-wrapper">🎯</span> 当前阶段</h2>
        <el-tag type="success" size="large" effect="dark">{{ babyStore.currentMonth }}月龄</el-tag>
      </div>
      <el-card class="current-month-card">
        <div class="current-month-content">
          <div class="month-info">
            <div class="month-badge">
              <span class="month-num">{{ babyStore.currentMonth }}</span>
              <span class="month-text">月</span>
            </div>
            <div class="month-details">
              <h3>{{ currentMonthData.title }}</h3>
              <p class="overview-summary">{{ currentMonthData.summary }}</p>
              <div class="month-highlights">
                <div class="highlight-item">
                  <el-icon><TrendCharts /></el-icon>
                  <span>体重：{{ currentMonthData.physicalDevelopment.weight }}</span>
                </div>
                <div class="highlight-item">
                  <el-icon><Histogram /></el-icon>
                  <span>身高：{{ currentMonthData.physicalDevelopment.height }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="month-actions">
            <el-button type="primary" size="large" @click="goToDetail(babyStore.currentMonth)">
              查看详细指南 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 里程碑预览 -->
        <div class="milestones-preview">
          <h4>🏆 本月关键里程碑</h4>
          <div class="milestone-tags">
            <el-tag
              v-for="milestone in currentMonthData.milestones.slice(0, 4)"
              :key="milestone.title"
              :type="babyStore.isMilestoneCompleted(milestone.title) ? 'success' : 'info'"
              effect="plain"
              round
            >
              <el-icon v-if="babyStore.isMilestoneCompleted(milestone.title)"><Check /></el-icon>
              {{ milestone.title }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 月龄选择网格 -->
    <div class="months-section">
      <div class="section-header">
        <h2><span class="icon-wrapper">📅</span> 选择宝宝月龄</h2>
        <p class="section-desc">点击查看每个阶段的详细发育指南</p>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="(monthData, index) in babyStore.allMonthsData"
          :key="monthData.month"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          class="month-col"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <MonthCard
            :month="monthData.month"
            :title="monthData.title"
            :summary="monthData.summary"
            :is-active="monthData.month === babyStore.currentMonth"
            :physical-data="monthData.physicalDevelopment"
            :milestones-count="monthData.milestones.length"
            @click="goToDetail"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 快捷功能卡片 -->
    <div class="quick-actions">
      <div class="section-header">
        <h2><span class="icon-wrapper">⚡</span> 快捷功能</h2>
        <p class="section-desc">便捷工具助您育儿更轻松</p>
      </div>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="action-card timeline-card" @click="router.push('/timeline')">
            <div class="action-icon">
              <el-icon :size="48"><Timer /></el-icon>
            </div>
            <div class="action-content">
              <h3>成长时间轴</h3>
              <p>查看宝宝0-12个月完整发育时间轴，追踪每个重要节点</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="action-card checklist-card" @click="router.push('/checklist')">
            <div class="action-icon">
              <el-icon :size="48"><List /></el-icon>
            </div>
            <div class="action-content">
              <h3>成长清单</h3>
              <p>记录宝宝的成长里程碑，见证每一个珍贵瞬间</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="action-card knowledge-card">
            <div class="action-icon">
              <el-icon :size="48"><Reading /></el-icon>
            </div>
            <div class="action-content">
              <h3>育儿知识库</h3>
              <p>新手爸爸必备育儿技巧，科学养育从这里开始</p>
            </div>
            <el-tag type="warning" size="small">即将上线</el-tag>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 育儿小贴士 -->
    <div class="tips-section">
      <div class="section-header">
        <h2><span class="icon-wrapper">💡</span> 每日育儿小贴士</h2>
      </div>
      <el-carousel :interval="5000" type="card" height="200px" indicator-position="outside">
        <el-carousel-item v-for="(tip, index) in dailyTips" :key="index">
          <div class="tip-card" :class="tip.type">
            <div class="tip-icon">{{ tip.icon }}</div>
            <h4>{{ tip.title }}</h4>
            <p>{{ tip.content }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 宝宝信息设置对话框 -->
    <el-dialog
      v-model="showBabyInfoDialog"
      title="👶 设置宝宝信息"
      width="500px"
      class="baby-info-dialog"
    >
      <el-form :model="babyForm" label-width="100px" label-position="top">
        <el-form-item label="宝宝昵称">
          <el-input v-model="babyForm.name" placeholder="给宝宝取一个可爱的昵称吧" size="large">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="babyForm.birthday"
            type="date"
            placeholder="选择宝宝的生日"
            size="large"
            style="width: 100%"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="宝宝性别">
          <el-radio-group v-model="babyForm.gender" size="large">
            <el-radio-button label="boy">
              <span>👦 男宝</span>
            </el-radio-button>
            <el-radio-button label="girl">
              <span>👧 女宝</span>
            </el-radio-button>
            <el-radio-button label="unknown">
              <span>🎒 暂不透露</span>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBabyInfoDialog = false" size="large">取消</el-button>
        <el-button type="primary" @click="saveBabyInfo" size="large">
          <el-icon><Check /></el-icon>
          保存信息
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import MonthCard from '@/components/baby/MonthCard.vue'
import ParticleAnimation from '@/components/baby/ParticleAnimation.vue'
import { Timer, List, User, ArrowRight, Check, TrendCharts, Histogram, Reading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { BabyMonthData } from '@/types/baby'

const router = useRouter()
const babyStore = useBabyStore()

const showBabyInfoDialog = ref(false)
const babyForm = ref({
  name: '宝宝',
  birthday: new Date(),
  gender: 'unknown' as 'boy' | 'girl' | 'unknown'
})

const currentMonthData = computed(() => babyStore.currentMonthData)

const totalMilestones = computed(() => {
  return babyStore.allMonthsData.reduce((sum: number, month: BabyMonthData) => sum + month.milestones.length, 0)
})

const dailyTips = [
  {
    icon: '🍼',
    title: '喂养小贴士',
    content: '母乳是宝宝最好的食物，按需喂养能帮助建立良好的供需关系。',
    type: 'feeding'
  },
  {
    icon: '😴',
    title: '睡眠小贴士',
    content: '建立规律的睡前仪式，帮助宝宝区分白天和夜晚。',
    type: 'sleep'
  },
  {
    icon: '🛁',
    title: '护理小贴士',
    content: '新生儿洗澡水温保持在37-38°C，每次洗澡时间不超过10分钟。',
    type: 'care'
  },
  {
    icon: '🎮',
    title: '互动小贴士',
    content: '多和宝宝说话、唱歌，有助于宝宝的语言发展和情感联结。',
    type: 'play'
  },
  {
    icon: '⚠️',
    title: '安全小贴士',
    content: '宝宝睡觉时保持仰卧姿势，床上不放置枕头和毛绒玩具。',
    type: 'safety'
  }
]

const goToDetail = (month: number) => {
  babyStore.setCurrentMonth(month)
  router.push(`/month/${month}`)
}

const saveBabyInfo = () => {
  if (!babyForm.value.name.trim()) {
    ElMessage.warning('请输入宝宝昵称')
    return
  }
  babyStore.setBabyInfo(babyForm.value)
  showBabyInfoDialog.value = false
  ElMessage.success(`${babyForm.value.name}的信息已保存 🎉`)
}

const disabledDate = (date: Date) => {
  return date > new Date()
}

onMounted(() => {
  babyStore.initFromStorage()
  babyForm.value = { ...babyStore.babyInfo }
})
</script>

<style scoped>
.home-view {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}

/* 英雄区域 - 更鲜艳的渐变 */
.hero-section {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 25%, #ec4899 50%, #f472b6 75%, #fb7185 100%);
  background-size: 200% 200%;
  animation: gradientFlow 8s ease infinite;
  border-radius: 0 0 60px 60px;
  padding: 120px 80px;
  text-align: center;
  color: white;
  margin-bottom: 70px;
  position: relative;
  overflow: hidden;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  animation: floatSlow 10s ease-in-out infinite;
}

.shape-1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  left: 5%;
  animation-delay: -3s;
}

.shape-3 {
  width: 300px;
  height: 300px;
  top: 30%;
  left: -80px;
  animation-delay: -6s;
}

@keyframes floatSlow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-3deg);
  }
  75% {
    transform: translateY(-25px) rotate(3deg);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-emoji {
  font-size: 120px;
  margin-bottom: 30px;
  animation: bounce 2.5s ease-in-out infinite;
  filter: drop-shadow(0 15px 30px rgba(0,0,0,0.25));
  display: inline-block;
}

@keyframes bounce {
  0%, 20%, 53%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateY(0) scale(1);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translateY(-35px) scale(1.1);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translateY(-18px) scale(1.05);
  }
  80% {
    transform: translateY(0) scale(1);
  }
  90% {
    transform: translateY(-8px);
  }
}

.hero-title {
  font-size: 72px;
  margin: 0 0 24px 0;
  font-weight: 900;
  text-shadow: 0 8px 40px rgba(0, 0, 0, 0.35);
  animation: fadeInUp 1s ease-out 0.2s both;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 28px;
  margin-bottom: 60px;
  opacity: 0.95;
  font-weight: 500;
  animation: fadeInUp 1s ease-out 0.4s both;
  text-shadow: 0 3px 15px rgba(0,0,0,0.25);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  margin-bottom: 60px;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: default;
}

.stat-item:hover {
  transform: scale(1.15) translateY(-5px);
}

.stat-number {
  font-size: 60px;
  font-weight: 900;
  text-shadow: 0 5px 20px rgba(0,0,0,0.25);
  background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 18px;
  opacity: 0.9;
  margin-top: 8px;
  font-weight: 600;
}

.stat-divider {
  width: 3px;
  height: 70px;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.1) 100%);
  border-radius: 2px;
}

.hero-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.hero-buttons .el-button {
  padding: 18px 40px !important;
  font-size: 20px !important;
  border-radius: 50px !important;
  font-weight: 700 !important;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
}

.hero-buttons .el-button:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 20px 50px rgba(0,0,0,0.25) !important;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: 2px solid rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(10px);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.35) !important;
  border-color: white !important;
}

/* 通用区域样式 */
.section-header {
  margin-bottom: 50px;
  padding: 0 40px;
  animation: fadeInUp 0.8s ease-out;
}

.section-header h2 {
  font-size: 42px;
  margin-bottom: 16px;
  color: #1e1b4b;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 18px;
  justify-content: center;
}

.icon-wrapper {
  display: inline-block;
  animation: wiggle 2.5s ease-in-out infinite;
  font-size: 48px;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.1); }
  50% { transform: rotate(-3deg) scale(1); }
  75% { transform: rotate(3deg) scale(1.05); }
}

.section-desc {
  font-size: 20px;
  color: #7c3aed;
  margin: 0;
  font-weight: 600;
}

/* 当前月龄卡片 */
.current-section {
  padding: 0 40px;
  margin-bottom: 80px;
}

.current-month-card {
  border-radius: 40px !important;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #fdf4ff 30%, #fae8ff 60%, #f5f3ff 100%) !important;
  border: 2px solid rgba(168, 85, 247, 0.15) !important;
  box-shadow: 0 20px 60px rgba(124, 58, 237, 0.15) !important;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  animation: fadeInScale 0.8s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.current-month-card:hover {
  transform: translateY(-12px) scale(1.01);
  box-shadow: 0 35px 80px rgba(124, 58, 237, 0.2) !important;
}

.current-month-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
  flex-wrap: wrap;
  gap: 40px;
}

.month-info {
  display: flex;
  align-items: center;
  gap: 40px;
  flex: 1;
}

.month-badge {
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 100%);
  border-radius: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 15px 40px rgba(124, 58, 237, 0.4);
  animation: pulse 3s ease-in-out infinite, floatBadge 4s ease-in-out infinite;
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 15px 40px rgba(124, 58, 237, 0.4); }
  50% { box-shadow: 0 20px 60px rgba(124, 58, 237, 0.6), 0 0 40px rgba(236, 72, 153, 0.3); }
}

@keyframes floatBadge {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}

.month-badge:hover {
  transform: rotate(-8deg) scale(1.1);
}

.month-num {
  font-size: 60px;
  font-weight: 900;
  line-height: 1;
}

.month-text {
  font-size: 18px;
  opacity: 0.95;
  font-weight: 700;
}

.month-details h3 {
  font-size: 32px;
  margin: 0 0 16px 0;
  color: #1e1b4b;
  font-weight: 800;
}

.overview-summary {
  font-size: 18px;
  line-height: 1.9;
  color: #4c1d95;
  margin: 0 0 24px 0;
}

.month-highlights {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #7c3aed;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
  padding: 12px 22px;
  border-radius: 30px;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: default;
}

.highlight-item:hover {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.2);
}

.milestones-preview {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid rgba(168, 85, 247, 0.12);
}

.milestones-preview h4 {
  font-size: 20px;
  margin: 0 0 24px 0;
  color: #1e1b4b;
  font-weight: 800;
}

.milestone-tags {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.milestone-tags .el-tag {
  padding: 10px 22px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  cursor: default;
}

.milestone-tags .el-tag:hover {
  transform: translateY(-5px) scale(1.08);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.25);
}

/* 月龄网格 */
.months-section {
  padding: 0 40px;
  margin-bottom: 80px;
}

.month-col {
  margin-bottom: 28px;
  animation: fadeInUp 0.7s ease forwards;
  opacity: 0;
}

/* 快捷功能 */
.quick-actions {
  padding: 0 40px;
  margin-bottom: 80px;
}

.action-card {
  background: linear-gradient(135deg, #ffffff 0%, #fefbff 50%, #fdf4ff 100%);
  border-radius: 35px;
  padding: 45px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: flex;
  align-items: center;
  gap: 35px;
  margin-bottom: 28px;
  box-shadow: 0 10px 40px rgba(124, 58, 237, 0.1);
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(168, 85, 247, 0.1);
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  transition: height 0.5s ease;
}

.action-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.7s ease;
}

.action-card:hover::after {
  left: 100%;
}

.timeline-card::before {
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
}

.checklist-card::before {
  background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
}

.knowledge-card::before {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%);
}

.action-card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 30px 70px rgba(124, 58, 237, 0.2);
}

.action-card:hover::before {
  height: 10px;
}

.action-icon {
  width: 100px;
  height: 100px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.action-card:hover .action-icon {
  transform: scale(1.15) rotate(-8deg);
}

.timeline-card .action-icon {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  color: #7c3aed;
}

.checklist-card .action-icon {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%);
  color: #10b981;
}

.knowledge-card .action-icon {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%);
  color: #f59e0b;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 28px;
  margin: 0 0 12px 0;
  color: #1e1b4b;
  font-weight: 800;
}

.action-content p {
  font-size: 18px;
  color: #7c3aed;
  margin: 0;
  line-height: 1.8;
}

.action-arrow {
  font-size: 40px;
  color: #c4b5fd;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  font-weight: 300;
}

.action-card:hover .action-arrow {
  transform: translateX(15px);
  color: #7c3aed;
}

/* 育儿小贴士 */
.tips-section {
  padding: 0 40px;
  margin-bottom: 100px;
}

.tip-card {
  height: 100%;
  padding: 45px;
  border-radius: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tip-card:hover {
  transform: scale(1.05);
}

.tip-card.feeding {
  background: linear-gradient(135deg, #a7f3d0 0%, #d9f99d 50%, #fef3c7 100%);
}

.tip-card.sleep {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  color: white;
}

.tip-card.care {
  background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #fae8ff 100%);
}

.tip-card.play {
  background: linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 50%, #e0e7ff 100%);
}

.tip-card.safety {
  background: linear-gradient(135deg, #fecdd3 0%, #fbcfe8 50%, #fae8ff 100%);
}

.tip-icon {
  font-size: 60px;
  margin-bottom: 20px;
  animation: bounce 2.5s ease-in-out infinite;
}

.tip-card h4 {
  font-size: 26px;
  margin: 0 0 14px 0;
  font-weight: 800;
}

.tip-card p {
  font-size: 17px;
  margin: 0;
  line-height: 1.8;
  opacity: 0.9;
}

/* 轮播样式增强 */
:deep(.el-carousel__item) {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
}

:deep(.el-carousel__indicators) {
  margin-top: 25px;
}

:deep(.el-carousel__button) {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #c4b5fd;
  transition: all 0.4s ease;
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
  width: 40px;
  border-radius: 7px;
}

/* 对话框样式 */
:deep(.baby-info-dialog) {
  border-radius: 35px;
}

:deep(.el-dialog__header) {
  padding: 32px 32px 24px;
  border-bottom: 2px solid rgba(168, 85, 247, 0.12);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
}

:deep(.el-dialog__body) {
  padding: 32px;
}

:deep(.el-dialog__footer) {
  padding: 24px 32px 32px;
  border-top: 2px solid rgba(168, 85, 247, 0.12);
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-section {
    padding: 70px 28px;
    border-radius: 0 0 40px 40px;
  }

  .hero-emoji {
    font-size: 80px;
  }

  .hero-title {
    font-size: 40px;
  }

  .subtitle {
    font-size: 20px;
    margin-bottom: 40px;
  }

  .hero-stats {
    gap: 30px;
  }

  .stat-number {
    font-size: 38px;
  }

  .stat-divider {
    display: none;
  }

  .section-header h2 {
    font-size: 30px;
  }

  .month-info {
    flex-direction: column;
    text-align: center;
  }

  .month-highlights {
    justify-content: center;
  }

  .current-month-content {
    flex-direction: column;
  }

  .month-actions {
    width: 100%;
  }

  .month-actions .el-button {
    width: 100%;
  }
}
</style>

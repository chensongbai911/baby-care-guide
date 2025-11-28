<template>
  <div class="home-view">
    <!-- 页面头部 -->

    <!-- 头部横幅 -->
    <div class="hero-section">
      <!-- 简化背景装饰 -->
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
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card timeline-card" @click="router.push('/timeline')">
            <div class="action-icon">
              <el-icon :size="48"><Timer /></el-icon>
            </div>
            <div class="action-content">
              <h3>成长时间轴</h3>
              <p>查看宝宝0-12个月完整发育时间轴</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card checklist-card" @click="router.push('/checklist')">
            <div class="action-icon">
              <el-icon :size="48"><List /></el-icon>
            </div>
            <div class="action-content">
              <h3>成长清单</h3>
              <p>记录宝宝的成长里程碑</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card vaccine-card" @click="router.push('/vaccine')">
            <div class="action-icon">
              <el-icon :size="48"><FirstAidKit /></el-icon>
            </div>
            <div class="action-content">
              <h3>疫苗接种</h3>
              <p>疫苗接种提醒与记录</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card growth-card" @click="router.push('/growth')">
            <div class="action-icon">
              <el-icon :size="48"><TrendCharts /></el-icon>
            </div>
            <div class="action-content">
              <h3>成长曲线</h3>
              <p>身高体重变化图表</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card diary-card" @click="router.push('/diary')">
            <div class="action-icon">
              <el-icon :size="48"><Notebook /></el-icon>
            </div>
            <div class="action-content">
              <h3>育儿日记</h3>
              <p>记录宝宝的点点滴滴</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card knowledge-card">
            <div class="action-icon">
              <el-icon :size="48"><Reading /></el-icon>
            </div>
            <div class="action-content">
              <h3>育儿知识库</h3>
              <p>新手爸爸必备育儿技巧</p>
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
        <p class="section-desc">科学育儿，从这里开始</p>
      </div>

      <!-- 大气轮播图 -->
      <div class="tips-carousel-wrapper">
        <el-carousel
          :interval="5000"
          height="320px"
          indicator-position="outside"
          :autoplay="true"
          arrow="hover"
          class="tips-carousel"
        >
          <el-carousel-item v-for="(tip, index) in dailyTips" :key="index">
            <div class="tip-card-large" :class="tip.type">
              <!-- 背景装饰 -->
              <div class="tip-bg-decoration">
                <div class="tip-blob tip-blob-1"></div>
                <div class="tip-blob tip-blob-2"></div>
                <div class="tip-circle"></div>
              </div>

              <!-- 内容区域 -->
              <div class="tip-content-wrapper">
                <div class="tip-icon-large">
                  <span class="icon-emoji">{{ tip.icon }}</span>
                  <div class="icon-ring"></div>
                  <div class="icon-pulse"></div>
                </div>

                <div class="tip-text-content">
                  <div class="tip-category">{{ tip.category || '育儿贴士' }}</div>
                  <h3 class="tip-title-large">{{ tip.title }}</h3>
                  <p class="tip-desc-large">{{ tip.content }}</p>

                  <div class="tip-footer">
                    <div class="tip-tags">
                      <span class="tip-tag" v-for="(tag, idx) in (tip.tags || ['实用', '科学'])" :key="idx">
                        {{ tag }}
                      </span>
                    </div>
                    <div class="tip-action">
                      <span class="action-text">了解更多</span>
                      <span class="action-arrow">→</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 序号指示 -->
              <div class="tip-number">
                <span class="current">0{{ index + 1 }}</span>
                <span class="divider">/</span>
                <span class="total">0{{ dailyTips.length }}</span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
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

    <!-- 底部简单装饰 -->
    <div class="bottom-decoration">
      <div class="wave-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import MonthCard from '@/components/baby/MonthCard.vue'
import AnimatedNumber from '@/components/baby/AnimatedNumber.vue'
import ConfettiEffect from '@/components/baby/ConfettiEffect.vue'
import { Timer, List, User, ArrowRight, Check, TrendCharts, Histogram, Reading, FirstAidKit, Notebook } from '@element-plus/icons-vue'
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
    content: '母乳是宝宝最好的食物，按需喂养能帮助建立良好的供需关系。建议新生儿每2-3小时喂一次，每次10-20分钟。',
    type: 'feeding',
    category: '科学喂养',
    tags: ['母乳喂养', '按需哺乳']
  },
  {
    icon: '😴',
    title: '睡眠小贴士',
    content: '建立规律的睡前仪式，帮助宝宝区分白天和夜晚。可以通过洗澡、换睡衣、讲故事等方式，让宝宝慢慢进入睡眠状态。',
    type: 'sleep',
    category: '健康睡眠',
    tags: ['睡眠习惯', '作息规律']
  },
  {
    icon: '🛁',
    title: '护理小贴士',
    content: '新生儿洗澡水温保持在37-38°C，每次洗澡时间不超过10分钟。注意保持脐部干燥，避免感染。',
    type: 'care',
    category: '日常护理',
    tags: ['洗澡技巧', '脐带护理']
  },
  {
    icon: '🎮',
    title: '互动小贴士',
    content: '多和宝宝说话、唱歌，有助于宝宝的语言发展和情感联结。每天抽出固定时间进行亲子互动游戏。',
    type: 'play',
    category: '亲子互动',
    tags: ['语言发展', '情感培养']
  },
  {
    icon: '⚠️',
    title: '安全小贴士',
    content: '宝宝睡觉时保持仰卧姿势，床上不放置枕头和毛绒玩具。确保婴儿床符合安全标准，护栏间隙小于6厘米。',
    type: 'safety',
    category: '安全防护',
    tags: ['睡眠安全', '防护措施']
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
  background: linear-gradient(180deg, #fdf4ff 0%, #ffffff 50%, #f0f9ff 100%);
  min-height: 100vh;
  position: relative;
}

.home-view::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(79, 172, 254, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 主英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 24px;
  border-radius: 0 0 40px 40px;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 28px;
}

/* 背景装饰 */
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
  background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 70%, transparent 100%);
  animation: floatShape 12s ease-in-out infinite;
  filter: blur(1px);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -150px;
}

.shape-2 {
  width: 350px;
  height: 350px;
  bottom: -150px;
  left: 5%;
  animation-delay: -4s;
}

.shape-3 {
  width: 280px;
  height: 280px;
  top: 30%;
  left: -100px;
  animation-delay: -8s;
}

.hero-content {
  position: relative;
  z-index: 1;
  animation: heroFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-emoji {
  font-size: 60px;
  margin-bottom: 12px;
  animation: emojiFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 12px 24px rgba(0,0,0,0.25));
  display: inline-block;
}

@keyframes emojiFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-12px) rotate(-5deg) scale(1.05);
  }
  50% {
    transform: translateY(-20px) rotate(0deg) scale(1.08);
  }
  75% {
    transform: translateY(-10px) rotate(5deg) scale(1.05);
  }
}

.hero-title {
  font-size: 32px;
  margin: 0 0 8px 0;
  font-weight: 800;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  letter-spacing: 1px;
  background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.95) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 16px;
  margin-bottom: 22px;
  opacity: 0.95;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
}

.hero-stats {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.08) translateY(-4px);
  background: rgba(255, 255, 255, 0.25);
}

.stat-number {
  font-size: 26px;
  font-weight: 800;
  text-shadow: 0 3px 10px rgba(0,0,0,0.2);
  color: #fff;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
  margin-top: 3px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255,255,255,0.3);
  border-radius: 1px;
  align-self: center;
}

.hero-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-buttons :deep(.el-button) {
  padding: 12px 26px !important;
  font-size: 15px !important;
  border-radius: 24px !important;
  font-weight: 600 !important;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
}

.hero-buttons :deep(.el-button:hover) {
  transform: translateY(-4px) scale(1.05);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: 2px solid rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(15px);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.35) !important;
}

/* 通用区域样式 */
.section-header {
  margin-bottom: 24px;
  padding: 0 24px;
  text-align: center;
}

.section-header h2 {
  font-size: 26px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.icon-wrapper {
  display: inline-block;
  animation: iconBounce 2s ease-in-out infinite;
  font-size: 28px;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0) rotate(-5deg) scale(1); }
  25% { transform: translateY(-6px) rotate(5deg) scale(1.1); }
  50% { transform: translateY(0) rotate(-5deg) scale(1); }
  75% { transform: translateY(-4px) rotate(5deg) scale(1.08); }
}

.section-desc {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

/* 当前月龄卡片 */
.current-section {
  padding: 0 24px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.current-month-card {
  border-radius: 24px !important;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #fef3ff 25%, #fae8ff 50%, #f3e8ff 75%, #ede9fe 100%) !important;
  border: 2px solid transparent !important;
  background-image:
    linear-gradient(white, white),
    linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) !important;
  background-origin: border-box !important;
  background-clip: padding-box, border-box !important;
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.18) !important;
  transition: all 0.4s ease !important;
}

.current-month-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 64px rgba(102, 126, 234, 0.25) !important;
}

.current-month-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
}

.month-info {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
}

.month-badge {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
}

.month-num {
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}

.month-text {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.9;
}

.month-details {
  flex: 1;
}

.month-details h3 {
  font-size: 20px;
  margin: 0 0 6px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.overview-summary {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.month-highlights {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 10px;
}

.month-actions :deep(.el-button) {
  padding: 10px 20px !important;
  font-size: 13px !important;
}

.milestones-preview {
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  padding-top: 12px;
  margin-top: 12px;
}

.milestones-preview h4 {
  font-size: 16px;
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-weight: 600;
}

.milestone-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.milestone-tags :deep(.el-tag) {
  font-size: 13px;
  padding: 5px 14px;
  font-weight: 500;
}

/* 月龄网格 */
.months-section {
  padding: 0 24px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.month-col {
  margin-bottom: 20px;
  animation: monthFadeIn 0.6s ease forwards;
  opacity: 0;
}

@keyframes monthFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 快捷功能 */
.quick-actions {
  padding: 0 24px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.action-card {
  background: linear-gradient(135deg, #ffffff 0%, #fefbff 50%, #fdf4ff 100%);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.08);
}

.action-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.2);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.18);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
  transition: all 0.3s ease;
}

.action-card:hover .action-icon {
  transform: rotate(8deg) scale(1.1);
}

.timeline-card .action-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.checklist-card .action-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.vaccine-card .action-icon {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.growth-card .action-icon {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.diary-card .action-icon {
  background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
}

.knowledge-card .action-icon {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.action-content h3 {
  font-size: 18px;
  margin: 0 0 6px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.action-content p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.action-arrow {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  transition: all 0.3s ease;
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.action-card:hover .action-arrow {
  opacity: 1;
  transform: translateX(6px);
}

.knowledge-card :deep(.el-tag) {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 12px;
  padding: 4px 12px;
  font-weight: 600;
}

/* 育儿小贴士 - 大气轮播图 */
.tips-section {
  padding: 0 24px 60px;
  position: relative;
  z-index: 1;
}

.tips-carousel-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.tips-carousel :deep(.el-carousel__container) {
  border-radius: 24px;
  overflow: visible;
}

.tips-carousel :deep(.el-carousel__item) {
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.tips-carousel :deep(.el-carousel__item.is-active) {
  transform: scale(1);
  z-index: 2;
}

.tips-carousel :deep(.el-carousel__item:not(.is-active)) {
  transform: scale(0.88);
  opacity: 0.6;
}

.tips-carousel :deep(.el-carousel__arrow) {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.tips-carousel :deep(.el-carousel__arrow:hover) {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.tips-carousel :deep(.el-carousel__arrow i) {
  font-size: 18px;
  font-weight: bold;
}

.tips-carousel :deep(.el-carousel__indicators) {
  margin-top: 20px;
}

.tips-carousel :deep(.el-carousel__indicator .el-carousel__button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.tips-carousel :deep(.el-carousel__indicator.is-active .el-carousel__button) {
  width: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 大气贴士卡片 */
.tip-card-large {
  height: 100%;
  min-height: 320px;
  border-radius: 24px;
  padding: 32px 40px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  transition: all 0.4s ease;
  cursor: pointer;
}

.tip-card-large::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
  z-index: 1;
}

/* 不同类型的背景渐变 */
.tip-card-large.feeding {
  background: linear-gradient(135deg, #e0f4ff 0%, #b8e4ff 50%, #89d4ff 100%);
}

.tip-card-large.sleep {
  background: linear-gradient(135deg, #e8e0ff 0%, #d4c4ff 50%, #b8a4ff 100%);
}

.tip-card-large.care {
  background: linear-gradient(135deg, #ffe0f0 0%, #ffc4e0 50%, #ffa4d0 100%);
}

.tip-card-large.play {
  background: linear-gradient(135deg, #fff4e0 0%, #ffe8c4 50%, #ffd8a4 100%);
}

.tip-card-large.safety {
  background: linear-gradient(135deg, #ffe0e0 0%, #ffc4c4 50%, #ffa4a4 100%);
}

/* 背景装饰 */
.tip-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.tip-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.6;
  animation: tipBlobFloat 8s ease-in-out infinite;
}

.tip-blob-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.tip-blob-2 {
  width: 150px;
  height: 150px;
  bottom: -40px;
  left: 20%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation-delay: -4s;
}

.tip-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 2px dashed rgba(102, 126, 234, 0.15);
  top: 50%;
  right: -100px;
  transform: translateY(-50%);
  animation: tipCircleRotate 20s linear infinite;
}

@keyframes tipBlobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.1); }
}

@keyframes tipCircleRotate {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
}

/* 内容包装器 */
.tip-content-wrapper {
  display: flex;
  align-items: center;
  gap: 32px;
  position: relative;
  z-index: 2;
  width: 100%;
}

/* 图标区域 */
.tip-icon-large {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-emoji {
  font-size: 56px;
  position: relative;
  z-index: 2;
  animation: iconFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.15));
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.05); }
}

.icon-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba(102, 126, 234, 0.2);
  animation: iconRingPulse 2s ease-in-out infinite;
}

@keyframes iconRingPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.5; }
}

.icon-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%);
  animation: iconPulseAnim 2s ease-in-out infinite;
}

@keyframes iconPulseAnim {
  0%, 100% { transform: scale(0.8); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 0; }
}

/* 文本内容 */
.tip-text-content {
  flex: 1;
}

.tip-category {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.tip-title-large {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
}

.tip-desc-large {
  font-size: 16px;
  color: #4a5568;
  margin: 0 0 20px 0;
  line-height: 1.8;
  max-width: 500px;
}

/* 底部区域 */
.tip-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.tip-tags {
  display: flex;
  gap: 8px;
}

.tip-tag {
  padding: 6px 14px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tip-card-large:hover .tip-tag {
  background: rgba(102, 126, 234, 0.2);
}

.tip-action {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-arrow {
  transition: transform 0.3s ease;
  font-size: 18px;
}

.tip-card-large:hover .tip-action {
  color: #764ba2;
}

.tip-card-large:hover .action-arrow {
  transform: translateX(6px);
}

/* 序号指示 */
.tip-number {
  position: absolute;
  top: 24px;
  right: 32px;
  z-index: 3;
  font-family: 'Georgia', serif;
}

.tip-number .current {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tip-number .divider {
  font-size: 20px;
  color: rgba(102, 126, 234, 0.3);
  margin: 0 4px;
}

.tip-number .total {
  font-size: 18px;
  color: rgba(102, 126, 234, 0.5);
}

/* 悬浮效果增强 */
.tip-card-large:hover {
  transform: translateY(-4px);
}

.tip-card-large:hover .tip-blob {
  animation-play-state: paused;
  opacity: 0.8;
}

.tip-card-large:hover .icon-emoji {
  animation: iconBounce 0.6s ease;
}

@keyframes iconBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    padding: 32px 20px;
    border-radius: 0 0 32px 32px;
  }

  .hero-emoji {
    font-size: 50px;
  }

  .hero-title {
    font-size: 26px;
  }

  .subtitle {
    font-size: 14px;
  }

  .hero-stats {
    gap: 8px;
  }

  .stat-item {
    padding: 8px 14px;
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }

  .section-header h2 {
    font-size: 20px;
  }

  .icon-wrapper {
    font-size: 22px;
  }

  .section-desc {
    font-size: 13px;
  }

  .current-section,
  .months-section,
  .quick-actions,
  .tips-section {
    padding: 0 16px;
  }

  .month-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .month-badge {
    width: 56px;
    height: 56px;
  }

  .month-num {
    font-size: 26px;
  }

  .month-details h3 {
    font-size: 17px;
  }

  .action-card {
    padding: 16px;
  }

  .action-icon {
    width: 48px;
    height: 48px;
  }

  .action-content h3 {
    font-size: 16px;
  }

  .action-content p {
    font-size: 13px;
  }

  .tips-section {
    padding: 0 16px 40px;
  }

  .tips-carousel :deep(.el-carousel__arrow) {
    width: 40px;
    height: 40px;
  }

  .tip-card-large {
    padding: 24px 20px;
    min-height: 280px;
  }

  .tip-content-wrapper {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .tip-icon-large {
    width: 80px;
    height: 80px;
  }

  .icon-emoji {
    font-size: 44px;
  }

  .tip-title-large {
    font-size: 20px;
  }

  .tip-desc-large {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .tip-footer {
    flex-direction: column;
    gap: 12px;
  }

  .tip-number {
    top: 16px;
    right: 20px;
  }

  .tip-number .current {
    font-size: 28px;
  }

  .tip-blob-1 {
    width: 120px;
    height: 120px;
  }

  .tip-blob-2 {
    width: 100px;
    height: 100px;
  }

  .tip-circle {
    width: 200px;
    height: 200px;
    right: -80px;
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 50%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 100%; }
  100% { background-position: 0% 50%; }
}

@keyframes floatShape {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(40px, -40px) rotate(90deg) scale(1.15);
  }
  50% {
    transform: translate(-30px, -60px) rotate(180deg) scale(0.9);
  }
  75% {
    transform: translate(-50px, -30px) rotate(270deg) scale(1.1);
  }
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes titleSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>

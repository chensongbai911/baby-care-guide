<template>
  <div class="timeline-view">
    <!-- 页面标题区域 -->
    <div class="timeline-header" ref="headerRef">
      <div class="header-decoration">
        <div class="deco-blob blob-1"></div>
        <div class="deco-blob blob-2"></div>
        <div class="deco-blob blob-3"></div>
      </div>

      <div class="header-content">
        <div class="title-wrapper">
          <h1 class="main-title">
            <span class="title-icon">🌟</span>
            <span class="title-text">宝宝成长时间轴</span>
          </h1>
          <p class="subtitle">记录每一个珍贵的成长瞬间</p>
        </div>

        <!-- 总体进度统计 -->
        <div class="overall-stats">
          <div
            class="stat-card"
            v-for="(stat, index) in stats"
            :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
            <div class="stat-glow"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间轴内容 -->
    <div class="timeline-container" ref="timelineRef">
      <!-- 中央时间线 -->
      <div class="timeline-line">
        <div
          class="timeline-progress"
          :style="{ height: scrollProgress + '%' }"
        >
          <div class="progress-glow"></div>
        </div>
      </div>

      <!-- 月份卡片 -->
      <div
        v-for="(month, index) in monthsData"
        :key="month.month"
        :class="[
          'timeline-item',
          { left: index % 2 === 0, right: index % 2 !== 0 },
        ]"
        :ref="
          (el) => {
            if (el) monthRefs[index] = el
          }
        "
        @mouseenter="onCardHover(index)"
        @mouseleave="onCardLeave(index)"
      >
        <!-- 时间点 -->
        <div class="timeline-dot">
          <div class="dot-outer">
            <div class="dot-inner">
              <span class="dot-month">{{ month.month }}</span>
            </div>
            <div class="dot-ring"></div>
            <div class="dot-pulse"></div>
          </div>
        </div>

        <!-- 月份卡片 -->
        <div class="month-card" @click="navigateToMonth(month.month)">
          <!-- 卡片光效 -->
          <div class="card-shine"></div>

          <!-- 装饰元素 -->
          <div class="card-decorations">
            <div class="deco-star" v-for="i in 3" :key="i"></div>
          </div>

          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="month-badge">
              <span class="badge-month">{{ month.month }}</span>
              <span class="badge-unit">月龄</span>
            </div>
            <div class="header-title">
              <h3>{{ month.title }}</h3>
              <p class="month-summary">{{ month.summary }}</p>
            </div>
          </div>

          <!-- 发育亮点 -->
          <div class="highlights-section">
            <div class="section-title">
              <span class="title-icon">✨</span>
              <span>发育亮点</span>
            </div>
            <div class="highlights-grid">
              <div
                class="highlight-item"
                v-for="(skill, idx) in month.cognitiveSkills.slice(0, 2)"
                :key="idx"
              >
                <span class="highlight-icon">🧠</span>
                <span class="highlight-text">{{ skill }}</span>
              </div>
              <div
                class="highlight-item"
                v-for="(skill, idx) in month.motorSkills.gross.slice(0, 1)"
                :key="'motor-' + idx"
              >
                <span class="highlight-icon">🏃</span>
                <span class="highlight-text">{{ skill }}</span>
              </div>
            </div>
          </div>

          <!-- 里程碑进度 -->
          <div class="milestones-preview">
            <div class="section-title">
              <span class="title-icon">🏆</span>
              <span>里程碑完成度</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: getMilestoneProgress(month) + '%' }"
                >
                  <div class="progress-shimmer"></div>
                </div>
              </div>
              <span class="progress-text">
                {{ getMilestoneProgress(month) }}%
              </span>
            </div>
          </div>

          <!-- 快速信息 -->
          <div class="quick-info">
            <div class="info-item">
              <span class="info-icon">📏</span>
              <span class="info-text">
                {{ month.physicalDevelopment.height }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-icon">⚖️</span>
              <span class="info-text">
                {{ month.physicalDevelopment.weight }}
              </span>
            </div>
          </div>

          <!-- 查看详情按钮 -->
          <div class="card-footer">
            <el-button type="primary" class="view-detail-btn" round>
              查看详情
              <el-icon class="btn-icon"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 悬浮效果 -->
          <div class="hover-overlay"></div>
        </div>

        <!-- 连接线动画 -->
        <div class="timeline-connector">
          <div class="connector-line"></div>
        </div>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <transition name="fade-slide">
      <div v-if="showScrollTop" class="floating-actions">
        <el-button
          circle
          size="large"
          @click="scrollToTop"
          class="scroll-top-btn"
        >
          <el-icon><Top /></el-icon>
        </el-button>
      </div>
    </transition>

    <!-- 底部简单装饰 -->
    <div class="bottom-decoration">
      <div class="wave-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import { ArrowRight, Top } from '@element-plus/icons-vue'
import type { BabyMonthData } from '@/types/baby'

const router = useRouter()
const babyStore = useBabyStore()

const monthsData = computed(() => babyStore.allMonthsData)
const headerRef = ref<HTMLElement>()
const timelineRef = ref<HTMLElement>()
const monthRefs = ref<any[]>([])
const scrollProgress = ref(0)
const showScrollTop = ref(false)

const stats = computed(() => [
  { icon: '📅', value: '13', label: '月龄阶段' },
  {
    icon: '🏆',
    value: babyStore.completedMilestonesCount,
    label: '已完成里程碑',
  },
  {
    icon: '📈',
    value:
      Math.round(
        (babyStore.completedMilestonesCount / babyStore.totalMilestonesCount) *
          100,
      ) + '%',
    label: '总体进度',
  },
])

// 获取里程碑进度
const getMilestoneProgress = (month: BabyMonthData) => {
  if (!month.milestones || month.milestones.length === 0) return 0
  const completed = month.milestones.filter((m) =>
    babyStore.isMilestoneCompleted(m.title),
  ).length
  return Math.round((completed / month.milestones.length) * 100)
}

// 导航到月份详情
const navigateToMonth = (monthId: number) => {
  router.push(`/month/${monthId}`)
}

// 卡片悬浮效果
const onCardHover = (index: number) => {
  const card = monthRefs.value[index]
  if (card) {
    card.classList.add('is-hovering')
  }
}

const onCardLeave = (index: number) => {
  const card = monthRefs.value[index]
  if (card) {
    card.classList.remove('is-hovering')
  }
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 滚动事件处理
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
  showScrollTop.value = scrollTop > 300

  // 视差效果
  if (headerRef.value) {
    headerRef.value.style.transform = `translateY(${scrollTop * 0.5}px)`
  }

  // 滚动触发动画
  monthRefs.value.forEach((ref, index) => {
    if (ref) {
      const rect = ref.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top < windowHeight * 0.8) {
        ref.classList.add('is-visible')
      }
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.timeline-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 50%, #fff8f8 100%);
  position: relative;
  overflow-x: hidden;
}

/* 底部简单装饰 */
.bottom-decoration {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.wave-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(102, 126, 234, 0.05) 100%
  );
}

/* 时间轴头部 */
.timeline-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
  border-radius: 0 0 40px 40px;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
}

.timeline-header h1 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 6px 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.timeline-header p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.deco-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: blob-float 8s ease-in-out infinite;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  top: -100px;
  right: -50px;
  animation-delay: 2s;
}

.blob-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: -100px;
  left: 50%;
  animation-delay: 4s;
}

@keyframes blob-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.header-content {
  position: relative;
  z-index: 1;
}

.title-wrapper {
  margin-bottom: 32px;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 6px 0;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: title-entrance 1s ease-out;
}

.title-icon {
  font-size: 40px;
  animation: rotate-scale 3s ease-in-out infinite;
}

@keyframes rotate-scale {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(10deg) scale(1.1);
  }
}

@keyframes title-entrance {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  animation: fade-in-up 1s ease-out 0.2s both;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 统计卡片 */
.overall-stats {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: card-pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

@keyframes card-pop-in {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.stat-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  animation: glow-sweep 3s ease-in-out infinite;
}

@keyframes glow-sweep {
  0%,
  100% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
}

.stat-icon {
  font-size: 20px;
  animation: bounce-subtle 2s ease-in-out infinite;
}

@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 时间轴容器 */
.timeline-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px 60px;
  position: relative;
}

/* 中央时间线 */
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #e0e0e0 0%, #f0f0f0 100%);
  transform: translateX(-50%);
  border-radius: 2px;
  z-index: 0;
}

.timeline-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: height 0.3s ease;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.progress-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateX(-50%) scale(1.5);
    opacity: 0.7;
  }
}

/* 时间轴项目 */
.timeline-item {
  position: relative;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline-item.left {
  padding-right: calc(50% + 60px);
}

.timeline-item.right {
  padding-left: calc(50% + 60px);
}

.timeline-item.left .month-card {
  transform-origin: right center;
}

.timeline-item.right .month-card {
  transform-origin: left center;
}

/* 时间点 */
.timeline-dot {
  position: absolute;
  left: 50%;
  top: 32px;
  transform: translateX(-50%);
  z-index: 2;
}

.dot-outer {
  position: relative;
  width: 64px;
  height: 64px;
}

.dot-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 16px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  z-index: 3;
  transition: all 0.3s ease;
}

.timeline-item.is-hovering .dot-inner {
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.dot-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.5;
  }
}

.dot-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  animation: pulse-expand 2s ease-in-out infinite;
}

@keyframes pulse-expand {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

/* 月份卡片 */
.month-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.month-card:hover {
  transform: scale(1.03);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

.timeline-item.is-hovering .month-card {
  transform: scale(1.03);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

/* 卡片光效 */
.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: rotate(45deg);
  transition: all 0.5s ease;
  opacity: 0;
}

.month-card:hover .card-shine {
  opacity: 1;
  animation: shine-sweep 1.5s ease-in-out;
}

@keyframes shine-sweep {
  from {
    transform: translateX(-100%) rotate(45deg);
  }
  to {
    transform: translateX(100%) rotate(45deg);
  }
}

/* 卡片装饰 */
.card-decorations {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  pointer-events: none;
}

.deco-star {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  opacity: 0.4;
  animation: twinkle 2s ease-in-out infinite;
}

.deco-star:nth-child(1) {
  top: 20px;
  right: 30px;
  animation-delay: 0s;
}
.deco-star:nth-child(2) {
  top: 40px;
  right: 50px;
  animation-delay: 0.5s;
}
.deco-star:nth-child(3) {
  top: 30px;
  right: 70px;
  animation-delay: 1s;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.3);
  }
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.month-badge {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.month-card:hover .month-badge {
  transform: rotate(5deg) scale(1.05);
}

.badge-month {
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
}

.badge-unit {
  font-size: 10px;
  opacity: 0.9;
  margin-top: 2px;
}

.header-title h3 {
  font-size: 18px;
  margin: 0 0 6px 0;
  color: var(--text-primary);
  font-weight: 700;
}

.month-summary {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 发育亮点 */
.highlights-section {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.title-icon {
  font-size: 16px;
}

.highlights-grid {
  display: grid;
  gap: 10px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 10px;
  font-size: 13px;
  color: var(--text-regular);
  transition: all 0.3s ease;
}

.highlight-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.highlight-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* 里程碑预览 */
.milestones-preview {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
  border-radius: 14px;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.progress-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer-slide 2s ease-in-out infinite;
}

@keyframes shimmer-slide {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.progress-text {
  font-size: 13px;
  font-weight: 700;
  color: #11998e;
  min-width: 40px;
  text-align: right;
}

/* 快速信息 */
.quick-info {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 12px;
  color: var(--text-regular);
}

.info-icon {
  font-size: 16px;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  justify-content: flex-end;
}

.view-detail-btn {
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-detail-btn:hover {
  transform: translateX(4px);
}

.btn-icon {
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.view-detail-btn:hover .btn-icon {
  transform: translateX(4px);
}

/* 悬浮遮罩 */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 24px;
}

.month-card:hover .hover-overlay {
  opacity: 1;
}

/* 连接线 */
.timeline-connector {
  position: absolute;
  top: 40px;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea);
}

.timeline-item.left .timeline-connector {
  right: calc(50% + 40px);
}

.timeline-item.right .timeline-connector {
  left: calc(50% + 40px);
  background: linear-gradient(90deg, #667eea, transparent);
}

.connector-line {
  width: 100%;
  height: 100%;
  background: inherit;
  animation: connector-flow 2s ease-in-out infinite;
}

@keyframes connector-flow {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

/* 浮动按钮 */
.floating-actions {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
}

.scroll-top-btn {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.scroll-top-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .timeline-view {
    padding-bottom: 80px;
  }

  .timeline-header {
    padding: 20px 16px;
    border-radius: 0 0 24px 24px;
  }

  .main-title {
    font-size: 22px;
    margin-bottom: 6px;
  }

  .title-icon {
    font-size: 36px;
  }

  .subtitle {
    font-size: 13px;
  }

  .overall-stats {
    flex-direction: column;
    gap: 10px;
  }

  .stat-card {
    width: 100%;
    max-width: none;
    padding: 12px 16px;
  }

  .stat-value {
    font-size: 18px;
  }

  .stat-label {
    font-size: 12px;
  }

  /* 移动端简化时间轴布局 */
  .timeline-container {
    padding: 20px 12px;
  }

  .timeline-item.left,
  .timeline-item.right {
    padding-left: 60px;
    padding-right: 12px;
    margin-bottom: 24px;
  }

  .timeline-line {
    left: 28px;
    width: 3px;
  }

  .timeline-dot {
    left: 28px;
    transform: translateX(-50%);
  }

  .dot-outer {
    width: 56px;
    height: 56px;
  }

  .dot-inner {
    width: 48px;
    height: 48px;
    font-size: 16px;
  }

  .dot-month {
    font-size: 14px;
  }

  .dot-ring {
    width: 64px;
    height: 64px;
  }

  .month-card {
    padding: 16px;
    border-radius: 16px;
  }

  .card-header {
    margin-bottom: 12px;
  }

  .header-title {
    gap: 8px;
  }

  .header-title h3 {
    font-size: 17px;
  }

  .header-emoji {
    font-size: 24px;
  }

  .month-badge {
    padding: 4px 10px;
    font-size: 11px;
  }

  .card-body {
    gap: 12px;
  }

  .month-summary {
    font-size: 13px;
    line-height: 1.6;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .section-title {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .highlight-item {
    font-size: 13px;
    padding: 10px 12px;
  }

  .milestone-item {
    padding: 10px 12px;
    font-size: 13px;
  }

  .progress-info {
    font-size: 12px;
  }

  .card-footer {
    padding-top: 12px;
    margin-top: 12px;
  }

  .view-detail-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .scroll-top-btn {
    bottom: 90px;
    right: 16px;
    width: 44px;
    height: 44px;
  }
}

/* 小屏优化 */
@media (max-width: 480px) {
  .timeline-header {
    padding: 16px 12px;
  }

  .main-title {
    font-size: 20px;
  }

  .overall-stats {
    gap: 8px;
  }

  .stat-card {
    padding: 10px 14px;
  }

  .timeline-item.left,
  .timeline-item.right {
    padding-left: 56px;
    padding-right: 8px;
  }

  .timeline-line {
    left: 24px;
  }

  .timeline-dot {
    left: 24px;
  }

  .dot-outer {
    width: 48px;
    height: 48px;
  }

  .dot-inner {
    width: 42px;
    height: 42px;
  }

  .month-card {
    padding: 14px;
  }

  .header-title h3 {
    font-size: 16px;
  }

  .highlights-grid {
    gap: 6px;
  }

  .highlight-item,
  .milestone-item {
    font-size: 12px;
    padding: 8px 10px;
  }
}
</style>

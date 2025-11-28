<template>
  <div class="month-detail-view" v-if="monthData">
    <!-- SVG 动画背景 -->
    <svg class="hero-svg-bg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <!-- 渐变定义 -->
        <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:#818cf8;stop-opacity:0.3" />
        </linearGradient>
        <linearGradient id="heroGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f472b6;stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:#c084fc;stop-opacity:0.2" />
        </linearGradient>

        <!-- 发光滤镜 -->
        <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 动态波浪 -->
      <path class="wave wave-1" d="M0,300 Q200,250 400,300 T800,280 V400 H0 Z" fill="url(#heroGradient1)"/>
      <path class="wave wave-2" d="M0,320 Q200,280 400,320 T800,300 V400 H0 Z" fill="url(#heroGradient2)"/>

      <!-- 漂浮圆圈 -->
      <circle class="float-circle fc-1" cx="100" cy="80" r="30" fill="rgba(255,255,255,0.15)" filter="url(#heroGlow)"/>
      <circle class="float-circle fc-2" cx="700" cy="120" r="45" fill="rgba(255,255,255,0.1)" filter="url(#heroGlow)"/>
      <circle class="float-circle fc-3" cx="400" cy="60" r="20" fill="rgba(255,255,255,0.2)" filter="url(#heroGlow)"/>
      <circle class="float-circle fc-4" cx="600" cy="200" r="25" fill="rgba(255,255,255,0.12)" filter="url(#heroGlow)"/>

      <!-- 星星装饰 -->
      <g class="star-group">
        <polygon class="twinkle-star ts-1" points="150,150 153,158 162,158 155,163 158,172 150,167 142,172 145,163 138,158 147,158" fill="rgba(255,255,255,0.8)"/>
        <polygon class="twinkle-star ts-2" points="650,80 652,86 658,86 653,90 655,96 650,92 645,96 647,90 642,86 648,86" fill="rgba(255,255,255,0.7)"/>
        <polygon class="twinkle-star ts-3" points="300,100 302,106 308,106 303,110 305,116 300,112 295,116 297,110 292,106 298,106" fill="rgba(255,255,255,0.6)"/>
      </g>

      <!-- 爱心装饰 -->
      <g class="heart-float hf-1" transform="translate(500, 150)">
        <path d="M0,-8 C-4,-12 -10,-8 -10,-4 C-10,2 0,10 0,10 C0,10 10,2 10,-4 C10,-8 4,-12 0,-8" fill="rgba(244,114,182,0.6)" filter="url(#heroGlow)"/>
      </g>
      <g class="heart-float hf-2" transform="translate(200, 200)">
        <path d="M0,-6 C-3,-9 -7.5,-6 -7.5,-3 C-7.5,1.5 0,7.5 0,7.5 C0,7.5 7.5,1.5 7.5,-3 C7.5,-6 3,-9 0,-6" fill="rgba(251,191,36,0.5)" filter="url(#heroGlow)"/>
      </g>
    </svg>

    <!-- 顶部导航 -->
    <div class="top-nav">
      <el-button class="back-btn" @click="router.back()" round>
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <div class="nav-controls">
        <el-button
          :disabled="monthData.month === 0"
          @click="navigateMonth(-1)"
          circle
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <span class="nav-month">{{ monthData.month }}月</span>
        <el-button
          :disabled="monthData.month === 12"
          @click="navigateMonth(1)"
          circle
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-decoration">
        <div class="deco-circle deco-1"></div>
        <div class="deco-circle deco-2"></div>
        <div class="deco-circle deco-3"></div>
      </div>
      <div class="hero-content">
        <div class="month-badge-large">
          <span class="month-num">{{ monthData.month }}</span>
          <span class="month-unit">月龄</span>
        </div>
        <h1>{{ monthData.title }}</h1>
        <p class="hero-summary">{{ monthData.summary }}</p>

        <!-- 快速统计 -->
        <div class="quick-stats">
          <div class="stat-item">
            <el-icon><ScaleToOriginal /></el-icon>
            <div class="stat-content">
              <span class="stat-label">体重</span>
              <span class="stat-value">{{ monthData.physicalDevelopment.weight }}</span>
            </div>
          </div>
          <div class="stat-item">
            <el-icon><Histogram /></el-icon>
            <div class="stat-content">
              <span class="stat-label">身高</span>
              <span class="stat-value">{{ monthData.physicalDevelopment.height }}</span>
            </div>
          </div>
          <div class="stat-item">
            <el-icon><DataAnalysis /></el-icon>
            <div class="stat-content">
              <span class="stat-label">头围</span>
              <span class="stat-value">{{ monthData.physicalDevelopment.headCircumference }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容标签页 -->
    <div class="content-section">
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- 发育指标 -->
        <el-tab-pane name="development">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">📊</span>
              <span class="tab-text">发育指标</span>
            </span>
          </template>

          <div class="tab-content">
            <!-- 身体发育详情 -->
            <el-card class="info-card physical-card">
              <template #header>
                <div class="card-header-custom">
                  <span class="header-icon">🎯</span>
                  <h3>身体发育</h3>
                </div>
              </template>
              <p class="description-text">{{ monthData.physicalDevelopment.description }}</p>
              <div class="physical-grid">
                <div class="physical-item">
                  <div class="physical-icon weight-icon">⚖️</div>
                  <div class="physical-info">
                    <span class="physical-label">体重范围</span>
                    <span class="physical-value">{{ monthData.physicalDevelopment.weight }}</span>
                  </div>
                </div>
                <div class="physical-item">
                  <div class="physical-icon height-icon">📏</div>
                  <div class="physical-info">
                    <span class="physical-label">身高范围</span>
                    <span class="physical-value">{{ monthData.physicalDevelopment.height }}</span>
                  </div>
                </div>
                <div class="physical-item">
                  <div class="physical-icon head-icon">👶</div>
                  <div class="physical-info">
                    <span class="physical-label">头围范围</span>
                    <span class="physical-value">{{ monthData.physicalDevelopment.headCircumference }}</span>
                  </div>
                </div>
              </div>
            </el-card>

            <el-row :gutter="20">
              <!-- 认知能力 -->
              <el-col :xs="24" :md="12">
                <el-card class="info-card skill-card cognitive-card">
                  <template #header>
                    <div class="card-header-custom">
                      <span class="header-icon">🧠</span>
                      <h3>认知能力</h3>
                    </div>
                  </template>
                  <ul class="skill-list">
                    <li v-for="(skill, index) in monthData.cognitiveSkills" :key="index">
                      <span class="skill-bullet cognitive"></span>
                      <span>{{ skill }}</span>
                    </li>
                  </ul>
                </el-card>
              </el-col>

              <!-- 社交情感 -->
              <el-col :xs="24" :md="12">
                <el-card class="info-card skill-card social-card">
                  <template #header>
                    <div class="card-header-custom">
                      <span class="header-icon">❤️</span>
                      <h3>社交情感</h3>
                    </div>
                  </template>
                  <ul class="skill-list">
                    <li v-for="(skill, index) in monthData.socialEmotional" :key="index">
                      <span class="skill-bullet social"></span>
                      <span>{{ skill }}</span>
                    </li>
                  </ul>
                </el-card>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <!-- 大运动 -->
              <el-col :xs="24" :md="12">
                <el-card class="info-card skill-card motor-gross-card">
                  <template #header>
                    <div class="card-header-custom">
                      <span class="header-icon">🏃</span>
                      <h3>大运动能力</h3>
                    </div>
                  </template>
                  <ul class="skill-list">
                    <li v-for="(skill, index) in monthData.motorSkills.gross" :key="index">
                      <span class="skill-bullet motor-gross"></span>
                      <span>{{ skill }}</span>
                    </li>
                  </ul>
                </el-card>
              </el-col>

              <!-- 精细动作 -->
              <el-col :xs="24" :md="12">
                <el-card class="info-card skill-card motor-fine-card">
                  <template #header>
                    <div class="card-header-custom">
                      <span class="header-icon">✋</span>
                      <h3>精细动作</h3>
                    </div>
                  </template>
                  <ul class="skill-list">
                    <li v-for="(skill, index) in monthData.motorSkills.fine" :key="index">
                      <span class="skill-bullet motor-fine"></span>
                      <span>{{ skill }}</span>
                    </li>
                  </ul>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!-- 护理指南 -->
        <el-tab-pane name="care">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">👨‍👦</span>
              <span class="tab-text">护理指南</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="care-grid">
              <CareGuideCard
                v-for="(guideline, index) in monthData.careGuidelines"
                :key="index"
                :guideline="guideline"
              />
            </div>
            <el-empty v-if="!monthData.careGuidelines.length" description="暂无护理指南" />
          </div>
        </el-tab-pane>

        <!-- 喂养建议 -->
        <el-tab-pane name="nutrition">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">🍼</span>
              <span class="tab-text">喂养建议</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="nutrition-grid">
              <el-card
                v-for="(tip, index) in monthData.nutritionTips"
                :key="index"
                class="nutrition-card"
              >
                <div class="nutrition-header">
                  <div class="nutrition-icon">
                    {{ tip.type.includes('母乳') || tip.type.includes('奶') ? '🍼' : '🥣' }}
                  </div>
                  <h3>{{ tip.type }}</h3>
                </div>
                <div class="nutrition-stats">
                  <div class="nutrition-stat">
                    <span class="stat-icon">⏰</span>
                    <div class="stat-info">
                      <span class="stat-label">喂养频率</span>
                      <span class="stat-value">{{ tip.frequency }}</span>
                    </div>
                  </div>
                  <div class="nutrition-stat">
                    <span class="stat-icon">📊</span>
                    <div class="stat-info">
                      <span class="stat-label">建议用量</span>
                      <span class="stat-value">{{ tip.amount }}</span>
                    </div>
                  </div>
                </div>
                <div class="nutrition-notes">
                  <h4>📝 注意事项</h4>
                  <ul>
                    <li v-for="(note, idx) in tip.notes" :key="idx">{{ note }}</li>
                  </ul>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>

        <!-- 成长里程碑 -->
        <el-tab-pane name="milestones">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">🏆</span>
              <span class="tab-text">里程碑</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="milestones-header">
              <div class="milestones-progress">
                <el-progress
                  type="circle"
                  :percentage="milestoneProgress"
                  :width="120"
                  :stroke-width="10"
                >
                  <template #default>
                    <div class="progress-inner">
                      <span class="progress-value">{{ completedMilestonesCount }}</span>
                      <span class="progress-label">/ {{ monthData.milestones.length }}</span>
                    </div>
                  </template>
                </el-progress>
                <div class="progress-text">
                  <h4>里程碑完成进度</h4>
                  <p>点击卡片标记完成状态</p>
                </div>
              </div>
            </div>

            <div class="milestones-grid">
              <div
                v-for="(milestone, index) in monthData.milestones"
                :key="index"
                :class="['milestone-card', { 'completed': isMilestoneCompleted(milestone.title) }]"
                @click="toggleMilestone(milestone.title)"
              >
                <div class="milestone-check">
                  <div class="check-circle">
                    <el-icon v-if="isMilestoneCompleted(milestone.title)"><Check /></el-icon>
                  </div>
                </div>
                <div class="milestone-content">
                  <h4>{{ milestone.title }}</h4>
                  <p>{{ milestone.description }}</p>
                </div>
                <div class="milestone-status">
                  <el-tag
                    :type="isMilestoneCompleted(milestone.title) ? 'success' : 'info'"
                    effect="plain"
                  >
                    {{ isMilestoneCompleted(milestone.title) ? '已完成 🎉' : '待完成' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 常见问题 -->
        <el-tab-pane name="issues">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">❓</span>
              <span class="tab-text">常见问题</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="issues-list">
              <el-card
                v-for="(issue, index) in monthData.commonIssues"
                :key="index"
                class="issue-card"
              >
                <div class="issue-header">
                  <span class="issue-icon">⚠️</span>
                  <h3>{{ issue.problem }}</h3>
                </div>

                <div class="issue-section">
                  <h4><span class="section-icon">🔍</span> 症状表现</h4>
                  <div class="symptom-tags">
                    <el-tag
                      v-for="(symptom, idx) in issue.symptoms"
                      :key="idx"
                      type="warning"
                      effect="plain"
                    >
                      {{ symptom }}
                    </el-tag>
                  </div>
                </div>

                <div class="issue-section">
                  <h4><span class="section-icon">💡</span> 解决方案</h4>
                  <ul class="solution-list">
                    <li v-for="(solution, idx) in issue.solutions" :key="idx">
                      <el-icon class="solution-icon"><CircleCheck /></el-icon>
                      {{ solution }}
                    </li>
                  </ul>
                </div>

                <el-alert
                  :title="'🏥 何时就医：' + issue.whenToSeeDr"
                  type="error"
                  :closable="false"
                  show-icon
                  class="doctor-alert"
                />
              </el-card>
            </div>
            <el-empty v-if="!monthData.commonIssues.length" description="暂无常见问题" />
          </div>
        </el-tab-pane>

        <!-- 安全提醒 -->
        <el-tab-pane name="safety">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">⚠️</span>
              <span class="tab-text">安全提醒</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="safety-header">
              <div class="safety-icon-large">🛡️</div>
              <div class="safety-intro">
                <h3>安全第一</h3>
                <p>以下是{{ monthData.month }}月龄宝宝需要特别注意的安全事项</p>
              </div>
            </div>

            <div class="safety-grid">
              <div
                v-for="(warning, index) in monthData.safetyWarnings"
                :key="index"
                class="safety-card"
              >
                <div class="safety-number">{{ index + 1 }}</div>
                <div class="safety-content">{{ warning }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 学习资源 -->
        <el-tab-pane name="media">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">📚</span>
              <span class="tab-text">学习资源</span>
            </span>
          </template>

          <div class="tab-content">
            <MediaGallery
              :videos="monthData.videos"
              :images="monthData.images"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <el-button
        v-if="monthData.month > 0"
        size="large"
        @click="navigateMonth(-1)"
      >
        <el-icon><ArrowLeft /></el-icon>
        {{ monthData.month - 1 }}月龄
      </el-button>
      <div v-else></div>

      <el-button
        v-if="monthData.month < 12"
        type="primary"
        size="large"
        @click="navigateMonth(1)"
      >
        {{ monthData.month + 1 }}月龄
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>
  </div>

  <el-empty v-else description="未找到该月龄数据" :image-size="200">
    <el-button type="primary" @click="router.push('/')">返回首页</el-button>
  </el-empty>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import CareGuideCard from '@/components/baby/CareGuideCard.vue'
import MediaGallery from '@/components/baby/MediaGallery.vue'
import {
  ArrowLeft,
  ArrowRight,
  ScaleToOriginal,
  Histogram,
  DataAnalysis,
  Check,
  CircleCheck
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { BabyMonthData, Milestone } from '@/types/baby'

const route = useRoute()
const router = useRouter()
const babyStore = useBabyStore()

const activeTab = ref('development')

const monthData = computed(() => {
  const monthId = parseInt(route.params.id as string)
  return babyStore.allMonthsData.find((m: BabyMonthData) => m.month === monthId)
})

const completedMilestonesCount = computed(() => {
  if (!monthData.value) return 0
  return monthData.value.milestones.filter((m: Milestone) => babyStore.isMilestoneCompleted(m.title)).length
})

const milestoneProgress = computed(() => {
  if (!monthData.value || !monthData.value.milestones.length) return 0
  return Math.round((completedMilestonesCount.value / monthData.value.milestones.length) * 100)
})

const isMilestoneCompleted = (title: string) => {
  return babyStore.isMilestoneCompleted(title)
}

const toggleMilestone = (title: string) => {
  babyStore.toggleMilestone(title)
  if (babyStore.isMilestoneCompleted(title)) {
    ElMessage({
      message: `🎉 太棒了！"${title}"已完成！`,
      type: 'success'
    })
  }
}

const navigateMonth = (delta: number) => {
  if (!monthData.value) return
  const newMonth = monthData.value.month + delta
  if (newMonth >= 0 && newMonth <= 12) {
    router.push(`/month/${newMonth}`)
  }
}

onMounted(() => {
  const monthId = parseInt(route.params.id as string)
  babyStore.setCurrentMonth(monthId)
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    babyStore.setCurrentMonth(parseInt(newId as string))
    activeTab.value = 'development'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<style scoped>
.month-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

/* 顶部导航 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px; /* 从 20px 减小 */
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.back-btn {
  font-weight: 600;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-month {
  font-size: 16px; /* 从 18px 减小 */
  font-weight: 700;
  color: #303133;
  min-width: 50px;
  text-align: center;
}

/* 页面头部 */
.page-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px; /* 从 60px 30px 减小 */
  border-radius: 0 0 40px 40px;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.deco-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -30px;
}

.deco-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  left: 10%;
}

.deco-3 {
  width: 100px;
  height: 100px;
  top: 30%;
  left: -20px;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.month-badge-large {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 16px 32px; /* 从 20px 40px 减小 */
  border-radius: 24px;
  margin-bottom: 16px; /* 从 20px 减小 */
  backdrop-filter: blur(10px);
}

.month-num {
  font-size: 44px; /* 从 56px 减小 */
  font-weight: 900;
  line-height: 1;
}

.month-unit {
  font-size: 14px; /* 从 16px 减小 */
  opacity: 0.9;
  margin-top: 4px;
}

.page-hero h1 {
  font-size: 26px; /* 从 32px 减小 */
  margin: 0 0 10px 0; /* 从 12px 减小 */
  font-weight: 800;
}

.hero-summary {
  font-size: 14px; /* 从 16px 减小 */
  opacity: 0.9;
  margin: 0 0 20px 0; /* 从 30px 减小 */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

.quick-stats {
  display: flex;
  justify-content: center;
  gap: 16px; /* 从 20px 减小 */
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px; /* 从 12px 减小 */
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 20px; /* 从 16px 24px 减小 */
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.stat-item .el-icon {
  font-size: 24px; /* 从 28px 减小 */
}

.stat-content {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.stat-label {
  font-size: 11px; /* 从 12px 减小 */
  opacity: 0.85;
}

.stat-value {
  font-size: 15px; /* 从 16px 减小 */
  font-weight: 700;
}

/* 详情页头部 */
.detail-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px; /* 从 60px 40px 减小 */
  border-radius: 0 0 40px 40px;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px; /* 从 40px 减小 */
}

.detail-header .month-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 16px; /* 从 8px 20px 减小 */
  border-radius: 20px;
  font-size: 13px; /* 从 14px 减小 */
  font-weight: 600;
  margin-bottom: 12px; /* 从 16px 减小 */
  backdrop-filter: blur(10px);
}

.detail-header h1 {
  font-size: 32px; /* 从 42px 减小 */
  font-weight: 800;
  margin: 0 0 8px 0; /* 从 12px 减小 */
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.detail-header p {
  font-size: 15px; /* 从 18px 减小 */
  opacity: 0.9;
  margin: 0 0 20px 0; /* 从 24px 减小 */
}

.quick-stats {
  display: flex;
  gap: 12px; /* 从 16px 减小 */
  margin-top: 20px; /* 从 24px 减小 */
}

.quick-stat {
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px; /* 从 16px 减小 */
  border-radius: 12px;
  backdrop-filter: blur(10px);
  text-align: center;
}

.quick-stat-icon {
  font-size: 20px; /* 从 24px 减小 */
  margin-bottom: 6px; /* 从 8px 减小 */
}

.quick-stat-value {
  font-size: 15px; /* 从 18px 减小 */
  font-weight: 700;
  display: block;
  margin-bottom: 2px; /* 从 4px 减小 */
}

.quick-stat-label {
  font-size: 11px; /* 从 12px 减小 */
  opacity: 0.8;
}

/* 月份详情头部 */
.month-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px; /* 从 60px 40px 减小 */
  border-radius: 0 0 40px 40px;
  color: white;
  position: relative;
  overflow: hidden;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px; /* 从 40px 减小 */
  height: 36px; /* 从 40px 减小 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.month-number {
  font-size: 48px; /* 从 64px 减小 */
  font-weight: 800;
  margin: 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.month-label {
  font-size: 16px; /* 从 18px 减小 */
  opacity: 0.9;
  margin-top: 4px; /* 从 8px 减小 */
}

.milestone-preview {
  background: rgba(255, 255, 255, 0.15);
  padding: 16px; /* 从 20px 减小 */
  border-radius: 20px;
  backdrop-filter: blur(10px);
  margin-top: 20px; /* 从 24px 减小 */
}

.milestone-title {
  font-size: 14px; /* 从 16px 减小 */
  opacity: 0.9;
  margin-bottom: 10px; /* 从 12px 减小 */
}

.milestone-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.milestone-tag {
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 12px; /* 从 8px 16px 减小 */
  border-radius: 20px;
  font-size: 12px; /* 从 13px 减小 */
  backdrop-filter: blur(5px);
}

/* 内容区域 */
.content-section {
  padding: 0 20px;
}

.detail-tabs {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-icon {
  font-size: 18px;
}

.tab-text {
  font-weight: 600;
}

.tab-content {
  padding: 20px 0;
}

/* 信息卡片 */
.info-card {
  margin-bottom: 20px;
  border-radius: 16px !important;
}

.card-header-custom {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 24px;
}

.card-header-custom h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.description-text {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

/* 身体发育网格 */
.physical-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.physical-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #ebeef5;
}

.physical-icon {
  font-size: 36px;
}

.physical-info {
  display: flex;
  flex-direction: column;
}

.physical-label {
  font-size: 13px;
  color: #909399;
}

.physical-value {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

/* 技能列表 */
.skill-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.skill-list li:last-child {
  border-bottom: none;
}

.skill-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.skill-bullet.cognitive { background: #409eff; }
.skill-bullet.social { background: #f56c6c; }
.skill-bullet.motor-gross { background: #67c23a; }
.skill-bullet.motor-fine { background: #e6a23c; }

/* 护理指南网格 */
.care-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

/* 营养卡片 */
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.nutrition-card {
  border-radius: 20px !important;
}

.nutrition-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.nutrition-icon {
  font-size: 48px;
}

.nutrition-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.nutrition-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.nutrition-stat {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.nutrition-stat .stat-icon {
  font-size: 24px;
}

.nutrition-stat .stat-info {
  display: flex;
  flex-direction: column;
}

.nutrition-stat .stat-label {
  font-size: 12px;
  color: #909399;
}

.nutrition-stat .stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.nutrition-notes {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  padding: 16px;
  border-radius: 12px;
}

.nutrition-notes h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #92400e;
}

.nutrition-notes ul {
  margin: 0;
  padding-left: 20px;
  color: #78350f;
  font-size: 14px;
  line-height: 1.8;
}

/* 里程碑 */
.milestones-header {
  margin-bottom: 30px;
}

.milestones-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 20px;
}

.progress-inner {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.progress-value {
  font-size: 32px;
  font-weight: 800;
  color: #667eea;
}

.progress-label {
  font-size: 16px;
  color: #909399;
}

.progress-text h4 {
  margin: 0 0 6px 0;
  font-size: 18px;
  color: #303133;
}

.progress-text p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.milestone-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.milestone-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.milestone-card.completed {
  background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
  border-color: #38ef7d;
}

.milestone-check {
  display: flex;
  justify-content: flex-end;
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

.milestone-content h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
}

.milestone-content p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

/* 问题卡片 */
.issues-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.issue-card {
  border-radius: 20px !important;
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.issue-icon {
  font-size: 28px;
}

.issue-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.issue-section {
  margin-bottom: 20px;
}

.issue-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #303133;
}

.section-icon {
  font-size: 16px;
}

.symptom-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.solution-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.solution-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.solution-icon {
  color: #67c23a;
  margin-top: 2px;
}

.doctor-alert {
  margin-top: 16px;
  border-radius: 12px;
}

/* 安全提醒 */
.safety-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border-radius: 20px;
  margin-bottom: 30px;
}

.safety-icon-large {
  font-size: 60px;
}

.safety-intro h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #c53030;
}

.safety-intro p {
  margin: 0;
  font-size: 14px;
  color: #742a2a;
}

.safety-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.safety-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border-left: 4px solid #f56c6c;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.safety-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f56c6c 0%, #ff9a9e 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.safety-content {
  font-size: 15px;
  color: #303133;
  line-height: 1.6;
}

/* 底部导航 */
.bottom-nav {
  display: flex;
  justify-content: space-between;
  padding: 30px 20px;
  margin-top: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-hero {
    padding: 40px 20px;
  }

  .month-num {
    font-size: 42px;
  }

  .page-hero h1 {
    font-size: 24px;
  }

  .quick-stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-item {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .milestones-progress {
    flex-direction: column;
    text-align: center;
  }

  .safety-header {
    flex-direction: column;
    text-align: center;
  }

  .care-grid,
  .nutrition-grid,
  .milestones-grid {
    grid-template-columns: 1fr;
  }

  .physical-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="home-view">
    <!-- 侧边栏快速导航 -->
    <transition name="slide-fade">
      <div class="sidebar-nav" v-show="showSidebar">
        <div class="sidebar-header">
          <h3>快速导航</h3>
          <el-button text @click="showSidebar = false" class="close-btn">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>

        <div class="sidebar-sections">
          <!-- 月龄分类 -->
          <div class="nav-section">
            <div class="section-title">
              <el-icon><Calendar /></el-icon>
              <span>月龄阶段</span>
            </div>
            <div class="nav-items">
              <div
                v-for="category in monthCategories"
                :key="category.id"
                class="nav-item"
                @click="scrollToSection(category.id)"
              >
                <span class="item-icon">{{ category.icon }}</span>
                <span class="item-text">{{ category.label }}</span>
                <span class="item-count">{{ category.count }}</span>
              </div>
            </div>
          </div>

          <!-- 功能分类 -->
          <div class="nav-section">
            <div class="section-title">
              <el-icon><Grid /></el-icon>
              <span>功能模块</span>
            </div>
            <div class="nav-items">
              <div
                v-for="func in functionCategories"
                :key="func.path"
                class="nav-item"
                @click="router.push(func.path)"
              >
                <span class="item-icon">{{ func.icon }}</span>
                <span class="item-text">{{ func.label }}</span>
              </div>
            </div>
          </div>

          <!-- 内容分类 -->
          <div class="nav-section">
            <div class="section-title">
              <el-icon><Collection /></el-icon>
              <span>内容分类</span>
            </div>
            <div class="nav-items">
              <div
                v-for="content in contentCategories"
                :key="content.id"
                class="nav-item"
                @click="scrollToSection(content.id)"
              >
                <span class="item-icon">{{ content.icon }}</span>
                <span class="item-text">{{ content.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 浮动导航按钮 -->
    <el-button
      class="floating-nav-btn"
      type="primary"
      circle
      @click="showSidebar = !showSidebar"
    >
      <el-icon><Menu /></el-icon>
    </el-button>

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
        <p class="subtitle">
          专属于你的育儿助手，宝宝成长每一步，我们陪你记录~
        </p>
        <div class="hero-stats">
          <!-- 月龄阶段突出显示 -->
          <div
            class="stat-item stat-primary"
            @click="scrollToSection('months-section')"
          >
            <span class="stat-number">13</span>
            <span class="stat-label">月龄阶段</span>
            <span class="stat-arrow">→</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" @click="goToTimeline">
            <span class="stat-number">{{ totalMilestones }}</span>
            <span class="stat-label">成长里程碑</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" @click="goToDetail(babyStore.currentMonth)">
            <span class="stat-number">100+</span>
            <span class="stat-label">护理技巧</span>
          </div>
        </div>
        <div class="hero-buttons">
          <el-button
            type="primary"
            size="large"
            round
            @click="showBabyInfoDialog = true"
            class="setup-btn"
          >
            <el-icon><Setting /></el-icon>
            {{
              babyStore.babyInfo.name === '宝宝'
                ? '设置宝宝月龄'
                : babyStore.babyInfo.name + '的成长档案'
            }}
          </el-button>
          <el-tooltip
            content="探索当前月龄的成长内容"
            placement="top"
            :show-after="500"
          >
            <el-button
              size="large"
              round
              @click="goToDetail(babyStore.currentMonth)"
              class="secondary-btn explore-btn"
            >
              <span>开始探索</span>
              <el-icon class="explore-arrow"><ArrowRight /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 当前月龄快速概览 - 优化设计 -->
    <div class="current-section" v-if="currentMonthData">
      <el-card class="current-month-card-enhanced">
        <!-- 顶部标记 - 更直观的阶段显示 -->
        <div class="current-badge">
          <div class="badge-left">
            <span class="badge-icon">🎯</span>
            <span class="badge-text">当前阶段</span>
          </div>
          <div class="badge-right" @click="showBabyInfoDialog = true">
            <span class="badge-stage">{{ currentMonthData.title }}</span>
            <el-icon class="edit-icon"><Edit /></el-icon>
          </div>
        </div>

        <!-- 欢迎语 -->
        <div class="welcome-section">
          <h2 class="welcome-title">
            <span class="emoji-wave">👋</span>
            {{ getWelcomeMessage() }}
          </h2>
          <p class="welcome-subtitle">
            宝宝现在
            <strong>{{ babyStore.currentMonth }}</strong>
            个月，
            {{ getStageDescription() }}
          </p>
        </div>

        <!-- 下个月龄预告 -->
        <div class="next-month-preview" v-if="nextMonthData">
          <div class="preview-header">
            <span class="preview-icon">🔮</span>
            <span class="preview-title">下个月预告</span>
          </div>
          <div class="preview-content">
            <span class="preview-month">{{ nextMonthData.month }}月龄</span>
            <span class="preview-abilities">
              即将解锁：{{ getNextMonthAbilities() }}
            </span>
          </div>
        </div>

        <!-- 发育数据卡片 - 统一视觉风格 -->
        <div class="development-data">
          <div class="data-card weight-card">
            <div class="data-icon-wrapper">
              <span class="data-icon">👶</span>
              <span class="data-badge">体重</span>
            </div>
            <div class="data-content">
              <div class="data-label">参考范围</div>
              <div class="data-value">
                {{ currentMonthData.physicalDevelopment.weight }}
              </div>
            </div>
          </div>
          <div class="data-card height-card">
            <div class="data-icon-wrapper">
              <span class="data-icon">👶</span>
              <span class="data-badge">身高</span>
            </div>
            <div class="data-content">
              <div class="data-label">参考范围</div>
              <div class="data-value">
                {{ currentMonthData.physicalDevelopment.height }}
              </div>
            </div>
          </div>
        </div>

        <!-- 关键里程碑 - 添加展开收起功能 -->
        <div class="key-milestones">
          <div class="milestone-header">
            <div class="header-left">
              <el-tooltip
                content="里程碑：宝宝发育过程中的关键能力节点，每个宝宝发育进度不同，仅供参考"
                placement="top"
              >
                <h3 class="milestone-title-with-tip">
                  🏆 关键里程碑
                  <span class="tip-icon">ℹ️</span>
                </h3>
              </el-tooltip>
              <span class="milestone-subtitle">
                {{ babyStore.currentMonth }}个月宝宝的重要能力发展
              </span>
            </div>
            <div class="header-right">
              <span class="milestone-progress">
                {{ getCompletedMilestonesForMonth() }}/{{
                  currentMonthData.milestones?.length || 0
                }}
              </span>
              <el-button
                text
                size="small"
                @click="showAllMilestones = !showAllMilestones"
                class="expand-btn"
              >
                {{ showAllMilestones ? '收起' : '展开' }}
                <el-icon>
                  <ArrowUp v-if="showAllMilestones" />
                  <ArrowDown v-else />
                </el-icon>
              </el-button>
            </div>
          </div>
          <div class="milestone-grid">
            <div
              v-for="milestone in (showAllMilestones ? currentMonthData.milestones : currentMonthData.milestones?.slice(0, 6))"
              :key="milestone.title"
              class="milestone-card"
              :class="{
                completed: babyStore.isMilestoneCompleted(milestone.title),
              }"
              @click="toggleMilestoneStatus(milestone.title)"
            >
              <div class="milestone-icon">
                {{ getMilestoneIcon(milestone.title) }}
              </div>
              <div class="milestone-title">{{ milestone.title }}</div>
              <div class="milestone-status">
                <el-icon
                  v-if="babyStore.isMilestoneCompleted(milestone.title)"
                  class="check-icon"
                >
                  <Check />
                </el-icon>
              </div>
            </div>
          </div>

          <!-- 查看更多入口 -->
          <div
            v-if="currentMonthData.milestones?.length > 6 && !showAllMilestones"
            class="view-more-milestones"
            @click="goToDetail(babyStore.currentMonth)"
          >
            <span>
              查看全部 {{ currentMonthData.milestones.length }} 个里程碑
            </span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="current-actions">
          <el-button
            type="primary"
            size="large"
            round
            @click="goToDetail(babyStore.currentMonth)"
            class="detail-btn"
          >
            <span>查看详细指南</span>
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
          <el-button
            size="large"
            round
            @click="goToTimeline"
            class="timeline-btn"
          >
            <el-icon><Calendar /></el-icon>
            <span>查看成长时间轴</span>
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 月龄选择网格 -->
    <div class="months-section" id="months-section">
      <div class="section-header">
        <h2>
          <span class="icon-wrapper">📅</span>
          全部月龄阶段
        </h2>
        <p class="section-desc">探索宝宝0-12个月的成长历程</p>
      </div>

      <!-- 月龄分类导航 -->
      <div class="month-category-tabs">
        <el-radio-group v-model="selectedCategory" size="large">
          <el-radio-button value="all">全部阶段</el-radio-button>
          <el-radio-button value="newborn">新生儿期 (0-3月)</el-radio-button>
          <el-radio-button value="infant">婴儿期 (4-6月)</el-radio-button>
          <el-radio-button value="older">较大婴儿 (7-9月)</el-radio-button>
          <el-radio-button value="toddler">学步期 (10-12月)</el-radio-button>
        </el-radio-group>
      </div>

      <div class="months-grid">
        <div
          v-for="(monthData, index) in filteredMonthsData"
          :key="monthData.month"
          class="month-card-wrapper"
          :class="{ 'is-current': monthData.month === babyStore.currentMonth }"
          :style="{ animationDelay: `${index * 0.03}s` }"
          @click="goToDetail(monthData.month)"
        >
          <!-- 当前标记 -->
          <div
            v-if="monthData.month === babyStore.currentMonth"
            class="current-marker"
          >
            <span class="marker-icon">⭐</span>
            <span class="marker-text">当前</span>
          </div>

          <div class="month-card-inner">
            <!-- 月龄标识 -->
            <div class="month-header">
              <div class="month-number">{{ monthData.month }}</div>
              <div class="month-label">月龄</div>
            </div>

            <!-- 阶段名称 -->
            <div class="month-stage-name">
              {{ monthData.title.replace(/[（(].*?[)）]/g, '') }}
            </div>

            <!-- 行为简述 -->
            <div class="month-description" v-if="monthData.summary">
              {{ getBriefDescription(monthData) }}
            </div>

            <!-- 里程碑进度条 -->
            <div class="month-milestone-progress" v-if="monthData.milestones">
              <div class="progress-info">
                <span class="progress-label">已完成</span>
                <span
                  class="progress-fraction"
                  :class="{
                    'has-progress': getCompletedMilestones(monthData) > 0,
                  }"
                >
                  {{ getCompletedMilestones(monthData) }}/{{
                    monthData.milestones.length
                  }}
                </span>
              </div>
              <div class="progress-bar-wrapper">
                <div
                  class="progress-bar-fill"
                  :style="{ width: getMilestoneProgress(monthData) + '%' }"
                ></div>
              </div>
            </div>

            <!-- 体格参考数据 -->
            <div class="month-physical-data">
              <div class="data-item">
                <span class="data-icon">⚖️</span>
                <span class="data-text">{{ getWeightShort(monthData) }}</span>
              </div>
              <div class="data-item">
                <span class="data-icon">📏</span>
                <span class="data-text">{{ getHeightShort(monthData) }}</span>
              </div>
            </div>

            <!-- 关键能力标签 -->
            <div class="month-abilities" v-if="monthData.milestones?.length">
              <span
                v-for="(m, idx) in monthData.milestones.slice(0, 3)"
                :key="idx"
                class="ability-tag"
                :class="{ completed: babyStore.isMilestoneCompleted(m.title) }"
              >
                {{ m.title }}
              </span>
              <span v-if="monthData.milestones.length > 3" class="ability-more">
                +{{ monthData.milestones.length - 3 }}
              </span>
            </div>

            <!-- 查看详情按钮 -->
            <div class="month-action">
              <span>查看详情</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷功能卡片 -->
    <div class="quick-actions" id="quick-actions">
      <div class="section-header">
        <h2>
          <span class="icon-wrapper">⚡</span>
          快捷功能
        </h2>
        <p class="section-desc">便捷工具助您育儿更轻松</p>
      </div>

      <!-- 功能分类标签 -->
      <div class="function-tags">
        <el-tag
          v-for="tag in functionTags"
          :key="tag.id"
          :type="tag.type"
          size="large"
          effect="plain"
          class="function-tag"
        >
          <span class="tag-icon">{{ tag.icon }}</span>
          <span>{{ tag.label }}</span>
        </el-tag>
      </div>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div
            class="action-card timeline-card"
            @click="router.push('/timeline')"
          >
            <div class="action-icon">
              <el-icon :size="48"><Timer /></el-icon>
            </div>
            <div class="action-content">
              <h3>成长时间轴</h3>
              <p class="action-desc">可视化查看0-12个月发育关键节点</p>
              <p class="action-value">
                ✨ 已收录 {{ totalMilestones }} 个发育里程碑
              </p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div
            class="action-card checklist-card"
            @click="router.push('/checklist')"
          >
            <div class="action-icon">
              <el-icon :size="48"><List /></el-icon>
            </div>
            <div class="action-content">
              <h3>成长清单</h3>
              <p class="action-desc">追踪记录宝宝能力发展进度</p>
              <p class="action-value">
                📝 已完成 {{ babyStore.completedMilestonesCount }} 项
              </p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div
            class="action-card vaccine-card"
            @click="router.push('/vaccine')"
          >
            <div class="action-icon vaccine-icon">
              <span>💉</span>
            </div>
            <div class="action-content">
              <h3>疫苗接种</h3>
              <p class="action-desc">智能提醒，不错过接种时间</p>
              <p class="action-value">🛡️ 守护宝宝健康第一步</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card growth-card" @click="router.push('/growth')">
            <div class="action-icon growth-icon">
              <span>📈</span>
            </div>
            <div class="action-content">
              <h3>成长曲线</h3>
              <p class="action-desc">对比WHO标准，科学评估发育</p>
              <p class="action-value">📊 一目了然的成长轨迹</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card diary-card" @click="router.push('/diary')">
            <div class="action-icon diary-icon">
              <span>📔</span>
            </div>
            <div class="action-content">
              <h3>育儿日记</h3>
              <p class="action-desc">记录珍贵时刻，留住美好回忆</p>
              <p class="action-value">💝 宝宝的专属成长册</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <div class="action-card knowledge-card">
            <div class="action-icon knowledge-icon">
              <span>📚</span>
            </div>
            <div class="action-content">
              <h3>育儿知识库</h3>
              <p class="action-desc">专业育儿知识随时查阅</p>
              <p class="action-value">🎓 新手爸爸的百科全书</p>
            </div>
            <el-tag type="warning" size="small">即将上线</el-tag>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 育儿小贴士 -->
    <div class="tips-section" id="tips-section">
      <div class="section-header">
        <h2>
          <span class="icon-wrapper">💡</span>
          每日育儿小贴士
        </h2>
        <p class="section-desc">科学育儿，从这里开始</p>
      </div>

      <!-- 小贴士分类 -->
      <div class="tips-category-filter">
        <el-button
          v-for="category in tipCategories"
          :key="category.value"
          :type="selectedTipCategory === category.value ? 'primary' : ''"
          size="small"
          round
          @click="selectedTipCategory = category.value"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span>{{ category.label }}</span>
        </el-button>
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
                  <div class="tip-category">
                    {{ tip.category || '育儿贴士' }}
                  </div>
                  <h3 class="tip-title-large">{{ tip.title }}</h3>
                  <p class="tip-desc-large">{{ tip.content }}</p>

                  <div class="tip-footer">
                    <div class="tip-tags">
                      <span
                        class="tip-tag"
                        v-for="(tag, idx) in (tip.tags || ['实用', '科学'])"
                        :key="idx"
                      >
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
          <el-input
            v-model="babyForm.name"
            placeholder="给宝宝取一个可爱的昵称吧"
            size="large"
          >
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
            style="width: 100%;"
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
        <el-button @click="showBabyInfoDialog = false" size="large">
          取消
        </el-button>
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
import {
  Timer,
  List,
  User,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  TrendCharts,
  Histogram,
  Reading,
  FirstAidKit,
  Notebook,
  Calendar,
  HomeFilled,
  Close,
  Menu,
  Grid,
  Collection,
  Setting,
  Edit,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { BabyMonthData } from '@/types/baby'

const router = useRouter()
const babyStore = useBabyStore()

const showBabyInfoDialog = ref(false)
const showSidebar = ref(false)
const selectedCategory = ref('all')
const selectedTipCategory = ref('all')
const showAllMilestones = ref(false)

const babyForm = ref({
  name: '宝宝',
  birthday: new Date(),
  gender: 'unknown' as 'boy' | 'girl' | 'unknown',
})

// 月龄分类
const monthCategories = [
  { id: 'newborn', label: '新生儿期', icon: '👶', range: [0, 3], count: 4 },
  { id: 'infant', label: '婴儿期', icon: '🍼', range: [4, 6], count: 3 },
  { id: 'older', label: '较大婴儿', icon: '🧸', range: [7, 9], count: 3 },
  { id: 'toddler', label: '学步期', icon: '👣', range: [10, 12], count: 3 },
]

// 功能分类
const functionCategories = [
  { path: '/timeline', label: '成长时间轴', icon: '⏰' },
  { path: '/checklist', label: '成长清单', icon: '✅' },
  { path: '/vaccine', label: '疫苗接种', icon: '💉' },
  { path: '/growth', label: '成长曲线', icon: '📈' },
  { path: '/diary', label: '育儿日记', icon: '📔' },
]

// 内容分类
const contentCategories = [
  { id: 'months-section', label: '月龄阶段', icon: '📅' },
  { id: 'quick-actions', label: '快捷功能', icon: '⚡' },
  { id: 'tips-section', label: '育儿小贴士', icon: '💡' },
]

// 功能标签
const functionTags = [
  { id: 'record', label: '记录追踪', icon: '📝', type: 'success' },
  { id: 'health', label: '健康管理', icon: '🏥', type: 'warning' },
  { id: 'learn', label: '学习成长', icon: '📚', type: 'primary' },
  { id: 'tools', label: '实用工具', icon: '🔧', type: 'info' },
]

// 小贴士分类
const tipCategories = [
  { value: 'all', label: '全部', icon: '🌟' },
  { value: 'feeding', label: '喂养', icon: '🍼' },
  { value: 'sleep', label: '睡眠', icon: '😴' },
  { value: 'care', label: '护理', icon: '🛁' },
  { value: 'play', label: '互动', icon: '🎮' },
  { value: 'safety', label: '安全', icon: '⚠️' },
]

const currentMonthData = computed(() => babyStore.currentMonthData)

// 下个月龄数据（用于预告）
const nextMonthData = computed(() => {
  const nextMonth = babyStore.currentMonth + 1
  if (nextMonth > 12) return null
  return babyStore.allMonthsData.find(
    (m: BabyMonthData) => m.month === nextMonth,
  )
})

const totalMilestones = computed(() => {
  return babyStore.allMonthsData.reduce(
    (sum: number, month: BabyMonthData) => sum + month.milestones.length,
    0,
  )
})

// 过滤后的月龄数据
const filteredMonthsData = computed(() => {
  if (selectedCategory.value === 'all') {
    return babyStore.allMonthsData
  }

  const category = monthCategories.find((c) => c.id === selectedCategory.value)
  if (!category?.range || category.range.length < 2)
    return babyStore.allMonthsData

  const [min = 0, max = 12] = category.range
  return babyStore.allMonthsData.filter(
    (month: BabyMonthData) => month.month >= min && month.month <= max,
  )
})

// 滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    showSidebar.value = false
  }
}

const dailyTips = [
  {
    icon: '🍼',
    title: '喂养小贴士',
    content:
      '母乳是宝宝最好的食物，按需喂养能帮助建立良好的供需关系。建议新生儿每2-3小时喂一次，每次10-20分钟。',
    type: 'feeding',
    category: '科学喂养',
    tags: ['母乳喂养', '按需哺乳'],
  },
  {
    icon: '😴',
    title: '睡眠小贴士',
    content:
      '建立规律的睡前仪式，帮助宝宝区分白天和夜晚。可以通过洗澡、换睡衣、讲故事等方式，让宝宝慢慢进入睡眠状态。',
    type: 'sleep',
    category: '健康睡眠',
    tags: ['睡眠习惯', '作息规律'],
  },
  {
    icon: '🛁',
    title: '护理小贴士',
    content:
      '新生儿洗澡水温保持在37-38°C，每次洗澡时间不超过10分钟。注意保持脐部干燥，避免感染。',
    type: 'care',
    category: '日常护理',
    tags: ['洗澡技巧', '脐带护理'],
  },
  {
    icon: '🎮',
    title: '互动小贴士',
    content:
      '多和宝宝说话、唱歌，有助于宝宝的语言发展和情感联结。每天抽出固定时间进行亲子互动游戏。',
    type: 'play',
    category: '亲子互动',
    tags: ['语言发展', '情感培养'],
  },
  {
    icon: '⚠️',
    title: '安全小贴士',
    content:
      '宝宝睡觉时保持仰卧姿势，床上不放置枕头和毛绒玩具。确保婴儿床符合安全标准，护栏间隙小于6厘米。',
    type: 'safety',
    category: '安全防护',
    tags: ['睡眠安全', '防护措施'],
  },
]

const goToDetail = (month: number) => {
  babyStore.setCurrentMonth(month)
  router.push(`/month/${month}`)
}

const goToTimeline = () => {
  router.push('/timeline')
}

const getWelcomeMessage = () => {
  const name = babyStore.babyInfo.name
  const month = babyStore.currentMonth
  if (month === 0) {
    return `欢迎来到${name}的成长之旅`
  }
  return `${name}，${month}个月啦！`
}

// 获取当前阶段描述
const getStageDescription = () => {
  const month = babyStore.currentMonth
  if (month <= 1) return '正处于新生儿期，需要特别呵护'
  if (month <= 3) return '正在快速成长，开始对世界充满好奇'
  if (month <= 6) return '活动能力增强，互动更加丰富'
  if (month <= 9) return '开始尝试独立，探索欲旺盛'
  if (month <= 12) return '即将迎来周岁，能力提升飞快'
  return '成长进入新阶段'
}

// 获取下个月龄的关键能力预告
const getNextMonthAbilities = () => {
  if (!nextMonthData.value?.milestones) return ''
  const abilities = nextMonthData.value.milestones
    .slice(0, 3)
    .map((m) => m.title)
  return abilities.join('、')
}

// 获取当前月龄已完成的里程碑数量
const getCompletedMilestonesForMonth = () => {
  if (!currentMonthData.value?.milestones) return 0
  return currentMonthData.value.milestones.filter((m) =>
    babyStore.isMilestoneCompleted(m.title),
  ).length
}

// 切换里程碑状态
const toggleMilestoneStatus = (title: string) => {
  babyStore.toggleMilestone(title)
}

const getMilestoneIcon = (title: string) => {
  const iconMap: Record<string, string> = {
    抬头: '👀',
    追视: '👁️',
    微笑: '😊',
    翻身: '🔄',
    坐: '🪑',
    爬: '🐛',
    站: '🧍',
    走: '👣',
    说话: '🗣️',
    抓握: '✋',
    视觉: '👁️',
    听觉: '👂',
    触觉: '👋',
  }

  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon
  }
  return '✨'
}

const getMonthProgress = (monthData: BabyMonthData) => {
  if (!monthData.milestones) return 0
  return monthData.milestones.length
}

// 获取月龄行为简述（口语化）
const getBriefDescription = (monthData: BabyMonthData) => {
  const summaryMap: Record<number, string> = {
    0: '新生宝宝，适应新环境',
    1: '开始对周围反应增多',
    2: '互动增加，睡眠减少',
    3: '能认出熟悉的脸',
    4: '笑声更多，好奇心强',
    5: '主动探索，抓握有力',
    6: '准备添加辅食了',
    7: '能独坐，喜欢拍打',
    8: '爬行探索，更加独立',
    9: '扶站，理解简单指令',
    10: '能站立，模仿能力强',
    11: '迈出人生第一步',
    12: '周岁啦，成长飞速',
  }
  return (
    summaryMap[monthData.month] || monthData.summary?.substring(0, 20) + '...'
  )
}

// 获取已完成里程碑数量
const getCompletedMilestones = (monthData: BabyMonthData) => {
  if (!monthData.milestones) return 0
  return monthData.milestones.filter((m) =>
    babyStore.isMilestoneCompleted(m.title),
  ).length
}

// 获取里程碑完成百分比
const getMilestoneProgress = (monthData: BabyMonthData) => {
  if (!monthData.milestones || monthData.milestones.length === 0) return 0
  const completed = getCompletedMilestones(monthData)
  return Math.round((completed / monthData.milestones.length) * 100)
}

// 获取体重简写（用于卡片展示）
const getWeightShort = (monthData: BabyMonthData) => {
  const weight = monthData.physicalDevelopment?.weight || ''
  // 提取数字范围，如 "4.3-7.1kg" 或 "约4.3kg"
  const match = weight.match(/[\d.]+[-~]?[\d.]*/)
  if (match) {
    return match[0] + 'kg'
  }
  return weight.substring(0, 10)
}

// 获取身高简写（用于卡片展示）
const getHeightShort = (monthData: BabyMonthData) => {
  const height = monthData.physicalDevelopment?.height || ''
  // 提取数字范围，如 "54-60cm" 或 "约55cm"
  const match = height.match(/[\d.]+[-~]?[\d.]*/)
  if (match) {
    return match[0] + 'cm'
  }
  return height.substring(0, 10)
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
/* 侧边栏快速导航 */
.sidebar-nav {
  position: fixed;
  right: 0;
  top: 0;
  width: 320px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow-y: auto;
  padding: 24px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  font-size: 20px;
  color: #6b7280;
}

.sidebar-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nav-section {
  background: linear-gradient(135deg, #faf5ff 0%, #f3f4f6 100%);
  border-radius: 16px;
  padding: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-item:hover {
  border-color: #a78bfa;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.2);
}

.item-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.item-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.item-count {
  font-size: 12px;
  padding: 2px 8px;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  border-radius: 10px;
  font-weight: 600;
}

/* 浮动导航按钮 */
.floating-nav-btn {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 998;
  width: 56px;
  height: 56px;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
  font-size: 24px;
}

.floating-nav-btn:hover {
  transform: translateY(-50%) scale(1.1);
}

/* 侧边栏动画 */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 月龄分类标签 */
.month-category-tabs {
  padding: 0 24px;
  margin-bottom: 24px;
  overflow-x: auto;
}

.month-category-tabs :deep(.el-radio-group) {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.month-category-tabs :deep(.el-radio-button__inner) {
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  background: white;
  transition: all 0.3s ease;
}

.month-category-tabs
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  border-color: #7c3aed;
  color: white;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

/* 功能标签 */
.function-tags {
  padding: 0 24px;
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.function-tag {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.function-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tag-icon {
  margin-right: 6px;
  font-size: 16px;
}

/* 小贴士分类过滤 */
.tips-category-filter {
  padding: 0 24px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.tips-category-filter :deep(.el-button) {
  padding: 8px 18px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tips-category-filter .category-icon {
  margin-right: 6px;
  font-size: 16px;
}

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
  background: radial-gradient(
      circle at 20% 30%,
      rgba(102, 126, 234, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(240, 147, 251, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 50% 50%,
      rgba(79, 172, 254, 0.05) 0%,
      transparent 50%
    );
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
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.05) 70%,
    transparent 100%
  );
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
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.25));
  display: inline-block;
}

@keyframes emojiFloat {
  0%,
  100% {
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
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 16px;
  margin-bottom: 22px;
  opacity: 0.95;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
  cursor: pointer;
}

.stat-item:hover {
  transform: scale(1.08) translateY(-4px);
  background: rgba(255, 255, 255, 0.25);
}

/* 主要数据卡片突出样式 */
.stat-item.stat-primary {
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  position: relative;
  padding: 10px 20px;
}

.stat-item.stat-primary .stat-number {
  font-size: 32px;
}

.stat-arrow {
  font-size: 14px;
  margin-top: 2px;
  opacity: 0.8;
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-arrow {
  transform: translateX(4px);
}

.stat-number {
  font-size: 26px;
  font-weight: 800;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
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
  background: rgba(255, 255, 255, 0.3);
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

.hero-buttons :deep(.el-button:hover) {
  transform: translateY(-4px) scale(1.05);
}

.setup-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setup-btn :deep(.el-icon) {
  font-size: 18px;
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

.explore-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.explore-arrow {
  transition: transform 0.3s ease;
}

.explore-btn:hover .explore-arrow {
  transform: translateX(4px);
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
  0%,
  100% {
    transform: translateY(0) rotate(-5deg) scale(1);
  }
  25% {
    transform: translateY(-6px) rotate(5deg) scale(1.1);
  }
  50% {
    transform: translateY(0) rotate(-5deg) scale(1);
  }
  75% {
    transform: translateY(-4px) rotate(5deg) scale(1.08);
  }
}

.section-desc {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

/* 当前月龄卡片 - 全新设计 */
.current-section {
  padding: 0 24px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.current-month-card-enhanced {
  border-radius: 28px !important;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #faf5ff 100%) !important;
  border: 3px solid #a78bfa !important;
  box-shadow: 0 20px 60px rgba(167, 139, 250, 0.25),
    0 0 0 1px rgba(167, 139, 250, 0.1) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
}

.current-month-card-enhanced:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 28px 80px rgba(167, 139, 250, 0.35),
    0 0 0 1px rgba(167, 139, 250, 0.2) !important;
}

/* 顶部标记 - 优化设计 */
.current-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  font-weight: 600;
}

.badge-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-icon {
  font-size: 22px;
  animation: pulse 2s ease-in-out infinite;
}

.badge-text {
  font-size: 15px;
  letter-spacing: 0.5px;
}

.badge-right {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.badge-right:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.02);
}

.badge-stage {
  font-size: 14px;
  font-weight: 700;
}

.edit-icon {
  font-size: 14px;
  opacity: 0.8;
}

/* 欢迎语 */
.welcome-section {
  padding: 24px 24px 16px;
  text-align: center;
}

.welcome-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.emoji-wave {
  font-size: 28px;
  display: inline-block;
  animation: wave 1.5s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-15deg);
  }
}

.welcome-subtitle {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

.welcome-subtitle strong {
  color: #7c3aed;
  font-weight: 700;
}

/* 下个月龄预告 */
.next-month-preview {
  margin: 0 24px 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%);
  border-radius: 16px;
  border: 2px dashed #f59e0b;
  position: relative;
  overflow: hidden;
}

.next-month-preview::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    transform: translateX(-30%) translateY(30%);
  }
  50% {
    transform: translateX(30%) translateY(-30%);
  }
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.preview-icon {
  font-size: 20px;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.preview-title {
  font-size: 14px;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.preview-month {
  font-size: 18px;
  font-weight: 800;
  color: #78350f;
}

.preview-abilities {
  font-size: 14px;
  color: #92400e;
  font-weight: 500;
}

/* 发育数据卡片 - 统一设计 */
.development-data {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 24px 24px;
}

.data-card {
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.data-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.data-card:hover {
  transform: translateY(-4px);
}

.data-card:hover::before {
  opacity: 1;
}

.weight-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.height-card {
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
}

.data-icon-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.data-icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.data-badge {
  font-size: 10px;
  font-weight: 700;
  color: #7c3aed;
  background: white;
  padding: 2px 8px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.weight-card .data-badge {
  color: #d97706;
}

.height-card .data-badge {
  color: #7c3aed;
}

.data-content {
  flex: 1;
  z-index: 1;
}

.data-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-value {
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
}

/* 关键里程碑 - 增强设计 */
.key-milestones {
  padding: 0 24px 24px;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-left h3,
.milestone-title-with-tip {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: help;
}

.tip-icon {
  font-size: 14px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.milestone-title-with-tip:hover .tip-icon {
  opacity: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.milestone-progress {
  font-size: 14px;
  font-weight: 700;
  color: #7c3aed;
  background: #f3e8ff;
  padding: 4px 12px;
  border-radius: 20px;
}

.expand-btn {
  font-size: 13px;
  color: #6b7280;
}

.expand-btn:hover {
  color: #7c3aed;
}

.milestone-subtitle {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
}

.milestone-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.milestone-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px 12px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.milestone-card:hover {
  border-color: #a78bfa;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(167, 139, 250, 0.2);
}

.milestone-card.completed {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
}

.milestone-card:active {
  transform: scale(0.98);
}

.milestone-icon {
  font-size: 32px;
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.milestone-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.milestone-status {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: #10b981;
  font-size: 18px;
  font-weight: bold;
}

/* 查看更多里程碑入口 */
.view-more-milestones {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 600;
  color: #7c3aed;
}

.view-more-milestones:hover {
  background: linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%);
  transform: translateY(-2px);
}

.view-more-milestones .el-icon {
  transition: transform 0.3s ease;
}

.view-more-milestones:hover .el-icon {
  transform: translateX(4px);
}

/* 底部操作按钮 */
.current-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
  flex-wrap: wrap;
}

.detail-btn {
  flex: 1;
  min-width: 200px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
  border: none !important;
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
}

.detail-btn:hover {
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.timeline-btn {
  flex: 1;
  min-width: 160px;
  height: 50px;
  font-size: 15px;
  font-weight: 600;
  background: white !important;
  border: 2px solid #e5e7eb !important;
  color: #6b7280 !important;
}

.timeline-btn:hover {
  border-color: #a78bfa !important;
  color: #7c3aed !important;
  background: #faf5ff !important;
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

/* 月龄网格 - 全新设计 */
.months-section {
  padding: 0 24px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

/* 月龄卡片网格 - PC端固定6列 */
.months-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.month-card-wrapper {
  position: relative;
  animation: monthFadeIn 0.5s ease forwards;
  opacity: 0;
}

.month-card-wrapper.is-current {
  z-index: 2;
}

.month-card-wrapper.is-current .month-card-inner {
  border: 3px solid #7c3aed;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.25);
}

.month-card-inner {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 280px;
}

.month-card-inner:hover {
  border-color: #a78bfa;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(167, 139, 250, 0.2);
}

/* 月龄头部 */
.month-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
}

.current-marker {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 3px;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
  z-index: 10;
  animation: pulse 2s ease-in-out infinite;
}

.marker-icon {
  font-size: 12px;
}

.marker-text {
  letter-spacing: 0.3px;
}

/* 月龄标识 */
.month-number {
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.month-label {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 阶段名称 */
.month-stage-name {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 行为简述 */
.month-description {
  font-size: 11px;
  color: #6b7280;
  line-height: 1.4;
  padding: 6px 8px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 8px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 体格数据 */
.month-physical-data {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.month-physical-data .data-item {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  color: #92400e;
}

.month-physical-data .data-icon {
  font-size: 12px;
  line-height: 1;
}

.month-physical-data .data-text {
  white-space: nowrap;
  font-size: 10px;
}

/* 关键能力标签 */
.month-abilities {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  margin-top: auto;
}

.ability-tag {
  font-size: 9px;
  padding: 3px 6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.ability-tag.completed {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: #86efac;
  color: #166534;
}

.ability-more {
  font-size: 9px;
  padding: 3px 6px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #9ca3af;
  font-weight: 600;
}

/* 查看详情按钮 */
.month-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: #7c3aed;
  font-weight: 600;
  padding-top: 8px;
  margin-top: auto;
  border-top: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.month-action:hover {
  color: #6d28d9;
}

.month-action .el-icon {
  font-size: 12px;
  transition: transform 0.2s ease;
}

.month-card-inner:hover .month-action .el-icon {
  transform: translateX(3px);
}

/* 里程碑进度 */
.month-milestone-progress {
  padding: 6px 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.progress-label {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}

.progress-fraction {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
}

.progress-fraction.has-progress {
  color: #7c3aed;
}

/* 进度条 */
.progress-bar-wrapper {
  width: 100%;
  height: 5px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e 0%, #10b981 50%, #059669 100%);
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 当前月龄卡片特殊样式 */
.month-card-wrapper.is-current .month-card-inner {
  border-width: 3px;
}

.month-card-wrapper.is-current .progress-bar-fill {
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  box-shadow: 0 0 6px rgba(124, 58, 237, 0.5);
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

.action-content .action-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.action-content .action-value {
  font-size: 12px;
  color: #7c3aed;
  font-weight: 600;
  margin: 0;
  padding: 6px 10px;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border-radius: 8px;
  display: inline-block;
}

.action-content p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* 差异化图标样式 */
.vaccine-icon,
.growth-icon,
.diary-icon,
.knowledge-icon {
  font-size: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.vaccine-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.growth-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.diary-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.knowledge-icon {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
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
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 100%
  );
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
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -20px) scale(1.1);
  }
}

@keyframes tipCircleRotate {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
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
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.05);
  }
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
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.5;
  }
}

.icon-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.2) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  animation: iconPulseAnim 2s ease-in-out infinite;
}

@keyframes iconPulseAnim {
  0%,
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0;
  }
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
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 响应式设计 - 移动端优化 */
@media (max-width: 768px) {
  .home-view {
    padding-bottom: 80px; /* 为底部导航留空间 */
  }

  .hero-section {
    padding: 24px 16px;
    border-radius: 0 0 24px 24px;
    margin-bottom: 16px;
  }

  .hero-emoji {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .hero-title {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .hero-stats {
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .stat-item {
    padding: 10px 16px;
    min-width: calc(50% - 8px);
    flex: 1 1 calc(50% - 8px);
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }

  .section-header {
    padding: 0 16px;
    margin-bottom: 16px;
  }

  .section-header h2 {
    font-size: 20px;
  }

  .icon-wrapper {
    font-size: 22px;
    width: 36px;
    height: 36px;
  }

  .section-desc {
    font-size: 13px;
  }

  .current-section,
  .months-section,
  .quick-actions,
  .tips-section {
    padding: 0 12px;
    margin-bottom: 24px;
  }

  .month-info {
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 16px;
  }

  .month-badge {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
  }

  .month-num {
    font-size: 28px;
  }

  .month-details {
    flex: 1;
    min-width: 0;
  }

  .month-details h3 {
    font-size: 18px;
    margin-bottom: 4px;
  }

  .month-stage {
    font-size: 13px;
  }

  /* 平板端4列布局 */
  .months-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .month-card-inner {
    padding: 12px 8px;
    min-height: 260px;
  }

  .month-number {
    font-size: 28px;
  }

  .month-label {
    font-size: 9px;
  }

  .month-stage-name {
    font-size: 11px;
    min-height: 30px;
  }

  .month-description {
    font-size: 10px;
    padding: 5px 6px;
    min-height: 32px;
  }

  .month-physical-data .data-item {
    padding: 3px 6px;
    font-size: 9px;
  }

  .month-physical-data .data-icon {
    font-size: 10px;
  }

  .month-physical-data .data-text {
    font-size: 9px;
  }

  .ability-tag {
    font-size: 8px;
    padding: 2px 5px;
  }

  .ability-more {
    font-size: 8px;
    padding: 2px 5px;
  }

  .month-action {
    font-size: 10px;
    padding-top: 6px;
  }

  .progress-label {
    font-size: 9px;
  }

  .progress-fraction {
    font-size: 10px;
  }

  .current-marker {
    padding: 3px 8px;
    font-size: 10px;
    top: -6px;
    right: -6px;
  }

  /* 移动端面包屑 */
  .breadcrumb-nav {
    padding: 12px 16px;
  }

  .breadcrumb-nav :deep(.el-breadcrumb__item) {
    font-size: 13px;
  }

  /* 移动端侧边栏 */
  .sidebar-nav {
    width: 85%;
    max-width: 300px;
  }

  .sidebar-header h3 {
    font-size: 18px;
  }

  /* 移动端浮动按钮 */
  .floating-nav-btn {
    right: 16px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  /* 移动端分类标签 */
  .month-category-tabs {
    padding: 0 12px;
    margin-bottom: 16px;
  }

  .month-category-tabs :deep(.el-radio-button__inner) {
    padding: 8px 14px;
    font-size: 12px;
  }

  .function-tags {
    padding: 0 12px;
  }

  .function-tag {
    padding: 6px 12px;
    font-size: 12px;
  }

  .tips-category-filter {
    padding: 0 12px;
  }

  .tips-category-filter :deep(.el-button) {
    padding: 6px 12px;
    font-size: 12px;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .action-card {
    padding: 16px 12px;
  }

  .action-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .action-title {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .action-desc {
    font-size: 12px;
  }

  .tips-grid {
    gap: 12px;
  }

  .tip-card {
    padding: 16px;
  }

  .tip-icon {
    font-size: 28px;
  }

  .tip-title {
    font-size: 14px;
  }

  .tip-content {
    font-size: 13px;
  }
}

/* 小屏手机优化 */
@media (max-width: 480px) {
  .hero-section {
    padding: 20px 12px;
  }

  .hero-title {
    font-size: 22px;
  }

  .stat-item {
    padding: 8px 12px;
    min-width: 100%;
    flex: 1 1 100%;
  }

  /* 手机端3列布局 */
  .months-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .month-card-inner {
    padding: 10px 6px;
    min-height: 220px;
    border-radius: 12px;
  }

  .month-number {
    font-size: 24px;
  }

  .month-label {
    font-size: 8px;
  }

  .month-stage-name {
    font-size: 10px;
    min-height: 26px;
  }

  .month-description {
    font-size: 9px;
    padding: 4px 5px;
    min-height: 28px;
    border-radius: 6px;
  }

  .month-physical-data {
    gap: 4px;
  }

  .month-physical-data .data-item {
    padding: 2px 5px;
    font-size: 8px;
    border-radius: 4px;
  }

  .month-physical-data .data-icon {
    font-size: 9px;
  }

  .month-physical-data .data-text {
    font-size: 8px;
  }

  .ability-tag {
    font-size: 7px;
    padding: 2px 4px;
    border-radius: 6px;
  }

  .ability-more {
    font-size: 7px;
    padding: 2px 4px;
  }

  .month-action {
    font-size: 9px;
    padding-top: 4px;
  }

  .month-action .el-icon {
    font-size: 10px;
  }

  .progress-bar-wrapper {
    height: 4px;
  }

  .progress-label {
    font-size: 8px;
  }

  .progress-fraction {
    font-size: 9px;
  }

  .current-marker {
    padding: 2px 6px;
    font-size: 8px;
    top: -4px;
    right: -4px;
    border-radius: 8px;
  }

  .marker-icon {
    font-size: 10px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .action-card {
    flex-direction: row;
    align-items: center;
    text-align: left;
    padding: 14px;
  }

  .action-icon {
    margin-bottom: 0;
    margin-right: 12px;
  }

  .action-content {
    flex: 1;
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
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes floatShape {
  0%,
  100% {
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

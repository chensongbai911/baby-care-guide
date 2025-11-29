<template>
  <div class="diary-view">
    <!-- 页面头部 - 增强版 -->
    <div class="page-header">
      <div class="header-content">
        <el-button class="back-btn" @click="router.back()" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-info">
          <h1>📔 育儿日记</h1>
          <p>记录宝宝成长的点点滴滴</p>
        </div>
        <!-- 连续记录徽章 -->
        <div v-if="streakDays > 0" class="streak-badge">
          <span class="streak-icon">🔥</span>
          <span class="streak-num">{{ streakDays }}</span>
          <span class="streak-label">天连续</span>
        </div>
      </div>

      <!-- 今日写作提示 -->
      <div class="daily-prompt" v-if="!hasWrittenToday">
        <div class="prompt-content">
          <span class="prompt-icon">💡</span>
          <span class="prompt-text">{{ dailyPrompt }}</span>
        </div>
        <el-button
          size="small"
          type="primary"
          round
          @click="openNewDiaryWithPrompt"
        >
          记录一下
        </el-button>
      </div>
      <div class="daily-prompt written" v-else>
        <span class="prompt-icon">✅</span>
        <span class="prompt-text">今天已记录，继续保持！</span>
      </div>
    </div>

    <!-- 统计概览 - 增强版 -->
    <div class="stats-section">
      <!-- 统计时间切换 -->
      <div class="stats-tabs">
        <span
          :class="['stats-tab', { active: statsRange === 'week' }]"
          @click="statsRange = 'week'"
        >
          本周
        </span>
        <span
          :class="['stats-tab', { active: statsRange === 'month' }]"
          @click="statsRange = 'month'"
        >
          本月
        </span>
        <span
          :class="['stats-tab', { active: statsRange === 'all' }]"
          @click="statsRange = 'all'"
        >
          全部
        </span>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-icon">📝</span>
          <span class="stat-num">{{ rangeStats.entries }}</span>
          <span class="stat-label">篇日记</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📷</span>
          <span class="stat-num">{{ rangeStats.photos }}</span>
          <span class="stat-label">张照片</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⭐</span>
          <span class="stat-num">{{ rangeStats.favorites }}</span>
          <span class="stat-label">精选</span>
        </div>
        <div class="stat-card highlight">
          <span class="stat-icon">📅</span>
          <span class="stat-num">{{ rangeStats.activeDays }}</span>
          <span class="stat-label">记录天数</span>
        </div>
      </div>

      <!-- 成就徽章 -->
      <div class="achievement-badges" v-if="achievements.length > 0">
        <div
          v-for="badge in achievements"
          :key="badge.id"
          class="achievement-badge"
          :title="badge.description"
        >
          <span class="badge-icon">{{ badge.icon }}</span>
          <span class="badge-name">{{ badge.name }}</span>
        </div>
      </div>
    </div>

    <!-- 写日记按钮 - 增强版 -->
    <div class="add-section">
      <div class="add-buttons">
        <el-button
          type="primary"
          size="large"
          round
          @click="openNewDiary"
          class="main-add-btn"
        >
          <el-icon><EditPen /></el-icon>
          写日记
        </el-button>
        <el-dropdown trigger="click" @command="handleTemplateSelect">
          <el-button size="large" round class="template-btn">
            <el-icon><Document /></el-icon>
            模板
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="daily">📅 日常记录</el-dropdown-item>
              <el-dropdown-item command="milestone">
                🎯 里程碑时刻
              </el-dropdown-item>
              <el-dropdown-item command="firstTime">
                ✨ 第一次体验
              </el-dropdown-item>
              <el-dropdown-item command="health">🏥 健康记录</el-dropdown-item>
              <el-dropdown-item command="growth">📏 成长变化</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 筛选和搜索 - 增强版 -->
    <div class="filter-section">
      <div class="filter-row">
        <el-input
          v-model="searchText"
          placeholder="搜索日记内容..."
          prefix-icon="Search"
          clearable
          class="search-input"
        />
        <el-button
          :type="showAdvancedFilter ? 'primary' : 'default'"
          circle
          @click="showAdvancedFilter = !showAdvancedFilter"
        >
          <el-icon><Filter /></el-icon>
        </el-button>
      </div>

      <!-- 高级筛选 -->
      <transition name="filter-expand">
        <div v-if="showAdvancedFilter" class="advanced-filter">
          <div class="filter-group">
            <label>心情</label>
            <el-select v-model="filterMood" placeholder="全部心情" clearable>
              <el-option label="😊 开心" value="happy" />
              <el-option label="🥰 幸福" value="love" />
              <el-option label="😢 难过" value="sad" />
              <el-option label="😴 疲惫" value="tired" />
              <el-option label="🤔 思考" value="thinking" />
            </el-select>
          </div>
          <div class="filter-group">
            <label>月龄</label>
            <el-select v-model="filterMonth" placeholder="全部月龄" clearable>
              <el-option
                v-for="m in 13"
                :key="m - 1"
                :label="`${m - 1}个月`"
                :value="m - 1"
              />
            </el-select>
          </div>
          <div class="filter-group">
            <label>时间</label>
            <el-date-picker
              v-model="filterDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="default"
              :shortcuts="dateShortcuts"
            />
          </div>
          <div class="filter-group">
            <label>分类</label>
            <div class="filter-tags">
              <el-tag
                v-for="tag in allTags"
                :key="tag"
                :type="filterTags.includes(tag) ? '' : 'info'"
                effect="plain"
                class="filter-tag"
                @click="toggleFilterTag(tag)"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </transition>

      <!-- 快速筛选标签 -->
      <div class="quick-filters">
        <span
          :class="['quick-filter', { active: quickFilter === 'all' }]"
          @click="quickFilter = 'all'"
        >
          全部
        </span>
        <span
          :class="['quick-filter', { active: quickFilter === 'favorite' }]"
          @click="quickFilter = 'favorite'"
        >
          ⭐ 收藏
        </span>
        <span
          :class="['quick-filter', { active: quickFilter === 'photos' }]"
          @click="quickFilter = 'photos'"
        >
          📷 有照片
        </span>
        <span
          :class="['quick-filter', { active: quickFilter === 'milestone' }]"
          @click="quickFilter = 'milestone'"
        >
          🎯 里程碑
        </span>
      </div>
    </div>

    <!-- 日记列表 - 按月份分组 -->
    <div class="diary-list">
      <div v-if="filteredEntries.length === 0" class="empty-state">
        <div class="empty-icon">📔</div>
        <h3>还没有日记</h3>
        <p>记录下宝宝今天的精彩瞬间吧！</p>
        <el-button type="primary" @click="openNewDiary">写第一篇日记</el-button>
      </div>

      <!-- 按月份分组展示 -->
      <div
        v-for="(group, monthKey) in groupedEntries"
        :key="monthKey"
        class="month-group"
      >
        <div class="month-header">
          <span class="month-label">{{ monthKey }}</span>
          <span class="month-count">{{ group.length }}篇</span>
        </div>

        <transition-group name="diary-list" tag="div" class="entries-container">
          <el-card
            v-for="entry in group"
            :key="entry.id"
            class="diary-card"
            :class="{ favorite: entry.isFavorite }"
          >
            <!-- 日记头部 -->
            <div class="diary-header">
              <div class="diary-date">
                <span class="date-day">{{ formatDay(entry.date) }}</span>
                <span class="date-weekday">
                  {{ formatWeekday(entry.date) }}
                </span>
              </div>
              <div class="diary-meta">
                <span class="mood-emoji">{{ getMoodEmoji(entry.mood) }}</span>
                <el-tag size="small" type="info" round>
                  {{ entry.ageMonth }}月龄
                </el-tag>
                <el-tag
                  v-if="entry.isFavorite"
                  size="small"
                  type="warning"
                  effect="dark"
                  round
                >
                  ⭐ 精选
                </el-tag>
              </div>
            </div>

            <!-- 日记标题 -->
            <h3 class="diary-title">{{ entry.title }}</h3>

            <!-- 日记内容预览 -->
            <p class="diary-content">{{ entry.content }}</p>

            <!-- 照片展示 - 优化布局 -->
            <div
              v-if="entry.photos && entry.photos.length > 0"
              class="diary-photos"
            >
              <div
                v-for="(photo, index) in entry.photos.slice(0, 4)"
                :key="index"
                class="photo-item"
                :class="{
                  'photo-last': index === 3 && entry.photos.length > 4,
                }"
                @click="previewPhoto(entry.photos, index)"
              >
                <img :src="photo" alt="日记照片" />
                <div
                  v-if="index === 3 && entry.photos.length > 4"
                  class="photo-more"
                >
                  +{{ entry.photos.length - 4 }}
                </div>
              </div>
            </div>

            <!-- 标签 -->
            <div v-if="entry.tags && entry.tags.length > 0" class="diary-tags">
              <el-tag
                v-for="tag in entry.tags"
                :key="tag"
                size="small"
                effect="plain"
                round
              >
                {{ tag }}
              </el-tag>
            </div>

            <!-- 操作按钮 -->
            <div class="diary-actions">
              <el-button
                text
                :type="entry.isFavorite ? 'warning' : 'default'"
                @click="toggleFavorite(entry)"
              >
                <el-icon><Star /></el-icon>
                {{ entry.isFavorite ? '已收藏' : '收藏' }}
              </el-button>
              <el-button text type="primary" @click="editDiary(entry)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button text type="info" @click="shareDiary(entry)">
                <el-icon><Share /></el-icon>
                分享
              </el-button>
              <el-button text type="danger" @click="deleteDiary(entry)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </el-card>
        </transition-group>
      </div>
    </div>

    <!-- 写日记对话框 -->
    <el-dialog
      v-model="showDiaryDialog"
      :title="editingEntry ? '✏️ 编辑日记' : '📝 写日记'"
      width="600px"
      fullscreen
      class="diary-dialog"
    >
      <el-form :model="diaryForm" label-position="top">
        <el-form-item label="日期">
          <el-date-picker
            v-model="diaryForm.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
            :disabled-date="disabledDate"
          />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="宝宝月龄">
              <el-input-number
                v-model="diaryForm.ageMonth"
                :min="0"
                :max="12"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="今日心情">
              <el-select v-model="diaryForm.mood" style="width: 100%;">
                <el-option label="😊 开心" value="happy" />
                <el-option label="🥰 幸福" value="love" />
                <el-option label="😢 难过" value="sad" />
                <el-option label="😴 疲惫" value="tired" />
                <el-option label="🤔 思考" value="thinking" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标题">
          <el-input
            v-model="diaryForm.title"
            placeholder="给今天取个标题吧..."
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            v-model="diaryForm.content"
            type="textarea"
            :rows="6"
            placeholder="记录宝宝今天的精彩瞬间..."
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="添加照片">
          <div class="photo-upload-area">
            <div
              v-for="(photo, index) in diaryForm.photos"
              :key="index"
              class="uploaded-photo"
            >
              <img :src="photo" alt="上传的照片" />
              <el-button
                class="remove-photo"
                circle
                size="small"
                type="danger"
                @click="removePhoto(index)"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <div class="upload-btn" @click="triggerFileInput">
              <el-icon :size="24"><Plus /></el-icon>
              <span>添加照片</span>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              style="display: none;"
              @change="handleFileSelect"
            />
          </div>
        </el-form-item>

        <el-form-item label="标签">
          <div class="tags-input">
            <el-tag
              v-for="tag in diaryForm.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="showTagInput"
              ref="tagInputRef"
              v-model="newTag"
              size="small"
              style="width: 100px;"
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <el-button v-else size="small" @click="showTagInputFn">
              + 添加标签
            </el-button>
          </div>
          <div class="quick-tags">
            <span
              v-for="tag in quickTags"
              :key="tag"
              class="quick-tag"
              @click="addQuickTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="cancelDiary">取消</el-button>
        <el-button type="primary" @click="saveDiary">
          {{ editingEntry ? '保存修改' : '发布日记' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showImageViewer"
      :url-list="previewImages"
      :initial-index="previewIndex"
      @close="showImageViewer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import {
  ArrowLeft,
  EditPen,
  Edit,
  Delete,
  Star,
  Plus,
  Close,
  Filter,
  Document,
  Share,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const babyStore = useBabyStore()

interface DiaryEntry {
  id: string
  date: Date
  ageMonth: number
  title: string
  content: string
  mood: string
  photos: string[]
  tags: string[]
  isFavorite: boolean
  createdAt: Date
}

interface Achievement {
  id: string
  name: string
  icon: string
  description: string
}

const showDiaryDialog = ref(false)
const editingEntry = ref<DiaryEntry | null>(null)
const searchText = ref('')
const filterMood = ref('')
const filterMonth = ref<number | null>(null)
const filterDateRange = ref<[Date, Date] | null>(null)
const filterTags = ref<string[]>([])
const showAdvancedFilter = ref(false)
const quickFilter = ref('all')
const statsRange = ref<'week' | 'month' | 'all'>('all')
const showTagInput = ref(false)
const newTag = ref('')
const tagInputRef = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const showImageViewer = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

// 每日写作提示
const dailyPrompts = [
  '今天宝宝有什么新的小动作？',
  '宝宝今天吃了什么？睡得好吗？',
  '有没有发现宝宝的小变化？',
  '今天和宝宝一起做了什么有趣的事？',
  '宝宝今天的心情怎么样？',
  '有什么想对宝宝说的话？',
  '今天宝宝有没有让你惊喜的表现？',
  '记录一下宝宝今天的可爱瞬间吧！',
]

// 日记模板
const diaryTemplates: Record<
  string,
  { title: string; content: string; tags: string[] }
> = {
  daily: {
    title: '今日记录',
    content:
      '【今日状态】\n睡眠：\n饮食：\n心情：\n\n【今日亮点】\n\n【妈妈/爸爸想说】\n',
    tags: ['日常'],
  },
  milestone: {
    title: '里程碑时刻 - ',
    content:
      '🎉 今天是个特别的日子！\n\n【里程碑】\n\n【发生时间】\n\n【详细记录】\n\n【当时的心情】\n',
    tags: ['里程碑'],
  },
  firstTime: {
    title: '第一次',
    content:
      '✨ 宝宝的第一次！\n\n【第一次做了什么】\n\n【宝宝的反应】\n\n【我的感受】\n',
    tags: ['第一次'],
  },
  health: {
    title: '健康记录',
    content:
      '🏥 健康记录\n\n【体温】\n【体重】\n【身高】\n\n【今日情况】\n\n【用药/护理】\n\n【注意事项】\n',
    tags: ['健康'],
  },
  growth: {
    title: '成长变化',
    content:
      '📏 成长记录\n\n【身体变化】\n\n【能力发展】\n\n【性格特点】\n\n【特别表现】\n',
    tags: ['成长'],
  },
}

const quickTags = [
  '第一次',
  '里程碑',
  '搞笑',
  '感动',
  '日常',
  '外出',
  '生病',
  '成长',
]

const diaryForm = ref({
  date: new Date(),
  ageMonth: babyStore.currentMonth,
  title: '',
  content: '',
  mood: 'happy',
  photos: [] as string[],
  tags: [] as string[],
})

const diaryEntries = ref<DiaryEntry[]>([])

const moodMap: Record<string, string> = {
  happy: '😊',
  love: '🥰',
  sad: '😢',
  tired: '😴',
  thinking: '🤔',
}

// 获取每日提示
const dailyPrompt = computed(() => {
  const dayIndex = new Date().getDay()
  return dailyPrompts[dayIndex % dailyPrompts.length]
})

// 今天是否已写日记
const hasWrittenToday = computed(() => {
  const today = new Date().toDateString()
  return diaryEntries.value.some(
    (e) => new Date(e.date).toDateString() === today,
  )
})

// 连续记录天数
const streakDays = computed(() => {
  if (diaryEntries.value.length === 0) return 0

  const sortedDates = [
    ...new Set(diaryEntries.value.map((e) => new Date(e.date).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)

    if (sortedDates.includes(checkDate.toDateString())) {
      streak++
    } else {
      break
    }
  }

  return streak
})

// 成就徽章
const achievements = computed<Achievement[]>(() => {
  const badges: Achievement[] = []
  const count = diaryEntries.value.length

  if (count >= 1)
    badges.push({
      id: 'first',
      name: '开启记录',
      icon: '🌱',
      description: '写下第一篇日记',
    })
  if (count >= 10)
    badges.push({
      id: 'ten',
      name: '持续记录',
      icon: '📚',
      description: '累计10篇日记',
    })
  if (count >= 30)
    badges.push({
      id: 'thirty',
      name: '日记达人',
      icon: '⭐',
      description: '累计30篇日记',
    })
  if (count >= 100)
    badges.push({
      id: 'hundred',
      name: '记录大师',
      icon: '👑',
      description: '累计100篇日记',
    })
  if (streakDays.value >= 7)
    badges.push({
      id: 'streak7',
      name: '坚持一周',
      icon: '🔥',
      description: '连续记录7天',
    })
  if (streakDays.value >= 30)
    badges.push({
      id: 'streak30',
      name: '坚持一月',
      icon: '💪',
      description: '连续记录30天',
    })

  return badges
})

// 所有标签
const allTags = computed(() => {
  const tags = new Set<string>()
  diaryEntries.value.forEach((e) => {
    e.tags?.forEach((t) => tags.add(t))
  })
  return Array.from(tags)
})

// 按时间范围统计
const rangeStats = computed(() => {
  let entries = diaryEntries.value
  const now = new Date()

  if (statsRange.value === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    entries = entries.filter((e) => new Date(e.date) >= weekAgo)
  } else if (statsRange.value === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    entries = entries.filter((e) => new Date(e.date) >= monthAgo)
  }

  const uniqueDays = new Set(
    entries.map((e) => new Date(e.date).toDateString()),
  )

  return {
    entries: entries.length,
    photos: entries.reduce((sum, e) => sum + (e.photos?.length || 0), 0),
    favorites: entries.filter((e) => e.isFavorite).length,
    activeDays: uniqueDays.size,
  }
})

const totalPhotos = computed(() => {
  return diaryEntries.value.reduce(
    (sum, entry) => sum + (entry.photos?.length || 0),
    0,
  )
})

const favoriteCount = computed(() => {
  return diaryEntries.value.filter((e) => e.isFavorite).length
})

const filteredEntries = computed(() => {
  let entries = [...diaryEntries.value]

  // 搜索文本
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    entries = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(search) ||
        e.content.toLowerCase().includes(search),
    )
  }

  // 心情筛选
  if (filterMood.value) {
    entries = entries.filter((e) => e.mood === filterMood.value)
  }

  // 月龄筛选
  if (filterMonth.value !== null) {
    entries = entries.filter((e) => e.ageMonth === filterMonth.value)
  }

  // 日期范围筛选
  if (
    filterDateRange.value &&
    filterDateRange.value[0] &&
    filterDateRange.value[1]
  ) {
    const [start, end] = filterDateRange.value
    entries = entries.filter((e) => {
      const d = new Date(e.date)
      return d >= start && d <= end
    })
  }

  // 标签筛选
  if (filterTags.value.length > 0) {
    entries = entries.filter((e) =>
      filterTags.value.some((tag) => e.tags?.includes(tag)),
    )
  }

  // 快速筛选
  if (quickFilter.value === 'favorite') {
    entries = entries.filter((e) => e.isFavorite)
  } else if (quickFilter.value === 'photos') {
    entries = entries.filter((e) => e.photos && e.photos.length > 0)
  } else if (quickFilter.value === 'milestone') {
    entries = entries.filter((e) => e.tags?.includes('里程碑'))
  }

  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
})

// 按月份分组
const groupedEntries = computed(() => {
  const groups: Record<string, DiaryEntry[]> = {}

  filteredEntries.value.forEach((entry) => {
    const date = new Date(entry.date)
    const key = `${date.getFullYear()}年${date.getMonth() + 1}月`

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(entry)
  })

  return groups
})

onMounted(() => {
  loadEntries()
})

const loadEntries = () => {
  const saved = localStorage.getItem('diaryEntries')
  if (saved) {
    diaryEntries.value = JSON.parse(saved).map((e: any) => ({
      ...e,
      date: new Date(e.date),
      createdAt: new Date(e.createdAt),
    }))
  }
}

const saveEntries = () => {
  localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries.value))
}

const getMoodEmoji = (mood: string) => moodMap[mood] || '😊'

const formatDay = (date: Date) => {
  return new Date(date).getDate()
}

const formatWeekday = (date: Date) => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[new Date(date).getDay()]
}

const formatMonth = (date: Date) => {
  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]
  return months[new Date(date).getMonth()]
}

// 切换筛选标签
const toggleFilterTag = (tag: string) => {
  const index = filterTags.value.indexOf(tag)
  if (index === -1) {
    filterTags.value.push(tag)
  } else {
    filterTags.value.splice(index, 1)
  }
}

// 使用模板写日记
const handleTemplateSelect = (template: string) => {
  const tpl = diaryTemplates[template]
  if (tpl) {
    editingEntry.value = null
    diaryForm.value = {
      date: new Date(),
      ageMonth: babyStore.currentMonth,
      title: tpl.title,
      content: tpl.content,
      mood: 'happy',
      photos: [],
      tags: [...tpl.tags],
    }
    showDiaryDialog.value = true
  }
}

// 带提示写日记
const openNewDiaryWithPrompt = () => {
  editingEntry.value = null
  diaryForm.value = {
    date: new Date(),
    ageMonth: babyStore.currentMonth,
    title: '',
    content: dailyPrompt.value + '\n\n',
    mood: 'happy',
    photos: [],
    tags: [],
  }
  showDiaryDialog.value = true
}

// 分享日记
const shareDiary = async (entry: DiaryEntry) => {
  const text = `📔 ${entry.title}\n\n${entry.content}\n\n——来自「宝贝成长记」`

  if (navigator.share) {
    try {
      await navigator.share({
        title: entry.title,
        text: text,
      })
    } catch {
      // 用户取消分享
    }
  } else {
    // 复制到剪贴板
    try {
      await navigator.clipboard.writeText(text)
      ElMessage.success('已复制到剪贴板 📋')
    } catch {
      ElMessage.error('复制失败')
    }
  }
}

const openNewDiary = () => {
  editingEntry.value = null
  diaryForm.value = {
    date: new Date(),
    ageMonth: babyStore.currentMonth,
    title: '',
    content: '',
    mood: 'happy',
    photos: [],
    tags: [],
  }
  showDiaryDialog.value = true
}

const editDiary = (entry: DiaryEntry) => {
  editingEntry.value = entry
  diaryForm.value = {
    date: new Date(entry.date),
    ageMonth: entry.ageMonth,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    photos: [...entry.photos],
    tags: [...entry.tags],
  }
  showDiaryDialog.value = true
}

const saveDiary = () => {
  if (!diaryForm.value.title.trim()) {
    ElMessage.warning('请输入日记标题')
    return
  }
  if (!diaryForm.value.content.trim()) {
    ElMessage.warning('请输入日记内容')
    return
  }

  if (editingEntry.value) {
    const index = diaryEntries.value.findIndex(
      (e) => e.id === editingEntry.value!.id,
    )
    if (index !== -1) {
      diaryEntries.value[index] = {
        ...editingEntry.value,
        ...diaryForm.value,
      }
    }
    ElMessage.success('日记已更新 ✨')
  } else {
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      ...diaryForm.value,
      isFavorite: false,
      createdAt: new Date(),
    }
    diaryEntries.value.push(newEntry)
    ElMessage.success('日记已发布 🎉')
  }

  saveEntries()
  cancelDiary()
}

const cancelDiary = () => {
  showDiaryDialog.value = false
  editingEntry.value = null
}

const deleteDiary = async (entry: DiaryEntry) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇日记吗？', '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    diaryEntries.value = diaryEntries.value.filter((e) => e.id !== entry.id)
    saveEntries()
    ElMessage.success('日记已删除')
  } catch {
    // 取消
  }
}

const toggleFavorite = (entry: DiaryEntry) => {
  entry.isFavorite = !entry.isFavorite
  saveEntries()
  ElMessage.success(entry.isFavorite ? '已添加到收藏 ⭐' : '已取消收藏')
}

const showTagInputFn = () => {
  showTagInput.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const addTag = () => {
  if (
    newTag.value.trim() &&
    !diaryForm.value.tags.includes(newTag.value.trim())
  ) {
    diaryForm.value.tags.push(newTag.value.trim())
  }
  newTag.value = ''
  showTagInput.value = false
}

const removeTag = (tag: string) => {
  diaryForm.value.tags = diaryForm.value.tags.filter((t) => t !== tag)
}

const addQuickTag = (tag: string) => {
  if (!diaryForm.value.tags.includes(tag)) {
    diaryForm.value.tags.push(tag)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          diaryForm.value.photos.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }
  input.value = ''
}

const removePhoto = (index: number) => {
  diaryForm.value.photos.splice(index, 1)
}

const previewPhoto = (photos: string[], index: number) => {
  previewImages.value = photos
  previewIndex.value = index
  showImageViewer.value = true
}

const disabledDate = (date: Date) => {
  return date > new Date()
}
</script>

<style scoped>
.diary-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff8e1 0%, #ffffff 50%, #fce4ec 100%);
  padding-bottom: 40px;
}

.page-header {
  background: linear-gradient(135deg, #ff8a65 0%, #ff7043 100%);
  padding: 24px;
  padding-bottom: 20px;
  color: white;
  border-radius: 0 0 32px 32px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
}

.header-info {
  flex: 1;
}

.header-info h1 {
  font-size: 24px;
  margin: 0 0 4px 0;
}

.header-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

/* 连续记录徽章 */
.streak-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px 12px;
  min-width: 60px;
}

.streak-icon {
  font-size: 20px;
}

.streak-num {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
}

.streak-label {
  font-size: 10px;
  opacity: 0.9;
}

/* 今日写作提示 */
.daily-prompt {
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.daily-prompt.written {
  justify-content: center;
}

.prompt-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.prompt-icon {
  font-size: 18px;
}

.prompt-text {
  font-size: 14px;
  opacity: 0.95;
}

/* 统计区域 */
.stats-section {
  padding: 0 20px;
  margin-bottom: 20px;
}

/* 统计时间切换 */
.stats-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stats-tab {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f5f5f5;
}

.stats-tab.active {
  background: linear-gradient(135deg, #ff8a65 0%, #ff7043 100%);
  color: white;
}

.stats-row {
  display: flex;
  gap: 10px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 12px 8px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.stat-card.highlight {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.stat-icon {
  font-size: 20px;
  display: block;
  margin-bottom: 6px;
}

.stat-num {
  font-size: 24px;
  font-weight: 800;
  color: #ff7043;
  display: block;
}

.stat-label {
  font-size: 11px;
  color: #999;
}

/* 成就徽章 */
.achievement-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  justify-content: center;
}

.achievement-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #f57c00;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

.badge-icon {
  font-size: 14px;
}

.badge-name {
  font-weight: 500;
}

/* 添加按钮 */
.add-section {
  padding: 0 20px;
  margin-bottom: 20px;
}

.add-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.main-add-btn {
  padding: 12px 32px !important;
}

.template-btn {
  background: white !important;
  border: 1px solid #e0e0e0 !important;
}

/* 筛选区域 */
.filter-section {
  padding: 0 20px;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.search-input {
  flex: 1;
}

/* 高级筛选 */
.advanced-filter {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.filter-group {
  margin-bottom: 12px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.filter-group .el-select,
.filter-group .el-date-picker {
  width: 100%;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 快速筛选 */
.quick-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.quick-filter {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.quick-filter.active {
  background: linear-gradient(135deg, #ff8a65 0%, #ff7043 100%);
  color: white;
}

/* 筛选展开动画 */
.filter-expand-enter-active,
.filter-expand-leave-active {
  transition: all 0.3s ease;
}

.filter-expand-enter-from,
.filter-expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 日记列表 */
.diary-list {
  padding: 0 20px;
}

/* 月份分组 */
.month-group {
  margin-bottom: 24px;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.month-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.month-count {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 12px;
}

.entries-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state .empty-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #666;
}

.empty-state p {
  margin: 0 0 20px 0;
}

/* 日记卡片 */
.diary-card {
  border-radius: 20px !important;
  border: none !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.3s ease !important;
  overflow: hidden;
}

.diary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.diary-card.favorite {
  border-left: 4px solid #ffc107 !important;
}

.diary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.diary-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #ff8a65 0%, #ff7043 100%);
  color: white;
  padding: 8px 14px;
  border-radius: 12px;
  min-width: 50px;
}

.date-day {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}

.date-weekday {
  font-size: 11px;
  opacity: 0.9;
  margin-top: 2px;
}

.date-month {
  font-size: 12px;
  opacity: 0.9;
}

.diary-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.mood-emoji {
  font-size: 26px;
}

.diary-title {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
  font-weight: 600;
}

.diary-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.diary-photos {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.photo-item {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;
}

.photo-item:hover {
  transform: scale(1.05);
}

.photo-item.photo-last {
  position: relative;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-more {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.diary-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.diary-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 4px;
  flex-wrap: wrap;
}

/* 日记对话框 */
.photo-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.uploaded-photo {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.uploaded-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
}

.upload-btn {
  width: 100px;
  height: 100px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  gap: 4px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  border-color: #ff7043;
  color: #ff7043;
}

.upload-btn span {
  font-size: 12px;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-tag {
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-tag:hover {
  background: #ff7043;
  color: white;
}

/* 列表动画 */
.diary-list-enter-active,
.diary-list-leave-active {
  transition: all 0.3s ease;
}

.diary-list-enter-from,
.diary-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px 16px;
    border-radius: 0 0 24px 24px;
  }

  .header-info h1 {
    font-size: 20px;
  }

  .streak-badge {
    padding: 6px 10px;
    min-width: 50px;
  }

  .streak-num {
    font-size: 18px;
  }

  .daily-prompt {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .stats-tabs {
    gap: 6px;
  }

  .stats-tab {
    padding: 5px 12px;
    font-size: 12px;
  }

  .stats-row {
    flex-wrap: wrap;
  }

  .stat-card {
    min-width: calc(50% - 6px);
    padding: 10px 6px;
  }

  .stat-num {
    font-size: 20px;
  }

  .achievement-badges {
    gap: 6px;
  }

  .achievement-badge {
    padding: 4px 10px;
    font-size: 11px;
  }

  .add-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .main-add-btn {
    width: 100%;
  }

  .template-btn {
    width: 100%;
  }

  .filter-row {
    flex-direction: column;
    gap: 10px;
  }

  .advanced-filter {
    padding: 12px;
  }

  .filter-group .el-date-picker {
    width: 100%;
  }

  .quick-filters {
    gap: 6px;
  }

  .quick-filter {
    padding: 5px 12px;
    font-size: 12px;
  }

  .month-header {
    padding: 0;
  }

  .month-label {
    font-size: 14px;
  }

  .diary-card {
    border-radius: 16px !important;
  }

  .diary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .diary-date {
    flex-direction: row;
    gap: 8px;
    padding: 6px 12px;
  }

  .date-day {
    font-size: 18px;
  }

  .diary-meta {
    width: 100%;
    justify-content: flex-start;
  }

  .mood-emoji {
    font-size: 22px;
  }

  .diary-title {
    font-size: 16px;
  }

  .diary-content {
    font-size: 13px;
    line-height: 1.7;
  }

  .photo-item {
    width: 56px;
    height: 56px;
  }

  .diary-actions {
    justify-content: space-between;
    gap: 0;
  }

  .diary-actions .el-button {
    padding: 8px 6px !important;
    font-size: 12px !important;
  }
}

@media (max-width: 480px) {
  .stats-section {
    padding: 0 16px;
  }

  .diary-list {
    padding: 0 16px;
  }

  .stat-card {
    padding: 8px 4px;
  }

  .stat-icon {
    font-size: 18px;
    margin-bottom: 4px;
  }

  .stat-num {
    font-size: 18px;
  }

  .stat-label {
    font-size: 10px;
  }

  .photo-item {
    width: 48px;
    height: 48px;
    border-radius: 8px;
  }
}
</style>

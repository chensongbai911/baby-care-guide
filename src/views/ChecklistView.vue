<template>
  <div class="checklist-view">
    <!-- 页面头部 - 环形进度图 -->
    <div class="page-header">
      <div class="header-top">
        <el-button class="back-btn" @click="router.back()" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1>📋 成长清单</h1>
        <el-dropdown trigger="click" @command="handleExportCommand">
          <el-button circle>
            <el-icon><More /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="export-json">
                📁 导出JSON
              </el-dropdown-item>
              <el-dropdown-item command="export-report">
                📄 生成成长报告
              </el-dropdown-item>
              <el-dropdown-item command="import">📥 导入记录</el-dropdown-item>
              <el-dropdown-item command="reset" divided>
                🔄 重置记录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 环形进度主视图 -->
      <div class="progress-hero">
        <div class="ring-progress-container">
          <svg class="ring-progress" viewBox="0 0 120 120">
            <circle class="ring-bg" cx="60" cy="60" r="52" />
            <circle
              class="ring-fill"
              cx="60"
              cy="60"
              r="52"
              :style="{ strokeDashoffset: ringOffset }"
            />
          </svg>
          <div class="ring-center">
            <span class="ring-value">{{ completedCount }}</span>
            <span class="ring-divider">/</span>
            <span class="ring-total">{{ totalMilestones }}</span>
          </div>
        </div>
        <div class="progress-info">
          <h2>{{ babyStore.babyInfo.name }}的成长进度</h2>
          <p class="progress-rate">
            已完成
            <strong>{{ completionRate }}%</strong>
            的里程碑
          </p>
          <div class="stage-badges">
            <span
              v-for="stage in stageProgress"
              :key="stage.name"
              :class="['stage-badge', { completed: stage.rate === 100 }]"
            >
              {{ stage.icon }} {{ stage.name }} {{ stage.rate }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 当前月龄提示 -->
      <div class="current-month-hint" v-if="pendingCurrentMonth > 0">
        <el-icon><Bell /></el-icon>
        <span>
          当前月龄有
          <strong>{{ pendingCurrentMonth }}</strong>
          个待完成里程碑
        </span>
        <el-button
          size="small"
          type="primary"
          round
          @click="scrollToCurrentMonth"
        >
          立即查看
        </el-button>
      </div>
    </div>

    <!-- 月龄快速切换 -->
    <div class="month-nav">
      <el-button circle @click="prevMonth" :disabled="activeMonth <= 0">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <div class="month-tabs-scroll" ref="monthTabsRef">
        <div
          v-for="monthData in babyStore.allMonthsData"
          :key="monthData.month"
          :class="[
            'month-tab',
            {
              active: activeMonth === monthData.month,
              current: monthData.month === babyStore.currentMonth,
              completed: getMonthCompletion(monthData.month) === 100,
            },
          ]"
          :ref="el => { if (monthData.month === activeMonth) activeTabRef = el as HTMLElement }"
          @click="activeMonth = monthData.month"
        >
          <span class="tab-month">{{ monthData.month }}月</span>
          <div class="tab-progress-bar">
            <div
              class="tab-progress-fill"
              :style="{ width: getMonthCompletion(monthData.month) + '%' }"
            ></div>
          </div>
          <span class="tab-status">
            <el-icon
              v-if="getMonthCompletion(monthData.month) === 100"
              color="#10b981"
            >
              <Check />
            </el-icon>
            <span v-else class="tab-count">
              {{ getCompletedCount(monthData.month) }}/{{
                getMonthMilestones(monthData.month).length
              }}
            </span>
          </span>
        </div>
      </div>
      <el-button circle @click="nextMonth" :disabled="activeMonth >= 12">
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 当前月龄内容 -->
    <div class="month-content" v-if="currentMonthData">
      <div class="month-header">
        <div class="month-info">
          <h2>
            <span class="month-icon">{{ getMonthIcon(activeMonth) }}</span>
            {{ currentMonthData.title }}
          </h2>
          <p>{{ currentMonthData.summary }}</p>
        </div>
        <div class="month-progress-ring">
          <el-progress
            type="circle"
            :percentage="getMonthCompletion(activeMonth)"
            :width="80"
            :stroke-width="8"
            :color="progressColor"
          >
            <template #default>
              <span class="mini-progress-text">
                {{ getMonthCompletion(activeMonth) }}%
              </span>
            </template>
          </el-progress>
        </div>
      </div>

      <!-- 里程碑网格 -->
      <div class="milestones-grid">
        <div
          v-for="(milestone, index) in currentMonthData.milestones"
          :key="milestone.title"
          :class="[
            'milestone-card',
            { completed: isMilestoneCompleted(milestone.title) },
          ]"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="openMilestoneDialog(milestone)"
        >
          <div class="card-check">
            <div
              class="check-circle"
              @click.stop="quickToggle(milestone.title)"
            >
              <transition name="check-pop">
                <el-icon
                  v-if="isMilestoneCompleted(milestone.title)"
                  class="check-icon"
                >
                  <Check />
                </el-icon>
              </transition>
            </div>
          </div>
          <div class="card-body">
            <h3>{{ milestone.title }}</h3>
            <p>{{ milestone.description }}</p>
            <div class="card-footer">
              <el-tag
                :type="
                  isMilestoneCompleted(milestone.title) ? 'success' : 'info'
                "
                size="small"
                effect="plain"
                round
              >
                {{
                  isMilestoneCompleted(milestone.title) ? '✓ 已达成' : '待完成'
                }}
              </el-tag>
              <span
                v-if="getMilestoneRecord(milestone.title)"
                class="record-hint"
              >
                <el-icon><Picture /></el-icon>
              </span>
            </div>
          </div>
          <div
            class="card-glow"
            v-if="isMilestoneCompleted(milestone.title)"
          ></div>
        </div>
      </div>

      <el-empty
        v-if="currentMonthData.milestones.length === 0"
        description="该月龄暂无里程碑数据"
      />
    </div>

    <!-- 自定义里程碑入口 -->
    <div class="custom-milestone-section">
      <el-button type="primary" plain round @click="showCustomDialog = true">
        <el-icon><Plus /></el-icon>
        添加自定义里程碑
      </el-button>
    </div>

    <!-- 成就展示 -->
    <div class="achievements-section">
      <h2>🏆 成就徽章</h2>
      <div class="achievements-grid">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          :class="['achievement-card', { unlocked: achievement.unlocked }]"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <h4>{{ achievement.title }}</h4>
            <p>{{ achievement.description }}</p>
          </div>
          <div class="achievement-status">
            <el-icon v-if="achievement.unlocked" color="#f59e0b">
              <Trophy />
            </el-icon>
            <el-icon v-else color="#d1d5db"><Lock /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 里程碑打卡对话框 -->
    <el-dialog
      v-model="showMilestoneDialog"
      :title="currentMilestone?.title"
      width="90%"
      class="milestone-dialog"
    >
      <div class="dialog-content" v-if="currentMilestone">
        <p class="milestone-desc">{{ currentMilestone.description }}</p>

        <div class="record-form">
          <el-form-item label="完成日期">
            <el-date-picker
              v-model="milestoneRecord.date"
              type="date"
              placeholder="选择日期"
              :disabled-date="disabledDate"
              style="width: 100%;"
            />
          </el-form-item>

          <el-form-item label="备注">
            <el-input
              v-model="milestoneRecord.note"
              type="textarea"
              :rows="3"
              placeholder="记录这个特别的时刻..."
            />
          </el-form-item>

          <el-form-item label="照片/视频">
            <div class="media-upload">
              <div
                v-for="(media, idx) in milestoneRecord.media"
                :key="idx"
                class="media-item"
              >
                <img :src="media" alt="记录照片" />
                <el-button
                  class="remove-media"
                  circle
                  size="small"
                  type="danger"
                  @click="removeMedia(idx)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
              <div class="upload-btn" @click="triggerMediaUpload">
                <el-icon :size="24"><Plus /></el-icon>
                <span>添加</span>
              </div>
              <input
                ref="mediaInputRef"
                type="file"
                accept="image/*,video/*"
                multiple
                style="display: none;"
                @change="handleMediaUpload"
              />
            </div>
          </el-form-item>
        </div>
      </div>

      <template #footer>
        <el-button @click="showMilestoneDialog = false">取消</el-button>
        <el-button
          type="success"
          @click="confirmMilestone"
          :disabled="isMilestoneCompleted(currentMilestone?.title || '')"
        >
          <el-icon><Check /></el-icon>
          {{
            isMilestoneCompleted(currentMilestone?.title || '')
              ? '已完成'
              : '确认完成'
          }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 自定义里程碑对话框 -->
    <el-dialog
      v-model="showCustomDialog"
      title="➕ 添加自定义里程碑"
      width="90%"
    >
      <el-form :model="customMilestone" label-position="top">
        <el-form-item label="里程碑名称" required>
          <el-input
            v-model="customMilestone.title"
            placeholder="如：第一次笑出声"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="customMilestone.description"
            type="textarea"
            :rows="2"
            placeholder="描述这个里程碑..."
          />
        </el-form-item>
        <el-form-item label="所属月龄">
          <el-select v-model="customMilestone.month" style="width: 100%;">
            <el-option
              v-for="m in 13"
              :key="m - 1"
              :label="`${m - 1}个月`"
              :value="m - 1"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCustomDialog = false">取消</el-button>
        <el-button type="primary" @click="addCustomMilestone">添加</el-button>
      </template>
    </el-dialog>

    <!-- 粒子动画容器 -->
    <div ref="particlesRef" class="particles-container"></div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none;"
      @change="handleFileImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Close,
  More,
  Bell,
  Picture,
  Trophy,
  Lock,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const babyStore = useBabyStore()

const activeMonth = ref(babyStore.currentMonth)
const showMilestoneDialog = ref(false)
const showCustomDialog = ref(false)
const currentMilestone = ref<{ title: string; description: string } | null>(
  null,
)
const fileInput = ref<HTMLInputElement | null>(null)
const mediaInputRef = ref<HTMLInputElement | null>(null)
const monthTabsRef = ref<HTMLElement | null>(null)
const activeTabRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

// 里程碑记录表单
const milestoneRecord = ref({
  date: new Date(),
  note: '',
  media: [] as string[],
})

// 自定义里程碑表单
const customMilestone = ref({
  title: '',
  description: '',
  month: babyStore.currentMonth,
})

// 里程碑详细记录存储
const milestoneRecords = ref<
  Record<string, { date: string; note: string; media: string[] }>
>({})

// 进度颜色
const progressColor = [
  { color: '#f87171', percentage: 20 },
  { color: '#fbbf24', percentage: 50 },
  { color: '#34d399', percentage: 80 },
  { color: '#10b981', percentage: 100 },
]

// 环形进度偏移量
const ringOffset = computed(() => {
  const circumference = 2 * Math.PI * 52
  return circumference - (completionRate.value / 100) * circumference
})

// 当前月龄数据
const currentMonthData = computed(() => {
  return babyStore.allMonthsData.find((m) => m.month === activeMonth.value)
})

// 总里程碑数
const totalMilestones = computed(() => {
  return babyStore.allMonthsData.reduce(
    (sum, month) => sum + month.milestones.length,
    0,
  )
})

// 已完成数量
const completedCount = computed(() => {
  return babyStore.completedMilestones.length
})

// 完成率
const completionRate = computed(() => {
  if (totalMilestones.value === 0) return 0
  return Math.round((completedCount.value / totalMilestones.value) * 100)
})

// 当前月龄待完成数
const pendingCurrentMonth = computed(() => {
  const monthData = babyStore.allMonthsData.find(
    (m) => m.month === babyStore.currentMonth,
  )
  if (!monthData) return 0
  return monthData.milestones.filter(
    (m) => !babyStore.isMilestoneCompleted(m.title),
  ).length
})

// 阶段进度
const stageProgress = computed(() => {
  const stages = [
    { name: '新生儿', icon: '👶', months: [0, 1, 2] },
    { name: '婴儿早期', icon: '🌱', months: [3, 4, 5] },
    { name: '婴儿中期', icon: '🌿', months: [6, 7, 8] },
    { name: '婴儿后期', icon: '🌳', months: [9, 10, 11, 12] },
  ]

  return stages.map((stage) => {
    let total = 0
    let completed = 0
    stage.months.forEach((m) => {
      const monthData = babyStore.allMonthsData.find((md) => md.month === m)
      if (monthData) {
        total += monthData.milestones.length
        completed += monthData.milestones.filter((ms) =>
          babyStore.isMilestoneCompleted(ms.title),
        ).length
      }
    })
    return {
      ...stage,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })
})

// 获取月份图标
const getMonthIcon = (month: number) => {
  const icons = [
    '🌟',
    '💫',
    '⭐',
    '🌙',
    '☀️',
    '🌈',
    '🎈',
    '🎀',
    '🎁',
    '🎊',
    '🎉',
    '🏆',
    '👑',
  ]
  return icons[month] || '⭐'
}

// 获取月份里程碑
const getMonthMilestones = (month: number) => {
  const monthData = babyStore.allMonthsData.find((m) => m.month === month)
  return monthData?.milestones || []
}

// 获取指定月份的完成数
const getCompletedCount = (month: number) => {
  const monthData = babyStore.allMonthsData.find((m) => m.month === month)
  if (!monthData) return 0
  return monthData.milestones.filter((m) =>
    babyStore.isMilestoneCompleted(m.title),
  ).length
}

// 获取指定月份的完成率
const getMonthCompletion = (month: number) => {
  const monthData = babyStore.allMonthsData.find((m) => m.month === month)
  if (!monthData || !monthData.milestones.length) return 0
  const completed = getCompletedCount(month)
  return Math.round((completed / monthData.milestones.length) * 100)
}

const isMilestoneCompleted = (title: string) => {
  return babyStore.isMilestoneCompleted(title)
}

// 获取里程碑记录
const getMilestoneRecord = (title: string) => {
  return milestoneRecords.value[title]
}

// 快速切换完成状态
const quickToggle = (title: string) => {
  const wasCompleted = babyStore.isMilestoneCompleted(title)
  babyStore.toggleMilestone(title)

  if (!wasCompleted) {
    showCelebration()
    ElMessage({
      message: `🎉 太棒了！"${title}"已完成！`,
      type: 'success',
      duration: 2000,
    })
  }
}

// 打开里程碑对话框
const openMilestoneDialog = (milestone: {
  title: string
  description: string
}) => {
  currentMilestone.value = milestone
  const record = milestoneRecords.value[milestone.title]
  if (record) {
    milestoneRecord.value = {
      date: new Date(record.date),
      note: record.note,
      media: [...record.media],
    }
  } else {
    milestoneRecord.value = {
      date: new Date(),
      note: '',
      media: [],
    }
  }
  showMilestoneDialog.value = true
}

// 确认里程碑完成
const confirmMilestone = () => {
  if (!currentMilestone.value) return

  // 保存记录
  milestoneRecords.value[currentMilestone.value.title] = {
    date: milestoneRecord.value.date.toISOString(),
    note: milestoneRecord.value.note,
    media: milestoneRecord.value.media,
  }
  localStorage.setItem(
    'milestoneRecords',
    JSON.stringify(milestoneRecords.value),
  )

  // 标记完成
  if (!babyStore.isMilestoneCompleted(currentMilestone.value.title)) {
    babyStore.toggleMilestone(currentMilestone.value.title)
    showCelebration()
    ElMessage({
      message: `🎉 恭喜！"${currentMilestone.value.title}"已记录！`,
      type: 'success',
      duration: 2500,
    })
  } else {
    ElMessage.success('记录已更新！')
  }

  showMilestoneDialog.value = false
}

// 上传媒体
const triggerMediaUpload = () => {
  mediaInputRef.value?.click()
}

const handleMediaUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          milestoneRecord.value.media.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }
  input.value = ''
}

const removeMedia = (index: number) => {
  milestoneRecord.value.media.splice(index, 1)
}

// 添加自定义里程碑
const addCustomMilestone = () => {
  if (!customMilestone.value.title.trim()) {
    ElMessage.warning('请输入里程碑名称')
    return
  }

  // 保存到本地存储
  const customList = JSON.parse(
    localStorage.getItem('customMilestones') || '[]',
  )
  customList.push({
    ...customMilestone.value,
    id: Date.now().toString(),
  })
  localStorage.setItem('customMilestones', JSON.stringify(customList))

  ElMessage.success('自定义里程碑已添加！')
  showCustomDialog.value = false
  customMilestone.value = {
    title: '',
    description: '',
    month: babyStore.currentMonth,
  }
}

// 月龄导航
const prevMonth = () => {
  if (activeMonth.value > 0) {
    activeMonth.value--
    scrollToActiveTab()
  }
}

const nextMonth = () => {
  if (activeMonth.value < 12) {
    activeMonth.value++
    scrollToActiveTab()
  }
}

const scrollToActiveTab = () => {
  nextTick(() => {
    activeTabRef.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  })
}

const scrollToCurrentMonth = () => {
  activeMonth.value = babyStore.currentMonth
  scrollToActiveTab()
}

// 庆祝动画
const showCelebration = () => {
  if (!particlesRef.value) return

  const colors = ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4']
  const container = particlesRef.value

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.cssText = `
      left: ${50 + (Math.random() - 0.5) * 40}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.3}s;
    `
    container.appendChild(particle)

    setTimeout(() => particle.remove(), 1500)
  }
}

// 成就系统
const achievements = computed(() => [
  {
    id: 'first',
    icon: '🌱',
    title: '第一步',
    description: '完成第一个里程碑',
    unlocked: completedCount.value >= 1,
  },
  {
    id: 'five',
    icon: '⭐',
    title: '小有成就',
    description: '完成5个里程碑',
    unlocked: completedCount.value >= 5,
  },
  {
    id: 'ten',
    icon: '🌟',
    title: '初露锋芒',
    description: '完成10个里程碑',
    unlocked: completedCount.value >= 10,
  },
  {
    id: 'quarter',
    icon: '🎯',
    title: '四分之一',
    description: '完成25%的里程碑',
    unlocked: completionRate.value >= 25,
  },
  {
    id: 'half',
    icon: '🏆',
    title: '半程冠军',
    description: '完成50%的里程碑',
    unlocked: completionRate.value >= 50,
  },
  {
    id: 'most',
    icon: '💎',
    title: '接近完美',
    description: '完成90%的里程碑',
    unlocked: completionRate.value >= 90,
  },
  {
    id: 'master',
    icon: '👑',
    title: '育儿大师',
    description: '完成所有里程碑',
    unlocked: completionRate.value === 100,
  },
])

// 导出命令处理
const handleExportCommand = (command: string) => {
  switch (command) {
    case 'export-json':
      exportProgress()
      break
    case 'export-report':
      generateReport()
      break
    case 'import':
      fileInput.value?.click()
      break
    case 'reset':
      resetProgress()
      break
  }
}

const exportProgress = () => {
  const data = {
    babyInfo: babyStore.babyInfo,
    completedMilestones: babyStore.completedMilestones,
    milestoneRecords: milestoneRecords.value,
    exportDate: new Date().toISOString(),
    version: '2.0',
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${
    babyStore.babyInfo.name
  }-成长记录-${new Date().toLocaleDateString()}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('成长记录已导出！📁')
}

const generateReport = () => {
  ElMessage.info('成长报告生成功能开发中...')
  // TODO: 实现PDF报告生成
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
        localStorage.setItem(
          'completedMilestones',
          JSON.stringify(data.completedMilestones),
        )
      }
      if (data.milestoneRecords) {
        milestoneRecords.value = data.milestoneRecords
        localStorage.setItem(
          'milestoneRecords',
          JSON.stringify(data.milestoneRecords),
        )
      }
      ElMessage.success('成长记录导入成功！🎉')
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
    },
  )
    .then(() => {
      localStorage.removeItem('completedMilestones')
      localStorage.removeItem('milestoneRecords')
      babyStore.completedMilestones = []
      milestoneRecords.value = {}
      ElMessage.success('已重置所有记录')
    })
    .catch(() => {})
}

const disabledDate = (date: Date) => {
  return date > new Date()
}

// 监听月份变化滚动
watch(activeMonth, () => {
  scrollToActiveTab()
})

onMounted(() => {
  // 加载里程碑记录
  const saved = localStorage.getItem('milestoneRecords')
  if (saved) {
    milestoneRecords.value = JSON.parse(saved)
  }

  // 滚动到当前月龄
  nextTick(() => {
    scrollToActiveTab()
  })
})
</script>

<style scoped>
.checklist-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #faf5ff 0%, #ffffff 50%, #fdf2f8 100%);
  padding-bottom: 40px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  padding: 20px;
  padding-bottom: 24px;
  color: white;
  border-radius: 0 0 32px 32px;
  margin-bottom: 20px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-top h1 {
  font-size: 20px;
  margin: 0;
  font-weight: 700;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
}

/* 环形进度主视图 */
.progress-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.ring-progress-container {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.ring-progress {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 10;
}

.ring-fill {
  fill: none;
  stroke: #fbbf24;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 326.73;
  transition: stroke-dashoffset 0.8s ease;
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.ring-value {
  font-size: 28px;
  font-weight: 800;
}

.ring-divider {
  font-size: 16px;
  opacity: 0.7;
}

.ring-total {
  font-size: 16px;
  opacity: 0.8;
}

.progress-info {
  flex: 1;
}

.progress-info h2 {
  font-size: 18px;
  margin: 0 0 6px 0;
  font-weight: 700;
}

.progress-rate {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 12px 0;
}

.progress-rate strong {
  font-size: 18px;
  color: #fbbf24;
}

.stage-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.stage-badge {
  font-size: 11px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  white-space: nowrap;
}

.stage-badge.completed {
  background: rgba(16, 185, 129, 0.3);
}

/* 当前月龄提示 */
.current-month-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  font-size: 13px;
}

/* 月龄导航 */
.month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.month-tabs-scroll {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
  scroll-behavior: smooth;
}

.month-tabs-scroll::-webkit-scrollbar {
  display: none;
}

.month-tab {
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 70px;
}

.month-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.month-tab.active {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
}

.month-tab.current:not(.active) {
  border: 2px solid #a855f7;
}

.month-tab.completed .tab-month {
  color: #10b981;
}

.month-tab.active.completed .tab-month {
  color: white;
}

.tab-month {
  font-size: 14px;
  font-weight: 700;
}

.tab-progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.month-tab.active .tab-progress-bar {
  background: rgba(255, 255, 255, 0.3);
}

.tab-progress-fill {
  height: 100%;
  background: #10b981;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.tab-status {
  font-size: 11px;
  opacity: 0.7;
}

.tab-count {
  font-weight: 500;
}

/* 月龄内容 */
.month-content {
  padding: 0 16px;
  margin-bottom: 24px;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.month-info h2 {
  font-size: 20px;
  margin: 0 0 6px 0;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.month-icon {
  font-size: 24px;
}

.month-info p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.mini-progress-text {
  font-size: 14px;
  font-weight: 700;
  color: #7c3aed;
}

/* 里程碑网格 */
.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.milestone-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  overflow: hidden;
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

.milestone-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.15);
  border-color: rgba(124, 58, 237, 0.3);
}

.milestone-card.completed {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
}

.card-check {
  position: absolute;
  top: 16px;
  right: 16px;
}

.check-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: white;
}

.check-circle:hover {
  border-color: #7c3aed;
  transform: scale(1.1);
}

.milestone-card.completed .check-circle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: transparent;
  color: white;
}

.check-icon {
  font-size: 16px;
}

.check-pop-enter-active {
  animation: checkPop 0.3s ease;
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.card-body h3 {
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #1f2937;
  padding-right: 36px;
}

.card-body p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.record-hint {
  color: #a855f7;
  font-size: 16px;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(16, 185, 129, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* 自定义里程碑入口 */
.custom-milestone-section {
  padding: 0 16px;
  margin-bottom: 24px;
  text-align: center;
}

/* 成就展示 */
.achievements-section {
  padding: 0 16px;
  margin-bottom: 40px;
}

.achievements-section h2 {
  font-size: 18px;
  margin: 0 0 16px 0;
  color: #1f2937;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.achievement-icon {
  font-size: 32px;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  font-size: 14px;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.achievement-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.achievement-status {
  font-size: 20px;
}

/* 对话框样式 */
.milestone-dialog .milestone-desc {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.record-form .el-form-item {
  margin-bottom: 16px;
}

.media-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.media-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-media {
  position: absolute;
  top: 4px;
  right: 4px;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  gap: 4px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  border-color: #7c3aed;
  color: #7c3aed;
}

.upload-btn span {
  font-size: 12px;
}

/* 粒子动画 */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: particle-fly 1.2s ease-out forwards;
}

@keyframes particle-fly {
  0% {
    top: 40%;
    opacity: 1;
    transform: scale(1);
  }
  100% {
    top: -10%;
    opacity: 0;
    transform: scale(0) translateX(calc((var(--random, 0.5) - 0.5) * 200px));
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .progress-hero {
    flex-direction: column;
    text-align: center;
  }

  .progress-info h2 {
    font-size: 16px;
  }

  .stage-badges {
    justify-content: center;
  }

  .month-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .milestones-grid {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 16px;
  }

  .ring-progress-container {
    width: 100px;
    height: 100px;
  }

  .ring-value {
    font-size: 24px;
  }

  .month-tab {
    min-width: 60px;
    padding: 8px 10px;
  }

  .tab-month {
    font-size: 12px;
  }

  .milestone-card {
    padding: 16px;
  }

  .card-body h3 {
    font-size: 14px;
  }
}
</style>

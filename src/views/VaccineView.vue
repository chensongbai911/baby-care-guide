<template>
  <div class="vaccine-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-bg">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <el-button class="back-btn" @click="router.back()" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-info">
          <h1>💉 疫苗接种</h1>
          <p>守护宝宝健康，按时接种疫苗</p>
        </div>
        <div class="header-actions">
          <el-button class="action-btn" circle @click="showExportDialog = true">
            <el-icon><Download /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 接种进度卡片 -->
    <div class="progress-section">
      <div class="progress-card">
        <div class="progress-ring">
          <svg viewBox="0 0 120 120">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#43a047" />
                <stop offset="100%" style="stop-color:#81c784" />
              </linearGradient>
            </defs>
            <circle class="ring-bg" cx="60" cy="60" r="52" />
            <circle
              class="ring-progress"
              cx="60" cy="60" r="52"
              :style="{ strokeDashoffset: progressOffset }"
            />
          </svg>
          <div class="progress-center">
            <span class="progress-percent">{{ completionRate }}%</span>
            <span class="progress-label">完成率</span>
          </div>
        </div>
        <div class="progress-stats">
          <div class="stat-item total">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <span class="stat-value">{{ totalVaccines }}</span>
              <span class="stat-label">总疫苗</span>
            </div>
          </div>
          <div class="stat-item completed">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{ completedCount }}</span>
              <span class="stat-label">已接种</span>
            </div>
          </div>
          <div class="stat-item pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <span class="stat-value">{{ pendingCount }}</span>
              <span class="stat-label">待接种</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 即将接种提醒 -->
    <div class="upcoming-section" v-if="upcomingVaccines.length > 0">
      <div class="section-header">
        <h2>
          <span class="section-icon">⏰</span>
          即将接种
        </h2>
        <el-tag v-if="overdueCount > 0" type="danger" effect="dark" round>
          {{ overdueCount }}个已过期
        </el-tag>
      </div>
      <div class="upcoming-cards">
        <div
          v-for="vaccine in upcomingVaccines"
          :key="vaccine.id"
          class="upcoming-card"
          :class="{ overdue: isOverdue(vaccine), current: isCurrent(vaccine) }"
          @click="showVaccineDetail(vaccine)"
        >
          <div class="card-status">
            <span v-if="isOverdue(vaccine)" class="status-badge overdue">已过期</span>
            <span v-else-if="isCurrent(vaccine)" class="status-badge current">本月</span>
            <span v-else class="status-badge upcoming">即将</span>
          </div>
          <div class="card-icon">
            <span>💉</span>
          </div>
          <div class="card-info">
            <h3>{{ vaccine.name }}</h3>
            <p>{{ vaccine.description }}</p>
            <div class="card-meta">
              <span class="age-tag">{{ vaccine.ageMonth }}月龄</span>
              <span class="type-tag" :class="vaccine.required ? 'free' : 'paid'">
                {{ vaccine.required ? '免费' : '自费' }}
              </span>
            </div>
          </div>
          <el-button
            type="primary"
            size="small"
            round
            class="vaccinate-btn"
            @click.stop="markAsCompleted(vaccine)"
          >
            打卡
          </el-button>
        </div>
      </div>
    </div>

    <!-- 疫苗分类标签 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <div
          v-for="tab in filterTabs"
          :key="tab.value"
          class="filter-tab"
          :class="{ active: filterStatus === tab.value }"
          @click="filterStatus = tab.value"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </div>
      </div>
    </div>

    <!-- 疫苗时间线 -->
    <div class="timeline-section">
      <div class="section-header">
        <h2>
          <span class="section-icon">📋</span>
          疫苗接种表
        </h2>
        <el-button text type="primary" @click="showLegend = !showLegend">
          <el-icon><InfoFilled /></el-icon>
          图例说明
        </el-button>
      </div>

      <!-- 图例 -->
      <el-collapse-transition>
        <div v-show="showLegend" class="legend-box">
          <div class="legend-item">
            <span class="legend-dot free"></span>
            <span>免费疫苗 (国家免疫规划)</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot paid"></span>
            <span>自费疫苗 (推荐接种)</span>
          </div>
          <div class="legend-item">
            <span class="legend-check"></span>
            <span>已完成接种</span>
          </div>
        </div>
      </el-collapse-transition>

      <!-- 时间线 -->
      <div class="vaccine-timeline">
        <div
          v-for="(group, ageMonth) in filteredVaccinesByAge"
          :key="ageMonth"
          class="timeline-group"
          :class="{ 'current-month': Number(ageMonth) === babyStore.currentMonth }"
        >
          <div class="timeline-header">
            <div class="timeline-node">
              <div class="node-circle" :class="getGroupStatus(group)">
                <el-icon v-if="isGroupCompleted(group)"><Check /></el-icon>
                <span v-else>{{ ageMonth }}</span>
              </div>
              <div class="node-line"></div>
            </div>
            <div class="timeline-title">
              <span class="month-label">{{ ageMonth }}月龄</span>
              <span class="vaccine-count">{{ group.length }}个疫苗</span>
              <el-tag
                v-if="Number(ageMonth) === babyStore.currentMonth"
                type="warning"
                size="small"
                effect="dark"
                round
              >
                当前
              </el-tag>
            </div>
          </div>
          <div class="timeline-content">
            <div
              v-for="vaccine in group"
              :key="vaccine.id"
              class="vaccine-item"
              :class="{ completed: vaccine.completed }"
              @click="showVaccineDetail(vaccine)"
            >
              <div class="item-checkbox">
                <div
                  class="checkbox-circle"
                  :class="{ checked: vaccine.completed }"
                  @click.stop="toggleVaccine(vaccine)"
                >
                  <el-icon v-if="vaccine.completed"><Check /></el-icon>
                </div>
              </div>
              <div class="item-content">
                <div class="item-header">
                  <h4>{{ vaccine.name }}</h4>
                  <el-tag
                    :type="vaccine.required ? 'success' : 'warning'"
                    size="small"
                    effect="plain"
                    round
                  >
                    {{ vaccine.required ? '免费' : '自费' }}
                  </el-tag>
                </div>
                <p class="item-desc">{{ vaccine.description }}</p>
                <div class="item-footer">
                  <span class="type-label">{{ vaccine.type }}</span>
                  <span v-if="vaccine.completedDate" class="date-label">
                    <el-icon><Calendar /></el-icon>
                    {{ formatDate(vaccine.completedDate) }}
                  </span>
                </div>
              </div>
              <el-icon class="item-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="Object.keys(filteredVaccinesByAge).length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>没有找到符合条件的疫苗</p>
      </div>
    </div>

    <!-- 接种须知 -->
    <div class="tips-section">
      <div class="section-header" @click="showTips = !showTips">
        <h2>
          <span class="section-icon">📖</span>
          接种须知
        </h2>
        <el-icon :class="{ rotated: showTips }"><ArrowDown /></el-icon>
      </div>
      <el-collapse-transition>
        <div v-show="showTips" class="tips-content">
          <div class="tip-card">
            <div class="tip-icon">📅</div>
            <div class="tip-text">
              <h4>按时接种</h4>
              <p>请按照推荐的月龄及时带宝宝接种疫苗，不要延误</p>
            </div>
          </div>
          <div class="tip-card">
            <div class="tip-icon">🏥</div>
            <div class="tip-text">
              <h4>接种前准备</h4>
              <p>确保宝宝身体健康，无发热、腹泻等症状</p>
            </div>
          </div>
          <div class="tip-card">
            <div class="tip-icon">⏰</div>
            <div class="tip-text">
              <h4>接种后观察</h4>
              <p>接种后在医院观察30分钟，注意有无不良反应</p>
            </div>
          </div>
          <div class="tip-card">
            <div class="tip-icon">📋</div>
            <div class="tip-text">
              <h4>携带证件</h4>
              <p>接种时请携带预防接种证和户口本</p>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 疫苗详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="currentVaccine?.name || '疫苗详情'"
      width="90%"
      :style="{ maxWidth: '450px' }"
      class="vaccine-dialog"
    >
      <div class="detail-content" v-if="currentVaccine">
        <div class="detail-header">
          <div class="detail-icon">💉</div>
          <div class="detail-tags">
            <el-tag :type="currentVaccine.required ? 'success' : 'warning'" effect="dark" round>
              {{ currentVaccine.required ? '免费疫苗' : '自费疫苗' }}
            </el-tag>
            <el-tag type="info" effect="plain" round>{{ currentVaccine.type }}</el-tag>
          </div>
        </div>

        <div class="detail-info">
          <div class="info-row">
            <span class="info-label">建议月龄</span>
            <span class="info-value">{{ currentVaccine.ageMonth }} 月龄</span>
          </div>
          <div class="info-row">
            <span class="info-label">预防疾病</span>
            <span class="info-value">{{ currentVaccine.description }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">接种状态</span>
            <span class="info-value" :class="currentVaccine.completed ? 'completed' : 'pending'">
              {{ currentVaccine.completed ? '已接种' : '未接种' }}
            </span>
          </div>
          <div class="info-row" v-if="currentVaccine.completedDate">
            <span class="info-label">接种日期</span>
            <span class="info-value">{{ formatDate(currentVaccine.completedDate) }}</span>
          </div>
          <div class="info-row" v-if="currentVaccine.note">
            <span class="info-label">备注</span>
            <span class="info-value">{{ currentVaccine.note }}</span>
          </div>
        </div>

        <div class="detail-tips">
          <h4>💡 温馨提示</h4>
          <ul>
            <li>接种前确保宝宝身体健康</li>
            <li>接种后观察30分钟</li>
            <li>如有不适及时就医</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <el-button @click="showDetailDialog = false" round>关闭</el-button>
        <el-button
          v-if="currentVaccine && !currentVaccine.completed"
          type="primary"
          round
          @click="markAsCompleted(currentVaccine)"
        >
          标记已接种
        </el-button>
        <el-button
          v-else-if="currentVaccine?.completed"
          type="danger"
          plain
          round
          @click="cancelVaccination"
        >
          取消接种
        </el-button>
      </template>
    </el-dialog>

    <!-- 接种日期选择对话框 -->
    <el-dialog
      v-model="showDateDialog"
      title="📅 填写接种信息"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <el-form label-position="top">
        <el-form-item label="接种日期">
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择接种日期"
            style="width: 100%"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="接种机构 (选填)">
          <el-input v-model="vaccineNote" placeholder="如：社区卫生服务中心" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDateDialog = false" round>取消</el-button>
        <el-button type="primary" @click="confirmVaccination" round>确认接种</el-button>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog
      v-model="showExportDialog"
      title="📤 导出接种记录"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <div class="export-options">
        <div class="export-option" @click="exportData('json')">
          <div class="option-icon">📄</div>
          <div class="option-info">
            <h4>JSON 格式</h4>
            <p>完整数据备份</p>
          </div>
        </div>
        <div class="export-option" @click="exportData('csv')">
          <div class="option-icon">📊</div>
          <div class="option-info">
            <h4>CSV 格式</h4>
            <p>可用Excel打开</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 成功动画 -->
    <div class="success-animation" v-if="showSuccessAnimation">
      <div class="success-circle">
        <el-icon><Check /></el-icon>
      </div>
      <p>接种成功！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import {
  ArrowLeft, ArrowRight, ArrowDown, Check, Calendar,
  Download, InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const babyStore = useBabyStore()

interface Vaccine {
  id: string
  name: string
  description: string
  ageMonth: number
  type: string
  required: boolean
  completed: boolean
  completedDate?: Date
  note?: string
}

// 状态
const filterStatus = ref('all')
const showDateDialog = ref(false)
const showDetailDialog = ref(false)
const showExportDialog = ref(false)
const showLegend = ref(false)
const showTips = ref(false)
const showSuccessAnimation = ref(false)
const selectedDate = ref(new Date())
const vaccineNote = ref('')
const currentVaccine = ref<Vaccine | null>(null)

// 过滤标签
const filterTabs = computed(() => [
  { value: 'all', label: '全部', icon: '📋', count: totalVaccines.value },
  { value: 'completed', label: '已接种', icon: '✅', count: completedCount.value },
  { value: 'pending', label: '待接种', icon: '⏳', count: pendingCount.value },
  { value: 'free', label: '免费', icon: '🆓', count: freeCount.value },
  { value: 'paid', label: '自费', icon: '💰', count: paidCount.value }
])

// 疫苗数据
const vaccines = ref<Vaccine[]>([
  // 出生时
  { id: 'bcg', name: '卡介苗', description: '预防结核病', ageMonth: 0, type: '细菌性疫苗', required: true, completed: false },
  { id: 'hepb1', name: '乙肝疫苗(第1剂)', description: '预防乙型肝炎', ageMonth: 0, type: '病毒性疫苗', required: true, completed: false },

  // 1月龄
  { id: 'hepb2', name: '乙肝疫苗(第2剂)', description: '预防乙型肝炎', ageMonth: 1, type: '病毒性疫苗', required: true, completed: false },

  // 2月龄
  { id: 'polio1', name: '脊灰疫苗(第1剂)', description: '预防脊髓灰质炎', ageMonth: 2, type: '病毒性疫苗', required: true, completed: false },
  { id: 'dpt1', name: '百白破疫苗(第1剂)', description: '预防百日咳、白喉、破伤风', ageMonth: 2, type: '联合疫苗', required: true, completed: false },
  { id: 'hib1', name: 'Hib疫苗(第1剂)', description: '预防b型流感嗜血杆菌感染', ageMonth: 2, type: '细菌性疫苗', required: false, completed: false },
  { id: 'pcv1', name: '肺炎疫苗(第1剂)', description: '预防肺炎球菌感染', ageMonth: 2, type: '细菌性疫苗', required: false, completed: false },
  { id: 'rv1', name: '轮状病毒疫苗(第1剂)', description: '预防轮状病毒腹泻', ageMonth: 2, type: '病毒性疫苗', required: false, completed: false },

  // 3月龄
  { id: 'polio2', name: '脊灰疫苗(第2剂)', description: '预防脊髓灰质炎', ageMonth: 3, type: '病毒性疫苗', required: true, completed: false },
  { id: 'dpt2', name: '百白破疫苗(第2剂)', description: '预防百日咳、白喉、破伤风', ageMonth: 3, type: '联合疫苗', required: true, completed: false },
  { id: 'hib2', name: 'Hib疫苗(第2剂)', description: '预防b型流感嗜血杆菌感染', ageMonth: 3, type: '细菌性疫苗', required: false, completed: false },
  { id: 'pcv2', name: '肺炎疫苗(第2剂)', description: '预防肺炎球菌感染', ageMonth: 3, type: '细菌性疫苗', required: false, completed: false },

  // 4月龄
  { id: 'polio3', name: '脊灰疫苗(第3剂)', description: '预防脊髓灰质炎', ageMonth: 4, type: '病毒性疫苗', required: true, completed: false },
  { id: 'dpt3', name: '百白破疫苗(第3剂)', description: '预防百日咳、白喉、破伤风', ageMonth: 4, type: '联合疫苗', required: true, completed: false },
  { id: 'hib3', name: 'Hib疫苗(第3剂)', description: '预防b型流感嗜血杆菌感染', ageMonth: 4, type: '细菌性疫苗', required: false, completed: false },
  { id: 'pcv3', name: '肺炎疫苗(第3剂)', description: '预防肺炎球菌感染', ageMonth: 4, type: '细菌性疫苗', required: false, completed: false },

  // 6月龄
  { id: 'hepb3', name: '乙肝疫苗(第3剂)', description: '预防乙型肝炎', ageMonth: 6, type: '病毒性疫苗', required: true, completed: false },
  { id: 'menA1', name: 'A群流脑疫苗(第1剂)', description: '预防流行性脑脊髓膜炎', ageMonth: 6, type: '细菌性疫苗', required: true, completed: false },
  { id: 'flu1', name: '流感疫苗(第1剂)', description: '预防季节性流感', ageMonth: 6, type: '病毒性疫苗', required: false, completed: false },

  // 7月龄
  { id: 'flu2', name: '流感疫苗(第2剂)', description: '预防季节性流感', ageMonth: 7, type: '病毒性疫苗', required: false, completed: false },

  // 8月龄
  { id: 'measles1', name: '麻风疫苗', description: '预防麻疹、风疹', ageMonth: 8, type: '病毒性疫苗', required: true, completed: false },
  { id: 'je1', name: '乙脑减毒疫苗(第1剂)', description: '预防流行性乙型脑炎', ageMonth: 8, type: '病毒性疫苗', required: true, completed: false },

  // 9月龄
  { id: 'menA2', name: 'A群流脑疫苗(第2剂)', description: '预防流行性脑脊髓膜炎', ageMonth: 9, type: '细菌性疫苗', required: true, completed: false },

  // 12月龄
  { id: 'mmr', name: '麻腮风疫苗', description: '预防麻疹、腮腺炎、风疹', ageMonth: 12, type: '病毒性疫苗', required: true, completed: false },
  { id: 'varicella', name: '水痘疫苗(第1剂)', description: '预防水痘', ageMonth: 12, type: '病毒性疫苗', required: false, completed: false },
  { id: 'hepA', name: '甲肝疫苗', description: '预防甲型肝炎', ageMonth: 12, type: '病毒性疫苗', required: true, completed: false },
  { id: 'pcv4', name: '肺炎疫苗(加强)', description: '预防肺炎球菌感染', ageMonth: 12, type: '细菌性疫苗', required: false, completed: false },
])

// 计算属性
const totalVaccines = computed(() => vaccines.value.length)
const completedCount = computed(() => vaccines.value.filter(v => v.completed).length)
const pendingCount = computed(() => vaccines.value.filter(v => !v.completed).length)
const freeCount = computed(() => vaccines.value.filter(v => v.required).length)
const paidCount = computed(() => vaccines.value.filter(v => !v.required).length)
const completionRate = computed(() => Math.round((completedCount.value / totalVaccines.value) * 100))

const progressOffset = computed(() => {
  const circumference = 2 * Math.PI * 52
  return circumference * (1 - completionRate.value / 100)
})

const overdueCount = computed(() => {
  return vaccines.value.filter(v => !v.completed && v.ageMonth < babyStore.currentMonth).length
})

// 即将接种的疫苗
const upcomingVaccines = computed(() => {
  const currentMonth = babyStore.currentMonth
  return vaccines.value
    .filter(v => !v.completed && v.ageMonth <= currentMonth + 2)
    .sort((a, b) => a.ageMonth - b.ageMonth)
    .slice(0, 4)
})

// 按月龄分组的疫苗
const filteredVaccinesByAge = computed(() => {
  let filtered = vaccines.value

  switch (filterStatus.value) {
    case 'completed':
      filtered = filtered.filter(v => v.completed)
      break
    case 'pending':
      filtered = filtered.filter(v => !v.completed)
      break
    case 'free':
      filtered = filtered.filter(v => v.required)
      break
    case 'paid':
      filtered = filtered.filter(v => !v.required)
      break
  }

  const groups: Record<number, Vaccine[]> = {}
  filtered.forEach(vaccine => {
    const key = vaccine.ageMonth
    if (!groups[key]) groups[key] = []
    groups[key].push(vaccine)
  })

  return groups
})

// 方法
const isOverdue = (vaccine: Vaccine) => vaccine.ageMonth < babyStore.currentMonth
const isCurrent = (vaccine: Vaccine) => vaccine.ageMonth === babyStore.currentMonth

const isGroupCompleted = (group: Vaccine[]) => group.every(v => v.completed)

const getGroupStatus = (group: Vaccine[]) => {
  if (group.every(v => v.completed)) return 'completed'
  if (group.some(v => v.completed)) return 'partial'
  return 'pending'
}

const showVaccineDetail = (vaccine: Vaccine) => {
  currentVaccine.value = vaccine
  showDetailDialog.value = true
}

const markAsCompleted = (vaccine: Vaccine) => {
  currentVaccine.value = vaccine
  selectedDate.value = new Date()
  vaccineNote.value = ''
  showDetailDialog.value = false
  showDateDialog.value = true
}

const toggleVaccine = (vaccine: Vaccine) => {
  if (vaccine.completed) {
    cancelVaccinationConfirm(vaccine)
  } else {
    markAsCompleted(vaccine)
  }
}

const confirmVaccination = () => {
  if (currentVaccine.value) {
    currentVaccine.value.completed = true
    currentVaccine.value.completedDate = selectedDate.value
    currentVaccine.value.note = vaccineNote.value || undefined
    saveVaccines()
    showDateDialog.value = false

    // 显示成功动画
    showSuccessAnimation.value = true
    setTimeout(() => {
      showSuccessAnimation.value = false
    }, 1500)

    ElMessage.success(`${currentVaccine.value.name} 接种成功 🎉`)
  }
}

const cancelVaccination = async () => {
  if (!currentVaccine.value) return
  await cancelVaccinationConfirm(currentVaccine.value)
  showDetailDialog.value = false
}

const cancelVaccinationConfirm = async (vaccine: Vaccine) => {
  try {
    await ElMessageBox.confirm('确定要取消该疫苗的接种记录吗？', '取消接种', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    vaccine.completed = false
    vaccine.completedDate = undefined
    vaccine.note = undefined
    saveVaccines()
    ElMessage.info('已取消接种记录')
  } catch {
    // 用户取消
  }
}

const formatDate = (date?: Date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const disabledDate = (date: Date) => date > new Date()

const saveVaccines = () => {
  localStorage.setItem('vaccineRecords', JSON.stringify(vaccines.value))
}

const loadVaccines = () => {
  const saved = localStorage.getItem('vaccineRecords')
  if (saved) {
    const savedVaccines = JSON.parse(saved)
    vaccines.value = vaccines.value.map(v => {
      const savedV = savedVaccines.find((sv: Vaccine) => sv.id === v.id)
      if (savedV) {
        return {
          ...v,
          completed: savedV.completed,
          completedDate: savedV.completedDate ? new Date(savedV.completedDate) : undefined,
          note: savedV.note
        }
      }
      return v
    })
  }
}

const exportData = (format: 'json' | 'csv') => {
  let content: string
  let filename: string
  let type: string

  if (format === 'json') {
    content = JSON.stringify(vaccines.value, null, 2)
    filename = 'vaccine-records.json'
    type = 'application/json'
  } else {
    const headers = ['疫苗名称', '月龄', '类型', '免费/自费', '状态', '接种日期', '备注']
    const rows = vaccines.value.map(v => [
      v.name,
      v.ageMonth,
      v.type,
      v.required ? '免费' : '自费',
      v.completed ? '已接种' : '未接种',
      v.completedDate ? formatDate(v.completedDate) : '',
      v.note || ''
    ])
    content = [headers, ...rows].map(row => row.join(',')).join('\n')
    filename = 'vaccine-records.csv'
    type = 'text/csv'
  }

  const blob = new Blob(['\ufeff' + content], { type: `${type};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)

  showExportDialog.value = false
  ElMessage.success('导出成功')
}

onMounted(() => {
  loadVaccines()
})
</script>

<style scoped>
.vaccine-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #e8f5e9 0%, #ffffff 40%, #f1f8e9 100%);
  padding-bottom: 40px;
}

/* 页面头部 */
.page-header {
  position: relative;
  background: linear-gradient(135deg, #43a047 0%, #66bb6a 50%, #81c784 100%);
  padding: 20px;
  color: white;
  border-radius: 0 0 32px 32px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.header-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.shape-1 {
  width: 150px;
  height: 150px;
  top: -50px;
  right: -30px;
}

.shape-2 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  left: 20%;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 30%;
  left: -20px;
}

.header-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn,
.action-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
}

.header-info h1 {
  font-size: 22px;
  margin: 0 0 4px 0;
}

.header-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

/* 进度卡片 */
.progress-section {
  padding: 0 20px;
  margin-top: -20px;
  position: relative;
  z-index: 10;
}

.progress-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(67, 160, 71, 0.2);
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.progress-ring {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-ring svg {
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: #e8f5e9;
  stroke-width: 8;
}

.ring-progress {
  fill: none;
  stroke: url(#progressGradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 326.73;
  transition: stroke-dashoffset 0.8s ease;
}

.progress-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-percent {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #43a047;
}

.progress-label {
  font-size: 12px;
  color: #666;
}

.progress-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stat-item.completed .stat-value {
  color: #43a047;
}

.stat-item.pending .stat-value {
  color: #ff9800;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

/* 即将接种 */
.upcoming-section {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 20px;
}

.upcoming-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.upcoming-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-left: 4px solid #81c784;
}

.upcoming-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.upcoming-card.overdue {
  border-left-color: #f44336;
  background: linear-gradient(135deg, #ffebee 0%, white 100%);
}

.upcoming-card.current {
  border-left-color: #ff9800;
  background: linear-gradient(135deg, #fff8e1 0%, white 100%);
}

.card-status {
  position: absolute;
  top: 8px;
  right: 8px;
}

.status-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.status-badge.overdue {
  background: #ffcdd2;
  color: #c62828;
}

.status-badge.current {
  background: #ffe0b2;
  color: #e65100;
}

.status-badge.upcoming {
  background: #c8e6c9;
  color: #2e7d32;
}

.card-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-info h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info p {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
}

.card-meta {
  display: flex;
  gap: 8px;
}

.age-tag,
.type-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.age-tag {
  background: #e3f2fd;
  color: #1976d2;
}

.type-tag.free {
  background: #e8f5e9;
  color: #43a047;
}

.type-tag.paid {
  background: #fff3e0;
  color: #f57c00;
}

.vaccinate-btn {
  flex-shrink: 0;
}

/* 过滤标签 */
.filter-section {
  padding: 0 20px 20px;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-tab:hover {
  background: #f5f5f5;
}

.filter-tab.active {
  background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
  color: white;
}

.tab-icon {
  font-size: 16px;
}

.tab-label {
  font-size: 14px;
  font-weight: 500;
}

.tab-count {
  font-size: 12px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

/* 时间线 */
.timeline-section {
  padding: 0 20px 20px;
}

.legend-box {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.free {
  background: #43a047;
}

.legend-dot.paid {
  background: #ff9800;
}

.legend-check {
  width: 16px;
  height: 16px;
  background: #43a047;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.legend-check::after {
  content: '✓';
  color: white;
  font-size: 10px;
}

.vaccine-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-group {
  position: relative;
}

.timeline-group.current-month {
  background: linear-gradient(135deg, #fff8e1 0%, transparent 100%);
  margin: 0 -20px;
  padding: 16px 20px;
  border-radius: 16px;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.timeline-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: #bdbdbd;
  z-index: 1;
}

.node-circle.completed {
  background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
}

.node-circle.partial {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
}

.node-circle.pending {
  background: #e0e0e0;
  color: #666;
}

.node-line {
  position: absolute;
  top: 36px;
  width: 2px;
  height: calc(100% + 24px);
  background: #e0e0e0;
}

.timeline-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.month-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.vaccine-count {
  font-size: 13px;
  color: #666;
}

.timeline-content {
  margin-left: 48px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vaccine-item {
  background: white;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s ease;
}

.vaccine-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.vaccine-item.completed {
  background: linear-gradient(135deg, #f1f8e9 0%, white 100%);
}

.item-checkbox {
  flex-shrink: 0;
}

.checkbox-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkbox-circle:hover {
  border-color: #43a047;
}

.checkbox-circle.checked {
  background: #43a047;
  border-color: #43a047;
  color: white;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.item-desc {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.type-label {
  font-size: 12px;
  color: #999;
}

.date-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #43a047;
}

.item-arrow {
  color: #ccc;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

/* 接种须知 */
.tips-section {
  padding: 0 20px;
}

.tips-section .section-header {
  background: white;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tips-section .section-header .el-icon {
  transition: transform 0.3s ease;
}

.tips-section .section-header .el-icon.rotated {
  transform: rotate(180deg);
}

.tips-content {
  background: white;
  border-radius: 0 0 16px 16px;
  padding: 16px;
  margin-top: -8px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.tip-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 12px;
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.tip-text p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* 详情弹窗 */
.detail-content {
  padding: 10px 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.detail-icon {
  font-size: 48px;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-info {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: 500;
}

.info-value.completed {
  color: #43a047;
}

.info-value.pending {
  color: #ff9800;
}

.detail-tips {
  background: #e8f5e9;
  border-radius: 12px;
  padding: 16px;
}

.detail-tips h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
}

.detail-tips ul {
  margin: 0;
  padding-left: 20px;
}

.detail-tips li {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

/* 导出选项 */
.export-options {
  display: flex;
  gap: 16px;
}

.export-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-option:hover {
  background: #f0f0f0;
}

.option-icon {
  font-size: 32px;
}

.option-info h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
}

.option-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* 成功动画 */
.success-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.success-circle {
  width: 80px;
  height: 80px;
  background: #43a047;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  animation: scaleIn 0.5s ease;
  margin-bottom: 16px;
}

.success-animation p {
  color: white;
  font-size: 18px;
  font-weight: 500;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 响应式 */
@media (max-width: 480px) {
  .progress-card {
    flex-direction: column;
  }

  .progress-stats {
    width: 100%;
    justify-content: space-around;
  }

  .upcoming-cards {
    grid-template-columns: 1fr;
  }

  .tips-content {
    grid-template-columns: 1fr;
  }
}
</style>

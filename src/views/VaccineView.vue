<template>
  <div class="vaccine-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <el-button class="back-btn" @click="router.back()" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-info">
          <h1>💉 疫苗接种提醒</h1>
          <p>守护宝宝健康，按时接种疫苗</p>
        </div>
      </div>
    </div>

    <!-- 接种进度概览 -->
    <div class="progress-section">
      <el-card class="progress-card">
        <div class="progress-content">
          <div class="progress-circle">
            <el-progress
              type="circle"
              :percentage="completionRate"
              :width="120"
              :stroke-width="10"
              :color="progressColors"
            >
              <template #default>
                <div class="progress-inner">
                  <span class="progress-num">{{ completedCount }}</span>
                  <span class="progress-text">已完成</span>
                </div>
              </template>
            </el-progress>
          </div>
          <div class="progress-stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalVaccines }}</span>
              <span class="stat-label">总疫苗数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value completed">{{ completedCount }}</span>
              <span class="stat-label">已接种</span>
            </div>
            <div class="stat-item">
              <span class="stat-value pending">{{ pendingCount }}</span>
              <span class="stat-label">待接种</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 即将接种提醒 -->
    <div class="upcoming-section" v-if="upcomingVaccines.length">
      <div class="section-header">
        <h2>⏰ 即将接种</h2>
      </div>
      <div class="upcoming-list">
        <el-card
          v-for="vaccine in upcomingVaccines"
          :key="vaccine.id"
          class="upcoming-card"
          :class="{ urgent: isUrgent(vaccine) }"
        >
          <div class="vaccine-info">
            <div class="vaccine-icon">💉</div>
            <div class="vaccine-details">
              <h3>{{ vaccine.name }}</h3>
              <p class="vaccine-desc">{{ vaccine.description }}</p>
              <div class="vaccine-meta">
                <el-tag size="small" :type="getAgeTagType(vaccine.ageMonth)">
                  {{ vaccine.ageMonth }}月龄
                </el-tag>
                <span class="vaccine-type">{{ vaccine.type }}</span>
              </div>
            </div>
          </div>
          <div class="vaccine-actions">
            <el-button
              type="primary"
              size="small"
              @click="markAsCompleted(vaccine)"
            >
              标记已接种
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 疫苗列表 -->
    <div class="vaccine-list-section">
      <div class="section-header">
        <h2>📋 疫苗接种表</h2>
        <el-radio-group v-model="filterStatus" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="completed">已接种</el-radio-button>
          <el-radio-button label="pending">待接种</el-radio-button>
        </el-radio-group>
      </div>

      <div class="vaccine-timeline">
        <div
          v-for="(group, ageMonth) in filteredVaccinesByAge"
          :key="ageMonth"
          class="age-group"
        >
          <div class="age-header">
            <div class="age-badge">{{ ageMonth }}月龄</div>
            <div class="age-line"></div>
          </div>
          <div class="vaccine-cards">
            <el-card
              v-for="vaccine in group"
              :key="vaccine.id"
              class="vaccine-card"
              :class="{ completed: vaccine.completed }"
            >
              <div class="card-header">
                <div class="vaccine-name">
                  <el-icon v-if="vaccine.completed" class="check-icon"><Check /></el-icon>
                  <span>{{ vaccine.name }}</span>
                </div>
                <el-tag :type="vaccine.required ? 'danger' : 'info'" size="small">
                  {{ vaccine.required ? '免费' : '自费' }}
                </el-tag>
              </div>
              <p class="vaccine-description">{{ vaccine.description }}</p>
              <div class="card-footer">
                <span class="vaccine-type-tag">{{ vaccine.type }}</span>
                <el-checkbox
                  v-model="vaccine.completed"
                  @change="toggleVaccine(vaccine)"
                >
                  {{ vaccine.completed ? '已接种' : '未接种' }}
                </el-checkbox>
              </div>
              <div v-if="vaccine.completed && vaccine.completedDate" class="completed-info">
                <el-icon><Calendar /></el-icon>
                <span>接种日期：{{ formatDate(vaccine.completedDate) }}</span>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 接种日期选择对话框 -->
    <el-dialog v-model="showDateDialog" title="📅 选择接种日期" width="400px">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择接种日期"
        style="width: 100%"
        :disabled-date="disabledDate"
      />
      <template #footer>
        <el-button @click="showDateDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmVaccination">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import { ArrowLeft, Check, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

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
}

const filterStatus = ref('all')
const showDateDialog = ref(false)
const selectedDate = ref(new Date())
const currentVaccine = ref<Vaccine | null>(null)

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

  // 3月龄
  { id: 'polio2', name: '脊灰疫苗(第2剂)', description: '预防脊髓灰质炎', ageMonth: 3, type: '病毒性疫苗', required: true, completed: false },
  { id: 'dpt2', name: '百白破疫苗(第2剂)', description: '预防百日咳、白喉、破伤风', ageMonth: 3, type: '联合疫苗', required: true, completed: false },

  // 4月龄
  { id: 'polio3', name: '脊灰疫苗(第3剂)', description: '预防脊髓灰质炎', ageMonth: 4, type: '病毒性疫苗', required: true, completed: false },
  { id: 'dpt3', name: '百白破疫苗(第3剂)', description: '预防百日咳、白喉、破伤风', ageMonth: 4, type: '联合疫苗', required: true, completed: false },

  // 5月龄
  { id: 'hib1', name: 'Hib疫苗(第1剂)', description: '预防b型流感嗜血杆菌感染', ageMonth: 5, type: '细菌性疫苗', required: false, completed: false },

  // 6月龄
  { id: 'hepb3', name: '乙肝疫苗(第3剂)', description: '预防乙型肝炎', ageMonth: 6, type: '病毒性疫苗', required: true, completed: false },
  { id: 'menA1', name: 'A群流脑疫苗(第1剂)', description: '预防流行性脑脊髓膜炎', ageMonth: 6, type: '细菌性疫苗', required: true, completed: false },

  // 8月龄
  { id: 'measles1', name: '麻风疫苗', description: '预防麻疹、风疹', ageMonth: 8, type: '病毒性疫苗', required: true, completed: false },
  { id: 'je1', name: '乙脑疫苗(第1剂)', description: '预防流行性乙型脑炎', ageMonth: 8, type: '病毒性疫苗', required: true, completed: false },

  // 9月龄
  { id: 'menA2', name: 'A群流脑疫苗(第2剂)', description: '预防流行性脑脊髓膜炎', ageMonth: 9, type: '细菌性疫苗', required: true, completed: false },

  // 12月龄
  { id: 'hepA', name: '甲肝疫苗', description: '预防甲型肝炎', ageMonth: 12, type: '病毒性疫苗', required: true, completed: false },
  { id: 'varicella', name: '水痘疫苗', description: '预防水痘', ageMonth: 12, type: '病毒性疫苗', required: false, completed: false },
])

// 从本地存储加载疫苗数据
onMounted(() => {
  const saved = localStorage.getItem('vaccineRecords')
  if (saved) {
    const savedVaccines = JSON.parse(saved)
    vaccines.value = vaccines.value.map(v => {
      const savedV = savedVaccines.find((sv: Vaccine) => sv.id === v.id)
      if (savedV) {
        return { ...v, completed: savedV.completed, completedDate: savedV.completedDate ? new Date(savedV.completedDate) : undefined }
      }
      return v
    })
  }
})

// 保存疫苗数据到本地存储
const saveVaccines = () => {
  localStorage.setItem('vaccineRecords', JSON.stringify(vaccines.value))
}

const totalVaccines = computed(() => vaccines.value.length)
const completedCount = computed(() => vaccines.value.filter(v => v.completed).length)
const pendingCount = computed(() => vaccines.value.filter(v => !v.completed).length)
const completionRate = computed(() => Math.round((completedCount.value / totalVaccines.value) * 100))

const progressColors = [
  { color: '#f56c6c', percentage: 30 },
  { color: '#e6a23c', percentage: 60 },
  { color: '#67c23a', percentage: 100 },
]

// 即将接种的疫苗（基于宝宝当前月龄）
const upcomingVaccines = computed(() => {
  const currentMonth = babyStore.currentMonth
  return vaccines.value
    .filter(v => !v.completed && v.ageMonth >= currentMonth && v.ageMonth <= currentMonth + 2)
    .slice(0, 3)
})

// 按月龄分组的疫苗
const filteredVaccinesByAge = computed(() => {
  let filtered = vaccines.value
  if (filterStatus.value === 'completed') {
    filtered = filtered.filter(v => v.completed)
  } else if (filterStatus.value === 'pending') {
    filtered = filtered.filter(v => !v.completed)
  }

  return filtered.reduce((groups, vaccine) => {
    const key = vaccine.ageMonth
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(vaccine)
    return groups
  }, {} as Record<number, Vaccine[]>)
})

const isUrgent = (vaccine: Vaccine) => {
  return vaccine.ageMonth <= babyStore.currentMonth
}

const getAgeTagType = (ageMonth: number) => {
  const current = babyStore.currentMonth
  if (ageMonth < current) return 'danger'
  if (ageMonth === current) return 'warning'
  return 'success'
}

const markAsCompleted = (vaccine: Vaccine) => {
  currentVaccine.value = vaccine
  selectedDate.value = new Date()
  showDateDialog.value = true
}

const toggleVaccine = (vaccine: Vaccine) => {
  if (vaccine.completed) {
    currentVaccine.value = vaccine
    selectedDate.value = new Date()
    showDateDialog.value = true
  } else {
    vaccine.completedDate = undefined
    saveVaccines()
  }
}

const confirmVaccination = () => {
  if (currentVaccine.value) {
    currentVaccine.value.completed = true
    currentVaccine.value.completedDate = selectedDate.value
    saveVaccines()
    showDateDialog.value = false
    ElMessage.success(`${currentVaccine.value.name} 已标记为接种完成 🎉`)
  }
}

const formatDate = (date: Date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const disabledDate = (date: Date) => {
  return date > new Date()
}
</script>

<style scoped>
.vaccine-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #e8f5e9 0%, #ffffff 50%, #f1f8e9 100%);
  padding-bottom: 40px;
}

.page-header {
  background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
  padding: 24px;
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

.header-info h1 {
  font-size: 24px;
  margin: 0 0 4px 0;
}

.header-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

/* 进度区域 */
.progress-section {
  padding: 0 20px;
  margin-bottom: 24px;
}

.progress-card {
  border-radius: 20px !important;
  border: none !important;
  box-shadow: 0 8px 32px rgba(67, 160, 71, 0.15) !important;
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.progress-inner {
  text-align: center;
}

.progress-num {
  font-size: 32px;
  font-weight: 800;
  color: #43a047;
}

.progress-text {
  display: block;
  font-size: 12px;
  color: #666;
}

.progress-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-value.completed {
  color: #43a047;
}

.stat-value.pending {
  color: #ff9800;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

/* 即将接种 */
.upcoming-section {
  padding: 0 20px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  margin: 0;
  color: #333;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upcoming-card {
  border-radius: 16px !important;
  border-left: 4px solid #43a047 !important;
  transition: all 0.3s ease !important;
}

.upcoming-card.urgent {
  border-left-color: #f44336 !important;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%) !important;
}

.upcoming-card :deep(.el-card__body) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px !important;
}

.vaccine-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.vaccine-icon {
  font-size: 32px;
}

.vaccine-details h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.vaccine-desc {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
}

.vaccine-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.vaccine-type {
  font-size: 12px;
  color: #999;
}

/* 疫苗列表 */
.vaccine-list-section {
  padding: 0 20px;
}

.vaccine-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.age-group {
  position: relative;
}

.age-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.age-badge {
  background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.age-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #43a047 0%, transparent 100%);
}

.vaccine-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.vaccine-card {
  border-radius: 16px !important;
  transition: all 0.3s ease !important;
  border: 2px solid transparent !important;
}

.vaccine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

.vaccine-card.completed {
  background: linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%) !important;
  border-color: #43a047 !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vaccine-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 15px;
}

.check-icon {
  color: #43a047;
}

.vaccine-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vaccine-type-tag {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.completed-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e0e0e0;
  font-size: 13px;
  color: #43a047;
}

@media (max-width: 768px) {
  .progress-content {
    flex-direction: column;
    gap: 20px;
  }

  .upcoming-card :deep(.el-card__body) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .vaccine-cards {
    grid-template-columns: 1fr;
  }
}
</style>

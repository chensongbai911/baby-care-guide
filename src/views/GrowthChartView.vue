<template>
  <div class="growth-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <el-button class="back-btn" @click="router.back()" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-info">
          <h1>📈 成长曲线图表</h1>
          <p>记录宝宝的身高体重变化</p>
        </div>
      </div>
    </div>

    <!-- 宝宝当前数据卡片 -->
    <div class="current-stats">
      <el-card class="stats-card">
        <div class="stats-grid">
          <div class="stat-box weight">
            <div class="stat-icon">⚖️</div>
            <div class="stat-info">
              <span class="stat-label">当前体重</span>
              <span class="stat-value">{{ latestRecord ? latestRecord.weight : '--' }} <small>kg</small></span>
            </div>
          </div>
          <div class="stat-box height">
            <div class="stat-icon">📏</div>
            <div class="stat-info">
              <span class="stat-label">当前身高</span>
              <span class="stat-value">{{ latestRecord ? latestRecord.height : '--' }} <small>cm</small></span>
            </div>
          </div>
          <div class="stat-box head">
            <div class="stat-icon">🧒</div>
            <div class="stat-info">
              <span class="stat-label">头围</span>
              <span class="stat-value">{{ latestRecord ? latestRecord.headCircumference : '--' }} <small>cm</small></span>
            </div>
          </div>
          <div class="stat-box age">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <span class="stat-label">当前月龄</span>
              <span class="stat-value">{{ babyStore.currentMonth }} <small>月</small></span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 添加记录按钮 -->
    <div class="add-record-section">
      <el-button type="primary" size="large" round @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加成长记录
      </el-button>
    </div>

    <!-- 图表切换 -->
    <div class="chart-section">
      <div class="section-header">
        <h2>📊 成长趋势</h2>
        <el-radio-group v-model="chartType" size="small">
          <el-radio-button label="weight">体重</el-radio-button>
          <el-radio-button label="height">身高</el-radio-button>
          <el-radio-button label="head">头围</el-radio-button>
        </el-radio-group>
      </div>

      <el-card class="chart-card">
        <div class="chart-container" ref="chartContainer">
          <div v-if="growthRecords.length === 0" class="empty-chart">
            <div class="empty-icon">📈</div>
            <p>暂无记录，快来添加宝宝的成长数据吧！</p>
          </div>
          <div v-else class="chart-wrapper">
            <!-- 简易图表展示 -->
            <div class="simple-chart">
              <div class="chart-y-axis">
                <span v-for="label in yAxisLabels" :key="label">{{ label }}</span>
              </div>
              <div class="chart-body">
                <div class="chart-grid">
                  <div class="grid-line" v-for="i in 5" :key="i"></div>
                </div>
                <div class="chart-bars">
                  <div
                    v-for="record in growthRecords"
                    :key="record.id"
                    class="bar-item"
                    :style="{ height: getBarHeight(record) + '%' }"
                  >
                    <div class="bar" :class="chartType">
                      <span class="bar-value">{{ getChartValue(record) }}</span>
                    </div>
                    <span class="bar-label">{{ record.ageMonth }}月</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 历史记录 -->
    <div class="records-section">
      <div class="section-header">
        <h2>📝 成长记录</h2>
      </div>

      <div class="records-list">
        <el-card
          v-for="record in sortedRecords"
          :key="record.id"
          class="record-card"
        >
          <div class="record-header">
            <div class="record-age">
              <span class="age-num">{{ record.ageMonth }}</span>
              <span class="age-text">月龄</span>
            </div>
            <span class="record-date">{{ formatDate(record.date) }}</span>
          </div>
          <div class="record-body">
            <div class="record-item">
              <span class="item-label">体重</span>
              <span class="item-value">{{ record.weight }} kg</span>
            </div>
            <div class="record-item">
              <span class="item-label">身高</span>
              <span class="item-value">{{ record.height }} cm</span>
            </div>
            <div class="record-item">
              <span class="item-label">头围</span>
              <span class="item-value">{{ record.headCircumference }} cm</span>
            </div>
          </div>
          <div class="record-note" v-if="record.note">
            <el-icon><Comment /></el-icon>
            <span>{{ record.note }}</span>
          </div>
          <div class="record-actions">
            <el-button text type="primary" size="small" @click="editRecord(record)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button text type="danger" size="small" @click="deleteRecord(record)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </div>
        </el-card>
      </div>

      <div v-if="growthRecords.length === 0" class="empty-records">
        <div class="empty-icon">📋</div>
        <p>还没有成长记录</p>
        <el-button type="primary" @click="showAddDialog = true">添加第一条记录</el-button>
      </div>
    </div>

    <!-- 参考标准 -->
    <div class="reference-section">
      <div class="section-header">
        <h2>📖 参考标准</h2>
        <el-tag type="info" size="small">WHO标准</el-tag>
      </div>
      <el-card class="reference-card">
        <el-table :data="referenceData" style="width: 100%" size="small">
          <el-table-column prop="month" label="月龄" width="80" />
          <el-table-column prop="weightBoy" label="男宝体重(kg)" />
          <el-table-column prop="weightGirl" label="女宝体重(kg)" />
          <el-table-column prop="heightBoy" label="男宝身高(cm)" />
          <el-table-column prop="heightGirl" label="女宝身高(cm)" />
        </el-table>
      </el-card>
    </div>

    <!-- 添加/编辑记录对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingRecord ? '✏️ 编辑成长记录' : '📝 添加成长记录'"
      width="500px"
    >
      <el-form :model="recordForm" label-width="80px" label-position="top">
        <el-form-item label="记录日期">
          <el-date-picker
            v-model="recordForm.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="宝宝月龄">
          <el-input-number
            v-model="recordForm.ageMonth"
            :min="0"
            :max="12"
            style="width: 100%"
          />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="体重(kg)">
              <el-input-number
                v-model="recordForm.weight"
                :precision="2"
                :step="0.1"
                :min="0"
                :max="20"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身高(cm)">
              <el-input-number
                v-model="recordForm.height"
                :precision="1"
                :step="0.5"
                :min="0"
                :max="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="头围(cm)">
          <el-input-number
            v-model="recordForm.headCircumference"
            :precision="1"
            :step="0.5"
            :min="0"
            :max="60"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="recordForm.note"
            type="textarea"
            :rows="2"
            placeholder="记录宝宝这个阶段的特别之处..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="saveRecord">
          {{ editingRecord ? '保存修改' : '添加记录' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import { ArrowLeft, Plus, Edit, Delete, Comment } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const babyStore = useBabyStore()

interface GrowthRecord {
  id: string
  date: Date
  ageMonth: number
  weight: number
  height: number
  headCircumference: number
  note?: string
}

const showAddDialog = ref(false)
const chartType = ref<'weight' | 'height' | 'head'>('weight')
const editingRecord = ref<GrowthRecord | null>(null)
const chartContainer = ref<HTMLElement | null>(null)

const recordForm = ref({
  date: new Date(),
  ageMonth: babyStore.currentMonth,
  weight: 0,
  height: 0,
  headCircumference: 0,
  note: ''
})

const growthRecords = ref<GrowthRecord[]>([])

// WHO参考数据
const referenceData = [
  { month: '0', weightBoy: '3.3', weightGirl: '3.2', heightBoy: '49.9', heightGirl: '49.1' },
  { month: '1', weightBoy: '4.5', weightGirl: '4.2', heightBoy: '54.7', heightGirl: '53.7' },
  { month: '2', weightBoy: '5.6', weightGirl: '5.1', heightBoy: '58.4', heightGirl: '57.1' },
  { month: '3', weightBoy: '6.4', weightGirl: '5.8', heightBoy: '61.4', heightGirl: '59.8' },
  { month: '4', weightBoy: '7.0', weightGirl: '6.4', heightBoy: '63.9', heightGirl: '62.1' },
  { month: '5', weightBoy: '7.5', weightGirl: '6.9', heightBoy: '65.9', heightGirl: '64.0' },
  { month: '6', weightBoy: '7.9', weightGirl: '7.3', heightBoy: '67.6', heightGirl: '65.7' },
  { month: '7', weightBoy: '8.3', weightGirl: '7.6', heightBoy: '69.2', heightGirl: '67.3' },
  { month: '8', weightBoy: '8.6', weightGirl: '7.9', heightBoy: '70.6', heightGirl: '68.7' },
  { month: '9', weightBoy: '8.9', weightGirl: '8.2', heightBoy: '72.0', heightGirl: '70.1' },
  { month: '10', weightBoy: '9.2', weightGirl: '8.5', heightBoy: '73.3', heightGirl: '71.5' },
  { month: '11', weightBoy: '9.4', weightGirl: '8.7', heightBoy: '74.5', heightGirl: '72.8' },
  { month: '12', weightBoy: '9.6', weightGirl: '8.9', heightBoy: '75.7', heightGirl: '74.0' },
]

const sortedRecords = computed(() => {
  return [...growthRecords.value].sort((a, b) => b.ageMonth - a.ageMonth)
})

const latestRecord = computed(() => {
  if (growthRecords.value.length === 0) return null
  return sortedRecords.value[0]
})

const yAxisLabels = computed(() => {
  if (chartType.value === 'weight') {
    return ['12', '9', '6', '3', '0']
  } else if (chartType.value === 'height') {
    return ['80', '60', '40', '20', '0']
  } else {
    return ['50', '40', '30', '20', '0']
  }
})

const getChartValue = (record: GrowthRecord) => {
  if (chartType.value === 'weight') return record.weight
  if (chartType.value === 'height') return record.height
  return record.headCircumference
}

const getBarHeight = (record: GrowthRecord) => {
  const value = getChartValue(record)
  let max = 12
  if (chartType.value === 'height') max = 80
  if (chartType.value === 'head') max = 50
  return Math.min((value / max) * 100, 100)
}

onMounted(() => {
  loadRecords()
})

const loadRecords = () => {
  const saved = localStorage.getItem('growthRecords')
  if (saved) {
    growthRecords.value = JSON.parse(saved).map((r: any) => ({
      ...r,
      date: new Date(r.date)
    }))
  }
}

const saveRecords = () => {
  localStorage.setItem('growthRecords', JSON.stringify(growthRecords.value))
}

const saveRecord = () => {
  if (recordForm.value.weight <= 0 && recordForm.value.height <= 0) {
    ElMessage.warning('请至少填写体重或身高')
    return
  }

  if (editingRecord.value) {
    // 编辑模式
    const index = growthRecords.value.findIndex(r => r.id === editingRecord.value!.id)
    if (index !== -1) {
      growthRecords.value[index] = {
        ...editingRecord.value,
        ...recordForm.value
      }
    }
    ElMessage.success('记录已更新 ✨')
  } else {
    // 新增模式
    const newRecord: GrowthRecord = {
      id: Date.now().toString(),
      ...recordForm.value
    }
    growthRecords.value.push(newRecord)
    ElMessage.success('记录已添加 🎉')
  }

  saveRecords()
  cancelEdit()
}

const editRecord = (record: GrowthRecord) => {
  editingRecord.value = record
  recordForm.value = {
    date: new Date(record.date),
    ageMonth: record.ageMonth,
    weight: record.weight,
    height: record.height,
    headCircumference: record.headCircumference,
    note: record.note || ''
  }
  showAddDialog.value = true
}

const deleteRecord = async (record: GrowthRecord) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    growthRecords.value = growthRecords.value.filter(r => r.id !== record.id)
    saveRecords()
    ElMessage.success('记录已删除')
  } catch {
    // 取消删除
  }
}

const cancelEdit = () => {
  showAddDialog.value = false
  editingRecord.value = null
  recordForm.value = {
    date: new Date(),
    ageMonth: babyStore.currentMonth,
    weight: 0,
    height: 0,
    headCircumference: 0,
    note: ''
  }
}

const formatDate = (date: Date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const disabledDate = (date: Date) => {
  return date > new Date()
}
</script>

<style scoped>
.growth-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #e3f2fd 0%, #ffffff 50%, #f3e5f5 100%);
  padding-bottom: 40px;
}

.page-header {
  background: linear-gradient(135deg, #5c6bc0 0%, #7e57c2 100%);
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

/* 当前数据卡片 */
.current-stats {
  padding: 0 20px;
  margin-bottom: 20px;
}

.stats-card {
  border-radius: 20px !important;
  border: none !important;
  box-shadow: 0 8px 32px rgba(92, 107, 192, 0.15) !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
}

.stat-box.weight {
  background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
}

.stat-box.height {
  background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
}

.stat-box.head {
  background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%);
}

.stat-box.age {
  background: linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%);
}

.stat-icon {
  font-size: 32px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stat-value small {
  font-size: 14px;
  font-weight: 400;
  color: #666;
}

/* 添加按钮 */
.add-record-section {
  padding: 0 20px;
  margin-bottom: 24px;
  text-align: center;
}

/* 图表区域 */
.chart-section {
  padding: 0 20px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-header h2 {
  font-size: 20px;
  margin: 0;
  color: #333;
}

.chart-card {
  border-radius: 20px !important;
  border: none !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
}

.chart-container {
  min-height: 250px;
}

.empty-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 简易图表 */
.simple-chart {
  display: flex;
  height: 250px;
  padding: 20px 0;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 12px;
  font-size: 12px;
  color: #999;
  width: 40px;
  text-align: right;
}

.chart-body {
  flex: 1;
  position: relative;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  height: 1px;
  background: #eee;
}

.chart-bars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding-bottom: 24px;
}

.bar-item {
  flex: 1;
  max-width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar {
  width: 100%;
  border-radius: 8px 8px 0 0;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
  transition: all 0.3s ease;
}

.bar.weight {
  background: linear-gradient(180deg, #66bb6a 0%, #43a047 100%);
}

.bar.height {
  background: linear-gradient(180deg, #42a5f5 0%, #1976d2 100%);
}

.bar.head {
  background: linear-gradient(180deg, #ffb74d 0%, #f57c00 100%);
}

.bar-value {
  font-size: 11px;
  color: white;
  font-weight: 600;
}

.bar-label {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

/* 记录列表 */
.records-section {
  padding: 0 20px;
  margin-bottom: 24px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  border-radius: 16px !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.3s ease !important;
}

.record-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-age {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.age-num {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #5c6bc0 0%, #7e57c2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.age-text {
  font-size: 14px;
  color: #666;
}

.record-date {
  font-size: 13px;
  color: #999;
}

.record-body {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.record-item {
  display: flex;
  flex-direction: column;
}

.item-label {
  font-size: 12px;
  color: #999;
}

.item-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.record-note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.record-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty-records {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-records .empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 参考标准 */
.reference-section {
  padding: 0 20px;
}

.reference-card {
  border-radius: 16px !important;
  border: none !important;
  overflow: hidden;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .record-body {
    gap: 16px;
  }

  .chart-bars {
    gap: 4px;
  }

  .bar-item {
    max-width: 40px;
  }
}
</style>

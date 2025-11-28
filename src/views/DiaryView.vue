<template>
  <div class="diary-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <el-button class="back-btn" @click="router.back()" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-info">
          <h1>📔 育儿日记</h1>
          <p>记录宝宝成长的点点滴滴</p>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-section">
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-icon">📝</span>
          <span class="stat-num">{{ diaryEntries.length }}</span>
          <span class="stat-label">篇日记</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📷</span>
          <span class="stat-num">{{ totalPhotos }}</span>
          <span class="stat-label">张照片</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⭐</span>
          <span class="stat-num">{{ favoriteCount }}</span>
          <span class="stat-label">精选</span>
        </div>
      </div>
    </div>

    <!-- 写日记按钮 -->
    <div class="add-section">
      <el-button type="primary" size="large" round @click="openNewDiary">
        <el-icon><EditPen /></el-icon>
        写日记
      </el-button>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <el-input
        v-model="searchText"
        placeholder="搜索日记内容..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />
      <el-select v-model="filterMood" placeholder="心情" clearable class="mood-filter">
        <el-option label="😊 开心" value="happy" />
        <el-option label="🥰 幸福" value="love" />
        <el-option label="😢 难过" value="sad" />
        <el-option label="😴 疲惫" value="tired" />
        <el-option label="🤔 思考" value="thinking" />
      </el-select>
    </div>

    <!-- 日记列表 -->
    <div class="diary-list">
      <div v-if="filteredEntries.length === 0" class="empty-state">
        <div class="empty-icon">📔</div>
        <h3>还没有日记</h3>
        <p>记录下宝宝今天的精彩瞬间吧！</p>
        <el-button type="primary" @click="openNewDiary">写第一篇日记</el-button>
      </div>

      <transition-group name="diary-list" tag="div" class="entries-container">
        <el-card
          v-for="entry in filteredEntries"
          :key="entry.id"
          class="diary-card"
          :class="{ favorite: entry.isFavorite }"
        >
          <!-- 日记头部 -->
          <div class="diary-header">
            <div class="diary-date">
              <span class="date-day">{{ formatDay(entry.date) }}</span>
              <span class="date-month">{{ formatMonth(entry.date) }}</span>
            </div>
            <div class="diary-meta">
              <span class="mood-emoji">{{ getMoodEmoji(entry.mood) }}</span>
              <el-tag size="small" type="info">{{ entry.ageMonth }}月龄</el-tag>
            </div>
          </div>

          <!-- 日记标题 -->
          <h3 class="diary-title">{{ entry.title }}</h3>

          <!-- 日记内容 -->
          <p class="diary-content">{{ entry.content }}</p>

          <!-- 照片展示 -->
          <div v-if="entry.photos && entry.photos.length > 0" class="diary-photos">
            <div
              v-for="(photo, index) in entry.photos.slice(0, 3)"
              :key="index"
              class="photo-item"
              @click="previewPhoto(entry.photos, index)"
            >
              <img :src="photo" alt="日记照片" />
              <div v-if="index === 2 && entry.photos.length > 3" class="photo-more">
                +{{ entry.photos.length - 3 }}
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
            <el-button text type="danger" @click="deleteDiary(entry)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </el-card>
      </transition-group>
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
            style="width: 100%"
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
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="今日心情">
              <el-select v-model="diaryForm.mood" style="width: 100%">
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
              style="display: none"
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
              style="width: 100px"
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
import { ArrowLeft, EditPen, Edit, Delete, Star, Plus, Close } from '@element-plus/icons-vue'
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

const showDiaryDialog = ref(false)
const editingEntry = ref<DiaryEntry | null>(null)
const searchText = ref('')
const filterMood = ref('')
const showTagInput = ref(false)
const newTag = ref('')
const tagInputRef = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const showImageViewer = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

const quickTags = ['第一次', '里程碑', '搞笑', '感动', '日常', '外出', '生病', '成长']

const diaryForm = ref({
  date: new Date(),
  ageMonth: babyStore.currentMonth,
  title: '',
  content: '',
  mood: 'happy',
  photos: [] as string[],
  tags: [] as string[]
})

const diaryEntries = ref<DiaryEntry[]>([])

const moodMap: Record<string, string> = {
  happy: '😊',
  love: '🥰',
  sad: '😢',
  tired: '😴',
  thinking: '🤔'
}

const totalPhotos = computed(() => {
  return diaryEntries.value.reduce((sum, entry) => sum + (entry.photos?.length || 0), 0)
})

const favoriteCount = computed(() => {
  return diaryEntries.value.filter(e => e.isFavorite).length
})

const filteredEntries = computed(() => {
  let entries = [...diaryEntries.value]

  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    entries = entries.filter(e =>
      e.title.toLowerCase().includes(search) ||
      e.content.toLowerCase().includes(search)
    )
  }

  if (filterMood.value) {
    entries = entries.filter(e => e.mood === filterMood.value)
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
      createdAt: new Date(e.createdAt)
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

const formatMonth = (date: Date) => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return months[new Date(date).getMonth()]
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
    tags: []
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
    tags: [...entry.tags]
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
    const index = diaryEntries.value.findIndex(e => e.id === editingEntry.value!.id)
    if (index !== -1) {
      diaryEntries.value[index] = {
        ...editingEntry.value,
        ...diaryForm.value
      }
    }
    ElMessage.success('日记已更新 ✨')
  } else {
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      ...diaryForm.value,
      isFavorite: false,
      createdAt: new Date()
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
      type: 'warning'
    })
    diaryEntries.value = diaryEntries.value.filter(e => e.id !== entry.id)
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
  if (newTag.value.trim() && !diaryForm.value.tags.includes(newTag.value.trim())) {
    diaryForm.value.tags.push(newTag.value.trim())
  }
  newTag.value = ''
  showTagInput.value = false
}

const removeTag = (tag: string) => {
  diaryForm.value.tags = diaryForm.value.tags.filter(t => t !== tag)
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
    Array.from(input.files).forEach(file => {
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

/* 统计区域 */
.stats-section {
  padding: 0 20px;
  margin-bottom: 20px;
}

.stats-row {
  display: flex;
  gap: 12px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.stat-num {
  font-size: 28px;
  font-weight: 800;
  color: #ff7043;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* 添加按钮 */
.add-section {
  padding: 0 20px;
  margin-bottom: 20px;
  text-align: center;
}

/* 筛选区域 */
.filter-section {
  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
}

.mood-filter {
  width: 120px;
}

/* 日记列表 */
.diary-list {
  padding: 0 20px;
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
  padding: 8px 16px;
  border-radius: 12px;
  min-width: 60px;
}

.date-day {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 12px;
  opacity: 0.9;
}

.diary-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mood-emoji {
  font-size: 28px;
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.diary-photos {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.photo-item {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
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
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 4px;
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
  .stats-row {
    flex-wrap: wrap;
  }

  .stat-card {
    min-width: calc(33% - 8px);
  }

  .filter-section {
    flex-direction: column;
  }

  .mood-filter {
    width: 100%;
  }

  .photo-item {
    width: 60px;
    height: 60px;
  }
}
</style>

<template>
  <div class="daily-tips">
    <div class="tips-header">
      <div class="header-left">
        <span class="header-icon">💡</span>
        <div class="header-text">
          <h3>今日护理贴士</h3>
          <span class="date">{{ formattedDate }}</span>
        </div>
      </div>
      <el-button type="primary" circle size="small" @click="refreshTip">
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>

    <!-- 主要贴士卡片 -->
    <div class="main-tip-card" :class="{ flipping: isFlipping }">
      <div class="tip-category">
        <span class="category-icon">{{ currentCategory.icon }}</span>
        <span class="category-name">{{ currentCategory.name }}</span>
      </div>
      <div class="tip-content">
        <p>{{ currentTip.content }}</p>
      </div>
      <div class="tip-footer">
        <div class="tip-tags">
          <el-tag v-for="tag in currentTip.tags" :key="tag" size="small" effect="plain">
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <!-- 装饰动画 -->
      <div class="decorations">
        <span class="deco deco-1">✨</span>
        <span class="deco deco-2">🌟</span>
        <span class="deco deco-3">💫</span>
      </div>
    </div>

    <!-- 快速贴士网格 -->
    <div class="quick-tips-grid">
      <div
        v-for="(tip, index) in quickTips"
        :key="index"
        class="quick-tip-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="showTipDetail(tip)"
      >
        <div class="quick-tip-icon">{{ tip.icon }}</div>
        <div class="quick-tip-title">{{ tip.title }}</div>
        <div class="quick-tip-preview">{{ tip.preview }}</div>
      </div>
    </div>

    <!-- 护理提醒 -->
    <div class="care-reminders">
      <h4>
        <span class="reminder-icon">⏰</span>
        今日护理提醒
      </h4>
      <div class="reminders-list">
        <div
          v-for="(reminder, index) in reminders"
          :key="index"
          class="reminder-item"
          :class="{ completed: reminder.completed }"
          @click="toggleReminder(index)"
        >
          <div class="reminder-checkbox">
            <el-checkbox v-model="reminder.completed" />
          </div>
          <div class="reminder-content">
            <span class="reminder-time">{{ reminder.time }}</span>
            <span class="reminder-text">{{ reminder.text }}</span>
          </div>
          <span class="reminder-emoji">{{ reminder.emoji }}</span>
        </div>
      </div>
    </div>

    <!-- 宝宝成长小知识 -->
    <div class="fun-fact">
      <div class="fact-icon">🎓</div>
      <div class="fact-content">
        <h5>你知道吗？</h5>
        <p>{{ funFact }}</p>
      </div>
    </div>

    <!-- 贴士详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedTip?.title"
      width="90%"
      class="tip-dialog"
    >
      <div class="dialog-content" v-if="selectedTip">
        <div class="dialog-icon">{{ selectedTip.icon }}</div>
        <p class="dialog-text">{{ selectedTip.detail }}</p>
        <div class="dialog-tips">
          <h5>实用建议：</h5>
          <ul>
            <li v-for="(advice, i) in selectedTip.advice" :key="i">{{ advice }}</li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

interface Tip {
  content: string
  tags: string[]
  category: string
}

interface QuickTip {
  icon: string
  title: string
  preview: string
  detail: string
  advice: string[]
}

interface Reminder {
  time: string
  text: string
  emoji: string
  completed: boolean
}

const isFlipping = ref(false)
const dialogVisible = ref(false)
const selectedTip = ref<QuickTip | null>(null)
const currentTipIndex = ref(0)

const formattedDate = computed(() => {
  const date = new Date()
  return `${date.getMonth() + 1}月${date.getDate()}日 星期${'日一二三四五六'[date.getDay()]}`
})

const categories = [
  { id: 'feeding', name: '喂养', icon: '🍼' },
  { id: 'sleep', name: '睡眠', icon: '😴' },
  { id: 'health', name: '健康', icon: '💪' },
  { id: 'development', name: '发育', icon: '🌱' },
  { id: 'care', name: '护理', icon: '🛁' }
]

const tips: Tip[] = [
  {
    content: '母乳喂养时，确保宝宝含住整个乳晕而不只是乳头，这样可以避免乳头疼痛，也能让宝宝吃得更饱。',
    tags: ['母乳喂养', '新手必看'],
    category: 'feeding'
  },
  {
    content: '给宝宝洗澡时，水温保持在37-38°C最佳，可以用手肘试温。浴室要温暖，避免宝宝着凉。',
    tags: ['洗澡', '日常护理'],
    category: 'care'
  },
  {
    content: '宝宝睡觉时应该仰卧，这是最安全的睡姿。确保婴儿床上没有多余的被褥和玩具。',
    tags: ['安全睡眠', '重要'],
    category: 'sleep'
  },
  {
    content: '每天给宝宝做抚触按摩，不仅能促进亲子关系，还能帮助宝宝消化、改善睡眠质量。',
    tags: ['抚触按摩', '亲子互动'],
    category: 'development'
  },
  {
    content: '注意观察宝宝的大便颜色，正常的母乳宝宝大便是金黄色糊状。如果出现白色或红色要及时就医。',
    tags: ['健康观察', '重要'],
    category: 'health'
  }
]

const currentTip = computed(() => tips[currentTipIndex.value])
const currentCategory = computed(() =>
  categories.find(c => c.id === currentTip.value.category) || categories[0]
)

const quickTips: QuickTip[] = [
  {
    icon: '🌡️',
    title: '体温监测',
    preview: '正常体温范围',
    detail: '婴儿正常腋下体温为36.0-37.3°C。超过37.5°C可能发烧，低于36°C要注意保暖。',
    advice: [
      '每天固定时间测量体温',
      '使用电子体温计更安全',
      '发烧时多喝水、物理降温'
    ]
  },
  {
    icon: '💧',
    title: '补水指南',
    preview: '何时需要喝水',
    detail: '6个月前纯母乳/配方奶喂养的宝宝一般不需要额外喝水。开始添加辅食后可以适当补水。',
    advice: [
      '母乳已含足够水分',
      '天热或发烧时可适量补水',
      '用小勺子喂水更安全'
    ]
  },
  {
    icon: '🧴',
    title: '皮肤护理',
    preview: '保持皮肤健康',
    detail: '宝宝皮肤娇嫩，每次换尿布后要清洁干净，涂抹护臀霜预防红屁屁。',
    advice: [
      '使用温和无香的护肤品',
      '勤换尿布保持干爽',
      '出现湿疹要及时处理'
    ]
  },
  {
    icon: '🎵',
    title: '听力发育',
    preview: '声音刺激很重要',
    detail: '多和宝宝说话、唱歌，播放轻柔音乐，有助于听力和语言发育。',
    advice: [
      '每天和宝宝说话聊天',
      '播放轻柔的音乐',
      '避免过于吵闹的环境'
    ]
  }
]

const reminders = ref<Reminder[]>([
  { time: '08:00', text: '早餐喂奶', emoji: '🍼', completed: true },
  { time: '10:00', text: '晒太阳补钙', emoji: '☀️', completed: true },
  { time: '12:00', text: '午餐喂奶', emoji: '🍼', completed: false },
  { time: '14:00', text: '午睡时间', emoji: '😴', completed: false },
  { time: '16:00', text: '亲子游戏', emoji: '🎮', completed: false },
  { time: '18:00', text: '洗澡时间', emoji: '🛁', completed: false }
])

const funFacts = [
  '新生儿的胃只有樱桃大小，所以要少量多餐喂养哦！',
  '宝宝出生时有300多块骨头，成年后会融合成206块。',
  '婴儿能识别妈妈的声音，因为在子宫里就已经开始听了！',
  '宝宝的微笑最早出现在睡梦中，这叫做"天使微笑"。',
  '新生儿每天要睡16-17小时，睡眠对大脑发育非常重要！'
]

const funFact = computed(() => {
  const index = new Date().getDate() % funFacts.length
  return funFacts[index]
})

const refreshTip = () => {
  isFlipping.value = true
  setTimeout(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % tips.length
    isFlipping.value = false
  }, 300)
}

const showTipDetail = (tip: QuickTip) => {
  selectedTip.value = tip
  dialogVisible.value = true
}

const toggleReminder = (index: number) => {
  reminders.value[index].completed = !reminders.value[index].completed
}
</script>

<style scoped>
.daily-tips {
  padding: 20px;
}

.tips-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 32px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.header-text h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}

.date {
  font-size: 13px;
  color: #6b7280;
}

.main-tip-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(251, 191, 36, 0.2);
}

.main-tip-card.flipping {
  transform: rotateY(180deg);
  opacity: 0;
}

.tip-category {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.category-icon {
  font-size: 24px;
}

.category-name {
  font-size: 13px;
  color: #92400e;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 12px;
  border-radius: 20px;
}

.tip-content p {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: #78350f;
}

.tip-footer {
  margin-top: 16px;
}

.tip-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.decorations {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.deco {
  position: absolute;
  font-size: 16px;
  opacity: 0.6;
  animation: twinkle 2s ease-in-out infinite;
}

.deco-1 { top: 10px; right: 20px; animation-delay: 0s; }
.deco-2 { top: 40px; right: 60px; animation-delay: 0.5s; }
.deco-3 { bottom: 20px; right: 30px; animation-delay: 1s; }

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.2); }
}

.quick-tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.quick-tip-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
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

.quick-tip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.quick-tip-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.quick-tip-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.quick-tip-preview {
  font-size: 12px;
  color: #6b7280;
}

.care-reminders {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.care-reminders h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reminder-icon {
  font-size: 20px;
}

.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reminder-item:hover {
  background: #f3f4f6;
}

.reminder-item.completed {
  opacity: 0.6;
}

.reminder-item.completed .reminder-text {
  text-decoration: line-through;
}

.reminder-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reminder-time {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.reminder-text {
  font-size: 14px;
  color: #1f2937;
}

.reminder-emoji {
  font-size: 20px;
}

.fun-fact {
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.fact-icon {
  font-size: 32px;
  animation: swing 2s ease-in-out infinite;
}

@keyframes swing {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.fact-content h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #5b21b6;
}

.fact-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #6d28d9;
}

.dialog-content {
  text-align: center;
  padding: 20px;
}

.dialog-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.dialog-text {
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 20px;
}

.dialog-tips h5 {
  margin: 0 0 12px 0;
  color: #1f2937;
  text-align: left;
}

.dialog-tips ul {
  margin: 0;
  padding-left: 20px;
  text-align: left;
}

.dialog-tips li {
  margin-bottom: 8px;
  color: #4b5563;
  line-height: 1.6;
}
</style>

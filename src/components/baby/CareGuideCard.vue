<template>
  <div class="care-card">
    <div class="card-icon-wrapper" :style="{ background: iconBackground }">
      <span class="card-icon">{{ getIconEmoji }}</span>
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="category-title">{{ guideline.category }}</h3>
        <el-tag v-if="guideline.duration" size="small" effect="plain" round>
          ⏱️ {{ guideline.duration }}
        </el-tag>
      </div>
      <ul class="tips-list">
        <li v-for="(tip, index) in guideline.tips" :key="index" class="tip-item">
          <span class="tip-bullet" :style="{ background: bulletColor }"></span>
          <span class="tip-text">{{ tip }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CareGuideline } from '@/types/baby'

const props = defineProps<{
  guideline: CareGuideline
}>()

const iconEmojiMap: Record<string, string> = {
  moon: '🌙',
  bath: '🛁',
  diaper: '👶',
  medical: '🏥',
  play: '🎮',
  exercise: '🏃',
  toy: '🧸',
  walk: '🚶',
  brain: '🧠',
  video: '📹',
  food: '🍼',
  finger: '🖐️',
  crawl: '🐛',
  explore: '🔍',
  milk: '🥛',
  steps: '👣',
  rule: '📋',
  walking: '🚶‍♂️',
  default: '💡'
}

const colorMap: Record<string, { bg: string; bullet: string }> = {
  moon: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', bullet: '#667eea' },
  bath: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', bullet: '#11998e' },
  diaper: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', bullet: '#f093fb' },
  medical: { bg: 'linear-gradient(135deg, #f56c6c 0%, #ff9a9e 100%)', bullet: '#f56c6c' },
  play: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', bullet: '#4facfe' },
  exercise: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', bullet: '#fa709a' },
  toy: { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', bullet: '#ff69b4' },
  walk: { bg: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', bullet: '#d299c2' },
  brain: { bg: 'linear-gradient(135deg, #9c27b0 0%, #e040fb 100%)', bullet: '#9c27b0' },
  food: { bg: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)', bullet: '#f2994a' },
  finger: { bg: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', bullet: '#ee9ca7' },
  crawl: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', bullet: '#667eea' },
  explore: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', bullet: '#4facfe' },
  milk: { bg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', bullet: '#a1c4fd' },
  default: { bg: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', bullet: '#8ec5fc' }
}

const defaultColor = { bg: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', bullet: '#8ec5fc' }

const getIconEmoji = computed(() => {
  return iconEmojiMap[props.guideline.icon] || iconEmojiMap.default
})

const iconBackground = computed(() => {
  const color = colorMap[props.guideline.icon]
  return color ? color.bg : defaultColor.bg
})

const bulletColor = computed(() => {
  const color = colorMap[props.guideline.icon]
  return color ? color.bullet : defaultColor.bullet
})
</script>

<style scoped>
.care-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
}

.care-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  font-size: 28px;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin: 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  line-height: 1.6;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 7px;
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
  color: #606266;
  font-size: 14px;
}

@media (max-width: 480px) {
  .care-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .card-header {
    justify-content: center;
  }

  .tip-item {
    justify-content: center;
  }
}
</style>

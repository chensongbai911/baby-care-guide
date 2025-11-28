<template>
  <div class="flip-card" :class="{ 'is-flipped': isFlipped }" @click="handleFlip">
    <div class="flip-card-inner">
      <!-- 正面 -->
      <div class="flip-card-front">
        <slot name="front">
          <div class="default-front">
            <div class="front-icon">{{ frontIcon }}</div>
            <h3 class="front-title">{{ frontTitle }}</h3>
            <p class="front-desc">{{ frontDesc }}</p>
            <div class="flip-hint">
              <span class="hint-icon">🔄</span>
              <span class="hint-text">点击翻转</span>
            </div>
          </div>
        </slot>
      </div>

      <!-- 背面 -->
      <div class="flip-card-back">
        <slot name="back">
          <div class="default-back">
            <div class="back-icon">{{ backIcon }}</div>
            <h3 class="back-title">{{ backTitle }}</h3>
            <p class="back-content">{{ backContent }}</p>
            <div class="flip-hint">
              <span class="hint-icon">↩️</span>
              <span class="hint-text">点击返回</span>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <!-- 光效 -->
    <div class="card-glow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  frontIcon?: string
  frontTitle?: string
  frontDesc?: string
  backIcon?: string
  backTitle?: string
  backContent?: string
  autoFlip?: boolean
  autoFlipDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  frontIcon: '📝',
  frontTitle: '正面标题',
  frontDesc: '点击查看更多信息',
  backIcon: '✨',
  backTitle: '背面标题',
  backContent: '这里是详细内容',
  autoFlip: false,
  autoFlipDelay: 3000
})

const emit = defineEmits<{
  flip: [isFlipped: boolean]
}>()

const isFlipped = ref(false)

const handleFlip = () => {
  isFlipped.value = !isFlipped.value
  emit('flip', isFlipped.value)
}

// 自动翻转
if (props.autoFlip) {
  setInterval(() => {
    handleFlip()
  }, props.autoFlipDelay)
}
</script>

<style scoped>
.flip-card {
  position: relative;
  width: 100%;
  height: 320px;
  cursor: pointer;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-style: preserve-3d;
}

.flip-card.is-flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 24px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.flip-card-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.flip-card-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: rotateY(180deg);
}

/* 默认样式 */
.default-front,
.default-back {
  text-align: center;
  width: 100%;
}

.front-icon,
.back-icon {
  font-size: 72px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.front-title,
.back-title {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.front-desc,
.back-content {
  font-size: 16px;
  opacity: 0.95;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.flip-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  margin: 0 auto;
  width: fit-content;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}

.hint-icon {
  font-size: 18px;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 光效 */
.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.flip-card:hover .card-glow {
  opacity: 1;
  animation: glow-rotate 4s linear infinite;
}

@keyframes glow-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 悬浮效果 */
.flip-card:hover {
  transform: translateY(-8px);
}

.flip-card:hover .flip-card-inner {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* 响应式 */
@media (max-width: 768px) {
  .flip-card {
    height: 280px;
  }

  .flip-card-front,
  .flip-card-back {
    padding: 24px;
  }

  .front-icon,
  .back-icon {
    font-size: 56px;
  }

  .front-title,
  .back-title {
    font-size: 24px;
  }

  .front-desc,
  .back-content {
    font-size: 14px;
  }
}
</style>

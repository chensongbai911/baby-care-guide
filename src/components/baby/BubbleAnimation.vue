<template>
  <div class="bubble-animation" :class="{ active: isActive }">
    <svg
      class="bubble-svg"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 定义渐变 -->
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            :style="{ stopColor: colors[0], stopOpacity: 0.8 }"
          />
          <stop
            offset="100%"
            :style="{ stopColor: colors[1], stopOpacity: 0.9 }"
          />
        </linearGradient>

        <!-- 发光滤镜 -->
        <filter :id="glowId" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- 主气泡 -->
      <circle
        class="main-bubble"
        cx="100"
        cy="100"
        :r="mainRadius"
        :fill="`url(#${gradientId})`"
        :filter="`url(#${glowId})`"
      />

      <!-- 小气泡 -->
      <circle
        v-for="(bubble, index) in smallBubbles"
        :key="index"
        class="small-bubble"
        :cx="bubble.x"
        :cy="bubble.y"
        :r="bubble.r"
        :fill="colors[0]"
        :opacity="bubble.opacity"
        :style="{ animationDelay: `${bubble.delay}s` }"
      />

      <!-- 内部光圈 -->
      <circle
        class="inner-ring"
        cx="100"
        cy="100"
        :r="mainRadius - 10"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        stroke-width="2"
      />

      <!-- 图标/文字插槽 -->
      <foreignObject x="50" y="50" width="100" height="100">
        <div class="bubble-content">
          <slot></slot>
        </div>
      </foreignObject>
    </svg>

    <!-- 涟漪效果 -->
    <div v-if="showRipple" class="ripple-effect"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  size?: number
  colors?: [string, string]
  isActive?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 200,
  colors: () => ['#a78bfa', '#ec4899'],
  isActive: false,
})

const mainRadius = ref(40)
const showRipple = ref(false)
const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`
const glowId = `glow-${Math.random().toString(36).substr(2, 9)}`

// 生成小气泡
const smallBubbles = computed(() => {
  const bubbles = []
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180
    const distance = 60
    bubbles.push({
      x: 100 + Math.cos(angle) * distance,
      y: 100 + Math.sin(angle) * distance,
      r: 4 + Math.random() * 3,
      opacity: 0.4 + Math.random() * 0.3,
      delay: i * 0.2,
    })
  }
  return bubbles
})

// 呼吸动画
const breathe = () => {
  setInterval(() => {
    mainRadius.value = 40 + Math.sin(Date.now() / 1000) * 3
  }, 50)
}

onMounted(() => {
  breathe()
})

defineExpose({
  triggerRipple: () => {
    showRipple.value = true
    setTimeout(() => {
      showRipple.value = false
    }, 600)
  },
})
</script>

<style scoped>
.bubble-animation {
  position: relative;
  display: inline-block;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.bubble-animation:hover {
  transform: scale(1.05);
}

.bubble-animation.active {
  animation: pulse 0.6s ease;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.bubble-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.main-bubble {
  transition: r 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.small-bubble {
  animation: bubbleFloat 4s ease-in-out infinite;
}

@keyframes bubbleFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(2px, -3px) scale(1.2);
    opacity: 0.8;
  }
}

.inner-ring {
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.bubble-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.ripple-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid currentColor;
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes ripple {
  0% {
    width: 100%;
    height: 100%;
    opacity: 1;
  }
  100% {
    width: 200%;
    height: 200%;
    opacity: 0;
  }
}
</style>

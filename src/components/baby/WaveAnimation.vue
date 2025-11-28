<template>
  <div class="wave-animation" :style="{ height: height }">
    <svg class="wave-svg" viewBox="0 0 1200 300" preserveAspectRatio="none">
      <defs>
        <!-- 渐变定义 -->
        <linearGradient :id="`waveGradient1-${id}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :style="`stop-color:${color1};stop-opacity:0.8`" />
          <stop offset="100%" :style="`stop-color:${color1};stop-opacity:0.3`" />
        </linearGradient>
        <linearGradient :id="`waveGradient2-${id}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :style="`stop-color:${color2};stop-opacity:0.6`" />
          <stop offset="100%" :style="`stop-color:${color2};stop-opacity:0.2`" />
        </linearGradient>
        <linearGradient :id="`waveGradient3-${id}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :style="`stop-color:${color3};stop-opacity:0.4`" />
          <stop offset="100%" :style="`stop-color:${color3};stop-opacity:0.1`" />
        </linearGradient>

        <!-- 发光滤镜 -->
        <filter :id="`glow-${id}`">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 波浪层 -->
      <g class="wave-layers">
        <path
          class="wave wave-1"
          :d="wavePath1"
          :fill="`url(#waveGradient1-${id})`"
          :filter="`url(#glow-${id})`"
        />
        <path
          class="wave wave-2"
          :d="wavePath2"
          :fill="`url(#waveGradient2-${id})`"
        />
        <path
          class="wave wave-3"
          :d="wavePath3"
          :fill="`url(#waveGradient3-${id})`"
        />
      </g>

      <!-- 漂浮气泡 -->
      <g v-if="showBubbles" class="bubbles-group">
        <circle
          v-for="bubble in bubbles"
          :key="bubble.id"
          :class="`bubble bubble-${bubble.id}`"
          :cx="bubble.x"
          :cy="bubble.y"
          :r="bubble.r"
          :fill="bubble.color"
          :opacity="bubble.opacity"
          :filter="`url(#glow-${id})`"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  height?: string
  color1?: string
  color2?: string
  color3?: string
  showBubbles?: boolean
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px',
  color1: '#667eea',
  color2: '#764ba2',
  color3: '#f093fb',
  showBubbles: true,
  speed: 1
})

const id = Math.random().toString(36).substring(7)
const time = ref(0)
let animationFrame: number

// 波浪路径
const wavePath1 = computed(() => {
  const offset = time.value * 0.5 * props.speed
  return `M0,150 Q${300 + offset},${100 + Math.sin(time.value * 0.002) * 20} ${600 + offset},150 T${1200 + offset},150 V300 H0 Z`
})

const wavePath2 = computed(() => {
  const offset = time.value * 0.3 * props.speed
  return `M0,170 Q${300 + offset},${130 + Math.sin(time.value * 0.003 + 1) * 15} ${600 + offset},170 T${1200 + offset},170 V300 H0 Z`
})

const wavePath3 = computed(() => {
  const offset = time.value * 0.4 * props.speed
  return `M0,190 Q${300 + offset},${160 + Math.sin(time.value * 0.0025 + 2) * 10} ${600 + offset},190 T${1200 + offset},190 V300 H0 Z`
})

// 气泡数据
const bubbles = ref([
  { id: 1, x: 100, y: 250, r: 8, color: 'rgba(255,255,255,0.6)', opacity: 0.8 },
  { id: 2, x: 300, y: 200, r: 12, color: 'rgba(255,255,255,0.5)', opacity: 0.7 },
  { id: 3, x: 500, y: 220, r: 6, color: 'rgba(255,255,255,0.7)', opacity: 0.9 },
  { id: 4, x: 700, y: 240, r: 10, color: 'rgba(255,255,255,0.55)', opacity: 0.75 },
  { id: 5, x: 900, y: 210, r: 7, color: 'rgba(255,255,255,0.65)', opacity: 0.85 },
  { id: 6, x: 1100, y: 230, r: 9, color: 'rgba(255,255,255,0.6)', opacity: 0.8 }
])

const animate = () => {
  time.value += 1

  // 更新气泡位置
  if (props.showBubbles) {
    bubbles.value = bubbles.value.map((bubble, index) => ({
      ...bubble,
      y: bubble.y - 0.5 + Math.sin(time.value * 0.01 + index) * 0.3,
      x: bubble.x + Math.cos(time.value * 0.008 + index) * 0.2
    }))
  }

  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.wave-animation {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.wave-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.wave {
  transition: d 0.3s ease;
}

.wave-1 {
  animation: wave-shift-1 8s ease-in-out infinite;
}

.wave-2 {
  animation: wave-shift-2 10s ease-in-out infinite;
}

.wave-3 {
  animation: wave-shift-3 12s ease-in-out infinite;
}

@keyframes wave-shift-1 {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-25px); }
}

@keyframes wave-shift-2 {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
}

@keyframes wave-shift-3 {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-15px); }
}

.bubble {
  transition: all 0.3s ease;
}
</style>

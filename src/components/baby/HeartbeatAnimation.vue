<template>
  <div class="heartbeat-container">
    <svg
      viewBox="0 0 400 200"
      class="heartbeat-svg"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <defs>
        <!-- 渐变定义 -->
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#f472b6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fb7185;stop-opacity:1" />
        </linearGradient>

        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:0.3" />
          <stop offset="50%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0.3" />
        </linearGradient>

        <!-- 发光效果 -->
        <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 背景网格线 -->
      <g class="grid-lines" opacity="0.1">
        <line v-for="i in 10" :key="'h'+i" :x1="0" :y1="i * 20" :x2="400" :y2="i * 20" stroke="#7c3aed" stroke-width="0.5"/>
        <line v-for="i in 20" :key="'v'+i" :x1="i * 20" :y1="0" :x2="i * 20" :y2="200" stroke="#7c3aed" stroke-width="0.5"/>
      </g>

      <!-- 心跳波形线 -->
      <path
        class="heartbeat-line"
        :class="{ 'is-hovered': isHovered }"
        d="M 0,100 L 50,100 L 70,100 L 90,60 L 110,140 L 130,100 L 150,100 L 170,100 L 190,100 L 210,100 L 230,60 L 250,140 L 270,100 L 290,100 L 310,100 L 330,60 L 350,140 L 370,100 L 400,100"
        fill="none"
        stroke="url(#lineGradient)"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#heartGlow)"
      />

      <!-- 跳动的心形 -->
      <g class="heart-icon" :class="{ 'is-hovered': isHovered }">
        <path
          d="M200,80 C200,65 185,50 165,50 C145,50 130,65 130,85 C130,115 165,135 200,160 C235,135 270,115 270,85 C270,65 255,50 235,50 C215,50 200,65 200,80 Z"
          fill="url(#heartGradient)"
          filter="url(#heartGlow)"
          class="heart-path"
        />
      </g>

      <!-- 脉冲圆环 -->
      <circle
        v-for="i in 3"
        :key="'pulse'+i"
        cx="200"
        cy="105"
        r="40"
        fill="none"
        stroke="#ec4899"
        stroke-width="2"
        class="pulse-ring"
        :style="{ animationDelay: `${i * 0.5}s` }"
      />

      <!-- 数据点 -->
      <g class="data-points">
        <circle
          v-for="(point, index) in dataPoints"
          :key="'point'+index"
          :cx="point.x"
          :cy="point.y"
          r="4"
          fill="#7c3aed"
          class="data-point"
          :style="{ animationDelay: `${index * 0.1}s` }"
        />
      </g>
    </svg>

    <!-- 心跳数值显示 -->
    <div class="heartbeat-info" v-if="showInfo">
      <div class="bpm-display">
        <span class="bpm-number">{{ currentBPM }}</span>
        <span class="bpm-label">BPM</span>
      </div>
      <div class="health-status">
        <span class="status-dot"></span>
        <span>健康</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineProps<{
  showInfo?: boolean
}>()

const isHovered = ref(false)
const currentBPM = ref(120)
let bpmInterval: number | null = null

// 波形上的数据点位置
const dataPoints = computed(() => [
  { x: 90, y: 60 },
  { x: 110, y: 140 },
  { x: 230, y: 60 },
  { x: 250, y: 140 },
  { x: 330, y: 60 },
  { x: 350, y: 140 }
])

onMounted(() => {
  // 模拟心跳变化
  bpmInterval = window.setInterval(() => {
    currentBPM.value = 115 + Math.floor(Math.random() * 15)
  }, 1500)
})

onUnmounted(() => {
  if (bpmInterval) {
    clearInterval(bpmInterval)
  }
})
</script>

<style scoped>
.heartbeat-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.heartbeat-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* 心跳线动画 */
.heartbeat-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 3s ease-in-out infinite;
}

.heartbeat-line.is-hovered {
  animation-duration: 1.5s;
}

@keyframes drawLine {
  0% {
    stroke-dashoffset: 1000;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -1000;
  }
}

/* 心形动画 */
.heart-icon {
  transform-origin: 200px 105px;
  animation: heartbeat 1.2s ease-in-out infinite;
}

.heart-icon.is-hovered {
  animation-duration: 0.6s;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.15);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(1);
  }
}

.heart-path {
  filter: drop-shadow(0 4px 15px rgba(236, 72, 153, 0.5));
}

/* 脉冲圆环 */
.pulse-ring {
  opacity: 0;
  animation: pulseRing 2s ease-out infinite;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 数据点动画 */
.data-point {
  animation: pointPulse 1.5s ease-in-out infinite;
}

@keyframes pointPulse {
  0%, 100% {
    r: 4;
    opacity: 0.6;
  }
  50% {
    r: 6;
    opacity: 1;
  }
}

/* 心跳信息显示 */
.heartbeat-info {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.bpm-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.bpm-number {
  font-size: 32px;
  font-weight: 900;
  color: #ec4899;
  animation: bpmPulse 1.2s ease-in-out infinite;
}

@keyframes bpmPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.bpm-label {
  font-size: 14px;
  color: #7c3aed;
  font-weight: 600;
}

.health-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #10b981;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: statusBlink 2s ease-in-out infinite;
}

@keyframes statusBlink {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
}
</style>

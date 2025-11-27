<template>
  <div class="bubble-animation-container" @click="createBubble">
    <svg
      ref="svgRef"
      viewBox="0 0 400 300"
      class="bubble-svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <!-- 气泡渐变 -->
        <radialGradient id="bubbleGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
          <stop offset="30%" style="stop-color:#bfdbfe;stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.2" />
        </radialGradient>

        <!-- 粉色气泡渐变 -->
        <radialGradient id="pinkBubbleGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
          <stop offset="30%" style="stop-color:#fbcfe8;stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:#ec4899;stop-opacity:0.2" />
        </radialGradient>

        <!-- 紫色气泡渐变 -->
        <radialGradient id="purpleBubbleGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
          <stop offset="30%" style="stop-color:#ddd6fe;stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.2" />
        </radialGradient>

        <!-- 气泡高光 -->
        <filter id="bubbleHighlight">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 背景气泡 -->
      <g class="background-bubbles">
        <g
          v-for="(bubble, index) in backgroundBubbles"
          :key="'bg-bubble-'+index"
          class="bg-bubble"
          :style="{ animationDelay: `${bubble.delay}s`, animationDuration: `${bubble.duration}s` }"
        >
          <circle
            :cx="bubble.x"
            :cy="bubble.y"
            :r="bubble.size"
            :fill="bubble.gradient"
            :opacity="bubble.opacity"
            filter="url(#bubbleHighlight)"
          />
          <!-- 高光点 -->
          <circle
            :cx="bubble.x - bubble.size * 0.3"
            :cy="bubble.y - bubble.size * 0.3"
            :r="bubble.size * 0.15"
            fill="white"
            :opacity="0.6"
          />
        </g>
      </g>

      <!-- 可点击的互动气泡 -->
      <g class="interactive-bubbles">
        <g
          v-for="(bubble, index) in interactiveBubbles"
          :key="'bubble-'+bubble.id"
          class="interactive-bubble"
          :class="{ popping: bubble.popping }"
          @click.stop="popBubble(index)"
          style="cursor: pointer"
        >
          <circle
            :cx="bubble.x"
            :cy="bubble.y"
            :r="bubble.size"
            :fill="bubble.gradient"
            :opacity="bubble.opacity"
            filter="url(#bubbleHighlight)"
            class="bubble-body"
          />
          <!-- 高光 -->
          <circle
            :cx="bubble.x - bubble.size * 0.25"
            :cy="bubble.y - bubble.size * 0.25"
            :r="bubble.size * 0.2"
            fill="white"
            :opacity="0.7"
          />
          <!-- 小高光 -->
          <circle
            :cx="bubble.x - bubble.size * 0.1"
            :cy="bubble.y + bubble.size * 0.3"
            :r="bubble.size * 0.08"
            fill="white"
            :opacity="0.4"
          />
        </g>
      </g>

      <!-- 爆炸粒子 -->
      <g class="pop-particles">
        <g
          v-for="particle in popParticles"
          :key="'particle-'+particle.id"
          class="particle"
        >
          <circle
            :cx="particle.x"
            :cy="particle.y"
            :r="particle.size"
            :fill="particle.color"
            :opacity="particle.opacity"
            :style="{
              transform: `translate(${particle.offsetX}px, ${particle.offsetY}px)`,
              transition: 'all 0.5s ease-out'
            }"
          />
        </g>
      </g>

      <!-- 提示文字 -->
      <text
        x="200"
        y="280"
        text-anchor="middle"
        font-size="12"
        fill="#94a3b8"
        class="hint-text"
      >
        点击气泡让它们爆炸！💫
      </text>

      <!-- 分数显示 -->
      <g class="score-display">
        <text
          x="200"
          y="25"
          text-anchor="middle"
          font-size="16"
          fill="#60a5fa"
          font-weight="bold"
        >
          🎯 得分: {{ score }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  gradient: string
  popping: boolean
  speedY: number
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  opacity: number
  offsetX: number
  offsetY: number
}

const gradients = [
  'url(#bubbleGradient)',
  'url(#pinkBubbleGradient)',
  'url(#purpleBubbleGradient)'
]

const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981']

// 背景气泡（装饰用）
const backgroundBubbles = ref<Array<{
  x: number
  y: number
  size: number
  opacity: number
  gradient: string
  delay: number
  duration: number
}>>([])

// 互动气泡
const interactiveBubbles = ref<Bubble[]>([])

// 爆炸粒子
const popParticles = ref<Particle[]>([])

// 分数
const score = ref(0)

// 气泡ID计数器
let bubbleIdCounter = 0
let particleIdCounter = 0
let animationFrameId: number | null = null

// 生成背景气泡
const generateBackgroundBubbles = () => {
  const bubbles = []
  for (let i = 0; i < 8; i++) {
    bubbles.push({
      x: Math.random() * 380 + 10,
      y: Math.random() * 250 + 25,
      size: Math.random() * 15 + 8,
      opacity: Math.random() * 0.3 + 0.1,
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 4
    })
  }
  backgroundBubbles.value = bubbles
}

// 创建新气泡
const createBubble = (event?: MouseEvent) => {
  if (interactiveBubbles.value.length >= 15) return

  let x = Math.random() * 350 + 25
  let y = 320

  if (event) {
    const svg = event.currentTarget as SVGSVGElement
    const rect = svg.getBoundingClientRect()
    const scaleX = 400 / rect.width
    const scaleY = 300 / rect.height
    x = (event.clientX - rect.left) * scaleX
    y = (event.clientY - rect.top) * scaleY
  }

  const bubble: Bubble = {
    id: bubbleIdCounter++,
    x,
    y,
    size: Math.random() * 20 + 15,
    opacity: Math.random() * 0.3 + 0.5,
    gradient: gradients[Math.floor(Math.random() * gradients.length)],
    popping: false,
    speedY: Math.random() * 0.5 + 0.3
  }

  interactiveBubbles.value.push(bubble)
}

// 气泡爆炸
const popBubble = (index: number) => {
  const bubble = interactiveBubbles.value[index]
  if (!bubble || bubble.popping) return

  bubble.popping = true
  score.value += Math.floor(bubble.size)

  // 创建爆炸粒子
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8
    const distance = bubble.size * 2

    const particle: Particle = {
      id: particleIdCounter++,
      x: bubble.x,
      y: bubble.y,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      offsetX: Math.cos(angle) * distance,
      offsetY: Math.sin(angle) * distance
    }

    popParticles.value.push(particle)

    // 移除粒子
    setTimeout(() => {
      const idx = popParticles.value.findIndex(p => p.id === particle.id)
      if (idx !== -1) {
        popParticles.value.splice(idx, 1)
      }
    }, 500)
  }

  // 移除气泡
  setTimeout(() => {
    const idx = interactiveBubbles.value.findIndex(b => b.id === bubble.id)
    if (idx !== -1) {
      interactiveBubbles.value.splice(idx, 1)
    }
  }, 100)
}

// 动画循环
const animate = () => {
  // 移动气泡向上
  interactiveBubbles.value.forEach(bubble => {
    if (!bubble.popping) {
      bubble.y -= bubble.speedY
      bubble.x += Math.sin(Date.now() / 500 + bubble.id) * 0.3
    }
  })

  // 移除超出范围的气泡
  interactiveBubbles.value = interactiveBubbles.value.filter(
    bubble => bubble.y > -bubble.size
  )

  animationFrameId = requestAnimationFrame(animate)
}

// 自动生成气泡
let autoCreateInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  generateBackgroundBubbles()
  animate()

  // 初始创建几个气泡
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createBubble(), i * 300)
  }

  // 自动生成新气泡
  autoCreateInterval = setInterval(() => {
    if (interactiveBubbles.value.length < 10) {
      createBubble()
    }
  }, 2000)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (autoCreateInterval) {
    clearInterval(autoCreateInterval)
  }
})
</script>

<style scoped>
.bubble-animation-container {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%);
}

.bubble-svg {
  width: 100%;
  height: auto;
  display: block;
  cursor: pointer;
}

/* 背景气泡动画 */
.bg-bubble {
  animation: floatBubble 6s ease-in-out infinite;
}

@keyframes floatBubble {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

/* 互动气泡 */
.interactive-bubble {
  transition: transform 0.2s ease;
}

.interactive-bubble:hover .bubble-body {
  transform: scale(1.1);
  filter: url(#bubbleHighlight) brightness(1.1);
}

.interactive-bubble.popping {
  animation: popBubble 0.3s ease-out forwards;
}

@keyframes popBubble {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.5;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/* 粒子动画 */
.particle circle {
  animation: particleFade 0.5s ease-out forwards;
}

@keyframes particleFade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* 提示文字 */
.hint-text {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* 分数显示 */
.score-display text {
  transition: transform 0.2s ease;
}
</style>

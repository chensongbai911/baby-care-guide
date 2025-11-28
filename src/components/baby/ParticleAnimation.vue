<template>
  <div class="particle-animation" ref="containerRef">
    <svg class="particle-svg" :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 星星形状 -->
        <path id="star" d="M 0,-5 L 1.5,-1.5 L 5,0 L 1.5,1.5 L 0,5 L -1.5,1.5 L -5,0 L -1.5,-1.5 Z" />

        <!-- 心形 -->
        <path id="heart" d="M 0,-3 C -1,-5 -4,-5 -4,-2 C -4,1 0,4 0,4 C 0,4 4,1 4,-2 C 4,-5 1,-5 0,-3 Z" />

        <!-- 圆形渐变 -->
        <radialGradient id="particle-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(168,139,250);stop-opacity:0.5" />
        </radialGradient>
      </defs>

      <!-- 粒子 -->
      <g v-for="particle in particles" :key="particle.id">
        <circle
          v-if="particle.type === 'circle'"
          :cx="particle.x"
          :cy="particle.y"
          :r="particle.size"
          :fill="particle.color"
          :opacity="particle.opacity"
          class="particle"
        />

        <use
          v-else-if="particle.type === 'star'"
          :href="'#star'"
          :x="particle.x"
          :y="particle.y"
          :fill="particle.color"
          :opacity="particle.opacity"
          :transform="`scale(${particle.size / 5}) rotate(${particle.rotation})`"
          class="particle"
        />

        <use
          v-else-if="particle.type === 'heart'"
          :href="'#heart'"
          :x="particle.x"
          :y="particle.y"
          :fill="particle.color"
          :opacity="particle.opacity"
          :transform="`scale(${particle.size / 3}) rotate(${particle.rotation})`"
          class="particle"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  life: number
  maxLife: number
  type: 'circle' | 'star' | 'heart'
  rotation: number
}

interface Props {
  width?: number
  height?: number
  colors?: string[]
  particleTypes?: Array<'circle' | 'star' | 'heart'>
  autoStart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 400,
  colors: () => ['#a78bfa', '#ec4899', '#fbbf24', '#34d399'],
  particleTypes: () => ['circle', 'star', 'heart'],
  autoStart: false
})

const containerRef = ref<HTMLElement>()
const particles = ref<Particle[]>([])
let animationFrame: number
let particleId = 0

// 创建粒子
const createParticle = (x: number, y: number) => {
  const angle = Math.random() * Math.PI * 2
  const speed = 2 + Math.random() * 4
  const type = props.particleTypes[Math.floor(Math.random() * props.particleTypes.length)] as 'circle' | 'star' | 'heart'

  return {
    id: particleId++,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 2, // 向上的初始速度
    size: 3 + Math.random() * 5,
    color: props.colors[Math.floor(Math.random() * props.colors.length)] as string,
    opacity: 1,
    life: 0,
    maxLife: 60 + Math.random() * 60,
    type,
    rotation: Math.random() * 360
  }
}

// 爆炸效果
const explode = (x?: number, y?: number, count: number = 30) => {
  const centerX = x ?? props.width / 2
  const centerY = y ?? props.height / 2

  for (let i = 0; i < count; i++) {
    particles.value.push(createParticle(centerX, centerY))
  }
}

// 更新粒子
const updateParticles = () => {
  particles.value = particles.value.filter(p => {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.15 // 重力
    p.vx *= 0.99 // 空气阻力
    p.life++
    p.rotation += 5

    // 淡出效果
    const lifeRatio = p.life / p.maxLife
    p.opacity = 1 - lifeRatio

    return p.life < p.maxLife
  })

  animationFrame = requestAnimationFrame(updateParticles)
}

// 连续发射模式
const continuousEmit = () => {
  const emit = () => {
    if (particles.value.length < 100) {
      const x = props.width / 2 + (Math.random() - 0.5) * 50
      const y = props.height / 2 + (Math.random() - 0.5) * 50
      for (let i = 0; i < 3; i++) {
        particles.value.push(createParticle(x, y))
      }
    }
    setTimeout(emit, 100)
  }
  emit()
}

onMounted(() => {
  updateParticles()

  if (props.autoStart) {
    continuousEmit()
  }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

defineExpose({
  explode,
  clear: () => {
    particles.value = []
  }
})
</script>

<style scoped>
.particle-animation {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle-svg {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  transition: opacity 0.1s linear;
}
</style>

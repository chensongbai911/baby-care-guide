<template>
  <div class="animated-background" :class="`theme-${theme}`">
    <svg class="background-svg" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <!-- 动态渐变 -->
        <linearGradient :id="`bgGradient1-${id}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :style="`stop-color:${gradientColors[0]};stop-opacity:0.8`">
            <animate attributeName="stop-color" :values="`${gradientColors[0]};${gradientColors[1]};${gradientColors[0]}`" dur="10s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" :style="`stop-color:${gradientColors[1]};stop-opacity:0.6`">
            <animate attributeName="stop-color" :values="`${gradientColors[1]};${gradientColors[2]};${gradientColors[1]}`" dur="10s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" :style="`stop-color:${gradientColors[2]};stop-opacity:0.8`">
            <animate attributeName="stop-color" :values="`${gradientColors[2]};${gradientColors[0]};${gradientColors[2]}`" dur="10s" repeatCount="indefinite" />
          </stop>
        </linearGradient>

        <!-- 径向渐变 -->
        <radialGradient :id="`bgRadial-${id}`" cx="50%" cy="50%">
          <stop offset="0%" :style="`stop-color:${gradientColors[1]};stop-opacity:0.4`" />
          <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
        </radialGradient>

        <!-- 模糊滤镜 -->
        <filter :id="`blur-${id}`">
          <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
        </filter>

        <!-- 发光滤镜 -->
        <filter :id="`glow-${id}`">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 背景底色 -->
      <rect width="1440" height="800" :fill="`url(#bgGradient1-${id})`" />

      <!-- 浮动圆形装饰 -->
      <g class="floating-shapes" :filter="`url(#blur-${id})`">
        <circle
          v-for="(shape, index) in floatingShapes"
          :key="`shape-${index}`"
          :cx="shape.x"
          :cy="shape.y"
          :r="shape.r"
          :fill="shape.color"
          :opacity="shape.opacity"
          :class="`floating-shape shape-${index}`"
          :style="{ '--duration': shape.duration + 's', '--delay': shape.delay + 's' }"
        >
          <animate
            attributeName="cx"
            :values="`${shape.x};${shape.x + shape.moveX};${shape.x}`"
            :dur="`${shape.duration}s`"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            :values="`${shape.y};${shape.y + shape.moveY};${shape.y}`"
            :dur="`${shape.duration}s`"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      <!-- 光晕效果 -->
      <g class="glow-effects">
        <ellipse
          v-for="(glow, index) in glowEffects"
          :key="`glow-${index}`"
          :cx="glow.x"
          :cy="glow.y"
          :rx="glow.rx"
          :ry="glow.ry"
          :fill="`url(#bgRadial-${id})`"
          :opacity="glow.opacity"
          :class="`glow-effect glow-${index}`"
        >
          <animate
            attributeName="opacity"
            :values="`${glow.opacity};${glow.opacity * 0.5};${glow.opacity}`"
            :dur="`${glow.duration}s`"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            :from="`0 ${glow.x} ${glow.y}`"
            :to="`360 ${glow.x} ${glow.y}`"
            :dur="`${glow.duration * 2}s`"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>

      <!-- 波浪装饰 -->
      <g v-if="showWaves" class="wave-decorations" opacity="0.3">
        <path
          v-for="(wave, index) in waves"
          :key="`wave-${index}`"
          :d="wave.path"
          :stroke="wave.color"
          stroke-width="2"
          fill="none"
          :opacity="wave.opacity"
          :filter="`url(#glow-${id})`"
          :class="`wave-line wave-${index}`"
        >
          <animate
            attributeName="d"
            :values="`${wave.path};${wave.pathAlt};${wave.path}`"
            :dur="`${wave.duration}s`"
            repeatCount="indefinite"
          />
        </path>
      </g>

      <!-- 星星装饰 -->
      <g v-if="showStars" class="stars-decoration">
        <g
          v-for="(star, index) in stars"
          :key="`star-${index}`"
          :transform="`translate(${star.x}, ${star.y})`"
        >
          <polygon
            :points="getStarPoints(star.size)"
            :fill="star.color"
            :opacity="star.opacity"
            :filter="`url(#glow-${id})`"
          >
            <animate
              attributeName="opacity"
              :values="`${star.opacity};${star.opacity * 0.3};${star.opacity}`"
              :dur="`${star.duration}s`"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              :dur="`${star.duration * 2}s`"
              repeatCount="indefinite"
            />
          </polygon>
        </g>
      </g>

      <!-- 装饰图案 -->
      <g v-if="showPatterns" class="pattern-decorations" opacity="0.15">
        <circle
          v-for="(pattern, index) in patterns"
          :key="`pattern-${index}`"
          :cx="pattern.x"
          :cy="pattern.y"
          :r="pattern.r"
          :stroke="pattern.color"
          :stroke-width="pattern.strokeWidth"
          fill="none"
          :class="`pattern-circle pattern-${index}`"
        >
          <animate
            attributeName="r"
            :from="pattern.r * 0.5"
            :to="pattern.r * 1.5"
            :dur="`${pattern.duration}s`"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.5;0"
            :dur="`${pattern.duration}s`"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  theme?: 'baby' | 'pastel' | 'ocean' | 'sunset' | 'forest'
  showWaves?: boolean
  showStars?: boolean
  showPatterns?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'baby',
  showWaves: true,
  showStars: false,
  showPatterns: true
})

const id = Math.random().toString(36).substring(7)

// 主题颜色配置
const themeColors = {
  baby: ['#ffc4d6', '#c7b3e5', '#a8d8ea'],
  pastel: ['#ffd4e5', '#f8e1a6', '#c8f7dc'],
  ocean: ['#4facfe', '#00f2fe', '#43e97b'],
  sunset: ['#fa709a', '#fee140', '#f093fb'],
  forest: ['#56ab2f', '#a8e063', '#7fcdcd']
}

const gradientColors = computed(() => themeColors[props.theme] || themeColors.baby)

// 浮动形状
const floatingShapes = computed(() => [
  { x: 200, y: 150, r: 120, color: gradientColors.value[0], opacity: 0.3, duration: 15, delay: 0, moveX: 50, moveY: 30 },
  { x: 800, y: 400, r: 180, color: gradientColors.value[1], opacity: 0.25, duration: 20, delay: 2, moveX: -60, moveY: 40 },
  { x: 1200, y: 200, r: 150, color: gradientColors.value[2], opacity: 0.28, duration: 18, delay: 4, moveX: 40, moveY: -50 },
  { x: 400, y: 600, r: 100, color: gradientColors.value[0], opacity: 0.22, duration: 16, delay: 1, moveX: -30, moveY: 35 },
  { x: 1000, y: 650, r: 130, color: gradientColors.value[1], opacity: 0.26, duration: 22, delay: 3, moveX: 55, moveY: -40 }
])

// 光晕效果
const glowEffects = computed(() => [
  { x: 300, y: 300, rx: 200, ry: 150, opacity: 0.4, duration: 8 },
  { x: 1100, y: 500, rx: 250, ry: 180, opacity: 0.35, duration: 10 },
  { x: 700, y: 200, rx: 180, ry: 120, opacity: 0.3, duration: 12 }
])

// 波浪路径
const waves = computed(() => [
  {
    path: 'M 0 300 Q 360 250 720 300 T 1440 300',
    pathAlt: 'M 0 300 Q 360 350 720 300 T 1440 300',
    color: gradientColors.value[0],
    opacity: 0.6,
    duration: 8
  },
  {
    path: 'M 0 400 Q 360 350 720 400 T 1440 400',
    pathAlt: 'M 0 400 Q 360 450 720 400 T 1440 400',
    color: gradientColors.value[1],
    opacity: 0.5,
    duration: 10
  },
  {
    path: 'M 0 500 Q 360 450 720 500 T 1440 500',
    pathAlt: 'M 0 500 Q 360 550 720 500 T 1440 500',
    color: gradientColors.value[2],
    opacity: 0.4,
    duration: 12
  }
])

// 星星
const stars = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    x: 100 + (i * 120) + (Math.random() * 50),
    y: 100 + (Math.random() * 600),
    size: 8 + Math.random() * 8,
    color: '#ffffff',
    opacity: 0.4 + Math.random() * 0.4,
    duration: 2 + Math.random() * 3
  }))
)

// 装饰图案
const patterns = computed(() =>
  Array.from({ length: 8 }, (_, i) => ({
    x: 150 + (i * 180),
    y: 150 + ((i % 3) * 200),
    r: 30 + Math.random() * 40,
    color: gradientColors.value[i % 3],
    strokeWidth: 2,
    duration: 4 + Math.random() * 4
  }))
)

// 生成星星路径
const getStarPoints = (size: number) => {
  const points = []
  const outerRadius = size
  const innerRadius = size * 0.4

  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2
    const innerAngle = outerAngle + Math.PI / 5

    points.push(`${outerRadius * Math.cos(outerAngle)},${outerRadius * Math.sin(outerAngle)}`)
    points.push(`${innerRadius * Math.cos(innerAngle)},${innerRadius * Math.sin(innerAngle)}`)
  }

  return points.join(' ')
}
</script>

<style scoped>
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.background-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.floating-shape {
  animation: float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(10px, -10px) scale(1.05);
  }
}

.glow-effect {
  mix-blend-mode: screen;
}

.wave-line {
  stroke-linecap: round;
}

.pattern-circle {
  mix-blend-mode: overlay;
}

/* 主题特定样式 */
.theme-baby {
  background: linear-gradient(135deg, #ffeef8 0%, #e8f4f8 100%);
}

.theme-pastel {
  background: linear-gradient(135deg, #fff5f7 0%, #fffef0 100%);
}

.theme-ocean {
  background: linear-gradient(135deg, #e0f7ff 0%, #d4f1f4 100%);
}

.theme-sunset {
  background: linear-gradient(135deg, #fff0f5 0%, #fffaeb 100%);
}

.theme-forest {
  background: linear-gradient(135deg, #f0fff4 0%, #e8f8f5 100%);
}
</style>

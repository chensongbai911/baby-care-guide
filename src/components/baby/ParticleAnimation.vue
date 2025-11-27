<template>
  <div class="particle-container">
    <svg class="particle-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <!-- 星星渐变 -->
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fbbf24" />
          <stop offset="100%" style="stop-color:#f59e0b" />
        </linearGradient>

        <!-- 心形渐变 -->
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f472b6" />
          <stop offset="100%" style="stop-color:#ec4899" />
        </linearGradient>

        <!-- 发光滤镜 -->
        <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 漂浮的星星 -->
      <g class="stars-group">
        <g v-for="(star, index) in stars" :key="'star-' + index"
           :class="['star-item', `star-${index}`]"
           :style="{ '--delay': star.delay + 's', '--duration': star.duration + 's' }">
          <polygon
            :points="getStarPoints(star.x, star.y, star.size)"
            fill="url(#starGradient)"
            filter="url(#particleGlow)"
            :opacity="star.opacity"
          />
        </g>
      </g>

      <!-- 漂浮的心形 -->
      <g class="hearts-group">
        <g v-for="(heart, index) in hearts" :key="'heart-' + index"
           :class="['heart-item', `heart-${index}`]"
           :style="{ '--delay': heart.delay + 's', '--duration': heart.duration + 's' }">
          <path
            :d="getHeartPath(heart.x, heart.y, heart.size)"
            fill="url(#heartGradient)"
            filter="url(#particleGlow)"
            :opacity="heart.opacity"
          />
        </g>
      </g>

      <!-- 漂浮的气泡 -->
      <g class="bubbles-group">
        <g v-for="(bubble, index) in bubbles" :key="'bubble-' + index"
           :class="['bubble-item', `bubble-${index}`]"
           :style="{ '--delay': bubble.delay + 's', '--duration': bubble.duration + 's' }">
          <circle
            :cx="bubble.x"
            :cy="bubble.y"
            :r="bubble.size"
            :fill="bubble.color"
            :opacity="bubble.opacity"
          />
          <circle
            :cx="bubble.x - bubble.size * 0.3"
            :cy="bubble.y - bubble.size * 0.3"
            :r="bubble.size * 0.2"
            fill="rgba(255,255,255,0.8)"
          />
        </g>
      </g>

      <!-- 闪烁的光点 -->
      <g class="sparkles-group">
        <g v-for="(sparkle, index) in sparkles" :key="'sparkle-' + index"
           :class="['sparkle-item', `sparkle-${index}`]"
           :style="{ '--delay': sparkle.delay + 's' }">
          <circle
            :cx="sparkle.x"
            :cy="sparkle.y"
            r="2"
            fill="#fff"
            filter="url(#particleGlow)"
          />
          <line
            :x1="sparkle.x - 8" :y1="sparkle.y"
            :x2="sparkle.x + 8" :y2="sparkle.y"
            stroke="#fff" stroke-width="1" opacity="0.6"
          />
          <line
            :x1="sparkle.x" :y1="sparkle.y - 8"
            :x2="sparkle.x" :y2="sparkle.y + 8"
            stroke="#fff" stroke-width="1" opacity="0.6"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 生成星星数据
const stars = ref(
  Array.from({ length: 8 }, () => ({
    x: 50 + Math.random() * 700,
    y: 50 + Math.random() * 500,
    size: 8 + Math.random() * 12,
    opacity: 0.6 + Math.random() * 0.4,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4
  }))
)

// 生成心形数据
const hearts = ref(
  Array.from({ length: 6 }, () => ({
    x: 100 + Math.random() * 600,
    y: 100 + Math.random() * 400,
    size: 10 + Math.random() * 15,
    opacity: 0.5 + Math.random() * 0.4,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 5
  }))
)

// 生成气泡数据
const bubbles = ref(
  Array.from({ length: 12 }, () => ({
    x: Math.random() * 800,
    y: Math.random() * 600,
    size: 5 + Math.random() * 20,
    color: ['rgba(124, 58, 237, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(168, 85, 247, 0.3)', 'rgba(251, 191, 36, 0.2)'][Math.floor(Math.random() * 4)],
    opacity: 0.4 + Math.random() * 0.4,
    delay: Math.random() * 8,
    duration: 5 + Math.random() * 7
  }))
)

// 生成闪烁光点数据
const sparkles = ref(
  Array.from({ length: 15 }, () => ({
    x: Math.random() * 800,
    y: Math.random() * 600,
    delay: Math.random() * 3
  }))
)

// 生成星星路径点
const getStarPoints = (cx: number, cy: number, size: number) => {
  const points = []
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * Math.PI / 180
    const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180
    points.push(`${cx + size * Math.cos(outerAngle)},${cy + size * Math.sin(outerAngle)}`)
    points.push(`${cx + size * 0.4 * Math.cos(innerAngle)},${cy + size * 0.4 * Math.sin(innerAngle)}`)
  }
  return points.join(' ')
}

// 生成心形路径
const getHeartPath = (cx: number, cy: number, size: number) => {
  const s = size / 10
  return `M ${cx} ${cy + s * 3}
    C ${cx} ${cy + s}, ${cx - s * 5} ${cy + s}, ${cx - s * 5} ${cy - s * 2}
    C ${cx - s * 5} ${cy - s * 5}, ${cx} ${cy - s * 5}, ${cx} ${cy - s * 2}
    C ${cx} ${cy - s * 5}, ${cx + s * 5} ${cy - s * 5}, ${cx + s * 5} ${cy - s * 2}
    C ${cx + s * 5} ${cy + s}, ${cx} ${cy + s}, ${cx} ${cy + s * 3} Z`
}
</script>

<style scoped>
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle-svg {
  width: 100%;
  height: 100%;
}

/* 星星动画 */
.star-item {
  animation: floatStar var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  transform-origin: center;
}

@keyframes floatStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-20px) rotate(15deg) scale(1.1);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px) rotate(-10deg) scale(0.95);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-25px) rotate(5deg) scale(1.05);
    opacity: 0.9;
  }
}

/* 心形动画 */
.heart-item {
  animation: floatHeart var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  transform-origin: center;
}

@keyframes floatHeart {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-30px) scale(1.2);
    opacity: 0.9;
  }
}

/* 气泡动画 */
.bubble-item {
  animation: floatBubble var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes floatBubble {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translateY(-40px) translateX(10px) scale(1.1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-80px) translateX(-5px) scale(0.9);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-120px) translateX(15px) scale(1.05);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-160px) translateX(0) scale(0.8);
    opacity: 0;
  }
}

/* 闪烁光点动画 */
.sparkle-item {
  animation: sparkle 2s ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 针对不同星星添加独特动画 */
.star-0 { animation-name: floatStar, rotateStar; }
.star-2 { animation-name: floatStar, pulseStar; }
.star-4 { animation-name: floatStar, rotateStar; }

@keyframes rotateStar {
  0%, 100% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulseStar {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
</style>

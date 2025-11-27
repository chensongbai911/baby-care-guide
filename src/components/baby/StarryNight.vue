<template>
  <div class="starry-night-container">
    <svg
      viewBox="0 0 800 400"
      class="starry-svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <!-- 星星渐变 -->
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#fef08a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#fde047;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:#facc15;stop-opacity:0" />
        </radialGradient>

        <!-- 月亮渐变 -->
        <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fef9c3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fde68a;stop-opacity:1" />
        </linearGradient>

        <!-- 夜空渐变 -->
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1e1b4b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#312e81;stop-opacity:1" />
        </linearGradient>

        <!-- 发光滤镜 -->
        <filter id="starBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 夜空背景 -->
      <rect x="0" y="0" width="800" height="400" fill="url(#skyGradient)" />

      <!-- 月亮 -->
      <g class="moon-group">
        <circle
          cx="650"
          cy="80"
          r="50"
          fill="url(#moonGradient)"
          filter="url(#moonGlow)"
          class="moon"
        />
        <!-- 月亮上的阴影（月牙效果） -->
        <circle
          cx="680"
          cy="65"
          r="45"
          fill="url(#skyGradient)"
          class="moon-shadow"
        />
      </g>

      <!-- 随机生成的星星 -->
      <g class="stars-group">
        <g v-for="(star, index) in stars" :key="'star-'+index" class="star-wrapper">
          <!-- 星星发光效果 -->
          <circle
            :cx="star.x"
            :cy="star.y"
            :r="star.size * 3"
            fill="url(#starGlow)"
            :opacity="star.opacity * 0.3"
            class="star-glow"
            :style="{ animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }"
          />
          <!-- 星星本体 -->
          <circle
            :cx="star.x"
            :cy="star.y"
            :r="star.size"
            :fill="star.color"
            filter="url(#starBlur)"
            class="star"
            :style="{ animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }"
          />
        </g>
      </g>

      <!-- 流星 -->
      <g class="shooting-stars">
        <g v-for="(meteor, index) in meteors" :key="'meteor-'+index" class="meteor-group">
          <line
            :x1="meteor.x"
            :y1="meteor.y"
            :x2="meteor.x + 60"
            :y2="meteor.y - 30"
            stroke="url(#starGlow)"
            stroke-width="2"
            stroke-linecap="round"
            class="meteor"
            :style="{ animationDelay: `${meteor.delay}s` }"
          />
        </g>
      </g>

      <!-- 云朵 -->
      <g class="clouds">
        <g class="cloud cloud-1">
          <ellipse cx="100" cy="320" rx="60" ry="25" fill="#1e293b" opacity="0.4"/>
          <ellipse cx="140" cy="310" rx="50" ry="20" fill="#1e293b" opacity="0.4"/>
          <ellipse cx="70" cy="315" rx="40" ry="18" fill="#1e293b" opacity="0.4"/>
        </g>
        <g class="cloud cloud-2">
          <ellipse cx="600" cy="350" rx="70" ry="28" fill="#1e293b" opacity="0.3"/>
          <ellipse cx="650" cy="340" rx="55" ry="22" fill="#1e293b" opacity="0.3"/>
          <ellipse cx="560" cy="345" rx="45" ry="20" fill="#1e293b" opacity="0.3"/>
        </g>
      </g>

      <!-- 睡觉的宝宝图标（可选显示） -->
      <g v-if="showBaby" class="sleeping-baby">
        <text x="400" y="250" text-anchor="middle" font-size="80" class="baby-emoji">😴</text>
        <text x="400" y="300" text-anchor="middle" font-size="16" fill="#94a3b8" class="sleep-text">宝宝正在甜睡中...</text>
        <!-- Z字母动画 -->
        <text
          v-for="(z, i) in zzzs"
          :key="'z-'+i"
          :x="440 + i * 20"
          :y="220 - i * 25"
          font-size="20"
          fill="#a78bfa"
          class="zzz"
          :style="{ animationDelay: `${i * 0.3}s` }"
        >Z</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  showBaby?: boolean
}>()

// 生成随机星星
const stars = computed(() => {
  const starList = []
  const colors = ['#fef08a', '#fde047', '#fff', '#e0f2fe', '#ddd6fe']

  for (let i = 0; i < 50; i++) {
    starList.push({
      x: Math.random() * 800,
      y: Math.random() * 300,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    })
  }
  return starList
})

// 流星
const meteors = computed(() => [
  { x: 200, y: 100, delay: 0 },
  { x: 500, y: 80, delay: 4 },
  { x: 350, y: 150, delay: 8 }
])

// Z字母
const zzzs = computed(() => [1, 2, 3])
</script>

<style scoped>
.starry-night-container {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.starry-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* 月亮动画 */
.moon {
  animation: moonGlow 4s ease-in-out infinite;
}

@keyframes moonGlow {
  0%, 100% {
    filter: url(#moonGlow);
    opacity: 1;
  }
  50% {
    filter: url(#moonGlow) brightness(1.1);
    opacity: 0.95;
  }
}

/* 星星闪烁动画 */
.star {
  animation: twinkle 2s ease-in-out infinite;
}

.star-glow {
  animation: starGlowPulse 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

@keyframes starGlowPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.1;
    transform: scale(1.2);
  }
}

/* 流星动画 */
.meteor {
  opacity: 0;
  animation: shootingStar 3s ease-out infinite;
}

@keyframes shootingStar {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(0);
  }
  10% {
    opacity: 1;
  }
  30% {
    opacity: 0;
    transform: translateX(150px) translateY(-75px);
  }
  100% {
    opacity: 0;
    transform: translateX(150px) translateY(-75px);
  }
}

/* 云朵飘动 */
.cloud-1 {
  animation: floatCloud1 20s ease-in-out infinite;
}

.cloud-2 {
  animation: floatCloud2 25s ease-in-out infinite;
}

@keyframes floatCloud1 {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(30px);
  }
}

@keyframes floatCloud2 {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-40px);
  }
}

/* 宝宝表情动画 */
.baby-emoji {
  animation: babyFloat 3s ease-in-out infinite;
}

@keyframes babyFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Z字母动画 */
.zzz {
  opacity: 0;
  animation: zzzFloat 2s ease-out infinite;
}

@keyframes zzzFloat {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(1.2);
  }
}

.sleep-text {
  animation: textFade 3s ease-in-out infinite;
}

@keyframes textFade {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>

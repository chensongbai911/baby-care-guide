<template>
  <div class="baby-loader" :class="{ 'full-screen': fullScreen }">
    <svg viewBox="0 0 200 200" class="loader-svg">
      <defs>
        <!-- 渐变定义 -->
        <linearGradient id="loaderGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a78bfa" />
          <stop offset="100%" style="stop-color:#7c3aed" />
        </linearGradient>
        <linearGradient id="loaderGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f472b6" />
          <stop offset="100%" style="stop-color:#ec4899" />
        </linearGradient>
        <linearGradient id="loaderGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fbbf24" />
          <stop offset="100%" style="stop-color:#f59e0b" />
        </linearGradient>

        <!-- 发光效果 -->
        <filter id="loaderGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 外圈旋转轨道 -->
      <circle
        cx="100" cy="100" r="80"
        fill="none"
        stroke="rgba(167, 139, 250, 0.2)"
        stroke-width="4"
      />

      <!-- 旋转的轨道球 -->
      <g class="orbit-group">
        <circle class="orbit-ball orbit-1" cx="100" cy="20" r="8" fill="url(#loaderGradient1)" filter="url(#loaderGlow)"/>
        <circle class="orbit-ball orbit-2" cx="180" cy="100" r="6" fill="url(#loaderGradient2)" filter="url(#loaderGlow)"/>
        <circle class="orbit-ball orbit-3" cx="100" cy="180" r="7" fill="url(#loaderGradient3)" filter="url(#loaderGlow)"/>
      </g>

      <!-- 中心宝宝脸 -->
      <g class="baby-face">
        <!-- 脸部 -->
        <circle cx="100" cy="100" r="45" fill="#ffe4c9" class="face"/>

        <!-- 腮红 -->
        <ellipse cx="70" cy="110" rx="10" ry="6" fill="#ffb8b8" opacity="0.6" class="blush-left"/>
        <ellipse cx="130" cy="110" rx="10" ry="6" fill="#ffb8b8" opacity="0.6" class="blush-right"/>

        <!-- 眼睛 -->
        <g class="eyes">
          <ellipse cx="82" cy="95" rx="8" ry="10" fill="#4a3728"/>
          <ellipse cx="118" cy="95" rx="8" ry="10" fill="#4a3728"/>
          <!-- 眼睛高光 -->
          <circle cx="84" cy="92" r="3" fill="#fff"/>
          <circle cx="120" cy="92" r="3" fill="#fff"/>
        </g>

        <!-- 眉毛 -->
        <path d="M72 82 Q82 78 90 82" stroke="#6b5344" stroke-width="2" fill="none" class="eyebrow-left"/>
        <path d="M110 82 Q118 78 128 82" stroke="#6b5344" stroke-width="2" fill="none" class="eyebrow-right"/>

        <!-- 嘴巴 -->
        <path d="M90 118 Q100 128 110 118" stroke="#e57373" stroke-width="3" fill="none" stroke-linecap="round" class="mouth"/>

        <!-- 头发 -->
        <g class="hair">
          <path d="M60 70 Q70 50 85 55 Q75 65 60 70" fill="#5d4037"/>
          <path d="M85 55 Q100 45 115 55 Q100 60 85 55" fill="#5d4037"/>
          <path d="M115 55 Q130 50 140 70 Q125 65 115 55" fill="#5d4037"/>
          <!-- 可爱的呆毛 -->
          <path d="M100 50 Q95 35 105 30 Q108 40 100 50" fill="#5d4037" class="ahoge"/>
        </g>
      </g>

      <!-- 装饰星星 -->
      <g class="decorative-stars">
        <polygon points="30,40 33,48 42,48 35,53 38,62 30,57 22,62 25,53 18,48 27,48"
                 fill="url(#loaderGradient3)" class="star star-1"/>
        <polygon points="170,50 172,56 178,56 173,60 175,66 170,62 165,66 167,60 162,56 168,56"
                 fill="url(#loaderGradient2)" class="star star-2"/>
        <polygon points="25,150 27,155 32,155 28,158 30,163 25,160 20,163 22,158 18,155 23,155"
                 fill="url(#loaderGradient1)" class="star star-3"/>
        <polygon points="175,140 177,145 182,145 178,148 180,153 175,150 170,153 172,148 168,145 173,145"
                 fill="url(#loaderGradient3)" class="star star-4"/>
      </g>

      <!-- 漂浮的心形 -->
      <g class="floating-hearts">
        <path d="M45 90 C45 85 40 80 35 85 C30 80 25 85 25 90 C25 100 35 105 35 105 C35 105 45 100 45 90Z"
              fill="url(#loaderGradient2)" opacity="0.7" class="heart heart-1"/>
        <path d="M175 100 C175 96 171 92 167 96 C163 92 159 96 159 100 C159 108 167 112 167 112 C167 112 175 108 175 100Z"
              fill="url(#loaderGradient2)" opacity="0.7" class="heart heart-2"/>
      </g>
    </svg>

    <p class="loading-text" v-if="showText">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  fullScreen?: boolean
  showText?: boolean
  text?: string
}>()
</script>

<style scoped>
.baby-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.baby-loader.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
}

.loader-svg {
  width: 150px;
  height: 150px;
}

/* 轨道旋转动画 */
.orbit-group {
  transform-origin: 100px 100px;
  animation: orbitRotate 3s linear infinite;
}

@keyframes orbitRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-ball {
  animation: pulseBall 1.5s ease-in-out infinite;
}

.orbit-1 { animation-delay: 0s; }
.orbit-2 { animation-delay: 0.5s; }
.orbit-3 { animation-delay: 1s; }

@keyframes pulseBall {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
}

/* 宝宝脸部动画 */
.baby-face {
  animation: gentleBounce 2s ease-in-out infinite;
}

@keyframes gentleBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.face {
  animation: faceGlow 3s ease-in-out infinite;
}

@keyframes faceGlow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 200, 150, 0.3)); }
  50% { filter: drop-shadow(0 0 15px rgba(255, 200, 150, 0.6)); }
}

/* 眼睛眨眼动画 */
.eyes {
  animation: blink 4s ease-in-out infinite;
}

@keyframes blink {
  0%, 45%, 55%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}

/* 腮红动画 */
.blush-left, .blush-right {
  animation: blushPulse 2s ease-in-out infinite;
}

.blush-right {
  animation-delay: 0.5s;
}

@keyframes blushPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

/* 嘴巴动画 */
.mouth {
  animation: smile 3s ease-in-out infinite;
}

@keyframes smile {
  0%, 100% { d: path("M90 118 Q100 128 110 118"); }
  50% { d: path("M88 118 Q100 132 112 118"); }
}

/* 呆毛动画 */
.ahoge {
  transform-origin: 100px 50px;
  animation: ahogeWiggle 2s ease-in-out infinite;
}

@keyframes ahogeWiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

/* 星星动画 */
.star {
  animation: starTwinkle 1.5s ease-in-out infinite;
}

.star-1 { animation-delay: 0s; }
.star-2 { animation-delay: 0.3s; }
.star-3 { animation-delay: 0.6s; }
.star-4 { animation-delay: 0.9s; }

@keyframes starTwinkle {
  0%, 100% { opacity: 0.5; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
}

/* 心形动画 */
.heart {
  animation: heartFloat 2.5s ease-in-out infinite;
}

.heart-1 { animation-delay: 0s; }
.heart-2 { animation-delay: 1.25s; }

@keyframes heartFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 0.9;
  }
}

/* 加载文字 */
.loading-text {
  margin-top: 20px;
  font-size: 16px;
  color: #7c3aed;
  font-weight: 500;
  animation: textPulse 1.5s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>

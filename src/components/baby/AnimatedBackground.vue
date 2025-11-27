<template>
  <div class="animated-background">
    <!-- 漂浮的云朵 -->
    <svg class="cloud cloud-1" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="40" rx="25" ry="18" fill="rgba(255,255,255,0.9)"/>
      <ellipse cx="55" cy="35" rx="30" ry="22" fill="rgba(255,255,255,0.95)"/>
      <ellipse cx="75" cy="42" rx="20" ry="15" fill="rgba(255,255,255,0.9)"/>
      <ellipse cx="45" cy="45" rx="28" ry="15" fill="rgba(255,255,255,0.95)"/>
    </svg>

    <svg class="cloud cloud-2" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="40" rx="22" ry="16" fill="rgba(255,255,255,0.85)"/>
      <ellipse cx="50" cy="35" rx="26" ry="20" fill="rgba(255,255,255,0.9)"/>
      <ellipse cx="70" cy="40" rx="18" ry="14" fill="rgba(255,255,255,0.85)"/>
    </svg>

    <svg class="cloud cloud-3" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="25" cy="38" rx="20" ry="14" fill="rgba(255,255,255,0.8)"/>
      <ellipse cx="50" cy="32" rx="28" ry="20" fill="rgba(255,255,255,0.85)"/>
      <ellipse cx="72" cy="38" rx="22" ry="16" fill="rgba(255,255,255,0.8)"/>
    </svg>

    <!-- 闪烁的星星 -->
    <svg class="star star-1" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <polygon points="25,2 32,18 50,20 37,33 40,50 25,42 10,50 13,33 0,20 18,18"
               fill="url(#starGradient1)" filter="url(#glow)"/>
      <defs>
        <linearGradient id="starGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fbbf24"/>
          <stop offset="100%" style="stop-color:#f59e0b"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>

    <svg class="star star-2" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <polygon points="25,5 30,18 45,20 34,30 37,45 25,38 13,45 16,30 5,20 20,18"
               fill="#a78bfa"/>
    </svg>

    <svg class="star star-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <polygon points="25,5 30,18 45,20 34,30 37,45 25,38 13,45 16,30 5,20 20,18"
               fill="#f472b6"/>
    </svg>

    <svg class="star star-4" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <polygon points="25,5 30,18 45,20 34,30 37,45 25,38 13,45 16,30 5,20 20,18"
               fill="#67e8f9"/>
    </svg>

    <!-- 漂浮的爱心 -->
    <svg class="heart heart-1" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,45 L22,42 C10,31 2,24 2,15 C2,8 7,3 14,3 C18,3 22,5 25,9 C28,5 32,3 36,3 C43,3 48,8 48,15 C48,24 40,31 28,42 L25,45 Z"
            fill="url(#heartGradient1)"/>
      <defs>
        <linearGradient id="heartGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ec4899"/>
          <stop offset="100%" style="stop-color:#f472b6"/>
        </linearGradient>
      </defs>
    </svg>

    <svg class="heart heart-2" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,45 L22,42 C10,31 2,24 2,15 C2,8 7,3 14,3 C18,3 22,5 25,9 C28,5 32,3 36,3 C43,3 48,8 48,15 C48,24 40,31 28,42 L25,45 Z"
            fill="url(#heartGradient2)"/>
      <defs>
        <linearGradient id="heartGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a855f7"/>
          <stop offset="100%" style="stop-color:#c084fc"/>
        </linearGradient>
      </defs>
    </svg>

    <svg class="heart heart-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,45 L22,42 C10,31 2,24 2,15 C2,8 7,3 14,3 C18,3 22,5 25,9 C28,5 32,3 36,3 C43,3 48,8 48,15 C48,24 40,31 28,42 L25,45 Z"
            fill="url(#heartGradient3)"/>
      <defs>
        <linearGradient id="heartGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fb7185"/>
          <stop offset="100%" style="stop-color:#fda4af"/>
        </linearGradient>
      </defs>
    </svg>

    <!-- 可爱的气泡 -->
    <svg class="bubble bubble-1" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="20" fill="url(#bubbleGradient)" opacity="0.6"/>
      <ellipse cx="18" cy="18" rx="5" ry="4" fill="rgba(255,255,255,0.6)"/>
      <defs>
        <radialGradient id="bubbleGradient" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.8)"/>
          <stop offset="100%" style="stop-color:rgba(168,85,247,0.3)"/>
        </radialGradient>
      </defs>
    </svg>

    <svg class="bubble bubble-2" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="18" fill="url(#bubbleGradient2)" opacity="0.5"/>
      <ellipse cx="18" cy="18" rx="4" ry="3" fill="rgba(255,255,255,0.5)"/>
      <defs>
        <radialGradient id="bubbleGradient2" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.7)"/>
          <stop offset="100%" style="stop-color:rgba(236,72,153,0.3)"/>
        </radialGradient>
      </defs>
    </svg>

    <svg class="bubble bubble-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="15" fill="url(#bubbleGradient3)" opacity="0.5"/>
      <ellipse cx="20" cy="20" rx="3" ry="2" fill="rgba(255,255,255,0.5)"/>
      <defs>
        <radialGradient id="bubbleGradient3" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.6)"/>
          <stop offset="100%" style="stop-color:rgba(103,232,249,0.3)"/>
        </radialGradient>
      </defs>
    </svg>

    <!-- 小蝴蝶 -->
    <svg class="butterfly butterfly-1" viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
      <g class="butterfly-wings">
        <ellipse cx="18" cy="18" rx="15" ry="12" fill="url(#wingGradient1)" transform="rotate(-20, 18, 18)"/>
        <ellipse cx="42" cy="18" rx="15" ry="12" fill="url(#wingGradient1)" transform="rotate(20, 42, 18)"/>
        <ellipse cx="15" cy="32" rx="10" ry="8" fill="url(#wingGradient2)" transform="rotate(-30, 15, 32)"/>
        <ellipse cx="45" cy="32" rx="10" ry="8" fill="url(#wingGradient2)" transform="rotate(30, 45, 32)"/>
      </g>
      <ellipse cx="30" cy="25" rx="3" ry="15" fill="#7c3aed"/>
      <circle cx="30" cy="8" r="4" fill="#7c3aed"/>
      <path d="M28,5 Q24,0 22,2" stroke="#7c3aed" fill="none" stroke-width="1.5"/>
      <path d="M32,5 Q36,0 38,2" stroke="#7c3aed" fill="none" stroke-width="1.5"/>
      <defs>
        <linearGradient id="wingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#c084fc"/>
          <stop offset="100%" style="stop-color:#f472b6"/>
        </linearGradient>
        <linearGradient id="wingGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a78bfa"/>
          <stop offset="100%" style="stop-color:#ec4899"/>
        </linearGradient>
      </defs>
    </svg>

    <!-- 彩虹 -->
    <svg class="rainbow" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,100 Q100,0 190,100" fill="none" stroke="#ef4444" stroke-width="8" opacity="0.6"/>
      <path d="M20,100 Q100,10 180,100" fill="none" stroke="#f59e0b" stroke-width="8" opacity="0.6"/>
      <path d="M30,100 Q100,20 170,100" fill="none" stroke="#fbbf24" stroke-width="8" opacity="0.6"/>
      <path d="M40,100 Q100,30 160,100" fill="none" stroke="#10b981" stroke-width="8" opacity="0.6"/>
      <path d="M50,100 Q100,40 150,100" fill="none" stroke="#06b6d4" stroke-width="8" opacity="0.6"/>
      <path d="M60,100 Q100,50 140,100" fill="none" stroke="#8b5cf6" stroke-width="8" opacity="0.6"/>
      <path d="M70,100 Q100,60 130,100" fill="none" stroke="#ec4899" stroke-width="8" opacity="0.6"/>
    </svg>

    <!-- 小花朵 -->
    <svg class="flower flower-1" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <g class="petals">
        <ellipse cx="25" cy="12" rx="8" ry="12" fill="#f472b6"/>
        <ellipse cx="25" cy="12" rx="8" ry="12" fill="#c084fc" transform="rotate(72, 25, 25)"/>
        <ellipse cx="25" cy="12" rx="8" ry="12" fill="#f472b6" transform="rotate(144, 25, 25)"/>
        <ellipse cx="25" cy="12" rx="8" ry="12" fill="#c084fc" transform="rotate(216, 25, 25)"/>
        <ellipse cx="25" cy="12" rx="8" ry="12" fill="#f472b6" transform="rotate(288, 25, 25)"/>
      </g>
      <circle cx="25" cy="25" r="8" fill="#fbbf24"/>
      <circle cx="23" cy="23" r="2" fill="#f59e0b"/>
      <circle cx="27" cy="24" r="1.5" fill="#f59e0b"/>
      <circle cx="25" cy="27" r="1.5" fill="#f59e0b"/>
    </svg>

    <svg class="flower flower-2" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <g class="petals">
        <ellipse cx="25" cy="12" rx="7" ry="10" fill="#67e8f9"/>
        <ellipse cx="25" cy="12" rx="7" ry="10" fill="#a78bfa" transform="rotate(60, 25, 25)"/>
        <ellipse cx="25" cy="12" rx="7" ry="10" fill="#67e8f9" transform="rotate(120, 25, 25)"/>
        <ellipse cx="25" cy="12" rx="7" ry="10" fill="#a78bfa" transform="rotate(180, 25, 25)"/>
        <ellipse cx="25" cy="12" rx="7" ry="10" fill="#67e8f9" transform="rotate(240, 25, 25)"/>
        <ellipse cx="25" cy="12" rx="7" ry="10" fill="#a78bfa" transform="rotate(300, 25, 25)"/>
      </g>
      <circle cx="25" cy="25" r="7" fill="#fcd34d"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 云朵动画 */
.cloud {
  position: absolute;
  filter: drop-shadow(0 4px 8px rgba(124, 58, 237, 0.1));
}

.cloud-1 {
  width: 180px;
  top: 5%;
  left: -180px;
  animation: floatCloud 35s linear infinite;
}

.cloud-2 {
  width: 140px;
  top: 15%;
  left: -140px;
  animation: floatCloud 45s linear infinite;
  animation-delay: -15s;
}

.cloud-3 {
  width: 120px;
  top: 8%;
  left: -120px;
  animation: floatCloud 55s linear infinite;
  animation-delay: -25s;
}

@keyframes floatCloud {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(100vw + 200px));
  }
}

/* 星星动画 */
.star {
  position: absolute;
}

.star-1 {
  width: 30px;
  top: 12%;
  right: 15%;
  animation: twinkleStar 3s ease-in-out infinite, floatStar 8s ease-in-out infinite;
}

.star-2 {
  width: 20px;
  top: 25%;
  left: 10%;
  animation: twinkleStar 2.5s ease-in-out infinite 0.5s, floatStar 10s ease-in-out infinite;
}

.star-3 {
  width: 25px;
  top: 8%;
  left: 30%;
  animation: twinkleStar 4s ease-in-out infinite 1s, floatStar 12s ease-in-out infinite;
}

.star-4 {
  width: 18px;
  top: 20%;
  right: 25%;
  animation: twinkleStar 3.5s ease-in-out infinite 1.5s, floatStar 9s ease-in-out infinite;
}

@keyframes twinkleStar {
  0%, 100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8) rotate(10deg);
  }
}

@keyframes floatStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(5deg);
  }
  75% {
    transform: translateY(-5px) rotate(-5deg);
  }
}

/* 爱心动画 */
.heart {
  position: absolute;
  filter: drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3));
}

.heart-1 {
  width: 35px;
  bottom: 30%;
  right: 8%;
  animation: floatHeart 6s ease-in-out infinite, heartPulse 2s ease-in-out infinite;
}

.heart-2 {
  width: 25px;
  bottom: 45%;
  left: 5%;
  animation: floatHeart 8s ease-in-out infinite 1s, heartPulse 2.5s ease-in-out infinite;
}

.heart-3 {
  width: 20px;
  top: 40%;
  right: 20%;
  animation: floatHeart 7s ease-in-out infinite 2s, heartPulse 3s ease-in-out infinite;
}

@keyframes floatHeart {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes heartPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 气泡动画 */
.bubble {
  position: absolute;
}

.bubble-1 {
  width: 45px;
  bottom: -50px;
  left: 15%;
  animation: riseBubble 12s ease-in-out infinite;
}

.bubble-2 {
  width: 35px;
  bottom: -50px;
  left: 45%;
  animation: riseBubble 15s ease-in-out infinite 3s;
}

.bubble-3 {
  width: 28px;
  bottom: -50px;
  right: 20%;
  animation: riseBubble 10s ease-in-out infinite 6s;
}

@keyframes riseBubble {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
    transform: scale(1);
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100vh) scale(1.2);
    opacity: 0;
  }
}

/* 蝴蝶动画 */
.butterfly {
  position: absolute;
  filter: drop-shadow(0 2px 4px rgba(124, 58, 237, 0.2));
}

.butterfly-1 {
  width: 50px;
  top: 30%;
  left: -60px;
  animation: flyButterfly 20s ease-in-out infinite;
}

.butterfly-wings {
  animation: flapWings 0.2s ease-in-out infinite;
  transform-origin: center;
}

@keyframes flyButterfly {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30vw, -50px) rotate(10deg);
  }
  50% {
    transform: translate(60vw, 30px) rotate(-5deg);
  }
  75% {
    transform: translate(85vw, -30px) rotate(15deg);
  }
  100% {
    transform: translate(110vw, 0) rotate(0deg);
  }
}

@keyframes flapWings {
  0%, 100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0.6);
  }
}

/* 彩虹 */
.rainbow {
  position: absolute;
  width: 300px;
  top: 2%;
  right: 5%;
  opacity: 0;
  animation: showRainbow 20s ease-in-out infinite;
}

@keyframes showRainbow {
  0%, 70%, 100% {
    opacity: 0;
    transform: scale(0.8);
  }
  75%, 95% {
    opacity: 0.7;
    transform: scale(1);
  }
}

/* 花朵动画 */
.flower {
  position: absolute;
  filter: drop-shadow(0 2px 4px rgba(124, 58, 237, 0.15));
}

.flower-1 {
  width: 40px;
  bottom: 15%;
  left: 8%;
  animation: swayFlower 4s ease-in-out infinite, bloomFlower 6s ease-in-out infinite;
}

.flower-2 {
  width: 35px;
  bottom: 20%;
  right: 12%;
  animation: swayFlower 5s ease-in-out infinite 1s, bloomFlower 8s ease-in-out infinite 2s;
}

.flower .petals {
  transform-origin: center;
  animation: spinPetals 20s linear infinite;
}

@keyframes swayFlower {
  0%, 100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

@keyframes bloomFlower {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes spinPetals {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式隐藏部分动画 */
@media (max-width: 768px) {
  .cloud-3,
  .star-3,
  .star-4,
  .heart-3,
  .bubble-3,
  .rainbow,
  .flower-2 {
    display: none;
  }

  .cloud-1 { width: 120px; }
  .cloud-2 { width: 100px; }
  .butterfly-1 { width: 35px; }
}
</style>

<template>
  <div class="floating-decorations">
    <!-- 浮动气泡 -->
    <div class="bubbles-container">
      <svg v-for="i in 8" :key="'bubble-'+i" class="bubble" :class="'bubble-'+i" viewBox="0 0 40 40">
        <defs>
          <radialGradient :id="'bubbleGrad'+i" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:rgba(255,255,255,0.9)"/>
            <stop offset="100%" style="stop-color:rgba(168,85,247,0.3)"/>
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="18" :fill="`url(#bubbleGrad${i})`" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        <ellipse cx="14" cy="14" rx="5" ry="3" fill="rgba(255,255,255,0.6)" transform="rotate(-30, 14, 14)"/>
      </svg>
    </div>

    <!-- 飘落的星星 -->
    <div class="falling-stars">
      <svg v-for="i in 6" :key="'star-'+i" class="falling-star" :class="'star-'+i" viewBox="0 0 30 30">
        <defs>
          <linearGradient :id="'starGrad'+i" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fef08a"/>
            <stop offset="100%" style="stop-color:#fbbf24"/>
          </linearGradient>
        </defs>
        <polygon points="15,2 18,11 28,11 20,17 23,27 15,21 7,27 10,17 2,11 12,11" :fill="`url(#starGrad${i})`"/>
      </svg>
    </div>

    <!-- 漂浮的云朵 -->
    <div class="clouds-container">
      <svg v-for="i in 4" :key="'cloud-'+i" class="cloud" :class="'cloud-'+i" viewBox="0 0 100 60">
        <defs>
          <linearGradient :id="'cloudGrad'+i" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(255,255,255,0.95)"/>
            <stop offset="100%" style="stop-color:rgba(241,245,249,0.9)"/>
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="40" rx="35" ry="18" :fill="`url(#cloudGrad${i})`"/>
        <ellipse cx="30" cy="35" rx="22" ry="15" :fill="`url(#cloudGrad${i})`"/>
        <ellipse cx="70" cy="35" rx="22" ry="15" :fill="`url(#cloudGrad${i})`"/>
        <ellipse cx="45" cy="28" rx="18" ry="14" :fill="`url(#cloudGrad${i})`"/>
        <ellipse cx="60" cy="30" rx="16" ry="12" :fill="`url(#cloudGrad${i})`"/>
      </svg>
    </div>

    <!-- 旋转的玩具 -->
    <div class="toys-container">
      <!-- 摇铃 -->
      <svg class="toy rattle" viewBox="0 0 50 80">
        <defs>
          <linearGradient id="rattleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f472b6"/>
            <stop offset="100%" style="stop-color:#ec4899"/>
          </linearGradient>
        </defs>
        <rect x="22" y="40" width="6" height="35" rx="3" fill="#fbbf24"/>
        <circle cx="25" cy="22" r="20" fill="url(#rattleGrad)" stroke="#db2777" stroke-width="2"/>
        <circle cx="18" cy="18" r="4" fill="#fef3c7"/>
        <circle cx="32" cy="18" r="4" fill="#a5f3fc"/>
        <circle cx="25" cy="28" r="4" fill="#d9f99d"/>
        <ellipse cx="15" cy="12" rx="3" ry="2" fill="rgba(255,255,255,0.5)"/>
      </svg>

      <!-- 积木 -->
      <svg class="toy blocks" viewBox="0 0 60 60">
        <defs>
          <linearGradient id="block1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f87171"/>
            <stop offset="100%" style="stop-color:#ef4444"/>
          </linearGradient>
          <linearGradient id="block2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#60a5fa"/>
            <stop offset="100%" style="stop-color:#3b82f6"/>
          </linearGradient>
          <linearGradient id="block3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4ade80"/>
            <stop offset="100%" style="stop-color:#22c55e"/>
          </linearGradient>
        </defs>
        <rect x="5" y="35" width="22" height="22" rx="3" fill="url(#block1Grad)" stroke="#dc2626" stroke-width="1"/>
        <text x="16" y="51" text-anchor="middle" font-size="14" font-weight="bold" fill="white">A</text>
        <rect x="33" y="35" width="22" height="22" rx="3" fill="url(#block2Grad)" stroke="#2563eb" stroke-width="1"/>
        <text x="44" y="51" text-anchor="middle" font-size="14" font-weight="bold" fill="white">B</text>
        <rect x="19" y="10" width="22" height="22" rx="3" fill="url(#block3Grad)" stroke="#16a34a" stroke-width="1"/>
        <text x="30" y="26" text-anchor="middle" font-size="14" font-weight="bold" fill="white">C</text>
      </svg>

      <!-- 小鸭子 -->
      <svg class="toy duck" viewBox="0 0 60 50">
        <defs>
          <radialGradient id="duckGrad" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:#fef08a"/>
            <stop offset="100%" style="stop-color:#facc15"/>
          </radialGradient>
        </defs>
        <ellipse cx="30" cy="35" rx="22" ry="14" fill="url(#duckGrad)"/>
        <circle cx="20" cy="20" r="14" fill="url(#duckGrad)"/>
        <ellipse cx="8" cy="22" rx="8" ry="4" fill="#f97316"/>
        <circle cx="24" cy="17" r="3" fill="#1e293b"/>
        <circle cx="23" cy="16" r="1" fill="white"/>
        <path d="M45,38 Q55,35 50,42 Q55,48 45,45" fill="#f97316"/>
        <ellipse cx="15" cy="12" rx="4" ry="2" fill="rgba(255,255,255,0.5)"/>
      </svg>
    </div>

    <!-- 爱心粒子 -->
    <div class="hearts-container">
      <svg v-for="i in 10" :key="'heart-'+i" class="floating-heart" :class="'heart-'+i" viewBox="0 0 30 30">
        <defs>
          <linearGradient :id="'heartGrad'+i" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fda4af"/>
            <stop offset="100%" style="stop-color:#fb7185"/>
          </linearGradient>
        </defs>
        <path d="M15,25 L13,23 C7,17 3,14 3,10 C3,6 6,3 10,3 C12,3 14,4 15,6 C16,4 18,3 20,3 C24,3 27,6 27,10 C27,14 23,17 17,23 L15,25 Z" :fill="`url(#heartGrad${i})`"/>
      </svg>
    </div>

    <!-- 音符动画 -->
    <div class="notes-container">
      <svg v-for="i in 5" :key="'note-'+i" class="music-note" :class="'note-'+i" viewBox="0 0 30 40">
        <ellipse cx="8" cy="32" rx="7" ry="5" fill="#a855f7"/>
        <rect x="14" y="8" width="3" height="25" fill="#a855f7"/>
        <path d="M17,8 Q25,5 25,15 Q25,20 17,18" fill="#c084fc"/>
      </svg>
    </div>

    <!-- 彩虹弧线 -->
    <svg class="rainbow" viewBox="0 0 200 100">
      <defs>
        <linearGradient id="rainbow1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ef4444"/>
          <stop offset="20%" style="stop-color:#f97316"/>
          <stop offset="40%" style="stop-color:#eab308"/>
          <stop offset="60%" style="stop-color:#22c55e"/>
          <stop offset="80%" style="stop-color:#3b82f6"/>
          <stop offset="100%" style="stop-color:#8b5cf6"/>
        </linearGradient>
      </defs>
      <path d="M10,100 A90,90 0 0,1 190,100" fill="none" stroke="url(#rainbow1)" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
      <path d="M25,100 A75,75 0 0,1 175,100" fill="none" stroke="url(#rainbow1)" stroke-width="6" stroke-linecap="round" opacity="0.4"/>
      <path d="M40,100 A60,60 0 0,1 160,100" fill="none" stroke="url(#rainbow1)" stroke-width="4" stroke-linecap="round" opacity="0.3"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.floating-decorations {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 气泡动画 */
.bubbles-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bubble {
  position: absolute;
  opacity: 0.7;
  animation: floatUp 8s ease-in-out infinite;
}

.bubble-1 { width: 30px; left: 5%; bottom: -50px; animation-delay: 0s; animation-duration: 10s; }
.bubble-2 { width: 45px; left: 15%; bottom: -50px; animation-delay: 2s; animation-duration: 12s; }
.bubble-3 { width: 25px; left: 30%; bottom: -50px; animation-delay: 4s; animation-duration: 9s; }
.bubble-4 { width: 35px; left: 50%; bottom: -50px; animation-delay: 1s; animation-duration: 11s; }
.bubble-5 { width: 40px; left: 65%; bottom: -50px; animation-delay: 3s; animation-duration: 10s; }
.bubble-6 { width: 28px; left: 80%; bottom: -50px; animation-delay: 5s; animation-duration: 13s; }
.bubble-7 { width: 32px; left: 90%; bottom: -50px; animation-delay: 2.5s; animation-duration: 9s; }
.bubble-8 { width: 38px; left: 42%; bottom: -50px; animation-delay: 6s; animation-duration: 11s; }

@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100vh) scale(1.2);
    opacity: 0;
  }
}

/* 飘落的星星 */
.falling-stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.falling-star {
  position: absolute;
  animation: fallAndSpin 6s linear infinite;
}

.star-1 { width: 20px; left: 10%; top: -30px; animation-delay: 0s; }
.star-2 { width: 25px; left: 25%; top: -30px; animation-delay: 1.5s; }
.star-3 { width: 18px; left: 45%; top: -30px; animation-delay: 3s; }
.star-4 { width: 22px; left: 60%; top: -30px; animation-delay: 0.8s; }
.star-5 { width: 28px; left: 78%; top: -30px; animation-delay: 2.2s; }
.star-6 { width: 16px; left: 92%; top: -30px; animation-delay: 4s; }

@keyframes fallAndSpin {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 云朵动画 */
.clouds-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  opacity: 0.8;
  animation: cloudFloat 20s linear infinite;
}

.cloud-1 { width: 120px; top: 8%; left: -150px; animation-duration: 25s; }
.cloud-2 { width: 100px; top: 20%; left: -150px; animation-delay: 8s; animation-duration: 22s; }
.cloud-3 { width: 80px; top: 35%; left: -150px; animation-delay: 15s; animation-duration: 28s; }
.cloud-4 { width: 110px; top: 50%; left: -150px; animation-delay: 5s; animation-duration: 24s; }

@keyframes cloudFloat {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(100vw + 200px));
  }
}

/* 玩具动画 */
.toys-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.toy {
  position: absolute;
  opacity: 0.9;
}

.rattle {
  width: 50px;
  top: 15%;
  right: 8%;
  animation: rattleShake 2s ease-in-out infinite;
}

@keyframes rattleShake {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
}

.blocks {
  width: 60px;
  bottom: 20%;
  left: 5%;
  animation: blocksWobble 3s ease-in-out infinite;
}

@keyframes blocksWobble {
  0%, 100% { transform: rotate(-3deg) scale(1); }
  50% { transform: rotate(3deg) scale(1.05); }
}

.duck {
  width: 55px;
  bottom: 30%;
  right: 10%;
  animation: duckBob 2.5s ease-in-out infinite;
}

@keyframes duckBob {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

/* 爱心粒子 */
.hearts-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-heart {
  position: absolute;
  animation: heartFloat 8s ease-in-out infinite;
}

.heart-1 { width: 18px; left: 8%; animation-delay: 0s; }
.heart-2 { width: 22px; left: 18%; animation-delay: 1.2s; }
.heart-3 { width: 15px; left: 28%; animation-delay: 2.4s; }
.heart-4 { width: 20px; left: 38%; animation-delay: 0.6s; }
.heart-5 { width: 25px; left: 52%; animation-delay: 3s; }
.heart-6 { width: 16px; left: 62%; animation-delay: 1.8s; }
.heart-7 { width: 21px; left: 72%; animation-delay: 4s; }
.heart-8 { width: 18px; left: 82%; animation-delay: 0.9s; }
.heart-9 { width: 24px; left: 88%; animation-delay: 2.7s; }
.heart-10 { width: 19px; left: 95%; animation-delay: 1.5s; }

@keyframes heartFloat {
  0% {
    transform: translateY(100vh) scale(0.5) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    transform: translateY(50vh) scale(1) rotate(180deg);
    opacity: 0.9;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-20px) scale(0.5) rotate(360deg);
    opacity: 0;
  }
}

/* 音符动画 */
.notes-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.music-note {
  position: absolute;
  animation: noteFloat 7s ease-in-out infinite;
}

.note-1 { width: 25px; left: 12%; animation-delay: 0s; }
.note-2 { width: 30px; left: 35%; animation-delay: 1.5s; }
.note-3 { width: 22px; left: 55%; animation-delay: 3s; }
.note-4 { width: 28px; left: 75%; animation-delay: 2s; }
.note-5 { width: 24px; left: 90%; animation-delay: 4s; }

@keyframes noteFloat {
  0% {
    transform: translateY(100vh) translateX(0) rotate(-20deg);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  40% {
    transform: translateY(60vh) translateX(30px) rotate(10deg);
  }
  60% {
    transform: translateY(40vh) translateX(-20px) rotate(-10deg);
  }
  80% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-50px) translateX(10px) rotate(20deg);
    opacity: 0;
  }
}

/* 彩虹 */
.rainbow {
  position: absolute;
  width: 300px;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  animation: rainbowFade 10s ease-in-out infinite;
}

@keyframes rainbowFade {
  0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(0.95); }
  50% { opacity: 0.6; transform: translateX(-50%) scale(1.05); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .toy { display: none; }
  .rainbow { width: 200px; }
  .cloud { width: 80px !important; }
  .bubble { transform: scale(0.7); }
}
</style>

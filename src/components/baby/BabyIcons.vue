<template>
  <div class="baby-icon" :class="[`icon-${type}`, { animated: animate }]">
    <!-- 奶瓶 -->
    <svg v-if="type === 'bottle'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a5f3fc"/>
          <stop offset="100%" style="stop-color:#67e8f9"/>
        </linearGradient>
        <linearGradient id="milkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#fef3c7"/>
          <stop offset="100%" style="stop-color:#fde68a"/>
        </linearGradient>
      </defs>
      <rect x="15" y="5" width="20" height="8" rx="3" fill="#fbbf24"/>
      <path d="M12,15 L12,42 Q12,47 17,47 L33,47 Q38,47 38,42 L38,15 Z" fill="url(#bottleGrad)" stroke="#06b6d4" stroke-width="1.5"/>
      <rect x="14" y="25" width="22" height="20" rx="2" fill="url(#milkGrad)" class="milk-level"/>
      <ellipse cx="25" cy="10" rx="6" ry="3" fill="#f59e0b"/>
      <line x1="18" y1="20" x2="32" y2="20" stroke="#67e8f9" stroke-width="1" stroke-dasharray="2"/>
      <line x1="18" y1="28" x2="32" y2="28" stroke="#67e8f9" stroke-width="1" stroke-dasharray="2"/>
      <line x1="18" y1="36" x2="32" y2="36" stroke="#67e8f9" stroke-width="1" stroke-dasharray="2"/>
    </svg>

    <!-- 婴儿脸 -->
    <svg v-else-if="type === 'baby'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="faceGrad" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#fef3c7"/>
          <stop offset="100%" style="stop-color:#fde68a"/>
        </radialGradient>
      </defs>
      <circle cx="25" cy="25" r="20" fill="url(#faceGrad)" stroke="#f59e0b" stroke-width="1"/>
      <!-- 头发 -->
      <path d="M10,18 Q15,5 25,8 Q35,5 40,18" fill="none" stroke="#92400e" stroke-width="3" stroke-linecap="round"/>
      <path d="M15,15 Q20,8 25,12" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round"/>
      <!-- 眼睛 -->
      <g class="eyes">
        <ellipse cx="18" cy="23" rx="3" ry="4" fill="#1e293b"/>
        <ellipse cx="32" cy="23" rx="3" ry="4" fill="#1e293b"/>
        <circle cx="17" cy="22" r="1" fill="white"/>
        <circle cx="31" cy="22" r="1" fill="white"/>
      </g>
      <!-- 腮红 -->
      <ellipse cx="12" cy="30" rx="4" ry="3" fill="#fda4af" opacity="0.6"/>
      <ellipse cx="38" cy="30" rx="4" ry="3" fill="#fda4af" opacity="0.6"/>
      <!-- 嘴巴 -->
      <path d="M20,34 Q25,40 30,34" fill="none" stroke="#f472b6" stroke-width="2" stroke-linecap="round" class="smile"/>
    </svg>

    <!-- 奶嘴 -->
    <svg v-else-if="type === 'pacifier'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pacifierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#c084fc"/>
          <stop offset="100%" style="stop-color:#a855f7"/>
        </linearGradient>
      </defs>
      <ellipse cx="25" cy="30" rx="18" ry="15" fill="url(#pacifierGrad)" stroke="#7c3aed" stroke-width="1.5"/>
      <ellipse cx="25" cy="30" rx="12" ry="10" fill="#e9d5ff"/>
      <ellipse cx="25" cy="15" rx="8" ry="10" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
      <circle cx="25" cy="32" r="5" fill="#fef3c7"/>
      <path d="M15,42 Q25,50 35,42" fill="none" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
    </svg>

    <!-- 脚印 -->
    <svg v-else-if="type === 'footprint'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="footGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f472b6"/>
          <stop offset="100%" style="stop-color:#ec4899"/>
        </linearGradient>
      </defs>
      <ellipse cx="25" cy="32" rx="12" ry="15" fill="url(#footGrad)"/>
      <circle cx="13" cy="12" r="5" fill="url(#footGrad)"/>
      <circle cx="21" cy="8" r="4.5" fill="url(#footGrad)"/>
      <circle cx="29" cy="8" r="4.5" fill="url(#footGrad)"/>
      <circle cx="37" cy="12" r="5" fill="url(#footGrad)"/>
      <ellipse cx="25" cy="14" rx="4" ry="3" fill="url(#footGrad)"/>
    </svg>

    <!-- 小熊 -->
    <svg v-else-if="type === 'teddy'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="teddyGrad" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#d4a574"/>
          <stop offset="100%" style="stop-color:#b8860b"/>
        </radialGradient>
      </defs>
      <!-- 耳朵 -->
      <circle cx="12" cy="12" r="8" fill="url(#teddyGrad)"/>
      <circle cx="12" cy="12" r="4" fill="#f4d03f"/>
      <circle cx="38" cy="12" r="8" fill="url(#teddyGrad)"/>
      <circle cx="38" cy="12" r="4" fill="#f4d03f"/>
      <!-- 脸 -->
      <circle cx="25" cy="28" r="18" fill="url(#teddyGrad)"/>
      <!-- 嘴部 -->
      <ellipse cx="25" cy="34" rx="8" ry="6" fill="#f4d03f"/>
      <ellipse cx="25" cy="32" rx="4" ry="3" fill="#1e293b"/>
      <!-- 眼睛 -->
      <circle cx="18" cy="25" r="3" fill="#1e293b"/>
      <circle cx="32" cy="25" r="3" fill="#1e293b"/>
      <circle cx="17" cy="24" r="1" fill="white"/>
      <circle cx="31" cy="24" r="1" fill="white"/>
      <!-- 嘴巴 -->
      <path d="M22,37 Q25,40 28,37" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    <!-- 月亮 -->
    <svg v-else-if="type === 'moon'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fef3c7"/>
          <stop offset="100%" style="stop-color:#fbbf24"/>
        </linearGradient>
      </defs>
      <path d="M35,5 A20,20 0 1,1 35,45 A15,15 0 1,0 35,5" fill="url(#moonGrad)" class="moon-glow"/>
      <!-- 睡觉的眼睛 -->
      <path d="M18,22 Q22,20 26,22" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round"/>
      <!-- 腮红 -->
      <ellipse cx="15" cy="28" rx="3" ry="2" fill="#fda4af" opacity="0.5"/>
      <!-- 小嘴 -->
      <path d="M20,32 Q23,35 26,32" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>
      <!-- 星星装饰 -->
      <polygon points="40,8 42,13 47,13 43,17 45,22 40,19 35,22 37,17 33,13 38,13" fill="#fbbf24" class="twinkle"/>
      <polygon points="8,35 9,38 12,38 10,40 11,43 8,41 5,43 6,40 4,38 7,38" fill="#fcd34d" class="twinkle-delay"/>
    </svg>

    <!-- 太阳 -->
    <svg v-else-if="type === 'sun'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGrad" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#fef08a"/>
          <stop offset="100%" style="stop-color:#fbbf24"/>
        </radialGradient>
      </defs>
      <!-- 光芒 -->
      <g class="sun-rays">
        <line x1="25" y1="2" x2="25" y2="10" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="25" y1="40" x2="25" y2="48" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="2" y1="25" x2="10" y2="25" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="40" y1="25" x2="48" y2="25" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="8" y1="8" x2="14" y2="14" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="36" y1="36" x2="42" y2="42" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="8" y1="42" x2="14" y2="36" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="36" y1="14" x2="42" y2="8" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <!-- 太阳主体 -->
      <circle cx="25" cy="25" r="12" fill="url(#sunGrad)"/>
      <!-- 笑脸 -->
      <path d="M20,23 Q22,21 24,23" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M26,23 Q28,21 30,23" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M21,28 Q25,32 29,28" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    </svg>

    <!-- 爱心 -->
    <svg v-else-if="type === 'heart'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heartIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f472b6"/>
          <stop offset="100%" style="stop-color:#ec4899"/>
        </linearGradient>
      </defs>
      <path d="M25,45 L22,42 C10,31 2,24 2,15 C2,8 7,3 14,3 C18,3 22,5 25,9 C28,5 32,3 36,3 C43,3 48,8 48,15 C48,24 40,31 28,42 L25,45 Z"
            fill="url(#heartIconGrad)" class="heart-beat"/>
      <ellipse cx="14" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.4)" transform="rotate(-30, 14, 14)"/>
    </svg>

    <!-- 星星 -->
    <svg v-else-if="type === 'star'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fef08a"/>
          <stop offset="100%" style="stop-color:#fbbf24"/>
        </linearGradient>
      </defs>
      <polygon points="25,2 32,18 50,20 37,33 40,50 25,42 10,50 13,33 0,20 18,18"
               fill="url(#starIconGrad)" class="star-spin"/>
      <circle cx="20" cy="22" r="2" fill="rgba(255,255,255,0.6)"/>
    </svg>

    <!-- 默认 -->
    <svg v-else viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="20" fill="#e9d5ff" stroke="#a855f7" stroke-width="2"/>
      <text x="25" y="32" text-anchor="middle" font-size="20" fill="#7c3aed">?</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'bottle' | 'baby' | 'pacifier' | 'footprint' | 'teddy' | 'moon' | 'sun' | 'heart' | 'star' | string;
  animate?: boolean;
}>();
</script>

<style scoped>
.baby-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.baby-icon svg {
  width: 100%;
  height: 100%;
}

/* 奶瓶动画 - 奶液晃动 */
.icon-bottle.animated .milk-level {
  animation: milkWave 2s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes milkWave {
  0%, 100% { transform: scaleY(1) skewX(0deg); }
  25% { transform: scaleY(0.95) skewX(2deg); }
  75% { transform: scaleY(0.95) skewX(-2deg); }
}

/* 婴儿动画 - 眨眼和微笑 */
.icon-baby.animated .eyes {
  animation: blink 4s ease-in-out infinite;
}

.icon-baby.animated .smile {
  animation: smileWide 3s ease-in-out infinite;
}

@keyframes blink {
  0%, 45%, 55%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}

@keyframes smileWide {
  0%, 100% { d: path("M20,34 Q25,38 30,34"); }
  50% { d: path("M20,34 Q25,42 30,34"); }
}

/* 奶嘴动画 */
.icon-pacifier.animated {
  animation: pacifierBounce 1s ease-in-out infinite;
}

@keyframes pacifierBounce {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

/* 脚印动画 */
.icon-footprint.animated {
  animation: footStep 1.5s ease-in-out infinite;
}

@keyframes footStep {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* 小熊动画 */
.icon-teddy.animated {
  animation: teddyWave 2s ease-in-out infinite;
}

@keyframes teddyWave {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

/* 月亮动画 */
.icon-moon.animated .moon-glow {
  animation: moonGlow 3s ease-in-out infinite;
}

.icon-moon.animated .twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

.icon-moon.animated .twinkle-delay {
  animation: twinkle 2s ease-in-out infinite 1s;
}

@keyframes moonGlow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.5)); }
  50% { filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.8)); }
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* 太阳动画 */
.icon-sun.animated .sun-rays {
  animation: sunRotate 10s linear infinite;
  transform-origin: 25px 25px;
}

@keyframes sunRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 爱心动画 */
.icon-heart.animated .heart-beat {
  animation: heartBeat 1.5s ease-in-out infinite;
  transform-origin: center;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.15); }
  28% { transform: scale(1); }
  42% { transform: scale(1.15); }
  70% { transform: scale(1); }
}

/* 星星动画 */
.icon-star.animated .star-spin {
  animation: starSpin 4s ease-in-out infinite;
  transform-origin: 25px 26px;
}

@keyframes starSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(10deg) scale(1.1); }
  75% { transform: rotate(-10deg) scale(1.1); }
}
</style>

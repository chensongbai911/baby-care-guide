<template>
  <div class="wave-animation-container">
    <svg class="wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <defs>
        <!-- 波浪渐变 -->
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:0.8">
            <animate attributeName="stop-color" values="#a78bfa;#818cf8;#c084fc;#a78bfa" dur="8s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" style="stop-color:#818cf8;stop-opacity:0.6">
            <animate attributeName="stop-color" values="#818cf8;#c084fc;#a78bfa;#818cf8" dur="8s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:#c084fc;stop-opacity:0.4">
            <animate attributeName="stop-color" values="#c084fc;#a78bfa;#818cf8;#c084fc" dur="8s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>

        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f472b6;stop-opacity:0.6">
            <animate attributeName="stop-color" values="#f472b6;#ec4899;#f472b6" dur="6s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:#ec4899;stop-opacity:0.3">
            <animate attributeName="stop-color" values="#ec4899;#f472b6;#ec4899" dur="6s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>

        <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:0.5"/>
          <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0.2"/>
        </linearGradient>
      </defs>

      <!-- 第一层波浪 -->
      <path class="wave wave-1" fill="url(#waveGradient1)">
        <animate
          attributeName="d"
          dur="10s"
          repeatCount="indefinite"
          values="
            M0,160 C320,300,420,240,640,200 C880,160,1040,220,1280,180 L1440,200 L1440,320 L0,320 Z;
            M0,200 C320,100,520,280,720,240 C920,200,1120,140,1280,200 L1440,180 L1440,320 L0,320 Z;
            M0,180 C240,280,480,120,720,180 C960,240,1200,160,1440,220 L1440,320 L0,320 Z;
            M0,160 C320,300,420,240,640,200 C880,160,1040,220,1280,180 L1440,200 L1440,320 L0,320 Z
          "
        />
      </path>

      <!-- 第二层波浪 -->
      <path class="wave wave-2" fill="url(#waveGradient2)">
        <animate
          attributeName="d"
          dur="8s"
          repeatCount="indefinite"
          values="
            M0,200 C180,260,360,180,540,220 C720,260,900,200,1080,240 C1260,280,1350,220,1440,240 L1440,320 L0,320 Z;
            M0,240 C180,180,420,280,600,220 C780,160,960,260,1140,200 C1320,140,1380,200,1440,180 L1440,320 L0,320 Z;
            M0,220 C240,280,480,160,720,220 C960,280,1200,180,1440,240 L1440,320 L0,320 Z;
            M0,200 C180,260,360,180,540,220 C720,260,900,200,1080,240 C1260,280,1350,220,1440,240 L1440,320 L0,320 Z
          "
        />
      </path>

      <!-- 第三层波浪 -->
      <path class="wave wave-3" fill="url(#waveGradient3)">
        <animate
          attributeName="d"
          dur="12s"
          repeatCount="indefinite"
          values="
            M0,260 C240,220,480,280,720,260 C960,240,1200,280,1440,260 L1440,320 L0,320 Z;
            M0,280 C240,240,540,300,720,260 C900,220,1140,280,1440,240 L1440,320 L0,320 Z;
            M0,240 C300,280,600,220,900,260 C1200,300,1350,240,1440,280 L1440,320 L0,320 Z;
            M0,260 C240,220,480,280,720,260 C960,240,1200,280,1440,260 L1440,320 L0,320 Z
          "
        />
      </path>

      <!-- 漂浮的装饰元素 -->
      <g class="floating-elements">
        <!-- 小鱼 -->
        <g class="fish fish-1">
          <ellipse cx="0" cy="0" rx="15" ry="8" fill="rgba(255,255,255,0.6)"/>
          <polygon points="15,-6 15,6 25,0" fill="rgba(255,255,255,0.6)"/>
          <circle cx="-8" cy="-2" r="2" fill="rgba(99,102,241,0.8)"/>
          <animateMotion dur="15s" repeatCount="indefinite">
            <mpath href="#fishPath1"/>
          </animateMotion>
        </g>

        <g class="fish fish-2">
          <ellipse cx="0" cy="0" rx="12" ry="6" fill="rgba(255,255,255,0.5)"/>
          <polygon points="12,-5 12,5 20,0" fill="rgba(255,255,255,0.5)"/>
          <circle cx="-6" cy="-1.5" r="1.5" fill="rgba(236,72,153,0.8)"/>
          <animateMotion dur="18s" repeatCount="indefinite">
            <mpath href="#fishPath2"/>
          </animateMotion>
        </g>

        <!-- 鱼的运动路径 -->
        <path id="fishPath1" d="M-50,280 Q400,260 800,290 Q1200,320 1500,270" fill="none"/>
        <path id="fishPath2" d="M1500,300 Q1000,270 600,290 Q200,310 -50,280" fill="none"/>

        <!-- 气泡 -->
        <g v-for="(bubble, i) in bubbles" :key="'wave-bubble-' + i">
          <circle
            :cx="bubble.x"
            :cy="bubble.startY"
            :r="bubble.r"
            fill="rgba(255,255,255,0.4)"
            :class="'bubble-float bubble-' + i"
            :style="{ '--duration': bubble.duration + 's', '--delay': bubble.delay + 's' }"
          >
            <animate
              attributeName="cy"
              :from="bubble.startY"
              :to="bubble.endY"
              :dur="bubble.duration + 's'"
              :begin="bubble.delay + 's'"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.7;0.4;0"
              :dur="bubble.duration + 's'"
              :begin="bubble.delay + 's'"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 生成气泡数据
const bubbles = ref(
  Array.from({ length: 20 }, () => ({
    x: Math.random() * 1440,
    startY: 280 + Math.random() * 40,
    endY: 100 + Math.random() * 80,
    r: 3 + Math.random() * 8,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 10
  }))
)
</script>

<style scoped>
.wave-animation-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.wave-svg {
  width: 100%;
  height: 100%;
}

.wave {
  opacity: 0.9;
}

.wave-1 {
  animation: waveShift 20s linear infinite;
}

.wave-2 {
  animation: waveShift 15s linear infinite reverse;
}

.wave-3 {
  animation: waveShift 25s linear infinite;
}

@keyframes waveShift {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-2%);
  }
  100% {
    transform: translateX(0);
  }
}

.fish {
  opacity: 0.8;
}

.fish-1 {
  animation: fishSwim 3s ease-in-out infinite;
}

.fish-2 {
  animation: fishSwim 4s ease-in-out infinite reverse;
}

@keyframes fishSwim {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(-3deg);
  }
  75% {
    transform: translateY(5px) rotate(3deg);
  }
}

.bubble-float {
  animation: bubbleWobble var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes bubbleWobble {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}
</style>

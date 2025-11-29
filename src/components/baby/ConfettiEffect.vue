<template>
  <div class="confetti-container" v-if="isActive">
    <div
      v-for="i in count"
      :key="i"
      class="confetti"
      :style="getConfettiStyle(i)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  active?: boolean
  count?: number
  duration?: number
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  count: 50,
  duration: 3000,
  colors: () => [
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#f5576c',
    '#4facfe',
    '#00f2fe',
    '#43e97b',
    '#38f9d7',
    '#fa709a',
    '#fee140',
  ],
})

const emit = defineEmits<{
  complete: []
}>()

const isActive = ref(props.active)

const getConfettiStyle = (_index: number) => {
  const colors = props.colors
  const color = colors[Math.floor(Math.random() * colors.length)]
  const left = Math.random() * 100
  const animationDelay = Math.random() * 0.5
  const animationDuration = 2 + Math.random() * 2
  const size = 8 + Math.random() * 8
  const rotation = Math.random() * 360
  const xMovement = -50 + Math.random() * 100

  return {
    left: `${left}%`,
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`,
    '--x-movement': `${xMovement}px`,
    '--rotation': `${rotation}deg`,
    '--final-rotation': `${rotation + 360}deg`,
  }
}

watch(
  () => props.active,
  (newValue) => {
    isActive.value = newValue
    if (newValue) {
      setTimeout(() => {
        isActive.value = false
        emit('complete')
      }, props.duration)
    }
  },
)
</script>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -10%;
  border-radius: 2px;
  animation: confetti-fall linear forwards;
  opacity: 0.9;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) translateX(0) rotate(var(--rotation));
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) translateX(var(--x-movement))
      rotate(var(--final-rotation));
    opacity: 0;
  }
}

/* 添加旋转和摇摆效果 */
.confetti:nth-child(3n) {
  animation: confetti-fall linear forwards, sway 1s ease-in-out infinite;
}

.confetti:nth-child(3n + 1) {
  animation: confetti-fall linear forwards, sway 1.5s ease-in-out infinite;
}

.confetti:nth-child(3n + 2) {
  animation: confetti-fall linear forwards, sway 2s ease-in-out infinite;
}

@keyframes sway {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(20px);
  }
}
</style>

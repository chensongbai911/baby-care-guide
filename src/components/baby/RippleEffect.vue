<template>
  <div class="ripple-container" @click="createRipple">
    <slot></slot>
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="ripple"
      :style="{
        left: ripple.x + 'px',
        top: ripple.y + 'px',
        width: ripple.size + 'px',
        height: ripple.size + 'px'
      }"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

interface Props {
  color?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'rgba(255, 255, 255, 0.6)',
  duration: 600
})

const ripples = ref<Ripple[]>([])
let rippleId = 0

const createRipple = (event: MouseEvent) => {
  const container = event.currentTarget as HTMLElement
  const rect = container.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2

  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  const newRipple: Ripple = {
    id: rippleId++,
    x,
    y,
    size
  }

  ripples.value.push(newRipple)

  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== newRipple.id)
  }, props.duration)
}
</script>

<style scoped>
.ripple-container {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: v-bind(color);
  transform: scale(0);
  animation: ripple-animation v-bind(duration + 'ms') ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(1);
    opacity: 0;
  }
}
</style>

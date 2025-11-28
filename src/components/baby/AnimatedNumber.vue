<template>
  <span class="animated-number">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1000,
  decimals: 0,
  prefix: '',
  suffix: ''
})

const displayValue = ref(props.prefix + '0' + props.suffix)
const currentValue = ref(0)

const animateValue = (start: number, end: number) => {
  const startTime = Date.now()
  const duration = props.duration
  const range = end - start

  const step = () => {
    const now = Date.now()
    const progress = Math.min((now - startTime) / duration, 1)

    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    currentValue.value = start + range * easeOutQuart

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      currentValue.value = end
    }

    displayValue.value = props.prefix + currentValue.value.toFixed(props.decimals) + props.suffix
  }

  requestAnimationFrame(step)
}

watch(() => props.value, (newValue, oldValue) => {
  animateValue(oldValue || 0, newValue)
})

onMounted(() => {
  animateValue(0, props.value)
})
</script>

<style scoped>
.animated-number {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}
</style>

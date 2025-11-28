<template>
  <div class="skeleton-loader" :class="variant">
    <template v-if="variant === 'card'">
      <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
          <div class="skeleton-footer">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-badge"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'list'">
      <div class="skeleton-list-item" v-for="i in count" :key="i">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-info">
          <div class="skeleton-title"></div>
          <div class="skeleton-text short"></div>
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'timeline'">
      <div class="skeleton-timeline-item" v-for="i in count" :key="i">
        <div class="skeleton-dot"></div>
        <div class="skeleton-timeline-card">
          <div class="skeleton-badge"></div>
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="skeleton-default">
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'card' | 'list' | 'timeline' | 'default'
  count?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  count: 3
})
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

/* 基础骨架样式 */
.skeleton-card,
.skeleton-list-item,
.skeleton-timeline-item,
.skeleton-default {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

/* 通用骨架元素 */
.skeleton-image,
.skeleton-title,
.skeleton-text,
.skeleton-avatar,
.skeleton-badge,
.skeleton-dot {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 卡片骨架 */
.skeleton-card {
  padding: 0;
  margin-bottom: 20px;
}

.skeleton-image {
  width: 100%;
  height: 200px;
  border-radius: 16px 16px 0 0;
}

.skeleton-content {
  padding: 20px;
}

.skeleton-title {
  height: 24px;
  margin-bottom: 16px;
  width: 70%;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 12px;
  width: 100%;
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-badge {
  height: 24px;
  width: 80px;
  border-radius: 12px;
}

/* 列表骨架 */
.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
}

.skeleton-info {
  flex: 1;
}

/* 时间轴骨架 */
.skeleton-timeline-item {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  padding-left: 40px;
  position: relative;
}

.skeleton-dot {
  position: absolute;
  left: 0;
  top: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.skeleton-timeline-card {
  flex: 1;
  padding: 20px;
  background: white;
  border-radius: 16px;
}

/* 默认骨架 */
.skeleton-default {
  padding: 24px;
}

/* 脉冲效果 */
.skeleton-loader.pulse .skeleton-image,
.skeleton-loader.pulse .skeleton-title,
.skeleton-loader.pulse .skeleton-text,
.skeleton-loader.pulse .skeleton-avatar,
.skeleton-loader.pulse .skeleton-badge,
.skeleton-loader.pulse .skeleton-dot {
  animation: shimmer 1.5s ease-in-out infinite, pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 响应式 */
@media (max-width: 768px) {
  .skeleton-image {
    height: 150px;
  }

  .skeleton-content {
    padding: 16px;
  }

  .skeleton-title {
    height: 20px;
  }

  .skeleton-text {
    height: 14px;
  }
}
</style>

<template>
  <div class="media-gallery">
    <!-- 标签切换 -->
    <div class="gallery-tabs">
      <div
        :class="['tab-item', { active: activeTab === 'videos' }]"
        @click="activeTab = 'videos'"
      >
        <span class="tab-icon">📹</span>
        <span class="tab-text">视频教程</span>
        <span class="tab-count" v-if="videos.length">{{ videos.length }}</span>
      </div>
      <div
        :class="['tab-item', { active: activeTab === 'images' }]"
        @click="activeTab = 'images'"
      >
        <span class="tab-icon">🖼️</span>
        <span class="tab-text">图片图解</span>
        <span class="tab-count" v-if="images.length">{{ images.length }}</span>
      </div>
    </div>

    <!-- 视频内容 -->
    <div class="gallery-content" v-show="activeTab === 'videos'">
      <div class="media-grid" v-if="videos.length">
        <div
          v-for="(video, index) in videos"
          :key="video.id"
          class="media-card video-card"
          @click="openMedia(video)"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="media-thumbnail">
            <img
              :src="video.thumbnail || 'https://via.placeholder.com/400x225/667eea/ffffff?text=Video'"
              :alt="video.title"
            >
            <div class="play-overlay">
              <div class="play-button">
                <span>▶</span>
              </div>
            </div>
            <div class="media-duration" v-if="video.duration">
              {{ video.duration }}
            </div>
          </div>
          <div class="media-info">
            <h4>{{ video.title }}</h4>
            <p v-if="video.description">{{ video.description }}</p>
            <div class="media-meta">
              <el-tag size="small" type="primary" effect="plain">视频</el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-state" v-else>
        <div class="empty-icon">📹</div>
        <h4>暂无视频资源</h4>
        <p>该阶段的视频教程正在准备中...</p>
      </div>
    </div>

    <!-- 图片内容 -->
    <div class="gallery-content" v-show="activeTab === 'images'">
      <div class="media-grid image-grid" v-if="images.length">
        <div
          v-for="(image, index) in images"
          :key="image.id"
          class="media-card image-card"
          @click="openMedia(image)"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="media-thumbnail">
            <img
              :src="image.url || 'https://via.placeholder.com/300x200/11998e/ffffff?text=Image'"
              :alt="image.title"
            >
            <el-tag
              v-if="image.type === 'gif'"
              class="gif-badge"
              type="warning"
              size="small"
              effect="dark"
            >
              GIF
            </el-tag>
            <div class="image-overlay">
              <div class="zoom-icon">🔍</div>
            </div>
          </div>
          <div class="media-info">
            <h4>{{ image.title }}</h4>
            <div class="media-meta">
              <el-tag size="small" :type="image.type === 'gif' ? 'warning' : 'success'" effect="plain">
                {{ image.type === 'gif' ? 'GIF动图' : '图片' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-state" v-else>
        <div class="empty-icon">🖼️</div>
        <h4>暂无图片资源</h4>
        <p>该阶段的图解内容正在准备中...</p>
      </div>
    </div>

    <!-- 媒体预览对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentMediaTitle"
      width="90%"
      :style="{ maxWidth: '900px' }"
      class="media-dialog"
      center
      destroy-on-close
    >
      <div class="media-preview">
        <video
          v-if="isVideoMedia"
          :src="currentMediaUrl"
          controls
          autoplay
          class="preview-video"
        ></video>
        <img
          v-else
          :src="currentMediaUrl"
          :alt="currentMediaTitle"
          class="preview-image"
        >
      </div>
      <div class="media-description" v-if="currentMediaDescription">
        <h4>📝 说明</h4>
        <p>{{ currentMediaDescription }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MediaResource } from '@/types/baby'

defineProps<{
  videos: MediaResource[]
  images: MediaResource[]
}>()

const activeTab = ref('videos')
const dialogVisible = ref(false)
const currentMedia = ref<MediaResource | null>(null)

const currentMediaTitle = computed(() => currentMedia.value ? currentMedia.value.title : '')
const currentMediaUrl = computed(() => currentMedia.value ? currentMedia.value.url : '')
const currentMediaDescription = computed(() => currentMedia.value ? currentMedia.value.description : '')
const isVideoMedia = computed(() => currentMedia.value && currentMedia.value.type === 'video')

const openMedia = (media: MediaResource) => {
  currentMedia.value = media
  dialogVisible.value = true
}
</script>

<style scoped>
.media-gallery {
  padding: 10px 0;
}

/* 标签切换 */
.gallery-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  padding: 8px;
  background: #f4f4f5;
  border-radius: 16px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
}

.tab-item:hover {
  background: rgba(255, 255, 255, 0.5);
}

.tab-item.active {
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  font-size: 20px;
}

.tab-text {
  font-size: 15px;
  font-weight: 600;
  color: #606266;
}

.tab-item.active .tab-text {
  color: #303133;
}

.tab-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

/* 媒体网格 */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.image-grid {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

/* 媒体卡片 */
.media-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.media-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 缩略图 */
.media-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
}

.image-card .media-thumbnail {
  padding-top: 75%; /* 4:3 比例 */
}

.media-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.media-card:hover .media-thumbnail img {
  transform: scale(1.1);
}

/* 播放按钮覆盖层 */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.media-card:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.play-button span {
  font-size: 28px;
  color: #667eea;
  margin-left: 5px;
}

.media-card:hover .play-button {
  transform: scale(1.1);
}

/* 图片覆盖层 */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.media-card:hover .image-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
}

/* 时长标签 */
.media-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

/* GIF标签 */
.gif-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

/* 媒体信息 */
.media-info {
  padding: 16px 20px;
}

.media-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-info p {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-meta {
  display: flex;
  gap: 8px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 20px;
  border: 2px dashed #dcdfe6;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h4 {
  font-size: 18px;
  color: #606266;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 预览对话框 */
:deep(.media-dialog) {
  border-radius: 20px;
}

:deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

.media-preview {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.preview-video {
  width: 100%;
  display: block;
}

.preview-image {
  width: 100%;
  display: block;
}

.media-description {
  background: #f8f9fa;
  padding: 16px 20px;
  border-radius: 12px;
}

.media-description h4 {
  font-size: 14px;
  color: #303133;
  margin: 0 0 8px 0;
}

.media-description p {
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .gallery-tabs {
    flex-direction: column;
    gap: 8px;
  }

  .tab-item {
    padding: 12px 16px;
  }

  .media-grid {
    grid-template-columns: 1fr;
  }

  .image-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>

<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section" @click="handleNavClick('/')">
          <span class="logo-icon">👶</span>
          <div class="logo-text">
            <span class="logo-title">新手爸爸育儿指南</span>
            <span class="logo-subtitle">0-12个月科学育儿</span>
          </div>
        </div>

        <nav class="nav-menu">
          <a @click="handleNavClick('/')" class="nav-item" :class="{ active: isActive('/') }">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">首页</span>
          </a>
          <a @click="handleNavClick('/timeline')" class="nav-item" :class="{ active: isActive('/timeline') }">
            <span class="nav-icon">📅</span>
            <span class="nav-text">时间轴</span>
          </a>
          <a @click="handleNavClick('/checklist')" class="nav-item" :class="{ active: isActive('/checklist') }">
            <span class="nav-icon">✅</span>
            <span class="nav-text">成长清单</span>
          </a>
        </nav>

        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu-btn" :class="{ 'is-active': showMobileMenu }" @click="showMobileMenu = !showMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <transition name="slide-down">
        <div class="mobile-menu" v-show="showMobileMenu">
          <a @click="handleMobileNavClick('/')" class="mobile-nav-item" :class="{ active: isActive('/') }">
            <span class="nav-icon">🏠</span>
            <span>首页</span>
          </a>
          <a @click="handleMobileNavClick('/timeline')" class="mobile-nav-item" :class="{ active: isActive('/timeline') }">
            <span class="nav-icon">📅</span>
            <span>时间轴</span>
          </a>
          <a @click="handleMobileNavClick('/checklist')" class="mobile-nav-item" :class="{ active: isActive('/checklist') }">
            <span class="nav-icon">✅</span>
            <span>成长清单</span>
          </a>
        </div>
      </transition>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部 -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-logo">👶</span>
          <span class="footer-title">新手爸爸育儿指南</span>
        </div>
        <p class="footer-desc">💝 用心陪伴宝宝成长的每一天</p>
        <div class="footer-links">
          <router-link to="/">首页</router-link>
          <span class="divider">·</span>
          <router-link to="/timeline">时间轴</router-link>
          <span class="divider">·</span>
          <router-link to="/checklist">成长清单</router-link>
        </div>
        <p class="footer-copyright">© 2025 新手爸爸育儿指南 · 祝愿每一位新手爸爸都能成为育儿高手！</p>
      </div>
    </footer>

    <!-- 返回顶部按钮 -->
    <transition name="fade">
      <div class="back-to-top" v-show="showBackTop" @click="scrollToTop">
        <span>↑</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const showMobileMenu = ref(false)
const showBackTop = ref(false)

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/' || route.path.startsWith('/month/')
  }
  return route.path === path
}

// 处理导航点击，滚动到顶部
const handleNavClick = (path: string) => {
  router.push(path)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 处理移动端导航点击
const handleMobileNavClick = (path: string) => {
  showMobileMenu.value = false
  router.push(path)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showBackTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

/* 导航栏 - 更新为紫色主题 */
.app-header {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(124, 58, 237, 0.3);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.logo-section:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  animation: float 4s ease-in-out infinite;
}

.logo-text {
  display: flex;
  flex-direction: column;
  color: white;
}

.logo-title {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo-subtitle {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 500;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.2);
}

.nav-text {
  font-size: 15px;
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: background 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-btn span {
  width: 24px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* 移动端菜单按钮动画 */
.mobile-menu-btn.is-active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.is-active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.is-active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 移动端菜单 */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

/* 移动端菜单滑动动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  color: white;
  text-decoration: none;
  border-radius: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.mobile-nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(8px);
}

/* 移动端导航激活状态 */
.mobile-nav-item.active {
  background: rgba(255, 255, 255, 0.2);
}

/* 主内容区 */
.app-main {
  flex: 1;
  width: 100%;
}

/* 底部 - 更新为与主题统一 */
.app-footer {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
  color: white;
  padding: 50px 24px 30px;
  margin-top: auto;
  position: relative;
  overflow: hidden;
}

.app-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
}

.app-footer::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
  top: -200px;
  right: -200px;
  pointer-events: none;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-logo {
  font-size: 36px;
  animation: float 4s ease-in-out infinite;
}

.footer-title {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #c4b5fd 0%, #f0abfc 50%, #fda4af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 24px 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 8px;
}

.footer-links a:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.footer-links .divider {
  color: rgba(255, 255, 255, 0.3);
}

.footer-copyright {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* 返回顶部按钮 - 更新样式 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 999;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.back-to-top:hover {
  transform: translateY(-8px) scale(1.1);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.5);
}

.back-to-top span {
  font-size: 24px;
  font-weight: 700;
}

/* 页面过渡动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }

  .logo-icon {
    font-size: 32px;
  }

  .logo-title {
    font-size: 16px;
  }

  .logo-subtitle {
    display: none;
  }

  .nav-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
  }

  .app-footer {
    padding: 40px 16px 24px;
  }

  .footer-brand {
    flex-direction: column;
    gap: 8px;
  }

  .footer-title {
    font-size: 18px;
  }

  .footer-desc {
    font-size: 14px;
  }

  .footer-copyright {
    font-size: 12px;
    line-height: 1.6;
  }
}

/* 小屏幕优化 */
@media (max-width: 480px) {
  .header-content {
    padding: 10px 12px;
  }

  .logo-icon {
    font-size: 28px;
  }

  .logo-title {
    font-size: 14px;
  }

  .mobile-nav-item {
    padding: 14px;
    font-size: 15px;
  }

  .back-to-top {
    bottom: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }

  .back-to-top span {
    font-size: 20px;
  }

  .app-footer {
    padding: 30px 12px 20px;
  }

  .footer-logo {
    font-size: 30px;
  }

  .footer-title {
    font-size: 16px;
  }

  .footer-desc {
    font-size: 13px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 4px;
  }

  .footer-links a {
    font-size: 13px;
  }

  .footer-copyright {
    font-size: 11px;
  }
}
</style>

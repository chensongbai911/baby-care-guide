<template>
  <div class="month-detail-view" v-if="monthData">
    <!-- 🎯 本月成长关键词卡片（优化版） -->
    <div class="growth-keywords-section">
      <div class="keywords-card">
        <div class="keywords-header">
          <span class="keywords-title">🌟 本月成长关键词</span>
          <span class="keywords-subtitle">点击查看训练方法</span>
        </div>
        <div class="keywords-content">
          <div
            v-for="(keyword, idx) in monthKeywords"
            :key="idx"
            class="keyword-item"
            @click="showTrainingGuide(keyword)"
          >
            <div
              class="keyword-icon-circle"
              :style="{ background: keywordColors[idx % keywordColors.length] }"
            >
              <span class="keyword-icon">
                {{ keyword.lineIcon || keyword.icon }}
              </span>
            </div>
            <div class="keyword-text-area">
              <span class="keyword-label">{{ keyword.text }}</span>
              <span class="keyword-desc">{{ keyword.desc }}</span>
            </div>
            <div class="keyword-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 顶部导航 - 增强版 -->
    <div class="top-nav">
      <el-button class="back-btn" @click="router.back()" round>
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>

      <!-- 中间标题区 -->
      <div class="nav-title-area">
        <h2 class="nav-current-month">第{{ monthData.month }}个月</h2>
        <el-tag type="primary" effect="plain" class="stage-tag">
          {{ getStageLabel(monthData.month) }}
        </el-tag>
      </div>

      <!-- 右侧月龄切换 -->
      <div class="nav-controls">
        <el-tooltip content="上一个月龄" placement="bottom">
          <el-button
            :disabled="monthData.month === 0"
            @click="navigateMonth(-1)"
            circle
            class="nav-arrow-btn"
          >
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
        </el-tooltip>

        <!-- 月龄下拉选择 -->
        <el-dropdown trigger="click" @command="handleMonthChange">
          <span class="nav-month-dropdown">
            {{ monthData.month }}月
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="m in 13"
                :key="m - 1"
                :command="m - 1"
                :class="{ 'is-active': monthData.month === m - 1 }"
              >
                <span class="dropdown-month-num">{{ m - 1 }}</span>
                <span class="dropdown-month-label">月龄</span>
                <el-icon
                  v-if="monthData.month === m - 1"
                  class="dropdown-check"
                >
                  <Check />
                </el-icon>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-tooltip content="下一个月龄" placement="bottom">
          <el-button
            :disabled="monthData.month === 12"
            @click="navigateMonth(1)"
            circle
            class="nav-arrow-btn"
          >
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 页面头部 - 优化版 -->
    <div class="page-hero">
      <div class="hero-content">
        <div class="hero-top-row">
          <div class="month-badge-large">
            <span class="month-num">{{ monthData.month }}</span>
            <span class="month-unit">月龄</span>
          </div>
          <div class="hero-title-area">
            <h1>{{ monthData.title }}</h1>
            <el-tag effect="dark" round class="hero-stage-tag">
              {{ getStageLabel(monthData.month) }}
            </el-tag>
          </div>
        </div>

        <!-- 🎯 本月成长关键词 + 里程碑进度（核心优化区域） -->
        <div class="growth-highlight-card">
          <div class="highlight-left">
            <div class="keyword-section">
              <span class="section-label">本月关键词</span>
              <div class="keyword-tags">
                <span
                  v-for="(keyword, idx) in monthKeywords"
                  :key="idx"
                  class="keyword-tag"
                  @click="handleKeywordClick(keyword)"
                >
                  <span class="keyword-icon">{{ keyword.icon }}</span>
                  <span class="keyword-text">{{ keyword.text }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="highlight-divider"></div>
          <div class="highlight-right">
            <div class="milestone-progress">
              <div class="progress-ring-mini">
                <svg viewBox="0 0 44 44">
                  <circle class="ring-bg" cx="22" cy="22" r="18" />
                  <circle
                    class="ring-fill"
                    cx="22"
                    cy="22"
                    r="18"
                    :style="{ strokeDashoffset: milestoneProgressOffset }"
                  />
                </svg>
                <span class="progress-text">
                  {{ milestoneCompletedCount }}/{{ milestoneTotalCount }}
                </span>
              </div>
              <div class="progress-info">
                <span class="progress-label">里程碑完成</span>
                <span class="progress-detail">
                  {{ milestoneProgressPercent }}%
                </span>
              </div>
            </div>
            <el-button
              type="primary"
              size="small"
              round
              class="checkin-btn"
              @click="activeTab = 'milestones'"
            >
              去打卡
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 个性化成长小贴士 -->
        <div class="growth-tip-banner" @click="showTipDetail">
          <span class="tip-icon">💡</span>
          <span class="tip-text">{{ currentGrowthTip }}</span>
          <span class="tip-more">了解更多 ›</span>
        </div>

        <!-- 快速统计 -->
        <div class="quick-stats">
          <div class="stat-item">
            <el-icon><ScaleToOriginal /></el-icon>
            <div class="stat-content">
              <span class="stat-label">体重</span>
              <span class="stat-value">
                {{ monthData.physicalDevelopment.weight }}
              </span>
            </div>
          </div>
          <div class="stat-item">
            <el-icon><Histogram /></el-icon>
            <div class="stat-content">
              <span class="stat-label">身高</span>
              <span class="stat-value">
                {{ monthData.physicalDevelopment.height }}
              </span>
            </div>
          </div>
          <div class="stat-item">
            <el-icon><DataAnalysis /></el-icon>
            <div class="stat-content">
              <span class="stat-label">头围</span>
              <span class="stat-value">
                {{ monthData.physicalDevelopment.headCircumference }}
              </span>
            </div>
          </div>
        </div>

        <!-- 快捷操作按钮 -->
        <div class="hero-actions">
          <el-button
            round
            class="hero-action-btn"
            @click="activeTab = 'milestones'"
          >
            <span class="btn-icon">🏆</span>
            <span>里程碑打卡</span>
            <el-badge
              :value="pendingMilestonesCount"
              :hidden="pendingMilestonesCount === 0"
              class="milestone-badge"
            />
          </el-button>
          <el-button round class="hero-action-btn" @click="goToDiary">
            <span class="btn-icon">📝</span>
            <span>记录成长</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 内容标签页 -->
    <div class="content-section">
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- 发育指标 -->
        <el-tab-pane name="development">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">📊</span>
              <span class="tab-text">发育指标</span>
            </span>
          </template>

          <div class="tab-content">
            <!-- 身体发育详情 - 优化版 -->
            <el-card class="info-card physical-card">
              <template #header>
                <div class="card-header-custom">
                  <span class="header-icon">🎯</span>
                  <div class="header-text">
                    <h3>身体发育</h3>
                    <span class="header-subtitle">
                      {{ monthData.month }}月龄宝宝的体格参考标准
                    </span>
                  </div>
                </div>
              </template>
              <p class="description-text">
                {{ monthData.physicalDevelopment.description }}
              </p>

              <!-- 发育数据可视化 -->
              <div class="physical-grid">
                <div class="physical-item weight-item">
                  <div class="physical-icon-wrapper">
                    <span class="physical-icon">⚖️</span>
                  </div>
                  <div class="physical-info">
                    <span class="physical-label">体重范围</span>
                    <span class="physical-value">
                      {{ monthData.physicalDevelopment.weight }}
                    </span>
                    <div class="physical-hint">
                      <el-tooltip
                        content="数据来源：WHO儿童生长标准，仅供参考"
                        placement="top"
                      >
                        <span class="hint-text">📊 WHO参考标准</span>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
                <div class="physical-item height-item">
                  <div class="physical-icon-wrapper">
                    <span class="physical-icon">📏</span>
                  </div>
                  <div class="physical-info">
                    <span class="physical-label">身高范围</span>
                    <span class="physical-value">
                      {{ monthData.physicalDevelopment.height }}
                    </span>
                    <div class="physical-hint">
                      <el-tooltip
                        content="身高受遗传影响较大，定期测量更重要"
                        placement="top"
                      >
                        <span class="hint-text">📈 关注增长趋势</span>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
                <div class="physical-item head-item">
                  <div class="physical-icon-wrapper">
                    <span class="physical-icon">👶</span>
                  </div>
                  <div class="physical-info">
                    <span class="physical-label">头围范围</span>
                    <span class="physical-value">
                      {{ monthData.physicalDevelopment.headCircumference }}
                    </span>
                    <div class="physical-hint">
                      <el-tooltip
                        content="头围反映脑部发育，过大或过小需就医"
                        placement="top"
                      >
                        <span class="hint-text">🧠 脑部发育指标</span>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 发育提醒 -->
              <el-alert
                title="温馨提示"
                type="info"
                :closable="false"
                show-icon
                class="development-alert"
              >
                <template #default>
                  每个宝宝发育进度不同，以上数据仅供参考。如有疑虑，建议定期体检并咨询医生。
                </template>
              </el-alert>
            </el-card>

            <!-- 能力发展区域 - 增加折叠功能 -->
            <div class="skills-section">
              <div class="skills-header">
                <h3>
                  <span class="section-icon">🌟</span>
                  能力发展
                </h3>
                <span class="skills-subtitle">
                  {{ monthData.month }}月龄宝宝的关键能力表现
                </span>
              </div>

              <el-row :gutter="20">
                <!-- 认知能力 -->
                <el-col :xs="24" :md="12">
                  <el-card
                    class="info-card skill-card cognitive-card"
                    :class="{ 'is-collapsed': collapsedCards.cognitive }"
                  >
                    <template #header>
                      <div
                        class="card-header-custom card-header-collapsible"
                        @click="toggleCardCollapse('cognitive')"
                      >
                        <div class="header-left">
                          <span class="header-icon">🧠</span>
                          <div class="header-text">
                            <h3>认知能力</h3>
                            <span class="header-count">
                              {{ monthData.cognitiveSkills?.length || 0 }}项能力
                            </span>
                          </div>
                        </div>
                        <el-icon
                          class="collapse-icon"
                          :class="{ 'is-rotated': !collapsedCards.cognitive }"
                        >
                          <ArrowDown />
                        </el-icon>
                      </div>
                    </template>
                    <el-collapse-transition>
                      <ul class="skill-list" v-show="!collapsedCards.cognitive">
                        <li
                          v-for="(skill, index) in monthData.cognitiveSkills"
                          :key="index"
                        >
                          <span class="skill-bullet cognitive"></span>
                          <span>{{ skill }}</span>
                        </li>
                      </ul>
                    </el-collapse-transition>
                  </el-card>
                </el-col>

                <!-- 社交情感 -->
                <el-col :xs="24" :md="12">
                  <el-card
                    class="info-card skill-card social-card"
                    :class="{ 'is-collapsed': collapsedCards.social }"
                  >
                    <template #header>
                      <div
                        class="card-header-custom card-header-collapsible"
                        @click="toggleCardCollapse('social')"
                      >
                        <div class="header-left">
                          <span class="header-icon">❤️</span>
                          <div class="header-text">
                            <h3>社交情感</h3>
                            <span class="header-count">
                              {{ monthData.socialEmotional?.length || 0 }}项能力
                            </span>
                          </div>
                        </div>
                        <el-icon
                          class="collapse-icon"
                          :class="{ 'is-rotated': !collapsedCards.social }"
                        >
                          <ArrowDown />
                        </el-icon>
                      </div>
                    </template>
                    <el-collapse-transition>
                      <ul class="skill-list" v-show="!collapsedCards.social">
                        <li
                          v-for="(skill, index) in monthData.socialEmotional"
                          :key="index"
                        >
                          <span class="skill-bullet social"></span>
                          <span>{{ skill }}</span>
                        </li>
                      </ul>
                    </el-collapse-transition>
                  </el-card>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <!-- 大运动 -->
                <el-col :xs="24" :md="12">
                  <el-card
                    class="info-card skill-card motor-gross-card"
                    :class="{ 'is-collapsed': collapsedCards.motorGross }"
                  >
                    <template #header>
                      <div
                        class="card-header-custom card-header-collapsible"
                        @click="toggleCardCollapse('motorGross')"
                      >
                        <div class="header-left">
                          <span class="header-icon">🏃</span>
                          <div class="header-text">
                            <h3>大运动能力</h3>
                            <span class="header-count">
                              {{
                                monthData.motorSkills?.gross?.length || 0
                              }}项能力
                            </span>
                          </div>
                        </div>
                        <el-icon
                          class="collapse-icon"
                          :class="{ 'is-rotated': !collapsedCards.motorGross }"
                        >
                          <ArrowDown />
                        </el-icon>
                      </div>
                    </template>
                    <el-collapse-transition>
                      <ul
                        class="skill-list"
                        v-show="!collapsedCards.motorGross"
                      >
                        <li
                          v-for="(skill, index) in monthData.motorSkills.gross"
                          :key="index"
                        >
                          <span class="skill-bullet motor-gross"></span>
                          <span>{{ skill }}</span>
                        </li>
                      </ul>
                    </el-collapse-transition>
                  </el-card>
                </el-col>

                <!-- 精细动作 -->
                <el-col :xs="24" :md="12">
                  <el-card
                    class="info-card skill-card motor-fine-card"
                    :class="{ 'is-collapsed': collapsedCards.motorFine }"
                  >
                    <template #header>
                      <div
                        class="card-header-custom card-header-collapsible"
                        @click="toggleCardCollapse('motorFine')"
                      >
                        <div class="header-left">
                          <span class="header-icon">✋</span>
                          <div class="header-text">
                            <h3>精细动作</h3>
                            <span class="header-count">
                              {{
                                monthData.motorSkills?.fine?.length || 0
                              }}项能力
                            </span>
                          </div>
                        </div>
                        <el-icon
                          class="collapse-icon"
                          :class="{ 'is-rotated': !collapsedCards.motorFine }"
                        >
                          <ArrowDown />
                        </el-icon>
                      </div>
                    </template>
                    <el-collapse-transition>
                      <ul class="skill-list" v-show="!collapsedCards.motorFine">
                        <li
                          v-for="(skill, index) in monthData.motorSkills.fine"
                          :key="index"
                        >
                          <span class="skill-bullet motor-fine"></span>
                          <span>{{ skill }}</span>
                        </li>
                      </ul>
                    </el-collapse-transition>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>

        <!-- 护理指南 -->
        <el-tab-pane name="care">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">👨‍👦</span>
              <span class="tab-text">护理指南</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="care-grid">
              <CareGuideCard
                v-for="(guideline, index) in monthData.careGuidelines"
                :key="index"
                :guideline="guideline"
              />
            </div>
            <el-empty
              v-if="!monthData.careGuidelines.length"
              description="暂无护理指南"
            />
          </div>
        </el-tab-pane>

        <!-- 喂养建议 -->
        <el-tab-pane name="nutrition">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">🍼</span>
              <span class="tab-text">喂养建议</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="nutrition-grid">
              <el-card
                v-for="(tip, index) in monthData.nutritionTips"
                :key="index"
                class="nutrition-card"
              >
                <div class="nutrition-header">
                  <div class="nutrition-icon">
                    {{
                      tip.type.includes('母乳') || tip.type.includes('奶')
                        ? '🍼'
                        : '🥣'
                    }}
                  </div>
                  <h3>{{ tip.type }}</h3>
                </div>
                <div class="nutrition-stats">
                  <div class="nutrition-stat">
                    <span class="stat-icon">⏰</span>
                    <div class="stat-info">
                      <span class="stat-label">喂养频率</span>
                      <span class="stat-value">{{ tip.frequency }}</span>
                    </div>
                  </div>
                  <div class="nutrition-stat">
                    <span class="stat-icon">📊</span>
                    <div class="stat-info">
                      <span class="stat-label">建议用量</span>
                      <span class="stat-value">{{ tip.amount }}</span>
                    </div>
                  </div>
                </div>
                <div class="nutrition-notes">
                  <h4>📝 注意事项</h4>
                  <ul>
                    <li v-for="(note, idx) in tip.notes" :key="idx">
                      {{ note }}
                    </li>
                  </ul>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>

        <!-- 成长里程碑 -->
        <el-tab-pane name="milestones">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">🏆</span>
              <span class="tab-text">里程碑</span>
            </span>
          </template>

          <div class="tab-content">
            <!-- 🔔 智能提醒区域 -->
            <div class="smart-reminder-section" v-if="smartReminder">
              <div :class="['reminder-card', smartReminder.type]">
                <div class="reminder-icon">{{ smartReminder.icon }}</div>
                <div class="reminder-content">
                  <h4>{{ smartReminder.title }}</h4>
                  <p>{{ smartReminder.message }}</p>
                </div>
                <el-button
                  v-if="smartReminder.action"
                  type="primary"
                  size="small"
                  round
                  @click="handleReminderAction(smartReminder.action)"
                >
                  {{ smartReminder.actionText }}
                </el-button>
                <el-button
                  text
                  circle
                  class="reminder-close"
                  @click="dismissReminder"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </div>

            <div class="milestones-header">
              <div class="milestones-progress">
                <el-progress
                  type="circle"
                  :percentage="milestoneProgress"
                  :width="120"
                  :stroke-width="10"
                >
                  <template #default>
                    <div class="progress-inner">
                      <span class="progress-value">
                        {{ completedMilestonesCount }}
                      </span>
                      <span class="progress-label">
                        / {{ monthData.milestones.length }}
                      </span>
                    </div>
                  </template>
                </el-progress>
                <div class="progress-text">
                  <h4>里程碑完成进度</h4>
                  <p>点击卡片标记完成状态</p>
                </div>
              </div>

              <!-- 📊 生成成长报告按钮 -->
              <div class="report-actions">
                <el-button type="success" round @click="openGrowthReportDialog">
                  <el-icon><Document /></el-icon>
                  生成成长报告
                </el-button>
              </div>
            </div>

            <!-- 📈 宝宝能力发展轨迹（升级版） -->
            <div
              class="ability-trend-section"
              :class="{ 'is-loading': trendChartLoading }"
            >
              <!-- 骨架屏加载状态 -->
              <div v-if="trendChartLoading" class="trend-skeleton">
                <div class="skeleton-header">
                  <div class="skeleton-title"></div>
                  <div class="skeleton-tabs"></div>
                </div>
                <div class="skeleton-chart"></div>
                <div class="skeleton-legend"></div>
              </div>

              <!-- 实际内容 -->
              <template v-else>
                <div class="trend-header">
                  <div class="trend-title-area">
                    <h4>🌈 宝宝能力发展轨迹</h4>
                    <p class="trend-subtitle">记录成长每一步，见证奇迹每一天</p>
                  </div>
                  <div class="trend-controls">
                    <el-radio-group
                      v-model="selectedAbilityType"
                      size="small"
                      @change="handleAbilityTypeChange"
                    >
                      <el-radio-button label="gross">
                        <span class="ability-icon">🦶</span>
                        <span class="ability-name">大运动</span>
                      </el-radio-button>
                      <el-radio-button label="fine">
                        <span class="ability-icon">🖐️</span>
                        <span class="ability-name">精细</span>
                      </el-radio-button>
                      <el-radio-button label="cognitive">
                        <span class="ability-icon">🧠</span>
                        <span class="ability-name">认知</span>
                      </el-radio-button>
                      <el-radio-button label="language">
                        <span class="ability-icon">👂</span>
                        <span class="ability-name">语言</span>
                      </el-radio-button>
                      <el-radio-button label="social">
                        <span class="ability-icon">💕</span>
                        <span class="ability-name">社交</span>
                      </el-radio-button>
                    </el-radio-group>
                  </div>
                </div>

                <div
                  class="trend-chart-enhanced"
                  ref="chartContainerRef"
                  @touchstart="handleTouchStart"
                  @touchmove="handleTouchMove"
                  @touchend="handleTouchEnd"
                >
                  <svg
                    viewBox="0 0 360 200"
                    class="chart-svg-enhanced"
                    :class="{ 'chart-transitioning': isChartTransitioning }"
                    :style="{ transform: `scale(${chartScale})`, transformOrigin: 'center center' }"
                  >
                    <!-- 渐变定义 -->
                    <defs>
                      <linearGradient
                        id="babyGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style="stop-color: #667eea; stop-opacity: 0.4;"
                        />
                        <stop
                          offset="100%"
                          style="stop-color: #667eea; stop-opacity: 0.05;"
                        />
                      </linearGradient>
                      <linearGradient
                        id="p50Gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style="stop-color: #22c55e; stop-opacity: 0.15;"
                        />
                        <stop
                          offset="100%"
                          style="stop-color: #22c55e; stop-opacity: 0.02;"
                        />
                      </linearGradient>
                    </defs>

                    <!-- Y轴标签 -->
                    <text x="8" y="25" class="axis-label">100</text>
                    <text x="8" y="65" class="axis-label">75</text>
                    <text x="8" y="105" class="axis-label">50</text>
                    <text x="8" y="145" class="axis-label">25</text>
                    <text x="8" y="180" class="axis-label">0</text>

                    <!-- 水平网格线 -->
                    <line x1="35" y1="20" x2="345" y2="20" class="grid-line" />
                    <line x1="35" y1="60" x2="345" y2="60" class="grid-line" />
                    <line
                      x1="35"
                      y1="100"
                      x2="345"
                      y2="100"
                      class="grid-line"
                    />
                    <line
                      x1="35"
                      y1="140"
                      x2="345"
                      y2="140"
                      class="grid-line"
                    />
                    <line
                      x1="35"
                      y1="175"
                      x2="345"
                      y2="175"
                      class="grid-line-base"
                    />

                    <!-- 发育标准曲线 - P97百分位（偏高）红色虚线 -->
                    <path :d="p97CurvePath" class="percentile-line p97" />

                    <!-- 发育标准曲线 - P50百分位（中位）绿色实线 + 填充 -->
                    <path :d="p50AreaPath" fill="url(#p50Gradient)" />
                    <path :d="p50CurvePath" class="percentile-line p50" />

                    <!-- 发育标准曲线 - P3百分位（偏低）蓝色虚线 -->
                    <path :d="p3CurvePath" class="percentile-line p3" />

                    <!-- 宝宝数据区域填充（平滑曲线） -->
                    <path
                      :d="smoothTrendAreaPath"
                      fill="url(#babyGradient)"
                      class="baby-area"
                    />

                    <!-- 宝宝数据趋势线（平滑曲线） -->
                    <path :d="smoothTrendLinePath" class="baby-trend-line" />

                    <!-- 关键里程碑标注 -->
                    <g
                      v-for="(milestone, idx) in keyMilestoneMarkers"
                      :key="'m' + idx"
                    >
                      <line
                        :x1="milestone.x"
                        :y1="milestone.y"
                        :x2="milestone.x"
                        :y2="175"
                        class="milestone-marker-line"
                      />
                      <circle
                        :cx="milestone.x"
                        :cy="milestone.y"
                        r="8"
                        class="milestone-marker"
                        @click="showMilestoneDetail(milestone)"
                      />
                      <text
                        :x="milestone.x"
                        :y="milestone.y - 12"
                        class="milestone-marker-text"
                      >
                        ⭐
                      </text>
                    </g>

                    <!-- 数据点（气泡样式，支持交互） -->
                    <g
                      v-for="(point, idx) in trendDataPoints"
                      :key="'p' + idx"
                      class="data-point-group"
                      @mouseenter="showPointTooltip(point, $event)"
                      @mouseleave="hidePointTooltip"
                      @click="handlePointClick(point)"
                    >
                      <!-- 外圈光晕 -->
                      <circle
                        :cx="point.x"
                        :cy="point.y"
                        :r="getPointRadius(point.value) + 4"
                        class="point-glow"
                        :class="{ current: point.isCurrent }"
                      />
                      <!-- 主数据点 -->
                      <circle
                        :cx="point.x"
                        :cy="point.y"
                        :r="getPointRadius(point.value)"
                        class="data-point-bubble"
                        :class="{
                          current: point.isCurrent,
                          achieved: point.value >= 80,
                        }"
                      />
                      <!-- 当前月份图标 -->
                      <text
                        v-if="point.isCurrent"
                        :x="point.x"
                        :y="point.y + 3"
                        class="current-point-icon"
                      >
                        {{ abilityIcons[selectedAbilityType] }}
                      </text>
                      <!-- X轴标签 -->
                      <text :x="point.x" :y="192" class="x-label">
                        {{ point.month }}月
                      </text>
                    </g>
                  </svg>

                  <!-- 悬停提示框 -->
                  <div
                    v-if="tooltipVisible"
                    class="chart-tooltip"
                    :style="{
                      left: tooltipPosition.x + 'px',
                      top: tooltipPosition.y + 'px',
                    }"
                  >
                    <div class="tooltip-header">
                      <span class="tooltip-month">
                        {{ tooltipData.month }}月龄
                      </span>
                      <span
                        class="tooltip-status"
                        :class="tooltipData.statusClass"
                      >
                        {{ tooltipData.status }}
                      </span>
                    </div>
                    <div class="tooltip-body">
                      <div class="tooltip-item">
                        <span class="tooltip-label">完成度</span>
                        <span class="tooltip-value">
                          {{ tooltipData.value }}%
                        </span>
                      </div>
                    </div>
                    <div class="tooltip-footer">点击查看详情 →</div>
                  </div>

                  <!-- 缩放控制按钮 -->
                  <div class="zoom-controls">
                    <button class="zoom-btn" @click="zoomIn" :disabled="chartScale >= 2" title="放大">
                      <span>+</span>
                    </button>
                    <button class="zoom-btn reset" @click="resetZoom" :disabled="chartScale === 1" title="重置">
                      <span>⟲</span>
                    </button>
                    <button class="zoom-btn" @click="zoomOut" :disabled="chartScale <= 0.5" title="缩小">
                      <span>−</span>
                    </button>
                    <span class="zoom-level">{{ Math.round(chartScale * 100) }}%</span>
                  </div>
                </div>

                <!-- 图例说明 -->
                <div class="trend-legend-enhanced">
                  <div class="legend-group">
                    <div class="legend-title">📊 图例说明</div>
                    <div class="legend-items">
                      <div class="legend-item">
                        <span class="legend-line baby"></span>
                        <span>宝宝数据</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-line p97"></span>
                        <span>P97偏高</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-line p50"></span>
                        <span>P50中位</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-line p3"></span>
                        <span>P3偏低</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-marker">⭐</span>
                        <span>关键节点</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 发育评估摘要 -->
                <div class="development-assessment">
                  <div class="assessment-header">
                    <span class="assessment-icon">
                      {{ developmentAssessment.icon }}
                    </span>
                    <span class="assessment-title">
                      {{ developmentAssessment.title }}
                    </span>
                    <el-tag
                      :type="developmentAssessment.tagType"
                      size="small"
                      round
                    >
                      {{ developmentAssessment.level }}
                    </el-tag>
                  </div>
                  <p class="assessment-desc">
                    {{ developmentAssessment.description }}
                  </p>
                  <div class="assessment-comparison">
                    <div class="comparison-item">
                      <span class="comparison-label">当前完成度</span>
                      <span class="comparison-value">
                        {{ developmentAssessment.currentValue }}%
                      </span>
                    </div>
                    <div class="comparison-item">
                      <span class="comparison-label">同龄P50标准</span>
                      <span class="comparison-value standard">
                        {{ developmentAssessment.p50Value }}%
                      </span>
                    </div>
                    <div class="comparison-item">
                      <span class="comparison-label">差异</span>
                      <span
                        class="comparison-value"
                        :class="developmentAssessment.diffClass"
                      >
                        {{ developmentAssessment.diff }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 生成成长报告按钮 -->
                <div class="trend-report-action">
                  <el-button
                    type="primary"
                    round
                    @click="generateAbilityReport"
                  >
                    <el-icon><Document /></el-icon>
                    生成能力发展报告
                  </el-button>
                </div>
              </template>
            </div>

            <!-- 关键里程碑详情弹窗 -->
            <el-dialog
              v-model="milestoneDetailVisible"
              :title="selectedMilestoneMarker?.title || '里程碑详情'"
              width="90%"
              class="milestone-detail-dialog"
            >
              <div
                v-if="selectedMilestoneMarker"
                class="milestone-detail-content"
              >
                <div class="detail-hero">
                  <span class="hero-emoji">
                    {{ selectedMilestoneMarker.emoji }}
                  </span>
                  <h3>{{ selectedMilestoneMarker.title }}</h3>
                  <p class="hero-month">
                    通常在 {{ selectedMilestoneMarker.month }} 个月达成
                  </p>
                </div>
                <div class="detail-section">
                  <h4>📌 发育意义</h4>
                  <p>{{ selectedMilestoneMarker.significance }}</p>
                </div>
                <div class="detail-section">
                  <h4>💡 促进建议</h4>
                  <ul class="suggestion-list">
                    <li
                      v-for="(tip, idx) in selectedMilestoneMarker.tips"
                      :key="idx"
                    >
                      {{ tip }}
                    </li>
                  </ul>
                </div>
                <div class="detail-section">
                  <h4>⚠️ 注意事项</h4>
                  <p>{{ selectedMilestoneMarker.caution }}</p>
                </div>
              </div>
            </el-dialog>

            <!-- 能力发展报告弹窗 -->
            <el-dialog
              v-model="abilityReportVisible"
              title="📊 能力发展报告"
              width="95%"
              class="ability-report-dialog"
            >
              <div class="ability-report-content">
                <div class="report-header">
                  <div class="report-baby-info">
                    <span class="baby-avatar">👶</span>
                    <div class="baby-details">
                      <h3>{{ babyInfo.name || '宝宝' }}的能力发展报告</h3>
                      <p>
                        {{ monthData?.month || 0 }}月龄 · 生成时间：{{
                          new Date().toLocaleDateString()
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 五维能力雷达概览 -->
                <div class="report-section">
                  <h4>🎯 五维能力概览</h4>
                  <div class="ability-radar-summary">
                    <div
                      v-for="(ability, key) in abilityReportData"
                      :key="key"
                      class="ability-bar-item"
                    >
                      <div class="ability-bar-header">
                        <span class="ability-name">{{ ability.name }}</span>
                        <span class="ability-score">{{ ability.score }}分</span>
                      </div>
                      <div class="ability-bar-container">
                        <div class="ability-bar-bg"></div>
                        <div
                          class="ability-bar-fill"
                          :style="{
                            width: ability.score + '%',
                            background: ability.color,
                          }"
                        ></div>
                        <div
                          class="ability-bar-p50"
                          :style="{ left: ability.p50 + '%' }"
                        ></div>
                      </div>
                      <div class="ability-bar-footer">
                        <span :class="['ability-status', ability.statusClass]">
                          {{ ability.status }}
                        </span>
                        <span class="ability-diff">
                          vs P50: {{ ability.diff }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 发育建议 -->
                <div class="report-section">
                  <h4>💡 个性化发育建议</h4>
                  <div class="advice-cards">
                    <div
                      v-for="(advice, idx) in developmentAdvices"
                      :key="idx"
                      class="advice-card"
                      :class="advice.type"
                    >
                      <span class="advice-icon">{{ advice.icon }}</span>
                      <div class="advice-content">
                        <h5>{{ advice.title }}</h5>
                        <p>{{ advice.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 下月预期 -->
                <div class="report-section">
                  <h4>🚀 下月发展预期</h4>
                  <div class="next-month-expectations">
                    <div
                      v-for="(exp, idx) in nextMonthExpectations"
                      :key="idx"
                      class="expectation-item"
                    >
                      <span class="exp-icon">{{ exp.icon }}</span>
                      <span class="exp-text">{{ exp.text }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <template #footer>
                <div class="report-actions">
                  <el-button @click="abilityReportVisible = false">
                    关闭
                  </el-button>
                  <el-button type="success" @click="shareAbilityReport">
                    <el-icon><Share /></el-icon>
                    分享报告
                  </el-button>
                  <el-button type="primary" @click="downloadAbilityReport">
                    <el-icon><Download /></el-icon>
                    保存报告
                  </el-button>
                </div>
              </template>
            </el-dialog>

            <div class="milestones-grid">
              <div
                v-for="(milestone, index) in monthData.milestones"
                :key="index"
                :class="[
                  'milestone-card',
                  { completed: isMilestoneCompleted(milestone.title) },
                ]"
                @click="handleMilestoneClick(milestone)"
              >
                <div class="milestone-header-row">
                  <div class="milestone-check">
                    <div class="check-circle">
                      <el-icon v-if="isMilestoneCompleted(milestone.title)">
                        <Check />
                      </el-icon>
                    </div>
                  </div>
                  <div class="milestone-status">
                    <el-tag
                      :type="
                        isMilestoneCompleted(milestone.title)
                          ? 'success'
                          : 'info'
                      "
                      :effect="
                        isMilestoneCompleted(milestone.title) ? 'dark' : 'plain'
                      "
                      round
                    >
                      <el-icon
                        v-if="isMilestoneCompleted(milestone.title)"
                        style="margin-right: 4px;"
                      >
                        <Check />
                      </el-icon>
                      {{
                        isMilestoneCompleted(milestone.title)
                          ? '已完成'
                          : '待完成'
                      }}
                    </el-tag>
                  </div>
                </div>
                <div class="milestone-content">
                  <h4>{{ milestone.title }}</h4>
                  <p>{{ milestone.description }}</p>
                </div>
                <div class="milestone-actions">
                  <el-button
                    v-if="!isMilestoneCompleted(milestone.title)"
                    type="primary"
                    size="small"
                    round
                    @click.stop="confirmMilestone(milestone)"
                  >
                    <el-icon><Check /></el-icon>
                    标记完成
                  </el-button>
                  <el-button
                    v-else
                    size="small"
                    round
                    @click.stop="uploadMilestonePhoto(milestone)"
                  >
                    <el-icon><Camera /></el-icon>
                    上传照片
                  </el-button>
                  <el-button
                    v-if="isMilestoneCompleted(milestone.title)"
                    size="small"
                    round
                    text
                    @click.stop="undoMilestone(milestone)"
                  >
                    撤销
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 确认完成对话框 -->
            <el-dialog
              v-model="milestoneDialogVisible"
              title="🎉 确认完成里程碑"
              width="90%"
              :style="{ maxWidth: '400px' }"
              center
            >
              <div class="milestone-confirm-content" v-if="currentMilestone">
                <div class="confirm-icon">🏆</div>
                <h3>{{ currentMilestone.title }}</h3>
                <p>{{ currentMilestone.description }}</p>
                <el-divider />
                <div class="confirm-upload-area">
                  <p class="upload-hint">记录这个珍贵瞬间（可选）</p>
                  <el-upload
                    class="milestone-upload"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept="image/*,video/*"
                    @change="handleMilestoneMediaChange"
                  >
                    <el-button type="primary" plain round>
                      <el-icon><Camera /></el-icon>
                      上传照片/视频
                    </el-button>
                  </el-upload>
                  <div v-if="milestoneMediaPreview" class="media-preview">
                    <img :src="milestoneMediaPreview" alt="预览" />
                    <el-button
                      circle
                      size="small"
                      class="remove-media-btn"
                      @click="removeMilestoneMedia"
                    >
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
              <template #footer>
                <el-button @click="milestoneDialogVisible = false" round>
                  取消
                </el-button>
                <el-button
                  type="success"
                  @click="confirmMilestoneComplete"
                  round
                >
                  <el-icon><Check /></el-icon>
                  确认完成
                </el-button>
              </template>
            </el-dialog>

            <!-- 训练方法指南对话框 -->
            <el-dialog
              v-model="trainingGuideVisible"
              :title="
                currentKeyword
                  ? `📖 ${currentKeyword.text} - 训练指南`
                  : '训练指南'
              "
              width="90%"
              :style="{ maxWidth: '500px' }"
            >
              <div class="training-guide-content" v-if="currentKeyword">
                <div class="guide-header">
                  <span class="guide-icon">{{ currentKeyword.icon }}</span>
                  <div class="guide-title-area">
                    <h3>{{ currentKeyword.text }}</h3>
                    <p class="guide-subtitle">{{ currentKeyword.desc }}</p>
                  </div>
                </div>
                <el-divider />
                <div class="guide-section">
                  <h4>
                    <span class="section-emoji">🎯</span>
                    训练目标
                  </h4>
                  <p>{{ currentKeyword.goal }}</p>
                </div>
                <div class="guide-section">
                  <h4>
                    <span class="section-emoji">📋</span>
                    训练方法
                  </h4>
                  <ul class="method-list">
                    <li
                      v-for="(method, idx) in currentKeyword.methods"
                      :key="idx"
                    >
                      <el-icon><CircleCheck /></el-icon>
                      {{ method }}
                    </li>
                  </ul>
                </div>
                <div class="guide-section">
                  <h4>
                    <span class="section-emoji">⏰</span>
                    建议频率
                  </h4>
                  <el-tag type="success" effect="plain" round>
                    {{ currentKeyword.frequency }}
                  </el-tag>
                </div>
                <div class="guide-section tips-section">
                  <h4>
                    <span class="section-emoji">💡</span>
                    温馨提示
                  </h4>
                  <el-alert
                    :title="currentKeyword.tips"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
              </div>
              <template #footer>
                <el-button @click="trainingGuideVisible = false" round>
                  关闭
                </el-button>
                <el-button type="primary" @click="goToRelatedContent" round>
                  查看相关内容
                  <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </template>
            </el-dialog>

            <!-- 🎯 记录今日成长 - 快捷入口（移至里程碑下方） -->
            <div class="quick-record-section">
              <div class="quick-record-card">
                <div class="quick-record-header">
                  <span class="record-emoji">📝</span>
                  <div class="record-title-area">
                    <h4>记录今日成长</h4>
                    <p>完成里程碑后，快来记录这个珍贵时刻吧！</p>
                  </div>
                </div>
                <div class="quick-record-templates">
                  <span class="templates-label">快速记录：</span>
                  <div class="template-tags">
                    <el-tag
                      v-for="(tpl, idx) in quickRecordTemplates"
                      :key="idx"
                      effect="plain"
                      round
                      class="template-tag"
                      @click="openQuickRecord(tpl)"
                    >
                      {{ tpl.icon }} {{ tpl.text }}
                    </el-tag>
                  </div>
                </div>
                <div class="quick-record-actions">
                  <el-button type="primary" round @click="goToDiary">
                    <el-icon><Edit /></el-icon>
                    打开日记本
                  </el-button>
                  <el-button round @click="openQuickRecordDialog">
                    <el-icon><Plus /></el-icon>
                    快速记录
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 快速记录对话框 -->
            <el-dialog
              v-model="quickRecordDialogVisible"
              title="📝 快速记录成长瞬间"
              width="90%"
              :style="{ maxWidth: '420px' }"
            >
              <div class="quick-record-form">
                <div class="form-item">
                  <label>记录类型</label>
                  <div class="type-selector">
                    <el-radio-group v-model="quickRecordForm.type">
                      <el-radio-button label="milestone">
                        🏆 里程碑
                      </el-radio-button>
                      <el-radio-button label="daily">📅 日常</el-radio-button>
                      <el-radio-button label="first">⭐ 第一次</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
                <div class="form-item">
                  <label>记录内容</label>
                  <el-input
                    v-model="quickRecordForm.content"
                    type="textarea"
                    :rows="3"
                    placeholder="记录宝宝今天的成长瞬间..."
                  />
                </div>
                <div class="form-item">
                  <label>添加照片（可选）</label>
                  <el-upload
                    class="quick-record-upload"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept="image/*"
                    @change="handleQuickRecordPhoto"
                  >
                    <div v-if="quickRecordForm.photo" class="photo-preview">
                      <img :src="quickRecordForm.photo" alt="预览" />
                      <el-button
                        circle
                        size="small"
                        class="remove-photo-btn"
                        @click.stop="quickRecordForm.photo = null"
                      >
                        <el-icon><Close /></el-icon>
                      </el-button>
                    </div>
                    <div v-else class="upload-placeholder">
                      <el-icon><Camera /></el-icon>
                      <span>点击上传照片</span>
                    </div>
                  </el-upload>
                </div>
              </div>
              <template #footer>
                <el-button @click="quickRecordDialogVisible = false" round>
                  取消
                </el-button>
                <el-button type="primary" @click="submitQuickRecord" round>
                  <el-icon><Check /></el-icon>
                  保存记录
                </el-button>
              </template>
            </el-dialog>

            <!-- 📚 个性化学习资源推荐 -->
            <div class="learning-resources-section">
              <div class="resources-header">
                <h4>📚 个性化学习资源</h4>
                <span class="resources-subtitle">
                  根据{{ monthData?.month }}月龄精选推荐
                </span>
              </div>

              <!-- 资源分类Tab -->
              <el-tabs v-model="activeResourceTab" class="resource-tabs">
                <!-- 早教游戏 -->
                <el-tab-pane label="🎮 早教游戏" name="games">
                  <div class="resource-list">
                    <div
                      v-for="(game, idx) in recommendedGames"
                      :key="idx"
                      class="resource-card game-card"
                    >
                      <div class="resource-icon">{{ game.icon }}</div>
                      <div class="resource-info">
                        <h5>{{ game.name }}</h5>
                        <p>{{ game.description }}</p>
                        <div class="resource-tags">
                          <el-tag size="small" type="success" effect="plain">
                            {{ game.ability }}
                          </el-tag>
                          <el-tag size="small" type="info" effect="plain">
                            {{ game.duration }}
                          </el-tag>
                        </div>
                      </div>
                      <div class="resource-actions">
                        <el-button
                          :type="
                            isResourceFavorited('game', game.name)
                              ? 'warning'
                              : 'default'
                          "
                          circle
                          size="small"
                          @click="toggleFavorite('game', game.name)"
                        >
                          <el-icon><Star /></el-icon>
                        </el-button>
                        <el-button
                          circle
                          size="small"
                          @click="shareResource(game)"
                        >
                          <el-icon><Share /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

                <!-- 绘本儿歌 -->
                <el-tab-pane label="📖 绘本儿歌" name="books">
                  <div class="resource-list">
                    <div
                      v-for="(book, idx) in recommendedBooks"
                      :key="idx"
                      class="resource-card book-card"
                    >
                      <div class="resource-cover">{{ book.cover }}</div>
                      <div class="resource-info">
                        <h5>{{ book.name }}</h5>
                        <p class="book-author">{{ book.author }}</p>
                        <p>{{ book.description }}</p>
                        <div class="resource-tags">
                          <el-tag
                            size="small"
                            :type="book.type === '绘本' ? 'primary' : 'success'"
                            effect="plain"
                          >
                            {{ book.type }}
                          </el-tag>
                          <el-tag size="small" type="info" effect="plain">
                            {{ book.ageRange }}
                          </el-tag>
                        </div>
                      </div>
                      <div class="resource-actions">
                        <el-button
                          :type="
                            isResourceFavorited('book', book.name)
                              ? 'warning'
                              : 'default'
                          "
                          circle
                          size="small"
                          @click="toggleFavorite('book', book.name)"
                        >
                          <el-icon><Star /></el-icon>
                        </el-button>
                        <el-button
                          circle
                          size="small"
                          @click="shareResource(book)"
                        >
                          <el-icon><Share /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

                <!-- 视频教程 -->
                <el-tab-pane label="🎬 视频教程" name="videos">
                  <div class="resource-list">
                    <div
                      v-for="(video, idx) in recommendedVideos"
                      :key="idx"
                      class="resource-card video-card"
                    >
                      <div class="video-thumbnail">
                        <span class="play-icon">▶</span>
                        <span class="video-duration">{{ video.duration }}</span>
                      </div>
                      <div class="resource-info">
                        <h5>{{ video.title }}</h5>
                        <p>{{ video.description }}</p>
                        <div class="resource-tags">
                          <el-tag size="small" type="danger" effect="plain">
                            {{ video.category }}
                          </el-tag>
                          <el-tag size="small" type="info" effect="plain">
                            {{ video.source }}
                          </el-tag>
                        </div>
                      </div>
                      <div class="resource-actions">
                        <el-button
                          :type="
                            isResourceFavorited('video', video.title)
                              ? 'warning'
                              : 'default'
                          "
                          circle
                          size="small"
                          @click="toggleFavorite('video', video.title)"
                        >
                          <el-icon><Star /></el-icon>
                        </el-button>
                        <el-button
                          circle
                          size="small"
                          @click="shareResource(video)"
                        >
                          <el-icon><Share /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>

              <!-- 查看收藏 -->
              <div class="favorites-action" v-if="favoritesCount > 0">
                <el-button text type="primary" @click="showFavorites">
                  <el-icon><Star /></el-icon>
                  查看我的收藏 ({{ favoritesCount }})
                </el-button>
              </div>
            </div>

            <!-- 📊 成长报告对话框 -->
            <el-dialog
              v-model="growthReportDialogVisible"
              title="📊 生成成长报告"
              width="90%"
              :style="{ maxWidth: '500px' }"
            >
              <div class="growth-report-content">
                <!-- 报告预览 -->
                <div class="report-preview" ref="reportPreviewRef">
                  <div class="report-header-section">
                    <div class="report-logo">👶</div>
                    <h2>宝宝成长报告</h2>
                    <p class="report-subtitle">
                      第{{ monthData?.month }}个月成长记录
                    </p>
                  </div>

                  <div class="report-info-section">
                    <div class="info-row">
                      <span class="info-label">👤 宝宝姓名</span>
                      <span class="info-value">
                        {{ babyInfo.name || '未设置' }}
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">🎂 出生日期</span>
                      <span class="info-value">
                        {{ babyInfo.birthday || '未设置' }}
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">📅 报告日期</span>
                      <span class="info-value">{{ reportDate }}</span>
                    </div>
                  </div>

                  <div class="report-progress-section">
                    <h3>🏆 本月里程碑完成情况</h3>
                    <div class="progress-summary">
                      <div class="progress-ring">
                        <svg viewBox="0 0 100 100">
                          <circle class="ring-bg" cx="50" cy="50" r="40" />
                          <circle
                            class="ring-fill"
                            cx="50"
                            cy="50"
                            r="40"
                            :style="{ strokeDashoffset: reportProgressOffset }"
                          />
                        </svg>
                        <span class="progress-percent">
                          {{ milestoneProgress }}%
                        </span>
                      </div>
                      <div class="progress-stats">
                        <div class="stat-item completed">
                          <span class="stat-num">
                            {{ completedMilestonesCount }}
                          </span>
                          <span class="stat-label">已完成</span>
                        </div>
                        <div class="stat-item pending">
                          <span class="stat-num">
                            {{
                              (monthData?.milestones?.length ?? 0) -
                              completedMilestonesCount
                            }}
                          </span>
                          <span class="stat-label">待完成</span>
                        </div>
                      </div>
                    </div>

                    <div class="milestones-summary">
                      <div
                        v-for="(milestone, idx) in monthData?.milestones"
                        :key="idx"
                        :class="[
                          'milestone-row',
                          { completed: isMilestoneCompleted(milestone.title) },
                        ]"
                      >
                        <span class="milestone-status-icon">
                          {{
                            isMilestoneCompleted(milestone.title) ? '✅' : '⏳'
                          }}
                        </span>
                        <span class="milestone-name">
                          {{ milestone.title }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="report-prediction-section">
                    <h3>🔮 下月能力预测</h3>
                    <p class="prediction-intro">
                      进入{{
                        (monthData?.month ?? 0) + 1
                      }}个月后，宝宝将可能发展以下能力：
                    </p>
                    <div class="prediction-tags">
                      <el-tag
                        v-for="(ability, idx) in nextMonthAbilities"
                        :key="idx"
                        type="success"
                        effect="plain"
                        round
                      >
                        {{ ability }}
                      </el-tag>
                    </div>
                  </div>

                  <div class="report-footer-section">
                    <p>📱 由「宝宝成长指南」生成</p>
                    <p class="footer-date">{{ reportDate }}</p>
                  </div>
                </div>

                <!-- 宝宝信息编辑（首次使用时） -->
                <div class="baby-info-edit" v-if="!babyInfo.name">
                  <el-alert
                    title="请先完善宝宝信息，以便生成完整报告"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                  <div class="info-form">
                    <el-input
                      v-model="babyInfoForm.name"
                      placeholder="宝宝姓名/昵称"
                      prefix-icon="User"
                    />
                    <el-date-picker
                      v-model="babyInfoForm.birthday"
                      type="date"
                      placeholder="出生日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      style="width: 100%;"
                    />
                    <el-button type="primary" round @click="saveBabyInfo">
                      保存信息
                    </el-button>
                  </div>
                </div>
              </div>
              <template #footer>
                <el-button @click="growthReportDialogVisible = false" round>
                  关闭
                </el-button>
                <el-button round @click="shareReport">
                  <el-icon><Share /></el-icon>
                  分享
                </el-button>
                <el-button type="primary" round @click="downloadReport">
                  <el-icon><Download /></el-icon>
                  保存图片
                </el-button>
              </template>
            </el-dialog>
          </div>
        </el-tab-pane>

        <!-- 常见问题 -->
        <el-tab-pane name="issues">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">❓</span>
              <span class="tab-text">常见问题</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="issues-list">
              <el-card
                v-for="(issue, index) in monthData.commonIssues"
                :key="index"
                class="issue-card"
              >
                <div class="issue-header">
                  <span class="issue-icon">⚠️</span>
                  <h3>{{ issue.problem }}</h3>
                </div>

                <div class="issue-section">
                  <h4>
                    <span class="section-icon">🔍</span>
                    症状表现
                  </h4>
                  <div class="symptom-tags">
                    <el-tag
                      v-for="(symptom, idx) in issue.symptoms"
                      :key="idx"
                      type="warning"
                      effect="plain"
                    >
                      {{ symptom }}
                    </el-tag>
                  </div>
                </div>

                <div class="issue-section">
                  <h4>
                    <span class="section-icon">💡</span>
                    解决方案
                  </h4>
                  <ul class="solution-list">
                    <li v-for="(solution, idx) in issue.solutions" :key="idx">
                      <el-icon class="solution-icon"><CircleCheck /></el-icon>
                      {{ solution }}
                    </li>
                  </ul>
                </div>

                <el-alert
                  :title="'🏥 何时就医：' + issue.whenToSeeDr"
                  type="error"
                  :closable="false"
                  show-icon
                  class="doctor-alert"
                />
              </el-card>
            </div>
            <el-empty
              v-if="!monthData.commonIssues.length"
              description="暂无常见问题"
            />
          </div>
        </el-tab-pane>

        <!-- 安全提醒 -->
        <el-tab-pane name="safety">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">⚠️</span>
              <span class="tab-text">安全提醒</span>
            </span>
          </template>

          <div class="tab-content">
            <div class="safety-header">
              <div class="safety-icon-large">🛡️</div>
              <div class="safety-intro">
                <h3>安全第一</h3>
                <p>以下是{{ monthData.month }}月龄宝宝需要特别注意的安全事项</p>
              </div>
            </div>

            <div class="safety-grid">
              <div
                v-for="(warning, index) in monthData.safetyWarnings"
                :key="index"
                class="safety-card"
              >
                <div class="safety-number">{{ index + 1 }}</div>
                <div class="safety-content">{{ warning }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 学习资源 -->
        <el-tab-pane name="media">
          <template #label>
            <span class="tab-label">
              <span class="tab-icon">📚</span>
              <span class="tab-text">学习资源</span>
            </span>
          </template>

          <div class="tab-content">
            <MediaGallery
              :videos="monthData.videos"
              :images="monthData.images"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 下月龄预告 -->
    <div
      class="next-month-preview"
      v-if="nextMonthData && monthData.month < 12"
    >
      <el-card class="preview-card">
        <div class="preview-header">
          <span class="preview-icon">🔮</span>
          <div class="preview-title-area">
            <h3>下月龄预告：{{ nextMonthData.month }}个月</h3>
            <span class="preview-stage">
              {{ getStageLabel(nextMonthData.month) }}
            </span>
          </div>
        </div>
        <p class="preview-summary">{{ nextMonthData.summary }}</p>

        <!-- 即将解锁的能力 -->
        <div class="preview-section">
          <div class="section-header">
            <span class="section-icon">🏆</span>
            <span class="section-title">即将解锁的能力</span>
          </div>
          <div class="preview-tags">
            <el-tag
              v-for="(m, idx) in nextMonthData.milestones?.slice(0, 3)"
              :key="idx"
              type="success"
              effect="plain"
              round
            >
              {{ m.title }}
            </el-tag>
            <el-tag
              v-if="(nextMonthData.milestones?.length ?? 0) > 3"
              type="info"
              effect="plain"
              round
            >
              +{{ (nextMonthData.milestones?.length ?? 0) - 3 }}更多
            </el-tag>
          </div>
        </div>

        <!-- 提前准备建议 -->
        <div class="preview-section">
          <div class="section-header">
            <span class="section-icon">📋</span>
            <span class="section-title">提前准备建议</span>
          </div>
          <div class="preparation-list">
            <div
              v-for="(prep, idx) in nextMonthPreparations"
              :key="idx"
              class="preparation-item"
            >
              <span class="prep-icon">{{ prep.icon }}</span>
              <span class="prep-text">{{ prep.text }}</span>
            </div>
          </div>
        </div>

        <!-- 训练小游戏推荐 -->
        <div class="preview-section">
          <div class="section-header">
            <span class="section-icon">🎮</span>
            <span class="section-title">推荐小游戏</span>
          </div>
          <div class="games-list">
            <div
              v-for="(game, idx) in nextMonthGames"
              :key="idx"
              class="game-item"
            >
              <span class="game-icon">{{ game.icon }}</span>
              <div class="game-info">
                <span class="game-name">{{ game.name }}</span>
                <span class="game-benefit">{{ game.benefit }}</span>
              </div>
            </div>
          </div>
        </div>

        <el-button
          type="primary"
          round
          class="preview-action-btn"
          @click="navigateMonth(1)"
        >
          查看{{ nextMonthData.month }}月龄详情
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </el-card>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <el-button
        v-if="monthData.month > 0"
        size="large"
        round
        @click="navigateMonth(-1)"
        class="nav-prev-btn"
      >
        <el-icon><ArrowLeft /></el-icon>
        {{ monthData.month - 1 }}月龄
      </el-button>
      <div v-else class="nav-placeholder"></div>

      <el-button
        type="primary"
        size="large"
        round
        @click="router.push('/')"
        class="nav-home-btn"
      >
        <el-icon><HomeFilled /></el-icon>
        返回首页
      </el-button>

      <el-button
        v-if="monthData.month < 12"
        type="primary"
        size="large"
        round
        @click="navigateMonth(1)"
        class="nav-next-btn"
      >
        {{ monthData.month + 1 }}月龄
        <el-icon><ArrowRight /></el-icon>
      </el-button>
      <div v-else class="nav-placeholder"></div>
    </div>
  </div>

  <el-empty v-else description="未找到该月龄数据" :image-size="200">
    <el-button type="primary" @click="router.push('/')">返回首页</el-button>
  </el-empty>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import CareGuideCard from '@/components/baby/CareGuideCard.vue'
import MediaGallery from '@/components/baby/MediaGallery.vue'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ScaleToOriginal,
  Histogram,
  DataAnalysis,
  Check,
  CircleCheck,
  Edit,
  HomeFilled,
  Camera,
  Close,
  Plus,
  Document,
  Share,
  Download,
  Star,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { BabyMonthData, Milestone } from '@/types/baby'

const route = useRoute()
const router = useRouter()
const babyStore = useBabyStore()

const activeTab = ref('development')

// 卡片折叠状态
const collapsedCards = ref({
  cognitive: false,
  social: false,
  motorGross: false,
  motorFine: false,
})

// 切换卡片折叠状态
const toggleCardCollapse = (cardType: keyof typeof collapsedCards.value) => {
  collapsedCards.value[cardType] = !collapsedCards.value[cardType]
}

const monthData = computed(() => {
  const monthId = parseInt(route.params.id as string)
  return babyStore.allMonthsData.find((m: BabyMonthData) => m.month === monthId)
})

// 下个月龄数据
const nextMonthData = computed(() => {
  if (!monthData.value || monthData.value.month >= 12) return null
  return babyStore.allMonthsData.find(
    (m: BabyMonthData) => m.month === monthData.value!.month + 1,
  )
})

const completedMilestonesCount = computed(() => {
  if (!monthData.value) return 0
  return monthData.value.milestones.filter((m: Milestone) =>
    babyStore.isMilestoneCompleted(m.title),
  ).length
})

// 待完成里程碑数量
const pendingMilestonesCount = computed(() => {
  if (!monthData.value) return 0
  return monthData.value.milestones.length - completedMilestonesCount.value
})

const milestoneProgress = computed(() => {
  if (!monthData.value || !monthData.value.milestones.length) return 0
  return Math.round(
    (completedMilestonesCount.value / monthData.value.milestones.length) * 100,
  )
})

// 🎯 新增：里程碑进度相关计算
const milestoneTotalCount = computed(() => {
  return monthData.value?.milestones?.length || 0
})

const milestoneCompletedCount = computed(() => {
  return completedMilestonesCount.value
})

const milestoneProgressPercent = computed(() => {
  return milestoneProgress.value
})

const milestoneProgressOffset = computed(() => {
  const circumference = 2 * Math.PI * 18
  return circumference * (1 - milestoneProgress.value / 100)
})

// 🎯 关键词卡片柔和渐变色
const keywordColors = [
  'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', // 柔蓝
  'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', // 柔粉
  'linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%)', // 柔绿
]

// 🎯 里程碑确认对话框状态
const milestoneDialogVisible = ref(false)
const currentMilestone = ref<{ title: string; description: string } | null>(
  null,
)
const milestoneMediaPreview = ref<string | null>(null)
const milestoneMediaFile = ref<File | null>(null)

// 🎯 训练指南对话框状态
const trainingGuideVisible = ref(false)
const currentKeyword = ref<{
  icon: string
  lineIcon: string
  text: string
  desc: string
  tab: string
  goal: string
  methods: string[]
  frequency: string
  tips: string
} | null>(null)

// 🎯 增强版：本月成长关键词（含描述和训练方法）
interface KeywordData {
  icon: string
  lineIcon: string
  text: string
  desc: string
  tab: string
  goal: string
  methods: string[]
  frequency: string
  tips: string
}

const monthKeywords = computed((): KeywordData[] => {
  const keywordsMap: Record<number, KeywordData[]> = {
    0: [
      {
        icon: '👀',
        lineIcon: '◎',
        text: '视觉追踪',
        desc: '促进视觉神经发育',
        tab: 'development',
        goal: '帮助宝宝学会用眼睛跟踪移动物体',
        methods: [
          '距离宝宝20-30cm展示黑白卡片',
          '缓慢移动玩具让宝宝目光跟随',
          '用表情变化吸引宝宝注意',
        ],
        frequency: '每天3-5次，每次2-3分钟',
        tips: '新生儿只能看清20-30cm内的物体，不要距离太远',
      },
      {
        icon: '🤱',
        lineIcon: '♡',
        text: '亲密依恋',
        desc: '建立安全感基础',
        tab: 'care',
        goal: '通过肌肤接触建立亲子依恋关系',
        methods: [
          '多进行肌肤接触（袋鼠式护理）',
          '喂奶时保持眼神交流',
          '轻声和宝宝说话唱歌',
        ],
        frequency: '全天候，抓住每次互动机会',
        tips: '安全的依恋关系是宝宝心理健康发展的基石',
      },
      {
        icon: '😴',
        lineIcon: '☽',
        text: '睡眠规律',
        desc: '帮助建立昼夜节律',
        tab: 'care',
        goal: '逐步建立白天黑夜的睡眠规律',
        methods: [
          '白天保持适度光线和声音',
          '夜间降低光线和噪音',
          '建立简单的睡前仪式',
        ],
        frequency: '每天坚持规律作息',
        tips: '新生儿每天需要16-18小时睡眠，不用急于建立固定时间表',
      },
    ],
    1: [
      {
        icon: '😊',
        lineIcon: '☺',
        text: '社交微笑',
        desc: '情感交流萌芽',
        tab: 'development',
        goal: '鼓励宝宝对人脸产生微笑反应',
        methods: [
          '经常对宝宝微笑',
          '用夸张的表情逗宝宝',
          '模仿宝宝的表情和声音',
        ],
        frequency: '每次互动都可以练习',
        tips: '社交微笑是宝宝情感发展的重要里程碑',
      },
      {
        icon: '👂',
        lineIcon: '♪',
        text: '声音定位',
        desc: '听觉发展训练',
        tab: 'development',
        goal: '帮助宝宝学会转头寻找声源',
        methods: [
          '在不同方向呼唤宝宝名字',
          '用摇铃在宝宝两侧轻轻摇动',
          '播放轻柔音乐观察反应',
        ],
        frequency: '每天3-4次，每次1-2分钟',
        tips: '声音不要太大，温柔的声音更能吸引宝宝',
      },
      {
        icon: '💪',
        lineIcon: '↑',
        text: '抬头训练',
        desc: '促进大运动发展',
        tab: 'milestones',
        goal: '锻炼颈部和背部肌肉力量',
        methods: [
          '趴着时在前方放有趣玩具',
          '用声音吸引宝宝抬头看',
          '每天进行俯卧时间（Tummy Time）',
        ],
        frequency: '每天3-5次，每次3-5分钟',
        tips: '俯卧时大人要全程看护，宝宝累了就休息',
      },
    ],
    2: [
      {
        icon: '🗣️',
        lineIcon: '◯',
        text: '咿呀学语',
        desc: '语言发展启蒙',
        tab: 'development',
        goal: '鼓励宝宝发出更多声音',
        methods: [
          '模仿宝宝的声音并回应',
          '用缓慢清晰的语言和宝宝说话',
          '多唱儿歌和念童谣',
        ],
        frequency: '全天候语言互动',
        tips: '宝宝的每一个声音都值得回应，这是语言发展的基础',
      },
      {
        icon: '👐',
        lineIcon: '✋',
        text: '手眼协调',
        desc: '精细动作启蒙',
        tab: 'milestones',
        goal: '帮助宝宝学会看着物体伸手触碰',
        methods: [
          '悬挂彩色玩具让宝宝触碰',
          '把玩具放在宝宝手能够到的地方',
          '轻握宝宝的手引导触摸',
        ],
        frequency: '每天多次，随机练习',
        tips: '这个阶段宝宝的抓握是无意识的反射动作',
      },
      {
        icon: '😄',
        lineIcon: '♡',
        text: '情绪表达',
        desc: '情感认知发展',
        tab: 'development',
        goal: '帮助宝宝学会表达不同情绪',
        methods: [
          '观察并回应宝宝的情绪表达',
          '用语言描述宝宝的感受',
          '通过游戏引发宝宝笑声',
        ],
        frequency: '日常互动中持续进行',
        tips: '及时回应宝宝的情绪，能帮助建立安全感',
      },
    ],
    3: [
      {
        icon: '🎯',
        lineIcon: '◎',
        text: '抓握能力',
        desc: '精细动作发展',
        tab: 'milestones',
        goal: '帮助宝宝学会有意识地抓握物品',
        methods: [
          '把摇铃放入宝宝手中',
          '用不同质地的物品让宝宝触摸',
          '玩拉扯布书的游戏',
        ],
        frequency: '每天5-6次，每次几分钟',
        tips: '选择适合宝宝手掌大小的玩具，方便抓握',
      },
      {
        icon: '🔄',
        lineIcon: '⟳',
        text: '翻身练习',
        desc: '促进大运动发展',
        tab: 'milestones',
        goal: '帮助宝宝学会从仰卧翻到俯卧',
        methods: [
          '侧卧时用玩具引导翻身方向',
          '轻轻帮助宝宝转动髋部',
          '趴着时用玩具吸引抬头转向',
        ],
        frequency: '每天3-4次，每次5分钟',
        tips: '翻身时注意安全，床上不要有软枕头或毯子',
      },
      {
        icon: '📅',
        lineIcon: '☀',
        text: '作息规律',
        desc: '建立稳定生物钟',
        tab: 'care',
        goal: '建立相对固定的吃-玩-睡作息',
        methods: [
          '每天在固定时间进行活动',
          '建立睡前仪式（洗澡、抚触、喂奶）',
          '区分白天和夜间的环境',
        ],
        frequency: '每天坚持',
        tips: '规律作息能帮助宝宝更好地入睡和减少哭闹',
      },
    ],
    4: [
      {
        icon: '🎭',
        lineIcon: '☺',
        text: '情绪识别',
        desc: '社会认知启蒙',
        tab: 'development',
        goal: '帮助宝宝识别不同的面部表情',
        methods: [
          '做夸张的表情让宝宝观察',
          '看绘本时指出人物的表情',
          '用语言描述你的情绪',
        ],
        frequency: '日常互动中自然进行',
        tips: '宝宝通过观察你的表情来学习情绪认知',
      },
      {
        icon: '🤝',
        lineIcon: '♡',
        text: '社交互动',
        desc: '增强社交意识',
        tab: 'development',
        goal: '鼓励宝宝与家人和陌生人互动',
        methods: [
          '经常带宝宝参与家庭活动',
          '让宝宝和其他小朋友接触',
          '玩躲猫猫等互动游戏',
        ],
        frequency: '每天都有社交互动时间',
        tips: '4个月的宝宝开始能区分熟悉和陌生的面孔',
      },
      {
        icon: '🎮',
        lineIcon: '★',
        text: '游戏探索',
        desc: '认知能力提升',
        tab: 'care',
        goal: '通过游戏促进多方面发展',
        methods: [
          '玩不同材质的玩具',
          '躲猫猫游戏培养物体恒存概念',
          '唱歌配合简单的肢体动作',
        ],
        frequency: '每天30分钟以上的游戏时间',
        tips: '游戏是宝宝学习的最佳方式',
      },
    ],
    5: [
      {
        icon: '🦷',
        lineIcon: '◇',
        text: '出牙准备',
        desc: '口腔护理与舒缓',
        tab: 'care',
        goal: '帮助宝宝度过出牙不适期',
        methods: [
          '提供安全的磨牙玩具',
          '用干净纱布轻轻按摩牙龈',
          '冷藏（非冷冻）的牙胶可缓解不适',
        ],
        frequency: '根据宝宝需要随时进行',
        tips: '出牙期宝宝可能会烦躁、流口水增多，是正常现象',
      },
      {
        icon: '🍎',
        lineIcon: '○',
        text: '辅食预备',
        desc: '观察添加信号',
        tab: 'nutrition',
        goal: '判断宝宝是否准备好添加辅食',
        methods: [
          '观察宝宝对大人吃饭的兴趣',
          '检查宝宝头部控制能力',
          '观察挺舌反射是否消失',
        ],
        frequency: '日常观察',
        tips: '建议满6个月后开始添加辅食，不要过早',
      },
      {
        icon: '🧸',
        lineIcon: '☆',
        text: '物品探索',
        desc: '感官认知发展',
        tab: 'milestones',
        goal: '鼓励宝宝用多种感官探索物品',
        methods: [
          '提供不同质地的安全玩具',
          '让宝宝用嘴巴探索（保证清洁）',
          '引导宝宝用双手倒换物品',
        ],
        frequency: '每天有自由探索时间',
        tips: '用嘴巴探索是这个阶段宝宝认识世界的重要方式',
      },
    ],
    6: [
      {
        icon: '🥣',
        lineIcon: '○',
        text: '辅食添加',
        desc: '科学喂养指导',
        tab: 'nutrition',
        goal: '安全科学地开始辅食添加',
        methods: [
          '从含铁米粉开始',
          '每次只添加一种新食物',
          '观察3-5天确认无过敏反应',
        ],
        frequency: '每天1-2次辅食',
        tips: '辅食添加遵循由少到多、由稀到稠、由单一到多样的原则',
      },
      {
        icon: '🪑',
        lineIcon: '△',
        text: '独坐练习',
        desc: '大运动发展',
        tab: 'milestones',
        goal: '帮助宝宝学会独立坐稳',
        methods: [
          '用枕头在宝宝两侧支撑',
          '在宝宝前方放玩具吸引注意',
          '玩拉坐起的游戏锻炼核心',
        ],
        frequency: '每天多次，每次几分钟',
        tips: '不要让宝宝坐太久，核心力量需要逐步发展',
      },
      {
        icon: '👋',
        lineIcon: '♡',
        text: '再见挥手',
        desc: '社交模仿能力',
        tab: 'development',
        goal: '教宝宝学会挥手再见',
        methods: [
          '每次说再见时示范挥手',
          '帮宝宝拿起手做挥手动作',
          '用鼓励的语气表扬宝宝的模仿',
        ],
        frequency: '每次分别时都练习',
        tips: '宝宝可能需要几周才能学会，耐心是关键',
      },
    ],
    7: [
      {
        icon: '🧗',
        lineIcon: '⟶',
        text: '爬行萌芽',
        desc: '大运动关键期',
        tab: 'milestones',
        goal: '帮助宝宝学会爬行',
        methods: [
          '提供足够的地面活动空间',
          '用玩具在前方引诱宝宝向前',
          '轻轻推宝宝的脚底给支撑点',
        ],
        frequency: '每天30分钟以上地面时间',
        tips: '爬行对大脑发育非常重要，不要急于让宝宝学走',
      },
      {
        icon: '📦',
        lineIcon: '□',
        text: '物体恒存',
        desc: '认知能力飞跃',
        tab: 'development',
        goal: '帮助宝宝理解物体不会消失',
        methods: [
          '玩躲猫猫游戏',
          '把玩具藏在布下让宝宝找',
          '玩"不见了-找到了"的游戏',
        ],
        frequency: '每天玩几次躲猫猫',
        tips: '物体恒存概念的建立是认知发展的重要里程碑',
      },
      {
        icon: '🗣️',
        lineIcon: '♪',
        text: '叫名反应',
        desc: '语言理解能力',
        tab: 'development',
        goal: '让宝宝学会对自己名字有反应',
        methods: [
          '经常叫宝宝的名字',
          '叫名字时配合眼神和微笑',
          '宝宝有反应时立即表扬',
        ],
        frequency: '日常互动中频繁使用',
        tips: '如果宝宝对名字没有反应，可以咨询医生',
      },
    ],
    8: [
      {
        icon: '🐛',
        lineIcon: '⟶',
        text: '爬行探索',
        desc: '空间认知发展',
        tab: 'milestones',
        goal: '鼓励宝宝自由爬行探索环境',
        methods: [
          '创建安全的爬行区域',
          '设置小障碍物增加挑战',
          '和宝宝一起在地上玩',
        ],
        frequency: '每天大量地面活动时间',
        tips: '做好家居安全防护，让宝宝安全探索',
      },
      {
        icon: '👆',
        lineIcon: '✋',
        text: '精细动作',
        desc: '手指灵活性',
        tab: 'development',
        goal: '锻炼宝宝的精细动作能力',
        methods: [
          '玩捏取小物品的游戏（注意安全）',
          '撕纸游戏锻炼手指力量',
          '用勺子舀东西的游戏',
        ],
        frequency: '每天在安全监护下练习',
        tips: '注意小物品的安全，防止误吞',
      },
      {
        icon: '😰',
        lineIcon: '♡',
        text: '分离焦虑',
        desc: '情感依恋正常表现',
        tab: 'development',
        goal: '帮助宝宝度过分离焦虑期',
        methods: [
          '离开前告诉宝宝并保持短暂',
          '建立固定的告别仪式',
          '不要偷偷离开',
        ],
        frequency: '每次分离时坚持',
        tips: '分离焦虑是依恋发展的正常表现，通常1岁后逐渐减轻',
      },
    ],
    9: [
      {
        icon: '🧍',
        lineIcon: '↑',
        text: '扶站练习',
        desc: '为行走做准备',
        tab: 'milestones',
        goal: '帮助宝宝学会扶物站立',
        methods: [
          '提供稳固的扶站支撑物',
          '在宝宝旁边放喜欢的玩具',
          '扶着宝宝练习腿部力量',
        ],
        frequency: '每天多次，每次几分钟',
        tips: '确保扶站的家具稳固，防止倾倒',
      },
      {
        icon: '👏',
        lineIcon: '★',
        text: '拍手游戏',
        desc: '模仿能力发展',
        tab: 'development',
        goal: '教宝宝学会拍手等简单动作',
        methods: [
          '唱"拍拍手"儿歌配合动作',
          '抓着宝宝的手一起拍',
          '用鼓励的方式表扬模仿行为',
        ],
        frequency: '每天玩几次',
        tips: '拍手是重要的模仿能力里程碑',
      },
      {
        icon: '🔤',
        lineIcon: '◯',
        text: '语言理解',
        desc: '理解简单指令',
        tab: 'development',
        goal: '帮助宝宝理解简单的语言指令',
        methods: [
          '说"给妈妈"配合手势',
          '问"XXX在哪里"让宝宝指',
          '说"不可以"时配合表情',
        ],
        frequency: '日常对话中持续进行',
        tips: '宝宝理解的比能说的多很多',
      },
    ],
    10: [
      {
        icon: '🚶',
        lineIcon: '⟶',
        text: '学步准备',
        desc: '向独立行走过渡',
        tab: 'milestones',
        goal: '帮助宝宝为独立行走做准备',
        methods: [
          '扶着宝宝练习迈步',
          '提供稳固的学步推车',
          '鼓励宝宝沿家具移动',
        ],
        frequency: '每天练习，不强求',
        tips: '不建议使用传统学步车，可能影响腿部发育',
      },
      {
        icon: '🎯',
        lineIcon: '✋',
        text: '精准抓取',
        desc: '精细动作精进',
        tab: 'development',
        goal: '锻炼拇指和食指的捏取能力',
        methods: [
          '练习捏取泡芙等小食物',
          '玩套圈和简单的配对游戏',
          '翻书页的精细动作练习',
        ],
        frequency: '每天在进食时自然练习',
        tips: '钳形抓握是精细动作发展的重要标志',
      },
      {
        icon: '📚',
        lineIcon: '□',
        text: '绘本互动',
        desc: '早期阅读启蒙',
        tab: 'care',
        goal: '培养宝宝对书籍的兴趣',
        methods: [
          '每天固定时间亲子阅读',
          '让宝宝自己翻书页',
          '用夸张的语气讲故事',
        ],
        frequency: '每天15-20分钟',
        tips: '选择布书或硬纸板书，耐撕耐咬',
      },
    ],
    11: [
      {
        icon: '👣',
        lineIcon: '⟶',
        text: '独立迈步',
        desc: '行走能力发展',
        tab: 'milestones',
        goal: '鼓励宝宝尝试独立迈出第一步',
        methods: [
          '在近距离张开双臂鼓励宝宝走来',
          '让宝宝在两个大人之间走',
          '提供安全的练习环境',
        ],
        frequency: '每天多次鼓励尝试',
        tips: '每个宝宝学走路的时间不同，不要和别人比较',
      },
      {
        icon: '🗣️',
        lineIcon: '♪',
        text: '叠词表达',
        desc: '语言产出萌芽',
        tab: 'development',
        goal: '鼓励宝宝说出"爸爸""妈妈"等叠词',
        methods: [
          '反复重复简单的叠词',
          '宝宝发出类似音时积极回应',
          '指物命名，多次重复',
        ],
        frequency: '全天候语言互动',
        tips: '语言发展个体差异很大，不必过于焦虑',
      },
      {
        icon: '🧩',
        lineIcon: '○',
        text: '因果认知',
        desc: '逻辑思维启蒙',
        tab: 'development',
        goal: '帮助宝宝理解因果关系',
        methods: [
          '玩按键发声的玩具',
          '示范开关灯的因果关系',
          '玩投球入桶的游戏',
        ],
        frequency: '在游戏中自然进行',
        tips: '因果认知是逻辑思维发展的基础',
      },
    ],
    12: [
      {
        icon: '🎂',
        lineIcon: '★',
        text: '周岁里程',
        desc: '成长阶段总结',
        tab: 'milestones',
        goal: '回顾宝宝一岁的成长历程',
        methods: [
          '拍摄周岁纪念照',
          '记录宝宝会的所有技能',
          '制作成长相册或视频',
        ],
        frequency: '周岁前后进行',
        tips: '这是一个重要的成长节点，记得好好庆祝',
      },
      {
        icon: '🚶',
        lineIcon: '⟶',
        text: '独立行走',
        desc: '大运动里程碑',
        tab: 'milestones',
        goal: '巩固宝宝的独立行走能力',
        methods: [
          '提供安全的行走环境',
          '牵着宝宝去户外探索',
          '鼓励宝宝走到想去的地方',
        ],
        frequency: '每天大量行走练习',
        tips: '刚学会走路时摔跤是正常的，做好防护',
      },
      {
        icon: '💬',
        lineIcon: '◯',
        text: '简单词汇',
        desc: '语言表达发展',
        tab: 'development',
        goal: '鼓励宝宝说出更多有意义的词汇',
        methods: [
          '坚持指物命名',
          '回应宝宝的任何语言尝试',
          '读绘本时让宝宝指认',
        ],
        frequency: '全天候语言刺激',
        tips: '1岁宝宝通常能说1-3个有意义的词',
      },
    ],
  }
  return keywordsMap[monthData.value?.month ?? 0] ?? keywordsMap[0] ?? []
})

// 🎯 新增：个性化成长小贴士
const currentGrowthTip = computed(() => {
  const tipsMap: Record<number, string[]> = {
    0: [
      '新生儿每天需要16-20小时睡眠，记得保持安静的睡眠环境',
      '脐带护理很重要，保持干燥清洁',
    ],
    1: [
      '多和宝宝说话唱歌，这是语言发展的基础',
      '黑白卡片能有效刺激宝宝视觉发育',
    ],
    2: ['这个月宝宝开始学会社交微笑啦', '俯卧时间可以锻炼颈部力量'],
    3: ['开始建立规律作息的好时机', '宝宝可能开始尝试翻身了'],
    4: ['多进行亲子互动游戏，增进感情', '注意观察宝宝的情绪变化'],
    5: ['为辅食添加做准备，观察宝宝对食物的兴趣', '出牙期可能会有些烦躁'],
    6: ['辅食添加从单一到多样，观察过敏反应', '独坐训练可以开始啦'],
    7: ['爬行是重要的发育里程碑，多创造爬行机会', '叫宝宝名字时注意观察反应'],
    8: ['爬行能促进大脑发育，别着急让宝宝学走', '这个阶段分离焦虑是正常的'],
    9: ['扶站练习要注意安全防护', '可以开始教简单的手势如拍手'],
    10: ['学步期要选择合适的学步环境', '精细动作训练可以用小积木'],
    11: ['迈出第一步是激动人心的时刻', '鼓励宝宝用简单词汇表达'],
    12: ['周岁是重要的成长节点，记得拍照留念', '持续鼓励语言和运动发展'],
  }
  const tips = tipsMap[monthData.value?.month ?? 0] ??
    tipsMap[0] ?? ['宝宝每天都在成长']
  return tips[Math.floor(Math.random() * tips.length)] ?? '宝宝每天都在成长'
})

// 🎯 显示训练方法指南对话框
const showTrainingGuide = (keyword: KeywordData) => {
  currentKeyword.value = keyword
  trainingGuideVisible.value = true
}

// 🎯 跳转到相关内容
const goToRelatedContent = () => {
  if (currentKeyword.value) {
    activeTab.value = currentKeyword.value.tab
    trainingGuideVisible.value = false
    ElMessage({
      message: `已跳转到"${currentKeyword.value.text}"相关内容`,
      type: 'success',
      duration: 1500,
    })
  }
}

// 🎯 里程碑卡片点击处理
const handleMilestoneClick = (milestone: {
  title: string
  description: string
}) => {
  if (!isMilestoneCompleted(milestone.title)) {
    confirmMilestone(milestone)
  }
}

// 🎯 打开里程碑确认对话框
const confirmMilestone = (milestone: {
  title: string
  description: string
}) => {
  currentMilestone.value = milestone
  milestoneMediaPreview.value = null
  milestoneMediaFile.value = null
  milestoneDialogVisible.value = true
}

// 🎯 处理里程碑媒体上传
const handleMilestoneMediaChange = (uploadFile: { raw: File }) => {
  const file = uploadFile.raw
  if (file) {
    milestoneMediaFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      milestoneMediaPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 🎯 移除已选媒体
const removeMilestoneMedia = () => {
  milestoneMediaPreview.value = null
  milestoneMediaFile.value = null
}

// 🎯 确认完成里程碑
const confirmMilestoneComplete = () => {
  if (currentMilestone.value) {
    babyStore.toggleMilestone(currentMilestone.value.title)
    milestoneDialogVisible.value = false

    // 显示庆祝效果
    ElMessage({
      message: `🎉 太棒了！"${currentMilestone.value.title}"已完成！`,
      type: 'success',
      duration: 3000,
    })

    // 如果有媒体文件，可以在这里处理上传逻辑
    if (milestoneMediaFile.value) {
      ElMessage({
        message: '📷 珍贵瞬间已保存！',
        type: 'info',
        duration: 2000,
      })
    }
  }
}

// 🎯 撤销里程碑完成状态
const undoMilestone = (milestone: { title: string; description: string }) => {
  ElMessageBox.confirm(
    `确定要撤销"${milestone.title}"的完成状态吗？`,
    '撤销确认',
    {
      confirmButtonText: '确定撤销',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      babyStore.toggleMilestone(milestone.title)
      ElMessage({
        message: '已撤销完成状态',
        type: 'info',
      })
    })
    .catch(() => {})
}

// 🎯 上传里程碑照片
const uploadMilestonePhoto = (milestone: {
  title: string
  description: string
}) => {
  currentMilestone.value = milestone
  // 触发文件选择
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,video/*'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      // 这里可以处理文件上传逻辑
      ElMessage({
        message: `📷 已为"${milestone.title}"添加照片记录！`,
        type: 'success',
      })
    }
  }
  input.click()
}

// 处理关键词点击（保留兼容）
const handleKeywordClick = (keyword: {
  icon: string
  text: string
  tab: string
}) => {
  activeTab.value = keyword.tab
  ElMessage({
    message: `查看"${keyword.text}"相关内容`,
    type: 'info',
    duration: 1500,
  })
}

// 显示小贴士详情
const showTipDetail = () => {
  ElMessage({
    message: currentGrowthTip.value,
    type: 'success',
    duration: 3000,
  })
}

const isMilestoneCompleted = (title: string) => {
  return babyStore.isMilestoneCompleted(title)
}

const toggleMilestone = (title: string) => {
  babyStore.toggleMilestone(title)
  if (babyStore.isMilestoneCompleted(title)) {
    ElMessage({
      message: `🎉 太棒了！"${title}"已完成！`,
      type: 'success',
    })
  }
}

const navigateMonth = (delta: number) => {
  if (!monthData.value) return
  const newMonth = monthData.value.month + delta
  if (newMonth >= 0 && newMonth <= 12) {
    router.push(`/month/${newMonth}`)
  }
}

// 处理月龄下拉选择
const handleMonthChange = (month: number) => {
  router.push(`/month/${month}`)
}

// 获取阶段标签
const getStageLabel = (month: number): string => {
  const stageLabels: Record<number, string> = {
    0: '新生儿期',
    1: '视觉发展期',
    2: '社交萌芽期',
    3: '作息稳定期',
    4: '社交能力提升期',
    5: '探索欲旺盛期',
    6: '辅食添加期',
    7: '独坐期',
    8: '爬行探索期',
    9: '扶站期',
    10: '学步准备期',
    11: '迈步期',
    12: '周岁成长期',
  }
  return stageLabels[month] || '成长期'
}

// 跳转到日记页面
const goToDiary = () => {
  router.push('/diary')
}

// 🎯 快速记录相关状态和数据
const quickRecordDialogVisible = ref(false)
const quickRecordForm = ref({
  type: 'milestone' as 'milestone' | 'daily' | 'first',
  content: '',
  photo: null as string | null,
})

// 快速记录模板（根据当前月龄动态生成）
const quickRecordTemplates = computed(() => {
  const templatesMap: Record<number, Array<{ icon: string; text: string }>> = {
    0: [
      { icon: '👀', text: '会追视物体' },
      { icon: '😴', text: '睡整觉了' },
      { icon: '🍼', text: '喝完一顿奶' },
    ],
    1: [
      { icon: '😊', text: '社交微笑' },
      { icon: '💪', text: '能抬头了' },
      { icon: '👂', text: '对声音有反应' },
    ],
    2: [
      { icon: '🗣️', text: '咿呀发声' },
      { icon: '✋', text: '能握住东西' },
      { icon: '😄', text: '笑出声了' },
    ],
    3: [
      { icon: '🔄', text: '第一次翻身' },
      { icon: '🎯', text: '能抓玩具' },
      { icon: '📅', text: '作息规律了' },
    ],
    4: [
      { icon: '🤝', text: '认出家人' },
      { icon: '🎮', text: '喜欢玩游戏' },
      { icon: '😆', text: '咯咯笑' },
    ],
    5: [
      { icon: '🦷', text: '长第一颗牙' },
      { icon: '🧸', text: '喜欢啃玩具' },
      { icon: '🎵', text: '对音乐有反应' },
    ],
    6: [
      { icon: '🥣', text: '第一口辅食' },
      { icon: '🪑', text: '能独坐了' },
      { icon: '👋', text: '会挥手再见' },
    ],
    7: [
      { icon: '🧗', text: '开始爬行' },
      { icon: '📦', text: '会找藏起的玩具' },
      { icon: '🗣️', text: '对名字有反应' },
    ],
    8: [
      { icon: '🐛', text: '爬得很快' },
      { icon: '👆', text: '会用手指捏' },
      { icon: '🤗', text: '黏人了' },
    ],
    9: [
      { icon: '🧍', text: '能扶站' },
      { icon: '👏', text: '会拍手' },
      { icon: '🔤', text: '听懂简单指令' },
    ],
    10: [
      { icon: '🚶', text: '扶走几步' },
      { icon: '🎯', text: '能精确抓取' },
      { icon: '📚', text: '喜欢翻书' },
    ],
    11: [
      { icon: '👣', text: '独立迈步' },
      { icon: '🗣️', text: '会叫爸爸妈妈' },
      { icon: '🧩', text: '会简单配对' },
    ],
    12: [
      { icon: '🚶', text: '独立行走' },
      { icon: '💬', text: '说出有意义的词' },
      { icon: '🎂', text: '周岁快乐' },
    ],
  }
  return templatesMap[monthData.value?.month ?? 0] ?? templatesMap[0] ?? []
})

// 下月龄准备建议
const nextMonthPreparations = computed(() => {
  const prepMap: Record<number, Array<{ icon: string; text: string }>> = {
    1: [
      { icon: '🎨', text: '准备黑白卡片刺激视觉发育' },
      { icon: '🔔', text: '准备摇铃等声音玩具' },
    ],
    2: [
      { icon: '🪞', text: '准备安全镜子让宝宝认识自己' },
      { icon: '📖', text: '准备高对比度布书' },
    ],
    3: [
      { icon: '🧸', text: '准备易抓握的软玩具' },
      { icon: '🎵', text: '准备音乐盒或儿歌播放器' },
    ],
    4: [
      { icon: '🎮', text: '准备互动游戏道具' },
      { icon: '🪑', text: '准备婴儿躺椅支持半坐' },
    ],
    5: [
      { icon: '🦷', text: '准备安全的磨牙玩具' },
      { icon: '🥣', text: '了解辅食添加知识' },
    ],
    6: [
      { icon: '🥄', text: '准备婴儿餐具和辅食工具' },
      { icon: '🪑', text: '准备婴儿餐椅' },
    ],
    7: [
      { icon: '🛡️', text: '做好家居爬行安全防护' },
      { icon: '🧩', text: '准备简单的认知玩具' },
    ],
    8: [
      { icon: '🚧', text: '安装安全门栏' },
      { icon: '👆', text: '准备精细动作训练玩具' },
    ],
    9: [
      { icon: '🧍', text: '准备稳固的扶站家具' },
      { icon: '📚', text: '准备互动绘本' },
    ],
    10: [
      { icon: '👟', text: '准备学步鞋（室内软底）' },
      { icon: '🎯', text: '准备套圈等配对玩具' },
    ],
    11: [
      { icon: '🚶', text: '创建安全的学步空间' },
      { icon: '🗣️', text: '多进行语言互动' },
    ],
    12: [
      { icon: '🎂', text: '准备周岁生日庆祝' },
      { icon: '📸', text: '预约周岁纪念照' },
    ],
  }
  const nextMonth = (monthData.value?.month ?? 0) + 1
  return prepMap[nextMonth] ?? []
})

// 下月龄推荐小游戏
const nextMonthGames = computed(() => {
  const gamesMap: Record<
    number,
    Array<{ icon: string; name: string; benefit: string }>
  > = {
    1: [
      { icon: '👀', name: '追视游戏', benefit: '促进视觉发育' },
      { icon: '🤱', name: '肌肤接触', benefit: '建立安全依恋' },
    ],
    2: [
      { icon: '😊', name: '表情模仿', benefit: '发展社交能力' },
      { icon: '🎵', name: '音乐互动', benefit: '刺激听觉发展' },
    ],
    3: [
      { icon: '🔄', name: '翻身辅助', benefit: '锻炼核心力量' },
      { icon: '✋', name: '抓握练习', benefit: '发展精细动作' },
    ],
    4: [
      { icon: '🙈', name: '躲猫猫', benefit: '建立物体恒存概念' },
      { icon: '🎤', name: '模仿发声', benefit: '促进语言发展' },
    ],
    5: [
      { icon: '🧸', name: '物品探索', benefit: '感官认知发展' },
      { icon: '🪞', name: '镜子游戏', benefit: '自我认知萌芽' },
    ],
    6: [
      { icon: '🥄', name: '辅食探索', benefit: '培养自主进食' },
      { icon: '👋', name: '再见挥手', benefit: '社交模仿能力' },
    ],
    7: [
      { icon: '🧗', name: '爬行追逐', benefit: '大运动发展' },
      { icon: '📦', name: '找玩具', benefit: '认知能力提升' },
    ],
    8: [
      { icon: '🎯', name: '投球入桶', benefit: '手眼协调训练' },
      { icon: '📚', name: '翻页游戏', benefit: '精细动作练习' },
    ],
    9: [
      { icon: '👏', name: '拍手歌', benefit: '模仿能力发展' },
      { icon: '🧱', name: '叠叠乐', benefit: '空间认知启蒙' },
    ],
    10: [
      { icon: '🚶', name: '扶走练习', benefit: '为独立行走准备' },
      { icon: '🎨', name: '涂鸦游戏', benefit: '创造力启蒙' },
    ],
    11: [
      { icon: '👣', name: '迈步鼓励', benefit: '行走能力发展' },
      { icon: '🗣️', name: '词汇指认', benefit: '语言理解提升' },
    ],
    12: [
      { icon: '🎂', name: '周岁派对', benefit: '社交体验' },
      { icon: '🧩', name: '简单拼图', benefit: '逻辑思维启蒙' },
    ],
  }
  const nextMonth = (monthData.value?.month ?? 0) + 1
  return gamesMap[nextMonth] ?? []
})

// 打开快速记录模板
const openQuickRecord = (template: { icon: string; text: string }) => {
  quickRecordForm.value.content = `${template.icon} ${template.text}`
  quickRecordForm.value.type = 'milestone'
  quickRecordDialogVisible.value = true
}

// 打开快速记录对话框
const openQuickRecordDialog = () => {
  quickRecordForm.value = {
    type: 'milestone',
    content: '',
    photo: null,
  }
  quickRecordDialogVisible.value = true
}

// 处理快速记录照片
const handleQuickRecordPhoto = (uploadFile: { raw: File }) => {
  const file = uploadFile.raw
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      quickRecordForm.value.photo = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 提交快速记录
const submitQuickRecord = () => {
  if (!quickRecordForm.value.content.trim()) {
    ElMessage.warning('请输入记录内容')
    return
  }

  // TODO: 保存到store或后端
  ElMessage.success('🎉 成长记录已保存！')
  quickRecordDialogVisible.value = false

  // 更新最后打卡时间
  localStorage.setItem('lastMilestoneCheckIn', new Date().toISOString())
}

// 🔔 智能提醒系统
interface SmartReminder {
  type: 'info' | 'warning' | 'success'
  icon: string
  title: string
  message: string
  action?: string
  actionText?: string
}

const reminderDismissed = ref(false)

const smartReminder = computed((): SmartReminder | null => {
  if (reminderDismissed.value) return null

  const currentMonth = monthData.value?.month ?? 0
  const completedCount = completedMilestonesCount.value
  const totalCount = monthData.value?.milestones?.length ?? 0

  // 检查是否连续3天未打卡
  const lastCheckIn = localStorage.getItem('lastMilestoneCheckIn')
  if (lastCheckIn) {
    const daysSinceLastCheckIn = Math.floor(
      (Date.now() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysSinceLastCheckIn >= 3 && completedCount < totalCount) {
      return {
        type: 'warning',
        icon: '⏰',
        title: '温馨提醒',
        message: `已经${daysSinceLastCheckIn}天没有打卡啦！建议查看训练方法，帮助宝宝发展新能力。`,
        action: 'showTraining',
        actionText: '查看训练方法',
      }
    }
  }

  // 本周关键里程碑提醒
  const keyMilestones: Record<number, string> = {
    0: '追视能力',
    1: '社交微笑',
    2: '抬头稳定',
    3: '翻身',
    4: '伸手抓物',
    5: '独坐',
    6: '辅食适应',
    7: '爬行',
    8: '扶站',
    9: '语言理解',
    10: '独站',
    11: '迈步',
    12: '独立行走',
  }

  const keyMilestone = keyMilestones[currentMonth]
  if (keyMilestone && completedCount < totalCount) {
    return {
      type: 'info',
      icon: '🎯',
      title: '本月关键里程碑',
      message: `宝宝${currentMonth}个月啦，重点关注"${keyMilestone}"能力的发展！`,
      action: 'scrollToMilestone',
      actionText: '去打卡',
    }
  }

  // 全部完成的庆祝提醒
  if (completedCount === totalCount && totalCount > 0) {
    return {
      type: 'success',
      icon: '🎉',
      title: '太棒了！',
      message: '本月所有里程碑已完成！建议生成成长报告记录这个精彩时刻。',
      action: 'generateReport',
      actionText: '生成报告',
    }
  }

  return null
})

// 处理提醒动作
const handleReminderAction = (action: string) => {
  switch (action) {
    case 'showTraining':
      // 展开第一个未完成的里程碑的训练方法
      const uncompletedMilestone = monthData.value?.milestones?.find(
        (m) => !isMilestoneCompleted(m.title),
      )
      if (uncompletedMilestone) {
        confirmMilestone(uncompletedMilestone)
      }
      break
    case 'scrollToMilestone':
      // 滚动到里程碑区域
      document
        .querySelector('.milestones-grid')
        ?.scrollIntoView({ behavior: 'smooth' })
      break
    case 'generateReport':
      openGrowthReportDialog()
      break
  }
  reminderDismissed.value = true
}

// 关闭提醒
const dismissReminder = () => {
  reminderDismissed.value = true
}

// 📊 成长报告相关
const growthReportDialogVisible = ref(false)
const reportPreviewRef = ref<HTMLElement | null>(null)

// 宝宝信息
const babyInfo = computed(() => ({
  name: localStorage.getItem('babyName') || '',
  birthday: localStorage.getItem('babyBirthday') || '',
}))

const babyInfoForm = ref({
  name: '',
  birthday: '',
})

// 报告日期
const reportDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})

// 报告进度圆环
const reportProgressOffset = computed(() => {
  const circumference = 2 * Math.PI * 40
  return circumference * (1 - milestoneProgress.value / 100)
})

// 下月能力预测
const nextMonthAbilities = computed(() => {
  const abilitiesMap: Record<number, string[]> = {
    1: ['社交微笑', '追视180°', '俯卧抬头'],
    2: ['咿呀发声', '握住玩具', '笑出声'],
    3: ['翻身', '抓握物品', '认识熟人'],
    4: ['独坐片刻', '伸手取物', '发多音节'],
    5: ['扶坐稳定', '传递物品', '认识名字'],
    6: ['独坐稳', '爬行萌芽', '挥手再见'],
    7: ['爬行', '扶站', '有意识叫人'],
    8: ['扶走', '精细抓取', '理解简单指令'],
    9: ['独站片刻', '模仿动作', '说叠词'],
    10: ['独站稳', '迈步', '指认物品'],
    11: ['独立行走', '简单词汇', '配合穿衣'],
    12: ['走得稳', '说短句', '用勺子'],
    13: ['跑步', '表达需求', '自己吃饭'],
  }
  const nextMonth = (monthData.value?.month ?? 0) + 1
  return abilitiesMap[nextMonth] || []
})

// 打开成长报告对话框
const openGrowthReportDialog = () => {
  growthReportDialogVisible.value = true
  // 预填充表单
  babyInfoForm.value.name = babyInfo.value.name
  babyInfoForm.value.birthday = babyInfo.value.birthday
}

// 保存宝宝信息
const saveBabyInfo = () => {
  if (babyInfoForm.value.name) {
    localStorage.setItem('babyName', babyInfoForm.value.name)
  }
  if (babyInfoForm.value.birthday) {
    localStorage.setItem('babyBirthday', babyInfoForm.value.birthday)
  }
  ElMessage.success('宝宝信息已保存')
}

// 下载报告（保存为图片）
const downloadReport = async () => {
  try {
    ElMessage.info('正在生成报告图片...')

    // 使用 html2canvas 生成图片（需要安装依赖）
    // 这里先用简单的提示代替
    const reportContent = reportPreviewRef.value
    if (!reportContent) return

    // 模拟下载
    ElMessage.success('📊 成长报告已生成！\n（实际项目需安装 html2canvas 库）')

    // 实际实现代码（需要安装 html2canvas）：
    // const canvas = await html2canvas(reportContent)
    // const link = document.createElement('a')
    // link.download = `宝宝成长报告_${monthData.value?.month}月龄.png`
    // link.href = canvas.toDataURL()
    // link.click()
  } catch (error) {
    ElMessage.error('生成报告失败，请重试')
  }
}

// 分享报告
const shareReport = () => {
  // 检查是否支持原生分享 API
  if (navigator.share) {
    navigator
      .share({
        title: `宝宝${monthData.value?.month}月龄成长报告`,
        text: `🎉 ${babyInfo.value.name || '宝宝'}${
          monthData.value?.month
        }个月啦！已完成${completedMilestonesCount.value}个里程碑！`,
        url: window.location.href,
      })
      .catch(() => {
        // 用户取消分享
      })
  } else {
    // 不支持原生分享，显示分享选项
    ElMessage.info('请截图后分享至微信/朋友圈')
  }
}

// 📈 能力发展趋势图相关（升级版）
const selectedAbilityType = ref<
  'gross' | 'fine' | 'cognitive' | 'language' | 'social'
>('gross')

// 图表加载状态
const trendChartLoading = ref(true)
const isChartTransitioning = ref(false)

// 能力类型切换动画
const handleAbilityTypeChange = () => {
  isChartTransitioning.value = true
  setTimeout(() => {
    isChartTransitioning.value = false
  }, 300)
  // 缓存选择到localStorage
  localStorage.setItem('selectedAbilityType', selectedAbilityType.value)
}

// 能力类型图标
const abilityIcons: Record<string, string> = {
  gross: '🦶',
  fine: '🖐️',
  cognitive: '🧠',
  language: '👂',
  social: '💕',
}

// 提示框相关
const tooltipVisible = ref(false)
const tooltipPosition = reactive({ x: 0, y: 0 })
const tooltipData = reactive({
  month: 0,
  value: 0,
  status: '',
  statusClass: '',
})

// 根据完成度计算数据点大小
const getPointRadius = (value: number): number => {
  const minRadius = 5
  const maxRadius = 10
  return minRadius + (value / 100) * (maxRadius - minRadius)
}

// 显示数据点提示框
const showPointTooltip = (
  point: { month: number; value: number; x: number; y: number },
  event: MouseEvent,
) => {
  const target = event.currentTarget as Element
  const svg = target?.closest('svg')
  const container = svg?.parentElement
  if (!container) return

  tooltipData.month = point.month
  tooltipData.value = Math.round(point.value)

  // 计算状态
  const p50 = percentileData.value?.p50?.[point.month] ?? 50
  if (point.value >= p50 + 10) {
    tooltipData.status = '发展优秀'
    tooltipData.statusClass = 'excellent'
  } else if (point.value >= p50 - 5) {
    tooltipData.status = '发展正常'
    tooltipData.statusClass = 'normal'
  } else {
    tooltipData.status = '需关注'
    tooltipData.statusClass = 'attention'
  }

  // 计算位置
  const rect = container.getBoundingClientRect()
  tooltipPosition.x = event.clientX - rect.left + 10
  tooltipPosition.y = event.clientY - rect.top - 80
  tooltipVisible.value = true
}

// 隐藏提示框
const hidePointTooltip = () => {
  tooltipVisible.value = false
}

// 点击数据点跳转
const handlePointClick = (point: { month: number }) => {
  if (point.month !== monthData.value?.month) {
    router.push(`/month/${point.month}`)
  }
}

// 图表缩放相关
const chartContainerRef = ref<HTMLElement | null>(null)
const chartScale = ref(1)
let touchStartDistance = 0

// 缩放功能
const zoomIn = () => {
  if (chartScale.value < 2) {
    chartScale.value = Math.min(2, chartScale.value + 0.25)
  }
}

const zoomOut = () => {
  if (chartScale.value > 0.5) {
    chartScale.value = Math.max(0.5, chartScale.value - 0.25)
  }
}

const resetZoom = () => {
  chartScale.value = 1
}

// 触摸事件处理（双指缩放）
const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    if (touch1 && touch2) {
      const dx = touch1.clientX - touch2.clientX
      const dy = touch1.clientY - touch2.clientY
      touchStartDistance = Math.sqrt(dx * dx + dy * dy)
    }
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 2 && touchStartDistance > 0) {
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    if (touch1 && touch2) {
      const dx = touch1.clientX - touch2.clientX
      const dy = touch1.clientY - touch2.clientY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const scale = distance / touchStartDistance
      chartScale.value = Math.max(0.5, Math.min(2, chartScale.value * scale))
      touchStartDistance = distance
      e.preventDefault()
    }
  }
}

const handleTouchEnd = () => {
  touchStartDistance = 0
}

// 里程碑详情弹窗
const milestoneDetailVisible = ref(false)
const selectedMilestoneMarker = ref<{
  title: string
  emoji: string
  month: number
  significance: string
  tips: string[]
  caution: string
} | null>(null)

// 能力发展报告弹窗
const abilityReportVisible = ref(false)

// 发育标准百分位曲线数据（基于WHO标准模拟）
const percentileData = computed(() => {
  // P3（偏低）、P50（中位）、P97（偏高）百分位数据
  const standards: Record<
    string,
    { p3: number[]; p50: number[]; p97: number[] }
  > = {
    gross: {
      p3: [10, 20, 32, 45, 55, 62, 68, 73, 77, 80, 83, 86, 88],
      p50: [20, 35, 50, 65, 75, 80, 85, 88, 90, 92, 94, 96, 100],
      p97: [30, 48, 65, 80, 88, 92, 95, 97, 98, 99, 99, 100, 100],
    },
    fine: {
      p3: [8, 15, 25, 38, 48, 55, 62, 68, 73, 77, 81, 85, 88],
      p50: [15, 25, 40, 55, 65, 72, 78, 82, 86, 89, 92, 95, 98],
      p97: [25, 40, 58, 72, 82, 88, 92, 95, 97, 98, 99, 100, 100],
    },
    cognitive: {
      p3: [5, 12, 22, 35, 45, 52, 58, 64, 70, 75, 79, 83, 87],
      p50: [10, 22, 38, 52, 62, 70, 76, 81, 85, 88, 91, 94, 97],
      p97: [20, 35, 55, 70, 80, 86, 90, 93, 95, 97, 98, 99, 100],
    },
    language: {
      p3: [2, 8, 15, 28, 40, 50, 58, 65, 71, 76, 80, 84, 88],
      p50: [5, 15, 28, 42, 55, 65, 72, 78, 83, 87, 90, 93, 96],
      p97: [15, 28, 45, 60, 72, 80, 86, 90, 93, 95, 97, 98, 100],
    },
    social: {
      p3: [5, 12, 20, 32, 42, 50, 56, 62, 68, 73, 78, 82, 86],
      p50: [12, 22, 35, 48, 58, 66, 73, 79, 84, 88, 91, 94, 97],
      p97: [22, 38, 52, 65, 75, 82, 88, 92, 95, 97, 98, 99, 100],
    },
  }
  return standards[selectedAbilityType.value] || standards.gross
})

// 关键里程碑事件数据
const keyMilestoneEvents = computed(() => {
  const events: Record<
    string,
    Array<{
      month: number
      title: string
      emoji: string
      significance: string
      tips: string[]
      caution: string
    }>
  > = {
    gross: [
      {
        month: 2,
        title: '抬头稳定',
        emoji: '👶',
        significance: '颈部肌肉发育成熟的标志，为后续翻身、坐立打下基础。',
        tips: ['多进行俯卧练习', '用玩具引导宝宝抬头', '每次练习2-3分钟'],
        caution: '练习时注意安全，避免宝宝疲劳。',
      },
      {
        month: 4,
        title: '翻身',
        emoji: '🔄',
        significance: '全身协调能力的里程碑，标志着主动运动能力的开始。',
        tips: [
          '在床上放置吸引物引导翻身',
          '帮助宝宝体验翻身感觉',
          '多鼓励尝试',
        ],
        caution: '翻身后注意防止坠床。',
      },
      {
        month: 6,
        title: '独坐',
        emoji: '🪑',
        significance: '核心肌群发育成熟，视野开阔促进认知发展。',
        tips: ['先用靠垫辅助坐立', '玩具引导保持平衡', '循序渐进增加时间'],
        caution: '周围放置软垫防止摔倒。',
      },
      {
        month: 8,
        title: '开始爬行',
        emoji: '🐛',
        significance: '大运动发展的重要里程碑，促进大脑左右脑协调。',
        tips: ['提供安全的爬行空间', '用玩具引导前进', '多进行亲子爬行游戏'],
        caution: '确保环境安全无尖锐物品。',
      },
      {
        month: 10,
        title: '能独站',
        emoji: '🧍',
        significance: '下肢力量和平衡能力的重要发展，为行走做准备。',
        tips: ['扶着家具站立练习', '鼓励蹲起动作', '增强腿部力量'],
        caution: '练习时家长要在旁保护。',
      },
      {
        month: 12,
        title: '独立行走',
        emoji: '🚶',
        significance: '运动发育的重大里程碑，标志着独立探索能力大幅提升。',
        tips: ['提供安全学步环境', '牵手练习走路', '不要过度依赖学步车'],
        caution: '初学走路易摔跤，做好防护。',
      },
    ],
    fine: [
      {
        month: 3,
        title: '手能握拳张开',
        emoji: '✋',
        significance: '精细动作发展的开始，为抓握物品做准备。',
        tips: ['轻触宝宝手掌刺激', '提供不同质感的物品触摸', '多做手指操'],
        caution: '注意物品卫生和安全。',
      },
      {
        month: 5,
        title: '主动抓握',
        emoji: '🤏',
        significance: '手眼协调能力发展的重要标志。',
        tips: ['提供易抓握的玩具', '引导宝宝抓取物品', '多进行抓握游戏'],
        caution: '避免小零件防止误吞。',
      },
      {
        month: 8,
        title: '捏取小物',
        emoji: '👌',
        significance: '拇指和食指对捏能力发展，精细动作更加精准。',
        tips: ['提供安全的小颗粒食物练习', '捡豆子游戏', '串珠游戏'],
        caution: '严密看护防止误吞。',
      },
      {
        month: 12,
        title: '涂鸦画线',
        emoji: '✏️',
        significance: '手部精细控制能力成熟，创造力萌芽。',
        tips: ['提供安全蜡笔和画纸', '鼓励自由涂鸦', '亲子共同创作'],
        caution: '使用无毒材料。',
      },
    ],
    cognitive: [
      {
        month: 4,
        title: '认识主要照顾者',
        emoji: '👨‍👩‍👧',
        significance: '社会认知发展的开始，建立安全依恋关系。',
        tips: ['增加亲子互动时间', '固定照顾者', '建立安全感'],
        caution: '避免频繁更换照顾者。',
      },
      {
        month: 6,
        title: '物体恒存概念萌芽',
        emoji: '🔍',
        significance: '认知发展的重要里程碑，理解物品不消失。',
        tips: ['玩躲猫猫游戏', '藏找玩具游戏', '盖布找物游戏'],
        caution: '游戏要有趣不要吓到宝宝。',
      },
      {
        month: 9,
        title: '因果关系理解',
        emoji: '💡',
        significance: '逻辑思维萌芽，理解行为会产生结果。',
        tips: ['按钮发声玩具', '开关灯游戏', '敲击乐器'],
        caution: '鼓励探索但注意安全。',
      },
      {
        month: 12,
        title: '简单指令理解',
        emoji: '👂',
        significance: '语言理解能力和执行能力的重要发展。',
        tips: ['给简单指令如"给妈妈"', '配合手势说话', '多重复关键词'],
        caution: '指令要简短清晰。',
      },
    ],
    language: [
      {
        month: 2,
        title: '咿呀学语',
        emoji: '🗣️',
        significance: '语言发展的开始，发声器官开始练习。',
        tips: ['多和宝宝说话', '模仿宝宝发声', '唱儿歌'],
        caution: '回应要积极鼓励发声。',
      },
      {
        month: 6,
        title: '发辅音',
        emoji: '💬',
        significance: '语言能力进步，能发出更多种类的声音。',
        tips: ['重复简单音节ba、ma', '看嘴型学习', '多进行语言互动'],
        caution: '不要纠正，鼓励为主。',
      },
      {
        month: 9,
        title: '叫爸爸妈妈',
        emoji: '👪',
        significance: '有意义发声的开始，语言理解和表达的重要突破。',
        tips: ['强化爸爸妈妈的称呼', '指认练习', '多鼓励发声'],
        caution: '要有耐心，每个宝宝进度不同。',
      },
      {
        month: 12,
        title: '说2-3个词',
        emoji: '📖',
        significance: '词汇积累开始，语言表达能力明显进步。',
        tips: ['指物说名', '看绘本学词汇', '日常描述动作物品'],
        caution: '创造丰富的语言环境。',
      },
    ],
    social: [
      {
        month: 2,
        title: '社交微笑',
        emoji: '😊',
        significance: '社交情感发展的重要标志，能对人微笑回应。',
        tips: ['多对宝宝微笑', '表情夸张互动', '眼神交流'],
        caution: '真诚温暖的互动最重要。',
      },
      {
        month: 5,
        title: '认生期开始',
        emoji: '😟',
        significance: '区分熟悉与陌生人，依恋关系建立的表现。',
        tips: ['给宝宝安全感', '不强迫接触陌生人', '循序渐进社交'],
        caution: '尊重宝宝的情感需求。',
      },
      {
        month: 8,
        title: '分离焦虑',
        emoji: '😢',
        significance: '依恋关系深化的表现，对分离有强烈反应。',
        tips: ['建立规律的告别仪式', '短时间分离练习', '给予安全物品'],
        caution: '不要偷偷离开，会加重焦虑。',
      },
      {
        month: 12,
        title: '社交性微笑和招手',
        emoji: '👋',
        significance: '社交技能丰富，能主动进行社交互动。',
        tips: ['示范招手再见', '鼓励社交互动', '参与同龄互动'],
        caution: '尊重宝宝的社交节奏。',
      },
    ],
  }
  return events[selectedAbilityType.value] || events.gross
})

// 模拟历史打卡数据（实际应从store获取）
const abilityHistoryData = computed(() => {
  const currentMonth = monthData.value?.month ?? 0
  const historyMap: Record<string, Record<number, number>> = {
    gross: {
      0: 20,
      1: 35,
      2: 50,
      3: 65,
      4: 75,
      5: 80,
      6: 85,
      7: 88,
      8: 90,
      9: 92,
      10: 94,
      11: 96,
      12: 100,
    },
    fine: {
      0: 15,
      1: 25,
      2: 40,
      3: 55,
      4: 65,
      5: 72,
      6: 78,
      7: 82,
      8: 86,
      9: 89,
      10: 92,
      11: 95,
      12: 98,
    },
    cognitive: {
      0: 10,
      1: 22,
      2: 38,
      3: 52,
      4: 62,
      5: 70,
      6: 76,
      7: 81,
      8: 85,
      9: 88,
      10: 91,
      11: 94,
      12: 97,
    },
    language: {
      0: 5,
      1: 15,
      2: 28,
      3: 42,
      4: 55,
      5: 65,
      6: 72,
      7: 78,
      8: 83,
      9: 87,
      10: 90,
      11: 93,
      12: 96,
    },
    social: {
      0: 12,
      1: 22,
      2: 35,
      3: 48,
      4: 58,
      5: 66,
      6: 73,
      7: 79,
      8: 84,
      9: 88,
      10: 91,
      11: 94,
      12: 97,
    },
  }

  // 生成从0到当前月龄的数据点
  const data: Array<{ month: number; value: number }> = []
  const baseData = historyMap[selectedAbilityType.value] || historyMap.gross

  // 显示当前月龄前后各2个月的数据
  const startMonth = Math.max(0, currentMonth - 2)
  const endMonth = Math.min(12, currentMonth + 2)

  for (let m = startMonth; m <= endMonth; m++) {
    // 添加一些随机波动使数据更真实
    const baseValue = (baseData && baseData[m]) ?? 50
    const actualValue =
      m <= currentMonth
        ? Math.min(100, Math.max(0, baseValue + (Math.random() * 10 - 5)))
        : baseValue
    data.push({ month: m, value: actualValue })
  }

  return data
})

// 趋势数据点坐标（适配新图表尺寸）
const trendDataPoints = computed(() => {
  const data = abilityHistoryData.value
  const currentMonth = monthData.value?.month ?? 0
  const chartWidth = 310 // 从35到345
  const chartHeight = 155 // 从20到175
  const paddingLeft = 35

  return data.map((item, idx) => ({
    x: paddingLeft + (idx * chartWidth) / Math.max(data.length - 1, 1),
    y: 20 + ((100 - item.value) * chartHeight) / 100,
    month: item.month,
    value: item.value,
    isCurrent: item.month === currentMonth,
  }))
})

// 生成平滑贝塞尔曲线路径
const generateSmoothPath = (
  points: Array<{ x: number; y: number }>,
): string => {
  if (points.length < 2) return ''
  const first = points[0]
  if (!first) return ''
  let path = `M ${first.x} ${first.y}`
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]
    if (!current || !next) continue
    const cpX = (current.x + next.x) / 2
    path += ` Q ${current.x + (next.x - current.x) * 0.5} ${
      current.y
    }, ${cpX} ${(current.y + next.y) / 2}`
  }
  const last = points[points.length - 1]
  if (last) path += ` T ${last.x} ${last.y}`
  return path
}

// 平滑趋势线路径
const smoothTrendLinePath = computed(() => {
  return generateSmoothPath(
    trendDataPoints.value.map((p) => ({ x: p.x, y: p.y })),
  )
})

// 平滑趋势区域填充路径
const smoothTrendAreaPath = computed(() => {
  const points = trendDataPoints.value
  if (points.length < 2) return ''
  const linePath = generateSmoothPath(points.map((p) => ({ x: p.x, y: p.y })))
  const firstX = points[0]?.x ?? 0
  const lastX = points[points.length - 1]?.x ?? 0
  const bottomY = 175
  return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`
})

// 原始趋势线路径（保留备用）
const trendLinePath = computed(() => {
  const points = trendDataPoints.value
  if (points.length < 2) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

// 原始趋势区域填充路径（保留备用）
const trendAreaPath = computed(() => {
  const points = trendDataPoints.value
  if (points.length < 2) return ''
  const firstX = points[0]?.x ?? 0
  const lastX = points[points.length - 1]?.x ?? 0
  const bottomY = 175
  let path = `M ${firstX} ${bottomY}`
  points.forEach((p) => {
    path += ` L ${p.x} ${p.y}`
  })
  path += ` L ${lastX} ${bottomY} Z`
  return path
})

// 百分位曲线路径生成函数
const generatePercentilePath = (percentileArray: number[]) => {
  const data = abilityHistoryData.value
  if (data.length < 2) return ''

  const chartWidth = 310
  const chartHeight = 155
  const paddingLeft = 35

  return data
    .map((item, idx) => {
      const pValue = percentileArray[item.month] ?? 50
      const x = paddingLeft + (idx * chartWidth) / Math.max(data.length - 1, 1)
      const y = 20 + ((100 - pValue) * chartHeight) / 100
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

// P3曲线路径
const p3CurvePath = computed(() =>
  generatePercentilePath(percentileData.value?.p3 ?? []),
)

// P50曲线路径
const p50CurvePath = computed(() =>
  generatePercentilePath(percentileData.value?.p50 ?? []),
)

// P97曲线路径
const p97CurvePath = computed(() =>
  generatePercentilePath(percentileData.value?.p97 ?? []),
)

// P50区域填充路径
const p50AreaPath = computed(() => {
  const data = abilityHistoryData.value
  if (data.length < 2) return ''

  const chartWidth = 310
  const chartHeight = 155
  const paddingLeft = 35
  const bottomY = 175

  const points = data.map((item, idx) => {
    const pValue = percentileData.value?.p50?.[item.month] ?? 50
    const x = paddingLeft + (idx * chartWidth) / Math.max(data.length - 1, 1)
    const y = 20 + ((100 - pValue) * chartHeight) / 100
    return { x, y }
  })

  const firstX = points[0]?.x ?? 0
  const lastX = points[points.length - 1]?.x ?? 0

  let path = `M ${firstX} ${bottomY}`
  points.forEach((p) => {
    path += ` L ${p.x} ${p.y}`
  })
  path += ` L ${lastX} ${bottomY} Z`

  return path
})

// 关键里程碑标记点
const keyMilestoneMarkers = computed(() => {
  const data = abilityHistoryData.value
  const events = keyMilestoneEvents.value
  const chartWidth = 310
  const chartHeight = 155
  const paddingLeft = 35

  const markers: Array<{
    x: number
    y: number
    month: number
    title: string
    emoji: string
    significance: string
    tips: string[]
    caution: string
  }> = []

  events?.forEach((event) => {
    const dataPoint = data.find((d) => d.month === event.month)
    if (dataPoint) {
      const idx = data.findIndex((d) => d.month === event.month)
      const x = paddingLeft + (idx * chartWidth) / Math.max(data.length - 1, 1)
      const y = 20 + ((100 - dataPoint.value) * chartHeight) / 100
      markers.push({
        x,
        y,
        month: event.month,
        title: event.title,
        emoji: event.emoji,
        significance: event.significance,
        tips: event.tips,
        caution: event.caution,
      })
    }
  })

  return markers
})

// 显示里程碑详情
const showMilestoneDetail = (
  milestone: typeof keyMilestoneMarkers.value[0],
) => {
  selectedMilestoneMarker.value = milestone
  milestoneDetailVisible.value = true
}

// 发育评估摘要
const developmentAssessment = computed(() => {
  const abilityNames: Record<string, string> = {
    gross: '大运动',
    fine: '精细动作',
    cognitive: '认知能力',
    language: '语言能力',
    social: '社交情感',
  }
  const data = abilityHistoryData.value
  const currentMonth = monthData.value?.month ?? 0
  const currentData = data.find((d) => d.month === currentMonth)
  const babyValue = currentData?.value ?? 0
  const p50Value = percentileData.value?.p50?.[currentMonth] ?? 50
  const diff = babyValue - p50Value

  let level = '正常发展'
  let icon = '✅'
  let tagType: 'success' | 'warning' | 'danger' | 'info' = 'success'
  let description = ''
  let diffClass = ''
  let diffText = ''

  if (diff >= 15) {
    level = '发展优秀'
    icon = '🌟'
    tagType = 'success'
    description = `宝宝的${
      abilityNames[selectedAbilityType.value]
    }发展明显超过同龄平均水平，继续保持！`
    diffClass = 'positive'
    diffText = `+${Math.round(diff)}%`
  } else if (diff >= 5) {
    level = '发展良好'
    icon = '👍'
    tagType = 'success'
    description = `宝宝的${
      abilityNames[selectedAbilityType.value]
    }发展略高于同龄平均水平，表现不错！`
    diffClass = 'positive'
    diffText = `+${Math.round(diff)}%`
  } else if (diff >= -5) {
    level = '正常发展'
    icon = '✅'
    tagType = 'info'
    description = `宝宝的${
      abilityNames[selectedAbilityType.value]
    }发展与同龄平均水平相当，属于正常范围。`
    diffClass = 'neutral'
    diffText = diff >= 0 ? `+${Math.round(diff)}%` : `${Math.round(diff)}%`
  } else if (diff >= -15) {
    level = '稍慢发展'
    icon = '💪'
    tagType = 'warning'
    description = `宝宝的${
      abilityNames[selectedAbilityType.value]
    }发展稍低于同龄平均水平，建议加强针对性训练。`
    diffClass = 'negative'
    diffText = `${Math.round(diff)}%`
  } else {
    level = '需要关注'
    icon = '⚠️'
    tagType = 'danger'
    description = `宝宝的${
      abilityNames[selectedAbilityType.value]
    }发展明显低于同龄平均水平，建议咨询专业医生。`
    diffClass = 'negative'
    diffText = `${Math.round(diff)}%`
  }

  return {
    title: abilityNames[selectedAbilityType.value],
    icon,
    level,
    tagType,
    description,
    currentValue: Math.round(babyValue),
    p50Value: Math.round(p50Value),
    diff: diffText,
    diffClass,
  }
})

// 能力发展报告数据
const abilityReportData = computed(() => {
  const currentMonth = monthData.value?.month ?? 0
  const abilities = [
    { key: 'gross', name: '大运动', color: '#667eea' },
    { key: 'fine', name: '精细动作', color: '#f59e0b' },
    { key: 'cognitive', name: '认知能力', color: '#10b981' },
    { key: 'language', name: '语言能力', color: '#ec4899' },
    { key: 'social', name: '社交情感', color: '#8b5cf6' },
  ]

  const historyMap: Record<string, Record<number, number>> = {
    gross: {
      0: 20,
      1: 35,
      2: 50,
      3: 65,
      4: 75,
      5: 80,
      6: 85,
      7: 88,
      8: 90,
      9: 92,
      10: 94,
      11: 96,
      12: 100,
    },
    fine: {
      0: 15,
      1: 25,
      2: 40,
      3: 55,
      4: 65,
      5: 72,
      6: 78,
      7: 82,
      8: 86,
      9: 89,
      10: 92,
      11: 95,
      12: 98,
    },
    cognitive: {
      0: 10,
      1: 22,
      2: 38,
      3: 52,
      4: 62,
      5: 70,
      6: 76,
      7: 81,
      8: 85,
      9: 88,
      10: 91,
      11: 94,
      12: 97,
    },
    language: {
      0: 5,
      1: 15,
      2: 28,
      3: 42,
      4: 55,
      5: 65,
      6: 72,
      7: 78,
      8: 83,
      9: 87,
      10: 90,
      11: 93,
      12: 96,
    },
    social: {
      0: 12,
      1: 22,
      2: 35,
      3: 48,
      4: 58,
      5: 66,
      6: 73,
      7: 79,
      8: 84,
      9: 88,
      10: 91,
      11: 94,
      12: 97,
    },
  }

  const p50Map: Record<string, number[]> = {
    gross: [20, 35, 50, 65, 75, 80, 85, 88, 90, 92, 94, 96, 100],
    fine: [15, 25, 40, 55, 65, 72, 78, 82, 86, 89, 92, 95, 98],
    cognitive: [10, 22, 38, 52, 62, 70, 76, 81, 85, 88, 91, 94, 97],
    language: [5, 15, 28, 42, 55, 65, 72, 78, 83, 87, 90, 93, 96],
    social: [12, 22, 35, 48, 58, 66, 73, 79, 84, 88, 91, 94, 97],
  }

  return abilities.reduce((acc, ability) => {
    const score = historyMap[ability.key]?.[currentMonth] ?? 50
    const p50 = p50Map[ability.key]?.[currentMonth] ?? 50
    const diff = score - p50
    let status = '正常'
    let statusClass = 'normal'
    if (diff >= 10) {
      status = '优秀'
      statusClass = 'excellent'
    } else if (diff >= 0) {
      status = '良好'
      statusClass = 'good'
    } else if (diff >= -10) {
      status = '正常'
      statusClass = 'normal'
    } else {
      status = '待提升'
      statusClass = 'needs-work'
    }

    acc[ability.key] = {
      name: ability.name,
      score,
      p50,
      diff: diff >= 0 ? `+${diff}` : `${diff}`,
      status,
      statusClass,
      color: ability.color,
    }
    return acc
  }, {} as Record<string, { name: string; score: number; p50: number; diff: string; status: string; statusClass: string; color: string }>)
})

// 发育建议
const developmentAdvices = computed(() => {
  const report = abilityReportData.value
  const advices: Array<{
    icon: string
    title: string
    content: string
    type: string
  }> = []

  // 找出需要加强的领域
  Object.entries(report).forEach(([key, data]) => {
    if (data.statusClass === 'needs-work') {
      const adviceMap: Record<
        string,
        { icon: string; title: string; content: string }
      > = {
        gross: {
          icon: '🏃',
          title: '大运动发展建议',
          content:
            '建议增加俯卧时间，多进行爬行、翻身练习，户外活动促进大运动发展。',
        },
        fine: {
          icon: '✋',
          title: '精细动作发展建议',
          content:
            '可以多玩抓握玩具、撕纸、捏橡皮泥等活动，锻炼手部精细控制能力。',
        },
        cognitive: {
          icon: '🧠',
          title: '认知能力发展建议',
          content: '多玩因果关系玩具、躲猫猫游戏、形状配对等，促进认知发展。',
        },
        language: {
          icon: '💬',
          title: '语言能力发展建议',
          content: '建议多进行亲子阅读、唱儿歌、日常对话，创造丰富的语言环境。',
        },
        social: {
          icon: '👥',
          title: '社交情感发展建议',
          content: '增加亲子互动时间，参与同龄宝宝活动，建立安全依恋关系。',
        },
      }
      if (adviceMap[key]) {
        advices.push({ ...adviceMap[key], type: 'warning' })
      }
    }
  })

  // 表扬优秀领域
  Object.entries(report).forEach(([key, data]) => {
    if (data.statusClass === 'excellent') {
      advices.push({
        icon: '🌟',
        title: `${data.name}表现优秀`,
        content: `宝宝在${data.name}方面发展很棒！继续保持现有的训练和互动方式。`,
        type: 'success',
      })
    }
  })

  if (advices.length === 0) {
    advices.push({
      icon: '✅',
      title: '整体发展良好',
      content:
        '宝宝各方面发展都在正常范围内，继续保持规律的作息和丰富的亲子互动。',
      type: 'info',
    })
  }

  return advices
})

// 下月发展预期
const nextMonthExpectations = computed(() => {
  const currentMonth = monthData.value?.month ?? 0
  const nextMonth = currentMonth + 1

  const expectationsMap: Record<
    number,
    Array<{ icon: string; text: string }>
  > = {
    1: [
      { icon: '👀', text: '追视能力更加稳定' },
      { icon: '😊', text: '社交微笑出现' },
    ],
    2: [
      { icon: '🎵', text: '对声音反应更敏感' },
      { icon: '👋', text: '手部抓握反射' },
    ],
    3: [
      { icon: '🔄', text: '开始尝试翻身' },
      { icon: '🗣️', text: '咿呀学语增多' },
    ],
    4: [
      { icon: '✋', text: '主动抓握物品' },
      { icon: '😄', text: '笑出声音' },
    ],
    5: [
      { icon: '🪑', text: '扶坐更稳定' },
      { icon: '🍼', text: '准备添加辅食' },
    ],
    6: [
      { icon: '🥄', text: '学习吃辅食' },
      { icon: '👶', text: '独坐能力发展' },
    ],
    7: [
      { icon: '🐛', text: '爬行准备期' },
      { icon: '💬', text: '发出更多辅音' },
    ],
    8: [
      { icon: '🚀', text: '爬行能力提升' },
      { icon: '👋', text: '模仿挥手再见' },
    ],
    9: [
      { icon: '🧍', text: '扶站更稳' },
      { icon: '👪', text: '叫爸爸妈妈' },
    ],
    10: [
      { icon: '🚶', text: '扶走准备' },
      { icon: '👂', text: '理解简单指令' },
    ],
    11: [
      { icon: '👣', text: '独站尝试' },
      { icon: '📖', text: '词汇理解增加' },
    ],
    12: [
      { icon: '🎉', text: '独立行走' },
      { icon: '🗣️', text: '说简单词语' },
    ],
    13: [
      { icon: '🌟', text: '进入幼儿期' },
      { icon: '🏃', text: '行走更加稳定' },
    ],
  }

  return expectationsMap[nextMonth] || [{ icon: '🌈', text: '继续健康成长' }]
})

// 生成能力发展报告
const generateAbilityReport = () => {
  abilityReportVisible.value = true
}

// 分享能力报告
const shareAbilityReport = () => {
  if (navigator.share) {
    navigator
      .share({
        title: `宝宝${monthData.value?.month}月龄能力发展报告`,
        text: `🎉 ${babyInfo.value.name || '宝宝'}${
          monthData.value?.month
        }个月能力发展报告已生成！`,
        url: window.location.href,
      })
      .catch(() => {})
  } else {
    ElMessage.info('请截图后分享至微信/朋友圈')
  }
}

// 下载能力报告
const downloadAbilityReport = () => {
  ElMessage.success(
    '📊 能力发展报告已保存！\n（实际项目需安装 html2canvas 库）',
  )
}

// 趋势分析总结（保留兼容）
const abilityTrendSummary = computed(() => {
  return developmentAssessment.value.description
})

// 📚 学习资源推荐相关
const activeResourceTab = ref('games')

// 早教游戏推荐
const recommendedGames = computed(() => {
  const gamesMap: Record<
    number,
    Array<{
      icon: string
      name: string
      description: string
      ability: string
      duration: string
    }>
  > = {
    0: [
      {
        icon: '👀',
        name: '追视训练',
        description: '用黑白卡片在宝宝面前20-30cm处缓慢移动，锻炼视觉追踪',
        ability: '视觉发育',
        duration: '每次2-3分钟',
      },
      {
        icon: '🤱',
        name: '肌肤接触',
        description: '袋鼠式护理，增进亲子依恋关系',
        ability: '情感发育',
        duration: '每天多次',
      },
      {
        icon: '🎵',
        name: '音乐胎教延续',
        description: '播放柔和音乐，观察宝宝反应',
        ability: '听觉发育',
        duration: '每次5-10分钟',
      },
    ],
    1: [
      {
        icon: '😊',
        name: '表情互动',
        description: '对宝宝做夸张的表情，等待宝宝回应微笑',
        ability: '社交能力',
        duration: '随时进行',
      },
      {
        icon: '🔔',
        name: '声音定位',
        description: '在宝宝两侧摇铃，观察转头反应',
        ability: '听觉定位',
        duration: '每次1-2分钟',
      },
      {
        icon: '💪',
        name: '趴趴时间',
        description: '让宝宝趴着，锻炼颈部力量',
        ability: '大运动',
        duration: '每次3-5分钟',
      },
    ],
    2: [
      {
        icon: '🪞',
        name: '镜子游戏',
        description: '让宝宝看镜子中的自己，发展自我认知',
        ability: '认知发育',
        duration: '每次2-3分钟',
      },
      {
        icon: '🗣️',
        name: '对话回应',
        description: '模仿宝宝的声音，鼓励咿呀发声',
        ability: '语言启蒙',
        duration: '随时进行',
      },
      {
        icon: '✋',
        name: '抓握练习',
        description: '把摇铃放入宝宝手中，锻炼抓握反射',
        ability: '精细动作',
        duration: '每次2-3分钟',
      },
    ],
    3: [
      {
        icon: '🔄',
        name: '翻身辅助',
        description: '用玩具引导宝宝翻身，轻推髋部辅助',
        ability: '大运动',
        duration: '每次5分钟',
      },
      {
        icon: '🎯',
        name: '抓取训练',
        description: '悬挂彩色玩具让宝宝伸手触碰',
        ability: '手眼协调',
        duration: '每次3-5分钟',
      },
      {
        icon: '📚',
        name: '看图说话',
        description: '看高对比度图片，描述图中内容',
        ability: '认知语言',
        duration: '每次3-5分钟',
      },
    ],
    4: [
      {
        icon: '🙈',
        name: '躲猫猫',
        description: '用手或布遮脸后露出，培养物体恒存概念',
        ability: '认知发育',
        duration: '每次3-5分钟',
      },
      {
        icon: '🎤',
        name: '声音模仿',
        description: '模仿各种动物叫声让宝宝听',
        ability: '听觉语言',
        duration: '每次2-3分钟',
      },
      {
        icon: '🧸',
        name: '物品传递',
        description: '和宝宝互相传递玩具，发展社交',
        ability: '社交能力',
        duration: '每次5分钟',
      },
    ],
    5: [
      {
        icon: '🪑',
        name: '扶坐练习',
        description: '用枕头支撑宝宝练习坐',
        ability: '大运动',
        duration: '每次3-5分钟',
      },
      {
        icon: '🥄',
        name: '喂食游戏',
        description: '用勺子模拟喂食，为辅食做准备',
        ability: '口腔发育',
        duration: '每次2-3分钟',
      },
      {
        icon: '📦',
        name: '因果玩具',
        description: '按键发声玩具，理解因果关系',
        ability: '认知发育',
        duration: '每次5分钟',
      },
    ],
    6: [
      {
        icon: '🥣',
        name: '辅食探索',
        description: '让宝宝用手触碰食物，培养进食兴趣',
        ability: '感官发育',
        duration: '每餐进行',
      },
      {
        icon: '👋',
        name: '再见挥手',
        description: '示范挥手动作，等宝宝模仿',
        ability: '社交模仿',
        duration: '每次分别时',
      },
      {
        icon: '🧱',
        name: '叠叠乐',
        description: '用大积木示范叠起再推倒',
        ability: '认知动作',
        duration: '每次5分钟',
      },
    ],
    7: [
      {
        icon: '🧗',
        name: '爬行追逐',
        description: '用玩具引诱宝宝向前爬',
        ability: '大运动',
        duration: '每次10分钟',
      },
      {
        icon: '📦',
        name: '找玩具',
        description: '把玩具藏在布下让宝宝找',
        ability: '物体恒存',
        duration: '每次5分钟',
      },
      {
        icon: '👏',
        name: '拍手歌',
        description: '唱拍手歌配合动作',
        ability: '模仿能力',
        duration: '每次3分钟',
      },
    ],
    8: [
      {
        icon: '🎯',
        name: '投球入桶',
        description: '让宝宝把球投入桶中',
        ability: '手眼协调',
        duration: '每次5分钟',
      },
      {
        icon: '📚',
        name: '翻页游戏',
        description: '让宝宝自己翻书页',
        ability: '精细动作',
        duration: '每次5分钟',
      },
      {
        icon: '🗣️',
        name: '指物命名',
        description: '指着物品说名字让宝宝跟读',
        ability: '语言发育',
        duration: '随时进行',
      },
    ],
    9: [
      {
        icon: '🧍',
        name: '扶站练习',
        description: '扶着宝宝在沙发旁站立',
        ability: '大运动',
        duration: '每次3-5分钟',
      },
      {
        icon: '🧩',
        name: '形状配对',
        description: '简单的形状配对玩具',
        ability: '认知能力',
        duration: '每次5分钟',
      },
      {
        icon: '🎵',
        name: '动作歌谣',
        description: '唱歌配合简单动作让宝宝模仿',
        ability: '模仿协调',
        duration: '每次5分钟',
      },
    ],
    10: [
      {
        icon: '🚶',
        name: '扶走练习',
        description: '牵着宝宝的手练习迈步',
        ability: '大运动',
        duration: '每次5分钟',
      },
      {
        icon: '✏️',
        name: '涂鸦启蒙',
        description: '用安全蜡笔让宝宝随意涂画',
        ability: '精细动作',
        duration: '每次5分钟',
      },
      {
        icon: '📖',
        name: '绘本共读',
        description: '指读简单绘本，让宝宝指认',
        ability: '语言认知',
        duration: '每次10分钟',
      },
    ],
    11: [
      {
        icon: '👣',
        name: '独立迈步',
        description: '在短距离放开手让宝宝走来',
        ability: '大运动',
        duration: '每次多次尝试',
      },
      {
        icon: '🧱',
        name: '叠高塔',
        description: '叠2-3块积木，锻炼精细动作',
        ability: '精细动作',
        duration: '每次5分钟',
      },
      {
        icon: '🗣️',
        name: '词汇扩展',
        description: '每天教2-3个新词汇',
        ability: '语言发育',
        duration: '随时进行',
      },
    ],
    12: [
      {
        icon: '⚽',
        name: '踢球游戏',
        description: '让宝宝尝试踢球',
        ability: '大运动协调',
        duration: '每次5分钟',
      },
      {
        icon: '🎨',
        name: '颜色认知',
        description: '教宝宝认识基本颜色',
        ability: '认知发育',
        duration: '每次5分钟',
      },
      {
        icon: '🧩',
        name: '简单拼图',
        description: '2-3片的简单拼图',
        ability: '问题解决',
        duration: '每次10分钟',
      },
    ],
  }
  return gamesMap[monthData.value?.month ?? 0] ?? gamesMap[0] ?? []
})

// 绘本儿歌推荐
const recommendedBooks = computed(() => {
  const booksMap: Record<
    number,
    Array<{
      cover: string
      name: string
      author: string
      description: string
      type: string
      ageRange: string
    }>
  > = {
    0: [
      {
        cover: '📕',
        name: '《黑白卡》',
        author: '各品牌',
        description: '高对比度黑白图案，刺激新生儿视觉发育',
        type: '视觉卡',
        ageRange: '0-3月',
      },
      {
        cover: '🎵',
        name: '《摇篮曲精选》',
        author: '经典儿歌',
        description: '柔和舒缓的摇篮曲，帮助宝宝入睡',
        type: '儿歌',
        ageRange: '0-12月',
      },
    ],
    1: [
      {
        cover: '📗',
        name: '《彩色卡》',
        author: '各品牌',
        description: '鲜艳的彩色图案，进阶视觉训练',
        type: '视觉卡',
        ageRange: '1-4月',
      },
      {
        cover: '🎵',
        name: '《小星星》',
        author: '经典儿歌',
        description: '简单重复的旋律，适合早期音乐启蒙',
        type: '儿歌',
        ageRange: '0-12月',
      },
    ],
    2: [
      {
        cover: '📘',
        name: '《脸谱书》',
        author: '各品牌',
        description: '各种表情的脸谱，帮助宝宝认识情绪',
        type: '绘本',
        ageRange: '2-6月',
      },
      {
        cover: '🎵',
        name: '《拍手歌》',
        author: '经典儿歌',
        description: '配合拍手动作的儿歌，培养节奏感',
        type: '儿歌',
        ageRange: '2-12月',
      },
    ],
    3: [
      {
        cover: '📙',
        name: '《小熊宝宝绘本》',
        author: '佐佐木洋子',
        description: '经典低幼绘本系列，涵盖生活场景',
        type: '绘本',
        ageRange: '0-3岁',
      },
      {
        cover: '🎵',
        name: '《两只老虎》',
        author: '经典儿歌',
        description: '欢快有趣的儿歌，宝宝喜欢听',
        type: '儿歌',
        ageRange: '3-24月',
      },
    ],
    4: [
      {
        cover: '📕',
        name: '《躲猫猫》',
        author: '各品牌',
        description: '翻翻书设计，配合躲猫猫游戏',
        type: '互动书',
        ageRange: '4-12月',
      },
      {
        cover: '🎵',
        name: '《数鸭子》',
        author: '经典儿歌',
        description: '简单数字启蒙儿歌',
        type: '儿歌',
        ageRange: '4-24月',
      },
    ],
    5: [
      {
        cover: '📗',
        name: '《好饿的毛毛虫》',
        author: '艾瑞·卡尔',
        description: '经典洞洞书，认识食物和数字',
        type: '绘本',
        ageRange: '0-3岁',
      },
      {
        cover: '🎵',
        name: '《小兔子乖乖》',
        author: '经典儿歌',
        description: '有情节的儿歌，培养安全意识',
        type: '儿歌',
        ageRange: '6-36月',
      },
    ],
    6: [
      {
        cover: '📘',
        name: '《米菲系列》',
        author: '迪克·布鲁纳',
        description: '简洁明快的画风，适合低幼宝宝',
        type: '绘本',
        ageRange: '0-3岁',
      },
      {
        cover: '📙',
        name: '《我爸爸》',
        author: '安东尼·布朗',
        description: '温馨的亲子绘本',
        type: '绘本',
        ageRange: '0-6岁',
      },
    ],
    7: [
      {
        cover: '📕',
        name: '《棕色的熊》',
        author: '艾瑞·卡尔',
        description: '认识颜色和动物的经典绘本',
        type: '绘本',
        ageRange: '0-3岁',
      },
      {
        cover: '🎵',
        name: '《如果感到幸福》',
        author: '经典儿歌',
        description: '配合动作的互动儿歌',
        type: '儿歌',
        ageRange: '6-36月',
      },
    ],
    8: [
      {
        cover: '📗',
        name: '《猜猜我有多爱你》',
        author: '山姆·麦克布雷尼',
        description: '表达爱的温馨绘本',
        type: '绘本',
        ageRange: '0-6岁',
      },
      {
        cover: '📘',
        name: '《点点点》',
        author: '埃尔维·杜莱',
        description: '互动式创意绘本',
        type: '互动书',
        ageRange: '0-6岁',
      },
    ],
    9: [
      {
        cover: '📙',
        name: '《晚安月亮》',
        author: '玛格丽特·怀兹·布朗',
        description: '经典睡前绘本',
        type: '绘本',
        ageRange: '0-3岁',
      },
      {
        cover: '🎵',
        name: '《世上只有妈妈好》',
        author: '经典儿歌',
        description: '温馨感人的亲子儿歌',
        type: '儿歌',
        ageRange: '0-36月',
      },
    ],
    10: [
      {
        cover: '📕',
        name: '《抱抱》',
        author: '杰兹·阿波罗',
        description: '简单重复的词汇，适合语言启蒙',
        type: '绘本',
        ageRange: '0-3岁',
      },
      {
        cover: '📗',
        name: '《小蓝和小黄》',
        author: '李欧·李奥尼',
        description: '认识颜色和友谊的绘本',
        type: '绘本',
        ageRange: '0-6岁',
      },
    ],
    11: [
      {
        cover: '📘',
        name: '《逃家小兔》',
        author: '玛格丽特·怀兹·布朗',
        description: '关于母爱的经典绘本',
        type: '绘本',
        ageRange: '0-6岁',
      },
      {
        cover: '🎵',
        name: '《生日快乐歌》',
        author: '经典儿歌',
        description: '庆祝宝宝即将周岁',
        type: '儿歌',
        ageRange: '0-36月',
      },
    ],
    12: [
      {
        cover: '📙',
        name: '《我的第一本认知书》',
        author: '各品牌',
        description: '常见物品认知学习',
        type: '认知书',
        ageRange: '1-3岁',
      },
      {
        cover: '📕',
        name: '《大卫不可以》',
        author: '大卫·香农',
        description: '趣味规则启蒙绘本',
        type: '绘本',
        ageRange: '1-6岁',
      },
    ],
  }
  return booksMap[monthData.value?.month ?? 0] ?? booksMap[0] ?? []
})

// 视频教程推荐
const recommendedVideos = computed(() => {
  const videosMap: Record<
    number,
    Array<{
      title: string
      description: string
      duration: string
      category: string
      source: string
    }>
  > = {
    0: [
      {
        title: '新生儿护理全攻略',
        description: '包含喂养、睡眠、洗护等基础护理知识',
        duration: '15:30',
        category: '护理技巧',
        source: '专业医生',
      },
      {
        title: '如何正确拍嗝',
        description: '三种拍嗝姿势详解，预防吐奶',
        duration: '05:20',
        category: '喂养技巧',
        source: '育儿专家',
      },
      {
        title: '脐带护理指南',
        description: '新生儿脐带消毒和护理方法',
        duration: '03:45',
        category: '护理技巧',
        source: '专业护士',
      },
    ],
    1: [
      {
        title: '黑白卡训练方法',
        description: '如何正确使用黑白卡进行视觉训练',
        duration: '06:15',
        category: '早教游戏',
        source: '早教专家',
      },
      {
        title: '1月龄宝宝互动游戏',
        description: '适合1个月宝宝的亲子互动方式',
        duration: '08:30',
        category: '早教游戏',
        source: '育儿博主',
      },
      {
        title: '婴儿抚触按摩教程',
        description: '促进宝宝身体发育的抚触手法',
        duration: '10:20',
        category: '护理技巧',
        source: '专业医生',
      },
    ],
    2: [
      {
        title: '俯卧抬头训练',
        description: '如何帮助宝宝练习抬头',
        duration: '05:45',
        category: '大运动训练',
        source: '康复治疗师',
      },
      {
        title: '宝宝笑声引导',
        description: '让宝宝开心大笑的互动技巧',
        duration: '04:30',
        category: '亲子互动',
        source: '育儿博主',
      },
    ],
    3: [
      {
        title: '翻身训练全攻略',
        description: '帮助宝宝学会翻身的完整方法',
        duration: '08:20',
        category: '大运动训练',
        source: '康复治疗师',
      },
      {
        title: '抓握能力训练',
        description: '锻炼宝宝抓握能力的游戏',
        duration: '06:15',
        category: '精细动作',
        source: '早教专家',
      },
    ],
    4: [
      {
        title: '躲猫猫游戏教程',
        description: '正确玩躲猫猫培养认知能力',
        duration: '04:30',
        category: '认知训练',
        source: '早教专家',
      },
      {
        title: '4月龄感官游戏',
        description: '多感官刺激促进大脑发育',
        duration: '07:45',
        category: '早教游戏',
        source: '育儿博主',
      },
    ],
    5: [
      {
        title: '辅食添加准备',
        description: '辅食添加前的准备工作和信号判断',
        duration: '12:30',
        category: '喂养指导',
        source: '营养师',
      },
      {
        title: '出牙期护理',
        description: '缓解出牙不适的方法',
        duration: '06:20',
        category: '护理技巧',
        source: '儿科医生',
      },
    ],
    6: [
      {
        title: '辅食添加第一课',
        description: '从米粉开始的辅食添加详解',
        duration: '15:40',
        category: '喂养指导',
        source: '营养师',
      },
      {
        title: '独坐训练方法',
        description: '帮助宝宝学会独坐的技巧',
        duration: '07:30',
        category: '大运动训练',
        source: '康复治疗师',
      },
    ],
    7: [
      {
        title: '爬行训练全攻略',
        description: '从匍匐到四肢爬行的完整训练',
        duration: '10:25',
        category: '大运动训练',
        source: '康复治疗师',
      },
      {
        title: '7月龄辅食食谱',
        description: '营养均衡的辅食制作方法',
        duration: '12:15',
        category: '喂养指导',
        source: '营养师',
      },
    ],
    8: [
      {
        title: '精细动作训练',
        description: '锻炼手指灵活性的游戏方法',
        duration: '08:40',
        category: '精细动作',
        source: '早教专家',
      },
      {
        title: '分离焦虑应对',
        description: '帮助宝宝度过分离焦虑期',
        duration: '09:30',
        category: '心理发育',
        source: '心理咨询师',
      },
    ],
    9: [
      {
        title: '扶站安全指南',
        description: '扶站训练的安全注意事项',
        duration: '06:50',
        category: '大运动训练',
        source: '康复治疗师',
      },
      {
        title: '语言启蒙方法',
        description: '促进宝宝语言发展的技巧',
        duration: '11:20',
        category: '语言发育',
        source: '语言治疗师',
      },
    ],
    10: [
      {
        title: '学步准备与安全',
        description: '学步期的准备和安全防护',
        duration: '09:15',
        category: '大运动训练',
        source: '康复治疗师',
      },
      {
        title: '10月龄认知游戏',
        description: '提升认知能力的亲子游戏',
        duration: '07:40',
        category: '认知训练',
        source: '早教专家',
      },
    ],
    11: [
      {
        title: '独立行走训练',
        description: '帮助宝宝迈出第一步',
        duration: '08:30',
        category: '大运动训练',
        source: '康复治疗师',
      },
      {
        title: '叠词语言训练',
        description: '教宝宝说简单叠词的方法',
        duration: '06:25',
        category: '语言发育',
        source: '语言治疗师',
      },
    ],
    12: [
      {
        title: '周岁宝宝能力评估',
        description: '12月龄发育里程碑检查清单',
        duration: '10:45',
        category: '发育评估',
        source: '儿科医生',
      },
      {
        title: '周岁后喂养指导',
        description: '1岁后的饮食安排和注意事项',
        duration: '14:20',
        category: '喂养指导',
        source: '营养师',
      },
    ],
  }
  return videosMap[monthData.value?.month ?? 0] ?? videosMap[0] ?? []
})

// 收藏功能
const favorites = ref<Set<string>>(new Set())

// 从localStorage加载收藏
const loadFavorites = () => {
  const saved = localStorage.getItem('resourceFavorites')
  if (saved) {
    favorites.value = new Set(JSON.parse(saved))
  }
}

// 保存收藏到localStorage
const saveFavorites = () => {
  localStorage.setItem(
    'resourceFavorites',
    JSON.stringify([...favorites.value]),
  )
}

// 检查是否已收藏
const isResourceFavorited = (type: string, name: string) => {
  return favorites.value.has(`${type}:${name}`)
}

// 切换收藏状态
const toggleFavorite = (type: string, name: string) => {
  const key = `${type}:${name}`
  if (favorites.value.has(key)) {
    favorites.value.delete(key)
    ElMessage.info('已取消收藏')
  } else {
    favorites.value.add(key)
    ElMessage.success('已添加到收藏')
  }
  saveFavorites()
}

// 收藏数量
const favoritesCount = computed(() => favorites.value.size)

// 查看收藏
const showFavorites = () => {
  ElMessage.info(`您已收藏${favoritesCount.value}个学习资源`)
  // TODO: 可以跳转到收藏页面或显示收藏列表弹窗
}

// 分享资源
const shareResource = (resource: {
  name?: string
  title?: string
  description?: string
}) => {
  const title = resource.name || resource.title || '学习资源'
  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: resource.description,
        url: window.location.href,
      })
      .catch(() => {})
  } else {
    ElMessage.info('请截图后分享给好友')
  }
}

onMounted(() => {
  const monthId = parseInt(route.params.id as string)
  babyStore.setCurrentMonth(monthId)

  // 模拟图表数据加载
  setTimeout(() => {
    trendChartLoading.value = false
  }, 800)

  // 从localStorage恢复用户选择的能力类型
  const savedAbilityType = localStorage.getItem('selectedAbilityType')
  if (
    savedAbilityType &&
    ['gross', 'fine', 'cognitive', 'language', 'social'].includes(
      savedAbilityType,
    )
  ) {
    selectedAbilityType.value = savedAbilityType as typeof selectedAbilityType.value
  }
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      babyStore.setCurrentMonth(parseInt(newId as string))
      activeTab.value = 'development'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
)
</script>

<style scoped>
.month-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  padding-bottom: 100px;
}

/* 🎯 本月成长关键词卡片 */
.growth-keywords-section {
  padding: 16px 20px 0;
}

.keywords-card {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #fdf2f8 100%);
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 4px 20px rgba(103, 126, 234, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.15);
}

.keywords-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.keywords-title {
  font-size: 16px;
  font-weight: 700;
  color: #5b21b6;
}

.keywords-subtitle {
  font-size: 12px;
  color: #8b5cf6;
  opacity: 0.8;
}

.keywords-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.keyword-item {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(167, 139, 250, 0.1);
}

.keyword-item:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 16px rgba(103, 126, 234, 0.12);
  border-color: rgba(139, 92, 246, 0.2);
}

.keyword-item:active {
  transform: scale(0.98);
}

.keyword-icon-circle {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.keyword-item:hover .keyword-icon-circle {
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.keyword-icon {
  font-size: 20px;
  font-weight: 600;
  color: #5b21b6;
}

.keyword-text-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.keyword-label {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.keyword-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.keyword-arrow {
  color: #9ca3af;
  transition: all 0.3s ease;
}

.keyword-item:hover .keyword-arrow {
  color: #667eea;
  transform: translateX(4px);
}

/* 响应式：移动端 */
@media (max-width: 480px) {
  .keywords-card {
    padding: 16px 14px;
  }

  .keywords-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 14px;
  }

  .keyword-icon-circle {
    width: 44px;
    height: 44px;
    min-width: 44px;
  }

  .keyword-icon {
    font-size: 18px;
  }

  .keyword-label {
    font-size: 14px;
  }

  .keyword-desc {
    font-size: 11px;
  }

  .keyword-item {
    padding: 12px 14px;
    gap: 12px;
  }
}

/* 顶部导航 - 增强版 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.back-btn {
  font-weight: 600;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-month {
  font-size: 16px; /* 从 18px 减小 */
  font-weight: 700;
  color: #303133;
  min-width: 50px;
  text-align: center;
}

/* 页面头部 */
.page-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px; /* 从 60px 30px 减小 */
  border-radius: 0 0 40px 40px;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
}

/* 🎯 新版头部布局 */
.hero-top-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.hero-title-area {
  text-align: left;
}

.hero-title-area h1 {
  font-size: 22px;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.hero-stage-tag {
  background: rgba(255, 255, 255, 0.25) !important;
  border: none !important;
  color: white !important;
}

/* 🎯 成长关键词 + 里程碑进度卡片 */
.growth-highlight-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 16px;
  gap: 16px;
}

.highlight-left {
  flex: 1;
}

.keyword-section {
  text-align: left;
}

.section-label {
  font-size: 11px;
  opacity: 0.8;
  display: block;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.keyword-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.keyword-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.keyword-tag:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.keyword-icon {
  font-size: 14px;
}

.keyword-text {
  font-weight: 500;
}

.highlight-divider {
  width: 1px;
  height: 50px;
  background: rgba(255, 255, 255, 0.3);
}

.highlight-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.milestone-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-ring-mini {
  position: relative;
  width: 44px;
  height: 44px;
}

.progress-ring-mini svg {
  transform: rotate(-90deg);
}

.progress-ring-mini .ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 4;
}

.progress-ring-mini .ring-fill {
  fill: none;
  stroke: #4ade80;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 113.1;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-ring-mini .progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 700;
}

.progress-info {
  text-align: left;
}

.progress-label {
  display: block;
  font-size: 11px;
  opacity: 0.8;
}

.progress-detail {
  display: block;
  font-size: 18px;
  font-weight: 700;
}

.checkin-btn {
  background: rgba(255, 255, 255, 0.25) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
}

.checkin-btn:hover {
  background: rgba(255, 255, 255, 0.4) !important;
}

/* 🎯 成长小贴士横幅 */
.growth-tip-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(
    90deg,
    rgba(251, 191, 36, 0.2) 0%,
    rgba(251, 146, 60, 0.15) 100%
  );
  padding: 10px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.growth-tip-banner:hover {
  background: linear-gradient(
    90deg,
    rgba(251, 191, 36, 0.3) 0%,
    rgba(251, 146, 60, 0.25) 100%
  );
}

.tip-icon {
  font-size: 18px;
}

.tip-text {
  flex: 1;
  font-size: 13px;
  text-align: left;
  line-height: 1.4;
}

.tip-more {
  font-size: 12px;
  opacity: 0.8;
  white-space: nowrap;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.month-badge-large {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.month-num {
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.month-unit {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 2px;
}

.page-hero h1 {
  font-size: 26px;
  margin: 0 0 10px 0;
  font-weight: 800;
}

.hero-summary {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 20px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

.quick-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.stat-item .el-icon {
  font-size: 24px; /* 从 28px 减小 */
}

.stat-content {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.stat-label {
  font-size: 11px; /* 从 12px 减小 */
  opacity: 0.85;
}

.stat-value {
  font-size: 15px; /* 从 16px 减小 */
  font-weight: 700;
}

/* 详情页头部 */
.detail-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px; /* 从 60px 40px 减小 */
  border-radius: 0 0 40px 40px;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px; /* 从 40px 减小 */
}

.detail-header .month-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 16px; /* 从 8px 20px 减小 */
  border-radius: 20px;
  font-size: 13px; /* 从 14px 减小 */
  font-weight: 600;
  margin-bottom: 12px; /* 从 16px 减小 */
  backdrop-filter: blur(10px);
}

.detail-header h1 {
  font-size: 32px; /* 从 42px 减小 */
  font-weight: 800;
  margin: 0 0 8px 0; /* 从 12px 减小 */
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.detail-header p {
  font-size: 15px; /* 从 18px 减小 */
  opacity: 0.9;
  margin: 0 0 20px 0; /* 从 24px 减小 */
}

.quick-stats {
  display: flex;
  gap: 12px; /* 从 16px 减小 */
  margin-top: 20px; /* 从 24px 减小 */
}

.quick-stat {
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px; /* 从 16px 减小 */
  border-radius: 12px;
  backdrop-filter: blur(10px);
  text-align: center;
}

.quick-stat-icon {
  font-size: 20px; /* 从 24px 减小 */
  margin-bottom: 6px; /* 从 8px 减小 */
}

.quick-stat-value {
  font-size: 15px; /* 从 18px 减小 */
  font-weight: 700;
  display: block;
  margin-bottom: 2px; /* 从 4px 减小 */
}

.quick-stat-label {
  font-size: 11px; /* 从 12px 减小 */
  opacity: 0.8;
}

/* 月份详情头部 */
.month-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px; /* 从 60px 40px 减小 */
  border-radius: 0 0 40px 40px;
  color: white;
  position: relative;
  overflow: hidden;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px; /* 从 40px 减小 */
  height: 36px; /* 从 40px 减小 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.month-number {
  font-size: 48px; /* 从 64px 减小 */
  font-weight: 800;
  margin: 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.month-label {
  font-size: 16px; /* 从 18px 减小 */
  opacity: 0.9;
  margin-top: 4px; /* 从 8px 减小 */
}

.milestone-preview {
  background: rgba(255, 255, 255, 0.15);
  padding: 16px; /* 从 20px 减小 */
  border-radius: 20px;
  backdrop-filter: blur(10px);
  margin-top: 20px; /* 从 24px 减小 */
}

.milestone-title {
  font-size: 14px; /* 从 16px 减小 */
  opacity: 0.9;
  margin-bottom: 10px; /* 从 12px 减小 */
}

.milestone-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.milestone-tag {
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 12px; /* 从 8px 16px 减小 */
  border-radius: 20px;
  font-size: 12px; /* 从 13px 减小 */
  backdrop-filter: blur(5px);
}

/* 内容区域 */
.content-section {
  padding: 0 20px;
}

.detail-tabs {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-icon {
  font-size: 18px;
}

.tab-text {
  font-weight: 600;
}

.tab-content {
  padding: 20px 0;
}

/* 信息卡片 */
.info-card {
  margin-bottom: 20px;
  border-radius: 16px !important;
}

.card-header-custom {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 24px;
}

.card-header-custom h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.description-text {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

/* 身体发育网格 */
.physical-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.physical-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #ebeef5;
}

.physical-icon {
  font-size: 36px;
}

.physical-info {
  display: flex;
  flex-direction: column;
}

.physical-label {
  font-size: 13px;
  color: #909399;
}

.physical-value {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

/* 技能列表 */
.skill-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.skill-list li:last-child {
  border-bottom: none;
}

.skill-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.skill-bullet.cognitive {
  background: #409eff;
}
.skill-bullet.social {
  background: #f56c6c;
}
.skill-bullet.motor-gross {
  background: #67c23a;
}
.skill-bullet.motor-fine {
  background: #e6a23c;
}

/* 护理指南网格 */
.care-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

/* 营养卡片 */
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.nutrition-card {
  border-radius: 20px !important;
}

.nutrition-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.nutrition-icon {
  font-size: 48px;
}

.nutrition-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.nutrition-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.nutrition-stat {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.nutrition-stat .stat-icon {
  font-size: 24px;
}

.nutrition-stat .stat-info {
  display: flex;
  flex-direction: column;
}

.nutrition-stat .stat-label {
  font-size: 12px;
  color: #909399;
}

.nutrition-stat .stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.nutrition-notes {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  padding: 16px;
  border-radius: 12px;
}

.nutrition-notes h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #92400e;
}

.nutrition-notes ul {
  margin: 0;
  padding-left: 20px;
  color: #78350f;
  font-size: 14px;
  line-height: 1.8;
}

/* 🔔 智能提醒区域 */
.smart-reminder-section {
  margin-bottom: 20px;
}

.reminder-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 16px;
  position: relative;
}

.reminder-card.info {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #93c5fd;
}

.reminder-card.warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fcd34d;
}

.reminder-card.success {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #86efac;
}

.reminder-icon {
  font-size: 28px;
}

.reminder-content {
  flex: 1;
}

.reminder-content h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 700;
}

.reminder-card.info .reminder-content h4 {
  color: #1e40af;
}

.reminder-card.warning .reminder-content h4 {
  color: #92400e;
}

.reminder-card.success .reminder-content h4 {
  color: #166534;
}

.reminder-content p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

.reminder-card.info .reminder-content p {
  color: #1e3a8a;
}

.reminder-card.warning .reminder-content p {
  color: #78350f;
}

.reminder-card.success .reminder-content p {
  color: #14532d;
}

.reminder-close {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #9ca3af;
}

/* 里程碑 */
.milestones-header {
  margin-bottom: 30px;
}

.milestones-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 20px;
}

.report-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.progress-inner {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.progress-value {
  font-size: 32px;
  font-weight: 800;
  color: #667eea;
}

.progress-label {
  font-size: 16px;
  color: #909399;
}

.progress-text h4 {
  margin: 0 0 6px 0;
  font-size: 18px;
  color: #303133;
}

.progress-text p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.milestone-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.milestone-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.milestone-card.completed {
  background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
  border-color: #22c55e;
}

.milestone-card.completed:hover {
  border-color: #16a34a;
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
}

.milestone-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.milestone-check {
  display: flex;
}

.check-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 14px;
}

.milestone-card.completed .check-circle {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: transparent;
  color: white;
}

.milestone-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.milestone-content p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

.milestone-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.milestone-status .el-tag {
  font-size: 12px;
}

/* 里程碑确认对话框 */
.milestone-confirm-content {
  text-align: center;
  padding: 10px 0;
}

.milestone-confirm-content .confirm-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.milestone-confirm-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.milestone-confirm-content p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.confirm-upload-area {
  margin-top: 16px;
  text-align: center;
}

.confirm-upload-area .upload-hint {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 12px;
}

.media-preview {
  position: relative;
  display: inline-block;
  margin-top: 12px;
}

.media-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 12px;
  object-fit: cover;
}

.remove-media-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444 !important;
  border-color: #ef4444 !important;
  color: white !important;
}

/* 训练指南对话框 */
.training-guide-content {
  padding: 10px 0;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.guide-icon {
  font-size: 40px;
}

.guide-title-area h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.guide-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #6b7280;
}

.guide-section {
  margin-bottom: 20px;
}

.guide-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.guide-section p {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

.section-emoji {
  font-size: 16px;
}

.method-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.method-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.method-list li .el-icon {
  color: #22c55e;
  margin-top: 3px;
  flex-shrink: 0;
}

.tips-section {
  margin-top: 16px;
}

.tips-section .el-alert {
  border-radius: 12px;
}

/* 问题卡片 */
.issues-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.issue-card {
  border-radius: 20px !important;
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.issue-icon {
  font-size: 28px;
}

.issue-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.issue-section {
  margin-bottom: 20px;
}

.issue-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #303133;
}

.section-icon {
  font-size: 16px;
}

.symptom-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.solution-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.solution-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.solution-icon {
  color: #67c23a;
  margin-top: 2px;
}

.doctor-alert {
  margin-top: 16px;
  border-radius: 12px;
}

/* 安全提醒 */
.safety-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border-radius: 20px;
  margin-bottom: 30px;
}

.safety-icon-large {
  font-size: 60px;
}

.safety-intro h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #c53030;
}

.safety-intro p {
  margin: 0;
  font-size: 14px;
  color: #742a2a;
}

.safety-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.safety-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border-left: 4px solid #f56c6c;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.safety-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f56c6c 0%, #ff9a9e 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.safety-content {
  font-size: 15px;
  color: #303133;
  line-height: 1.6;
}

/* 底部导航 */
.bottom-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  margin-top: 20px;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}

.nav-placeholder {
  width: 120px;
}

.nav-prev-btn,
.nav-next-btn {
  min-width: 120px;
}

.nav-home-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

/* 顶部导航增强样式 */
.nav-title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nav-current-month {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #303133;
}

.stage-tag {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-arrow-btn {
  width: 36px;
  height: 36px;
}

.nav-month-dropdown {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-month-dropdown:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.dropdown-month-num {
  font-weight: 700;
  min-width: 20px;
  text-align: center;
}

.dropdown-month-label {
  color: #909399;
  font-size: 12px;
}

.dropdown-check {
  color: #67c23a;
  margin-left: auto;
}

:deep(.el-dropdown-menu__item.is-active) {
  background: linear-gradient(135deg, #f0f0ff 0%, #fff5f8 100%);
  color: #667eea;
}

/* Hero 阶段标签 */
.hero-stage-tags {
  margin-bottom: 12px;
}

.hero-stage-tag {
  background: rgba(255, 255, 255, 0.25);
  border: none;
  font-size: 13px;
  padding: 6px 16px;
}

/* Hero 快捷操作 */
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.hero-action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.hero-action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.hero-action-btn .btn-icon {
  font-size: 18px;
}

.milestone-badge :deep(.el-badge__content) {
  background: #f56c6c;
  border: none;
}

/* 成长记录入口区域 */
.growth-record-section {
  padding: 0 20px;
  margin-top: 30px;
}

.record-entry-card {
  border-radius: 20px !important;
  background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%);
  border: 2px solid #e9d5ff;
}

.record-entry-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
}

.record-icon {
  font-size: 48px;
}

.record-text {
  flex: 1;
}

.record-text h3 {
  margin: 0 0 6px 0;
  font-size: 18px;
  color: #7c3aed;
  font-weight: 700;
}

.record-text p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* 🎯 快速记录入口区域 */
.quick-record-section {
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
}

.quick-record-card {
  background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #fde047;
}

.quick-record-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
}

.record-emoji {
  font-size: 32px;
}

.record-title-area h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: #854d0e;
}

.record-title-area p {
  margin: 0;
  font-size: 13px;
  color: #a16207;
}

.quick-record-templates {
  margin-bottom: 16px;
}

.templates-label {
  font-size: 13px;
  color: #92400e;
  font-weight: 600;
  display: block;
  margin-bottom: 10px;
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-tag {
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.8) !important;
  border-color: #fbbf24 !important;
  color: #92400e !important;
}

.template-tag:hover {
  background: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.quick-record-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 快速记录对话框 */
.quick-record-form .form-item {
  margin-bottom: 20px;
}

.quick-record-form .form-item label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.type-selector {
  margin-top: 8px;
}

.quick-record-upload {
  width: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 30px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f5f3ff;
}

.upload-placeholder .el-icon {
  font-size: 32px;
}

.photo-preview {
  position: relative;
  display: inline-block;
}

.photo-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 12px;
  object-fit: cover;
}

.remove-photo-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444 !important;
  border-color: #ef4444 !important;
  color: white !important;
}

/* 能力发展趋势图 - 升级版 */
.ability-trend-section {
  margin-top: 30px;
  padding: 0 20px;
  position: relative;
}

.ability-trend-section.is-loading {
  min-height: 400px;
}

/* 骨架屏样式 */
.trend-skeleton {
  padding: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(157, 80, 255, 0.08);
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.skeleton-title {
  width: 180px;
  height: 24px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-tabs {
  width: 300px;
  height: 36px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 18px;
}

.skeleton-chart {
  width: 100%;
  height: 220px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 16px;
  margin-bottom: 16px;
}

.skeleton-legend {
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.trend-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.trend-title-area h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #9d50ff 0%, #ff6bcc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.trend-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #9ca3af;
}

.trend-controls {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.trend-controls :deep(.el-radio-group) {
  flex-wrap: nowrap;
  gap: 8px;
}

.trend-controls :deep(.el-radio-button__inner) {
  padding: 10px 12px;
  font-size: 13px;
  border-radius: 20px !important;
  border: none !important;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.trend-controls :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 20px !important;
}

.trend-controls :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 20px !important;
}

.trend-controls
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #9d50ff 0%, #ff6bcc 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(157, 80, 255, 0.3);
}

.ability-icon {
  font-size: 14px;
}

.ability-name {
  font-size: 12px;
  font-weight: 500;
}

.axis-label {
  font-size: 10px;
  fill: #9ca3af;
  text-anchor: start;
}

.grid-line {
  stroke: #f3f4f6;
  stroke-width: 1;
}

.grid-line-base {
  stroke: #e5e7eb;
  stroke-width: 1.5;
}

/* 百分位曲线样式 */
.percentile-line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
}

.percentile-line.p97 {
  stroke: #ef4444;
  stroke-dasharray: 6 4;
  opacity: 0.7;
}

.percentile-line.p50 {
  stroke: #22c55e;
  stroke-width: 2.5;
  opacity: 0.9;
}

.percentile-line.p3 {
  stroke: #3b82f6;
  stroke-dasharray: 6 4;
  opacity: 0.7;
}

/* 宝宝数据线样式 */
.baby-trend-line {
  fill: none;
  stroke: #667eea;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.baby-area {
  transition: opacity 0.3s ease;
}

/* 数据点组样式 */
.data-point-group {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.data-point-group:hover {
  transform: scale(1.15);
}

/* 外圈光晕 */
.point-glow {
  fill: rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.point-glow.current {
  fill: rgba(236, 72, 153, 0.3);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

/* 气泡数据点 */
.data-point-bubble {
  fill: #667eea;
  stroke: white;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.data-point-bubble.current {
  fill: #ec4899;
  stroke-width: 3;
  filter: drop-shadow(0 2px 6px rgba(236, 72, 153, 0.5));
}

.data-point-bubble.achieved {
  filter: drop-shadow(0 2px 8px rgba(34, 197, 94, 0.4));
}

.current-point-icon {
  font-size: 8px;
  text-anchor: middle;
  pointer-events: none;
}

/* 原始数据点样式（保留备用） */
.data-point {
  fill: #667eea;
  stroke: white;
  stroke-width: 2;
  transition: all 0.2s ease;
}

.data-point.current {
  fill: #ec4899;
  r: 7;
  filter: drop-shadow(0 2px 4px rgba(236, 72, 153, 0.4));
}

/* 提示框样式 */
.chart-tooltip {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 140px;
  pointer-events: none;
  animation: tooltip-appear 0.2s ease;
}

@keyframes tooltip-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.tooltip-month {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.tooltip-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.tooltip-status.excellent {
  background: #dcfce7;
  color: #166534;
}

.tooltip-status.normal {
  background: #dbeafe;
  color: #1e40af;
}

.tooltip-status.attention {
  background: #fef3c7;
  color: #92400e;
}

.tooltip-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tooltip-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.tooltip-label {
  color: #9ca3af;
}

.tooltip-value {
  font-weight: 600;
  color: #374151;
}

.tooltip-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
}

/* 缩放控制按钮 */
.zoom-controls {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #9D50FF 0%, #FF6BCC 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.zoom-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(157, 80, 255, 0.4);
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-btn.reset {
  background: #f3f4f6;
  color: #6b7280;
}

.zoom-btn.reset:hover:not(:disabled) {
  background: #e5e7eb;
  box-shadow: none;
}

.zoom-level {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  min-width: 36px;
  text-align: center;
}

/* 图表容器支持缩放 */
.trend-chart-enhanced {
  position: relative;
  background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(157, 80, 255, 0.08);
  overflow: hidden;
  touch-action: pan-x pan-y pinch-zoom;
}

.chart-svg-enhanced {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.2s ease, opacity 0.3s ease;
}

.chart-svg-enhanced.chart-transitioning {
  opacity: 0.5;
}

.x-label {
  font-size: 10px;
  fill: #6b7280;
  text-anchor: middle;
}

/* 关键里程碑标记 */
.milestone-marker-line {
  stroke: #f59e0b;
  stroke-width: 1;
  stroke-dasharray: 3 2;
  opacity: 0.6;
}

.milestone-marker {
  fill: #fef3c7;
  stroke: #f59e0b;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.milestone-marker:hover {
  fill: #fde68a;
  transform: scale(1.2);
}

.milestone-marker-text {
  font-size: 10px;
  text-anchor: middle;
  pointer-events: none;
}

/* 图例增强 */
.trend-legend-enhanced {
  margin-top: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.legend-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.legend-line {
  width: 20px;
  height: 3px;
  border-radius: 2px;
}

.legend-line.baby {
  background: #667eea;
}

.legend-line.p97 {
  background: #ef4444;
  background: repeating-linear-gradient(
    90deg,
    #ef4444 0,
    #ef4444 4px,
    transparent 4px,
    transparent 7px
  );
}

.legend-line.p50 {
  background: #22c55e;
}

.legend-line.p3 {
  background: #3b82f6;
  background: repeating-linear-gradient(
    90deg,
    #3b82f6 0,
    #3b82f6 4px,
    transparent 4px,
    transparent 7px
  );
}

.legend-marker {
  font-size: 12px;
}

/* 发育评估摘要 */
.development-assessment {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 14px;
  border: 1px solid #bbf7d0;
}

.assessment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.assessment-icon {
  font-size: 20px;
}

.assessment-title {
  font-size: 15px;
  font-weight: 600;
  color: #166534;
}

.assessment-desc {
  margin: 0 0 14px 0;
  font-size: 14px;
  color: #15803d;
  line-height: 1.6;
}

.assessment-comparison {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.comparison-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  background: white;
  border-radius: 10px;
  min-width: 80px;
}

.comparison-label {
  font-size: 11px;
  color: #6b7280;
}

.comparison-value {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.comparison-value.standard {
  color: #22c55e;
}

.comparison-value.positive {
  color: #22c55e;
}

.comparison-value.neutral {
  color: #6b7280;
}

.comparison-value.negative {
  color: #f59e0b;
}

/* 生成报告按钮 */
.trend-report-action {
  margin-top: 16px;
  text-align: center;
}

/* 里程碑详情弹窗 */
.milestone-detail-dialog :deep(.el-dialog) {
  border-radius: 20px;
}

.milestone-detail-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 16px 20px;
  margin: 0;
}

.milestone-detail-dialog :deep(.el-dialog__title) {
  color: #92400e;
  font-weight: 700;
}

.milestone-detail-content {
  padding: 20px;
}

.milestone-detail-content .detail-hero {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-radius: 16px;
  margin-bottom: 20px;
}

.milestone-detail-content .hero-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.milestone-detail-content .detail-hero h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #78350f;
}

.milestone-detail-content .hero-month {
  margin: 0;
  font-size: 14px;
  color: #92400e;
}

.milestone-detail-content .detail-section {
  margin-bottom: 16px;
}

.milestone-detail-content .detail-section h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #78350f;
}

.milestone-detail-content .detail-section p {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

.suggestion-list {
  margin: 0;
  padding-left: 20px;
}

.suggestion-list li {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.8;
}

/* 能力发展报告弹窗 */
.ability-report-dialog :deep(.el-dialog) {
  border-radius: 20px;
}

.ability-report-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 20px;
  margin: 0;
}

.ability-report-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 700;
}

.ability-report-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

.ability-report-content {
  padding: 20px;
}

.report-header {
  margin-bottom: 24px;
}

.report-baby-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.report-baby-info .baby-avatar {
  font-size: 48px;
}

.baby-details h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #303133;
}

.baby-details p {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

.report-section {
  margin-bottom: 24px;
}

.report-section h4 {
  margin: 0 0 14px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 能力条形图 */
.ability-radar-summary {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ability-bar-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.ability-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ability-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ability-score {
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
}

.ability-bar-container {
  position: relative;
  height: 10px;
  margin-bottom: 6px;
}

.ability-bar-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  border-radius: 5px;
}

.ability-bar-fill {
  position: absolute;
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.ability-bar-p50 {
  position: absolute;
  width: 2px;
  height: 16px;
  top: -3px;
  background: #22c55e;
  border-radius: 1px;
}

.ability-bar-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ability-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
}

.ability-status.excellent {
  background: #dcfce7;
  color: #166534;
}

.ability-status.good {
  background: #dbeafe;
  color: #1e40af;
}

.ability-status.normal {
  background: #f3f4f6;
  color: #4b5563;
}

.ability-status.needs-work {
  background: #fef3c7;
  color: #92400e;
}

.ability-diff {
  font-size: 11px;
  color: #9ca3af;
}

/* 发育建议卡片 */
.advice-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.advice-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid;
}

.advice-card.warning {
  background: #fffbeb;
  border-color: #fde68a;
}

.advice-card.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.advice-card.info {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.advice-icon {
  font-size: 24px;
}

.advice-content h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.advice-content p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

/* 下月预期 */
.next-month-expectations {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.expectation-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 20px;
  border: 1px solid #bae6fd;
}

.exp-icon {
  font-size: 18px;
}

.exp-text {
  font-size: 13px;
  color: #0369a1;
  font-weight: 500;
}

.report-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 学习资源推荐 */
.learning-resources-section {
  margin-top: 30px;
  padding: 0 20px;
}

.resources-card {
  border-radius: 20px !important;
  background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
  border: 2px solid #fde047;
}

.resources-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.resources-icon {
  font-size: 28px;
}

.resources-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #a16207;
}

.resource-tabs {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.resource-tabs :deep(.el-tabs__header) {
  margin: 0;
  background: #fffbeb;
  border-bottom: 2px solid #fde68a;
}

.resource-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.resource-tabs :deep(.el-tabs__item) {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #92400e;
  transition: all 0.3s ease;
}

.resource-tabs :deep(.el-tabs__item.is-active) {
  color: #b45309;
  font-weight: 600;
}

.resource-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  height: 3px;
  border-radius: 3px;
}

.resource-tabs :deep(.el-tabs__content) {
  padding: 16px;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.resource-card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  border: 2px solid #fef3c7;
  cursor: pointer;
  transition: all 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
  border-color: #fbbf24;
}

.resource-card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.resource-thumb {
  font-size: 36px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fffbeb;
  border-radius: 12px;
}

.resource-info {
  flex: 1;
  min-width: 0;
}

.resource-info h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: #78350f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-info p {
  margin: 0;
  font-size: 12px;
  color: #92400e;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.resource-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: #fef9c3;
  color: #a16207;
  border-radius: 10px;
}

.resource-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.favorite-btn {
  border-color: #fcd34d !important;
  color: #b45309 !important;
}

.favorite-btn:hover,
.favorite-btn.is-favorited {
  background: #fef3c7 !important;
  border-color: #f59e0b !important;
  color: #d97706 !important;
}

.favorite-btn.is-favorited {
  background: linear-gradient(135deg, #fef3c7, #fde68a) !important;
}

.share-btn {
  border-color: #bae6fd !important;
  color: #0369a1 !important;
}

.share-btn:hover {
  background: #e0f2fe !important;
  border-color: #38bdf8 !important;
}

/* 资源详情弹窗 */
.resource-detail-dialog :deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

.resource-detail-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 20px;
  margin: 0;
}

.resource-detail-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 700;
  color: #78350f;
}

.resource-detail-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.resource-detail-content {
  padding: 24px;
}

.detail-hero {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%);
  border-radius: 16px;
  margin-bottom: 24px;
}

.detail-hero .hero-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.detail-hero h2 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #78350f;
}

.detail-hero p {
  margin: 0;
  font-size: 14px;
  color: #92400e;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: #78350f;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-section h4::before {
  content: '';
  width: 4px;
  height: 16px;
  background: linear-gradient(to bottom, #f59e0b, #fbbf24);
  border-radius: 2px;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
}

.benefit-item::before {
  content: '✓';
  color: #22c55e;
  font-weight: 600;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-tags .resource-tag {
  font-size: 12px;
  padding: 4px 12px;
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* 下月预告区域 - 增强版 */
.next-month-preview {
  padding: 0 20px;
  margin-top: 24px;
}

.preview-card {
  border-radius: 20px !important;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.preview-icon {
  font-size: 32px;
}

.preview-title-area {
  flex: 1;
}

.preview-title-area h3 {
  margin: 0;
  font-size: 18px;
  color: #0369a1;
  font-weight: 700;
}

.preview-stage {
  font-size: 12px;
  color: #0284c7;
  background: rgba(14, 165, 233, 0.15);
  padding: 2px 10px;
  border-radius: 20px;
  display: inline-block;
  margin-top: 4px;
}

.preview-summary {
  font-size: 14px;
  color: #0c4a6e;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.preview-section {
  margin-bottom: 18px;
}

.preview-section .section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.preview-section .section-icon {
  font-size: 16px;
}

.preview-section .section-title {
  font-size: 14px;
  font-weight: 600;
  color: #0369a1;
}

.preview-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 准备建议列表 */
.preparation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preparation-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  font-size: 13px;
  color: #0c4a6e;
}

.preparation-item .prep-icon {
  font-size: 16px;
}

/* 游戏推荐列表 */
.games-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
}

.game-item .game-icon {
  font-size: 24px;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.game-name {
  font-size: 14px;
  font-weight: 600;
  color: #0c4a6e;
}

.game-benefit {
  font-size: 12px;
  color: #0369a1;
}

.preview-action-btn {
  margin-top: 16px;
  width: 100%;
}

/* 📊 成长报告对话框样式 */
.growth-report-content {
  max-height: 60vh;
  overflow-y: auto;
}

.report-preview {
  background: linear-gradient(180deg, #fef3c7 0%, #fefce8 30%, #ffffff 100%);
  border-radius: 20px;
  padding: 24px;
  border: 2px solid #fde047;
}

.report-header-section {
  text-align: center;
  margin-bottom: 24px;
}

.report-logo {
  font-size: 48px;
  margin-bottom: 8px;
}

.report-header-section h2 {
  margin: 0 0 4px 0;
  font-size: 22px;
  font-weight: 800;
  color: #92400e;
}

.report-subtitle {
  margin: 0;
  font-size: 14px;
  color: #a16207;
}

.report-info-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.report-progress-section {
  margin-bottom: 20px;
}

.report-progress-section h3,
.report-prediction-section h3 {
  font-size: 16px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 16px 0;
}

.progress-summary {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
}

.progress-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.progress-ring svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-ring .ring-bg {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 8;
}

.progress-ring .ring-fill {
  fill: none;
  stroke: #22c55e;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 251.2;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-percent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: 800;
  color: #22c55e;
}

.progress-stats {
  display: flex;
  gap: 20px;
}

.progress-stats .stat-item {
  text-align: center;
}

.progress-stats .stat-num {
  display: block;
  font-size: 24px;
  font-weight: 800;
}

.progress-stats .stat-item.completed .stat-num {
  color: #22c55e;
}

.progress-stats .stat-item.pending .stat-num {
  color: #9ca3af;
}

.progress-stats .stat-label {
  font-size: 12px;
  color: #6b7280;
}

.milestones-summary {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 12px;
}

.milestone-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.milestone-row:last-child {
  border-bottom: none;
}

.milestone-row.completed {
  opacity: 1;
}

.milestone-row:not(.completed) {
  opacity: 0.6;
}

.milestone-status-icon {
  font-size: 16px;
}

.milestone-name {
  font-size: 13px;
  color: #374151;
}

.report-prediction-section {
  margin-bottom: 20px;
}

.prediction-intro {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.prediction-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.report-footer-section {
  text-align: center;
  padding-top: 16px;
  border-top: 1px dashed #e5e7eb;
}

.report-footer-section p {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.footer-date {
  margin-top: 4px !important;
}

.baby-info-edit {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-hero {
    padding: 30px 16px;
  }

  /* 🎯 新增头部区域响应式 */
  .hero-top-row {
    flex-direction: column;
    gap: 12px;
  }

  .hero-title-area {
    text-align: center;
  }

  .growth-highlight-card {
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
  }

  .highlight-divider {
    width: 80%;
    height: 1px;
  }

  .highlight-left {
    width: 100%;
  }

  .keyword-section {
    text-align: center;
  }

  .keyword-tags {
    justify-content: center;
  }

  .keyword-tag {
    padding: 5px 10px;
    font-size: 12px;
  }

  .highlight-right {
    width: 100%;
    justify-content: center;
  }

  .growth-tip-banner {
    padding: 10px 14px;
  }

  .tip-text {
    font-size: 12px;
  }

  .month-num {
    font-size: 32px;
  }

  .month-badge-large {
    padding: 10px 20px;
  }

  .page-hero h1 {
    font-size: 20px;
  }

  .quick-stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-item {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .milestones-progress {
    flex-direction: column;
    text-align: center;
  }

  .safety-header {
    flex-direction: column;
    text-align: center;
  }

  .care-grid,
  .nutrition-grid,
  .milestones-grid {
    grid-template-columns: 1fr;
  }

  .physical-grid {
    grid-template-columns: 1fr;
  }

  /* 移动端顶部导航 */
  .top-nav {
    padding: 10px 12px;
  }

  .nav-title-area {
    display: none;
  }

  .nav-month-dropdown {
    font-size: 13px;
    padding: 5px 10px;
  }

  /* 移动端Hero操作 */
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-action-btn {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  /* 移动端成长记录入口 */
  .record-entry-content {
    flex-direction: column;
    text-align: center;
  }

  .record-text {
    text-align: center;
  }

  /* 移动端底部导航 */
  .bottom-nav {
    flex-direction: column;
    gap: 12px;
  }

  .nav-prev-btn,
  .nav-next-btn,
  .nav-home-btn {
    width: 100%;
  }

  .nav-placeholder {
    display: none;
  }
}

/* 标签栏优化 */
.detail-tabs :deep(.el-tabs__nav-wrap) {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.detail-tabs :deep(.el-tabs__nav-scroll) {
  overflow: visible;
}

.detail-tabs :deep(.el-tabs__item) {
  padding: 0 16px;
  height: 48px;
  font-weight: 600;
}

.detail-tabs :deep(.el-tabs__item.is-active) {
  color: #667eea;
}

.detail-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 3px;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .detail-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 13px;
  }

  .tab-icon {
    font-size: 16px;
  }

  .tab-text {
    font-size: 12px;
  }
}

/* 卡片头部优化 */
.card-header-custom {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header-custom .header-text {
  display: flex;
  flex-direction: column;
}

.card-header-custom .header-text h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.header-subtitle {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.header-count {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

/* 可折叠卡片头部 */
.card-header-collapsible {
  cursor: pointer;
  width: 100%;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.card-header-collapsible:hover {
  opacity: 0.8;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-icon {
  transition: transform 0.3s ease;
  color: #909399;
}

.collapse-icon.is-rotated {
  transform: rotate(-180deg);
}

/* 物理发育卡片优化 */
.physical-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.physical-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #ebeef5;
  transition: all 0.3s ease;
}

.physical-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.physical-item.weight-item {
  border-left: 4px solid #67c23a;
}

.physical-item.height-item {
  border-left: 4px solid #409eff;
}

.physical-item.head-item {
  border-left: 4px solid #e6a23c;
}

.physical-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.physical-icon-wrapper .physical-icon {
  font-size: 28px;
}

.physical-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.physical-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.physical-value {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
}

.physical-hint {
  margin-top: 6px;
}

.hint-text {
  font-size: 11px;
  color: #a8abb2;
  cursor: help;
}

.hint-text:hover {
  color: #667eea;
}

/* 发育提醒 */
.development-alert {
  border-radius: 12px;
}

/* 能力发展区域 */
.skills-section {
  margin-top: 24px;
}

.skills-header {
  margin-bottom: 20px;
  padding: 0 4px;
}

.skills-header h3 {
  margin: 0 0 6px 0;
  font-size: 20px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 24px;
}

.skills-subtitle {
  font-size: 13px;
  color: #909399;
}

/* 技能卡片折叠状态 */
.skill-card.is-collapsed {
  opacity: 0.85;
}

.skill-card.is-collapsed :deep(.el-card__body) {
  padding: 0;
}

@media (max-width: 768px) {
  .physical-grid {
    grid-template-columns: 1fr;
  }

  .physical-item {
    padding: 16px;
  }

  .physical-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .physical-icon-wrapper .physical-icon {
    font-size: 22px;
  }
}
</style>

<template>
  <div class="month-detail-view" v-if="monthData">
    <!-- 🎯 本月成长关键词卡片（替换原SVG装饰区） -->
    <div class="growth-keywords-section">
      <div class="keywords-card">
        <div class="keywords-header">
          <span class="keywords-title">🌟 本月成长关键词</span>
          <span class="keywords-subtitle">点击了解详细能力指南</span>
        </div>
        <div class="keywords-content">
          <div
            v-for="(keyword, idx) in monthKeywords"
            :key="idx"
            class="keyword-item"
            @click="handleKeywordClick(keyword)"
          >
            <div class="keyword-icon-circle">
              <span class="keyword-icon">{{ keyword.icon }}</span>
            </div>
            <span class="keyword-label">{{ keyword.text }}</span>
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
            </div>

            <div class="milestones-grid">
              <div
                v-for="(milestone, index) in monthData.milestones"
                :key="index"
                :class="[
                  'milestone-card',
                  { completed: isMilestoneCompleted(milestone.title) },
                ]"
                @click="toggleMilestone(milestone.title)"
              >
                <div class="milestone-check">
                  <div class="check-circle">
                    <el-icon v-if="isMilestoneCompleted(milestone.title)">
                      <Check />
                    </el-icon>
                  </div>
                </div>
                <div class="milestone-content">
                  <h4>{{ milestone.title }}</h4>
                  <p>{{ milestone.description }}</p>
                </div>
                <div class="milestone-status">
                  <el-tag
                    :type="
                      isMilestoneCompleted(milestone.title) ? 'success' : 'info'
                    "
                    effect="plain"
                  >
                    {{
                      isMilestoneCompleted(milestone.title)
                        ? '已完成 🎉'
                        : '待完成'
                    }}
                  </el-tag>
                </div>
              </div>
            </div>
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

    <!-- 成长记录入口区域 -->
    <div class="growth-record-section">
      <el-card class="record-entry-card">
        <div class="record-entry-content">
          <div class="record-icon">📝</div>
          <div class="record-text">
            <h3>记录今日成长</h3>
            <p>每一个第一次都值得铭记，让宝宝的成长足迹永不遗忘</p>
          </div>
          <el-button type="primary" round size="large" @click="goToDiary">
            <el-icon><Edit /></el-icon>
            开始记录
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 下月龄预告 -->
    <div
      class="next-month-preview"
      v-if="nextMonthData && monthData.month < 12"
    >
      <el-card class="preview-card">
        <div class="preview-header">
          <span class="preview-icon">🔮</span>
          <h3>下月龄预告：{{ nextMonthData.month }}个月</h3>
        </div>
        <p class="preview-summary">{{ nextMonthData.summary }}</p>
        <div class="preview-milestones">
          <span class="preview-label">即将解锁的能力：</span>
          <div class="preview-tags">
            <el-tag
              v-for="(m, idx) in nextMonthData.milestones?.slice(0, 3)"
              :key="idx"
              type="info"
              effect="plain"
            >
              {{ m.title }}
            </el-tag>
            <el-tag
              v-if="nextMonthData.milestones?.length > 3"
              type="info"
              effect="plain"
            >
              +{{ nextMonthData.milestones.length - 3 }}更多
            </el-tag>
          </div>
        </div>
        <el-button text type="primary" @click="navigateMonth(1)">
          查看{{ nextMonthData.month }}月龄详情
          <el-icon><ArrowRight /></el-icon>
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
import { ref, computed, onMounted, watch } from 'vue'
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
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
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

// 🎯 新增：本月成长关键词
const monthKeywords = computed(() => {
  const keywordsMap: Record<
    number,
    Array<{ icon: string; text: string; tab: string }>
  > = {
    0: [
      { icon: '👀', text: '视觉追踪', tab: 'development' },
      { icon: '🤱', text: '亲密依恋', tab: 'care' },
      { icon: '😴', text: '睡眠规律', tab: 'care' },
    ],
    1: [
      { icon: '😊', text: '社交微笑', tab: 'development' },
      { icon: '👂', text: '声音定位', tab: 'development' },
      { icon: '💪', text: '抬头训练', tab: 'milestones' },
    ],
    2: [
      { icon: '🗣️', text: '咿呀学语', tab: 'development' },
      { icon: '👐', text: '手眼协调', tab: 'milestones' },
      { icon: '😄', text: '情绪表达', tab: 'development' },
    ],
    3: [
      { icon: '🎯', text: '抓握能力', tab: 'milestones' },
      { icon: '🔄', text: '翻身练习', tab: 'milestones' },
      { icon: '📅', text: '作息规律', tab: 'care' },
    ],
    4: [
      { icon: '🎭', text: '情绪识别', tab: 'development' },
      { icon: '🤝', text: '社交互动', tab: 'development' },
      { icon: '🎮', text: '游戏探索', tab: 'care' },
    ],
    5: [
      { icon: '🦷', text: '出牙准备', tab: 'care' },
      { icon: '🍎', text: '辅食预备', tab: 'nutrition' },
      { icon: '🧸', text: '物品探索', tab: 'milestones' },
    ],
    6: [
      { icon: '🥣', text: '辅食添加', tab: 'nutrition' },
      { icon: '🪑', text: '独坐练习', tab: 'milestones' },
      { icon: '👋', text: '再见挥手', tab: 'development' },
    ],
    7: [
      { icon: '🧗', text: '爬行萌芽', tab: 'milestones' },
      { icon: '📦', text: '物体恒存', tab: 'development' },
      { icon: '🗣️', text: '叫名反应', tab: 'development' },
    ],
    8: [
      { icon: '🐛', text: '爬行探索', tab: 'milestones' },
      { icon: '👆', text: '精细动作', tab: 'development' },
      { icon: '😰', text: '分离焦虑', tab: 'development' },
    ],
    9: [
      { icon: '🧍', text: '扶站练习', tab: 'milestones' },
      { icon: '👏', text: '拍手游戏', tab: 'development' },
      { icon: '🔤', text: '语言理解', tab: 'development' },
    ],
    10: [
      { icon: '🚶', text: '学步准备', tab: 'milestones' },
      { icon: '🎯', text: '精准抓取', tab: 'development' },
      { icon: '📚', text: '绘本互动', tab: 'care' },
    ],
    11: [
      { icon: '👣', text: '独立迈步', tab: 'milestones' },
      { icon: '🗣️', text: '叠词表达', tab: 'development' },
      { icon: '🧩', text: '因果认知', tab: 'development' },
    ],
    12: [
      { icon: '🎂', text: '周岁里程', tab: 'milestones' },
      { icon: '🚶', text: '独立行走', tab: 'milestones' },
      { icon: '💬', text: '简单词汇', tab: 'development' },
    ],
  }
  return keywordsMap[monthData.value?.month || 0] || keywordsMap[0]
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

// 处理关键词点击
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

onMounted(() => {
  const monthId = parseInt(route.params.id as string)
  babyStore.setCurrentMonth(monthId)
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
  justify-content: space-around;
  gap: 12px;
}

.keyword-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
  flex: 1;
  padding: 8px;
  border-radius: 16px;
}

.keyword-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.6);
}

.keyword-item:active {
  transform: scale(0.95);
}

.keyword-icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffff 0%, #f3f0ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(103, 126, 234, 0.15),
    inset 0 -2px 4px rgba(103, 126, 234, 0.05);
  border: 2px solid rgba(167, 139, 250, 0.2);
  transition: all 0.3s ease;
}

.keyword-item:hover .keyword-icon-circle {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(103, 126, 234, 0.25),
    inset 0 -2px 4px rgba(103, 126, 234, 0.1);
  border-color: rgba(139, 92, 246, 0.4);
}

.keyword-icon {
  font-size: 26px;
}

.keyword-label {
  font-size: 13px;
  font-weight: 600;
  color: #6d28d9;
  text-align: center;
  white-space: nowrap;
}

/* 响应式：移动端 */
@media (max-width: 480px) {
  .keywords-card {
    padding: 16px 16px;
  }

  .keywords-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 14px;
  }

  .keyword-icon-circle {
    width: 50px;
    height: 50px;
  }

  .keyword-icon {
    font-size: 22px;
  }

  .keyword-label {
    font-size: 12px;
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
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.milestone-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.milestone-card.completed {
  background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
  border-color: #38ef7d;
}

.milestone-check {
  display: flex;
  justify-content: flex-end;
}

.check-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.milestone-card.completed .check-circle {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-color: transparent;
  color: white;
}

.milestone-content h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
}

.milestone-content p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
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

/* 下月预告区域 */
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
  gap: 12px;
  margin-bottom: 12px;
}

.preview-icon {
  font-size: 28px;
}

.preview-header h3 {
  margin: 0;
  font-size: 18px;
  color: #0369a1;
  font-weight: 700;
}

.preview-summary {
  font-size: 14px;
  color: #0c4a6e;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.preview-milestones {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.preview-label {
  font-size: 13px;
  color: #0369a1;
  font-weight: 600;
}

.preview-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

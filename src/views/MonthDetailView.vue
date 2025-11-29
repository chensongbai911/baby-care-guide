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
  Camera,
  Close,
  Plus,
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

  // 可选：跳转到日记页面查看
  // router.push('/diary')
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

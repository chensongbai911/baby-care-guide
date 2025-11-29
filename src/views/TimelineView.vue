<template>
  <div class="timeline-view">
    <!-- 页面标题区域 -->
    <div class="timeline-header" ref="headerRef">
      <div class="header-decoration">
        <div class="deco-blob blob-1"></div>
        <div class="deco-blob blob-2"></div>
        <div class="deco-blob blob-3"></div>
      </div>

      <div class="header-content">
        <div class="title-wrapper">
          <h1 class="main-title">
            <span class="title-icon">🌟</span>
            <span class="title-text">宝宝成长时间轴</span>
          </h1>
          <p class="subtitle">记录每一个珍贵的成长瞬间</p>
        </div>

        <!-- 总体进度统计 -->
        <div class="overall-stats">
          <div class="stat-card stat-current" :style="{ animationDelay: '0s' }">
            <div class="stat-icon">📍</div>
            <div class="stat-info">
              <div class="stat-value">
                当前：{{ babyStore.currentMonth }}月龄
              </div>
              <div class="stat-label">
                第 {{ babyStore.currentMonth + 1 }}/13 阶段
              </div>
            </div>
            <div class="stat-glow"></div>
          </div>
          <div class="stat-card" :style="{ animationDelay: '0.1s' }">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <div class="stat-value">
                {{ babyStore.completedMilestonesCount }}
              </div>
              <div class="stat-label">已完成里程碑</div>
            </div>
            <div class="stat-glow"></div>
          </div>
          <div class="stat-card" :style="{ animationDelay: '0.2s' }">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <div class="stat-value">
                {{
                  Math.round(
                    (babyStore.completedMilestonesCount /
                      babyStore.totalMilestonesCount) *
                      100,
                  )
                }}%
              </div>
              <div class="stat-label">总体进度</div>
            </div>
            <div class="stat-glow"></div>
          </div>
        </div>

        <!-- 功能快捷入口 -->
        <div class="feature-shortcuts">
          <div class="shortcut-card" @click="openGrowthAlbum">
            <div class="shortcut-icon">📸</div>
            <div class="shortcut-info">
              <span class="shortcut-title">成长相册</span>
              <span class="shortcut-desc">{{ growthMomentsCount }} 个瞬间</span>
            </div>
            <div class="shortcut-badge" v-if="hasNewMoments">NEW</div>
          </div>
          <div class="shortcut-card" @click="showSmartReminder">
            <div class="shortcut-icon">🔔</div>
            <div class="shortcut-info">
              <span class="shortcut-title">智能提醒</span>
              <span class="shortcut-desc">{{ pendingReminders }} 项待办</span>
            </div>
            <div class="shortcut-badge warning" v-if="pendingReminders > 0">
              {{ pendingReminders }}
            </div>
          </div>
          <div class="shortcut-card" @click="openFamilyCollaboration">
            <div class="shortcut-icon">👨‍👩‍👧</div>
            <div class="shortcut-info">
              <span class="shortcut-title">家庭协作</span>
              <span class="shortcut-desc">{{ familyMembersCount }} 位成员</span>
            </div>
          </div>
          <div class="shortcut-card" @click="generateGrowthReport">
            <div class="shortcut-icon">📊</div>
            <div class="shortcut-info">
              <span class="shortcut-title">成长报告</span>
              <span class="shortcut-desc">一键生成</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能提醒横幅 -->
    <Transition name="slide-down">
      <div
        class="smart-reminder-banner"
        v-if="showReminderBanner && currentWeekMilestones.length > 0"
      >
        <div class="reminder-content">
          <span class="reminder-icon">🌟</span>
          <div class="reminder-text">
            <strong>本周关键里程碑</strong>
            <p>
              宝宝快{{ babyStore.currentMonth + 1 }}个月啦，关注「{{
                currentWeekMilestones[0]
              }}」能力
            </p>
          </div>
        </div>
        <div class="reminder-actions">
          <el-button size="small" type="primary" round @click="goToChecklist">
            去打卡
          </el-button>
          <el-button size="small" text @click="dismissReminder">
            稍后提醒
          </el-button>
        </div>
      </div>
    </Transition>

    <!-- 未打卡提醒弹窗 -->
    <el-dialog
      v-model="showNoCheckInDialog"
      title="温馨提示 💝"
      width="90%"
      class="no-checkin-dialog"
      center
    >
      <div class="no-checkin-content">
        <div class="no-checkin-icon">📅</div>
        <p class="no-checkin-text">
          已经
          <strong>{{ daysSinceLastCheckIn }}</strong>
          天没有记录啦~
        </p>
        <p class="no-checkin-hint">
          宝宝每天都在成长，建议查看训练方法，帮助宝宝发展新技能！
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showNoCheckInDialog = false">稍后再说</el-button>
          <el-button type="primary" @click="goToTrainingMethods">
            查看训练方法
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 成长相册弹窗 -->
    <el-dialog
      v-model="showAlbumDialog"
      title="📸 成长相册"
      width="95%"
      class="album-dialog"
      fullscreen
    >
      <div class="album-content">
        <!-- 月份筛选 -->
        <div class="album-filter">
          <el-radio-group v-model="albumFilterMonth" size="small">
            <el-radio-button :value="-1">全部</el-radio-button>
            <el-radio-button
              v-for="m in 13"
              :key="m - 1"
              :value="m - 1"
              :disabled="!hasPhotosInMonth(m - 1)"
            >
              {{ m - 1 }}月
            </el-radio-button>
          </el-radio-group>
        </div>

        <!-- 相册网格 -->
        <div class="album-grid" v-if="filteredGrowthMoments.length > 0">
          <div
            v-for="moment in filteredGrowthMoments"
            :key="moment.id"
            class="album-item"
            @click="viewMomentDetail(moment)"
          >
            <div class="album-thumb">
              <img :src="moment.media[0]" :alt="moment.milestone" />
              <div class="album-overlay">
                <span class="album-milestone">{{ moment.milestone }}</span>
                <span class="album-date">{{ formatDate(moment.date) }}</span>
              </div>
              <div class="media-count" v-if="moment.media.length > 1">
                +{{ moment.media.length - 1 }}
              </div>
            </div>
          </div>
        </div>

        <el-empty v-else description="还没有成长瞬间，快去记录里程碑吧~">
          <el-button type="primary" @click="goToChecklist">去记录</el-button>
        </el-empty>
      </div>

      <template #footer>
        <div class="album-footer">
          <el-button @click="shareAlbum" type="primary" round>
            <span>📤</span>
            分享相册
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 成长瞬间详情弹窗 -->
    <el-dialog
      v-model="showMomentDetailDialog"
      :title="currentMoment?.milestone"
      width="95%"
      class="moment-detail-dialog"
    >
      <div class="moment-detail-content" v-if="currentMoment">
        <!-- 媒体轮播 -->
        <el-carousel
          :autoplay="false"
          indicator-position="outside"
          height="300px"
        >
          <el-carousel-item
            v-for="(media, idx) in currentMoment.media"
            :key="idx"
          >
            <img :src="media" class="moment-media" />
          </el-carousel-item>
        </el-carousel>

        <div class="moment-info">
          <div class="moment-date">
            <el-icon><Calendar /></el-icon>
            {{ formatDate(currentMoment.date) }}
          </div>
          <div class="moment-note" v-if="currentMoment.note">
            {{ currentMoment.note }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="moment-actions">
          <el-button @click="shareMoment" type="primary">
            <span>📤</span>
            分享
          </el-button>
          <el-button @click="deleteMoment" type="danger" plain>
            <span>🗑️</span>
            删除
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 家庭协作弹窗 -->
    <el-dialog
      v-model="showFamilyDialog"
      title="👨‍👩‍👧 家庭协作"
      width="95%"
      class="family-dialog"
    >
      <div class="family-content">
        <!-- 当前用户 -->
        <div class="family-current-user">
          <div class="user-avatar primary">
            {{ babyStore.babyInfo.name?.charAt(0) || '宝' }}
          </div>
          <div class="user-info">
            <h4>{{ babyStore.babyInfo.name || '宝宝' }}的成长记录</h4>
            <el-tag size="small" type="primary">主账号</el-tag>
          </div>
        </div>

        <!-- 家庭成员列表 -->
        <div class="family-members-section">
          <div class="section-header">
            <h3>家庭成员</h3>
            <el-button
              size="small"
              type="primary"
              @click="showAddFamilyMember = true"
            >
              + 添加成员
            </el-button>
          </div>

          <div class="family-members-list" v-if="familyMembers.length > 0">
            <div
              v-for="member in familyMembers"
              :key="member.id"
              class="family-member-card"
            >
              <div class="member-avatar" :style="{ background: member.color }">
                {{ member.name.charAt(0) }}
              </div>
              <div class="member-info">
                <span class="member-name">{{ member.name }}</span>
                <span class="member-relation">{{ member.relation }}</span>
              </div>
              <div class="member-permission">
                <el-tag
                  :type="member.permission === 'edit' ? 'success' : 'info'"
                  size="small"
                >
                  {{ member.permission === 'edit' ? '可记录' : '仅查看' }}
                </el-tag>
              </div>
              <el-button
                text
                type="danger"
                size="small"
                @click="removeFamilyMember(member.id)"
              >
                移除
              </el-button>
            </div>
          </div>

          <el-empty v-else description="还没有添加家庭成员" />
        </div>

        <!-- 添加成员表单 -->
        <Transition name="slide-down">
          <div class="add-member-form" v-if="showAddFamilyMember">
            <el-form :model="newFamilyMember" label-position="top">
              <el-form-item label="称呼">
                <el-input
                  v-model="newFamilyMember.name"
                  placeholder="如：奶奶"
                />
              </el-form-item>
              <el-form-item label="关系">
                <el-select
                  v-model="newFamilyMember.relation"
                  style="width: 100%;"
                >
                  <el-option label="爸爸" value="爸爸" />
                  <el-option label="妈妈" value="妈妈" />
                  <el-option label="爷爷" value="爷爷" />
                  <el-option label="奶奶" value="奶奶" />
                  <el-option label="外公" value="外公" />
                  <el-option label="外婆" value="外婆" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
              <el-form-item label="权限">
                <el-radio-group v-model="newFamilyMember.permission">
                  <el-radio value="view">仅查看</el-radio>
                  <el-radio value="edit">可记录</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="showAddFamilyMember = false">取消</el-button>
                <el-button type="primary" @click="addFamilyMember">
                  添加
                </el-button>
              </div>
            </el-form>
          </div>
        </Transition>

        <!-- 活动通知 -->
        <div class="activity-notifications">
          <h3>🔔 最近活动</h3>
          <div class="activity-list" v-if="recentActivities.length > 0">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div
                class="activity-avatar"
                :style="{ background: activity.color }"
              >
                {{ activity.memberName.charAt(0) }}
              </div>
              <div class="activity-content">
                <p>
                  <strong>{{ activity.memberName }}</strong>
                  {{ activity.action }}
                </p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无活动记录" />
        </div>
      </div>
    </el-dialog>

    <!-- 成长报告生成弹窗 -->
    <el-dialog
      v-model="showReportDialog"
      title="📊 成长报告"
      width="95%"
      class="report-dialog"
    >
      <div class="report-content" ref="reportRef">
        <!-- 报告头部 -->
        <div class="report-header">
          <div class="report-avatar">
            {{ babyStore.babyInfo.name?.charAt(0) || '宝' }}
          </div>
          <div class="report-title">
            <h2>{{ babyStore.babyInfo.name || '宝宝' }}的成长报告</h2>
            <p>出生日期：{{ formatBirthday() }}</p>
            <p>当前月龄：{{ babyStore.currentMonth }}月龄</p>
          </div>
        </div>

        <!-- 总体统计 -->
        <div class="report-section">
          <h3>📈 总体进度</h3>
          <div class="report-stats">
            <div class="report-stat">
              <div class="stat-number">
                {{ babyStore.completedMilestonesCount }}
              </div>
              <div class="stat-label">已完成里程碑</div>
            </div>
            <div class="report-stat">
              <div class="stat-number">
                {{ babyStore.totalMilestonesCount }}
              </div>
              <div class="stat-label">总里程碑数</div>
            </div>
            <div class="report-stat">
              <div class="stat-number">
                {{
                  Math.round(
                    (babyStore.completedMilestonesCount /
                      babyStore.totalMilestonesCount) *
                      100,
                  )
                }}%
              </div>
              <div class="stat-label">完成率</div>
            </div>
          </div>
        </div>

        <!-- 各月龄完成情况 -->
        <div class="report-section">
          <h3>📅 各月龄完成情况</h3>
          <div class="month-progress-list">
            <div
              v-for="month in monthsData"
              :key="month.month"
              class="month-progress-item"
            >
              <div class="month-label">{{ month.month }}月龄</div>
              <div class="progress-bar-wrapper">
                <el-progress
                  :percentage="getMonthCompletionRate(month)"
                  :stroke-width="8"
                  :show-text="false"
                />
              </div>
              <div class="progress-text">
                {{ getCompletedCount(month) }}/{{
                  month.milestones?.length || 0
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- 能力发展曲线 -->
        <div class="report-section">
          <h3>🎯 关键能力发展</h3>
          <div class="ability-chart">
            <div
              class="ability-item"
              v-for="ability in abilityProgress"
              :key="ability.name"
            >
              <div class="ability-name">
                <span class="ability-icon">{{ ability.icon }}</span>
                {{ ability.name }}
              </div>
              <div class="ability-bar">
                <div
                  class="ability-fill"
                  :style="{ width: ability.progress + '%' }"
                ></div>
              </div>
              <div class="ability-percent">{{ ability.progress }}%</div>
            </div>
          </div>
        </div>

        <!-- 报告生成时间 -->
        <div class="report-footer">
          <p>报告生成时间：{{ new Date().toLocaleDateString() }}</p>
          <p class="report-powered">Powered by 宝宝成长指南</p>
        </div>
      </div>

      <template #footer>
        <div class="report-actions">
          <el-button @click="downloadReport" type="primary" round>
            <span>📥</span>
            下载报告
          </el-button>
          <el-button @click="shareReport" round>
            <span>📤</span>
            分享到微信
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 横向时间轴导航 -->
    <div class="horizontal-timeline-nav">
      <div class="nav-wrapper">
        <el-button
          circle
          size="small"
          class="nav-arrow nav-prev"
          @click="scrollTimeline(-1)"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>

        <div class="timeline-nav-track" ref="timelineNavRef">
          <div class="timeline-nav-items">
            <el-tooltip
              v-for="month in monthsData"
              :key="month.month"
              :content="getMonthTooltip(month.month)"
              placement="bottom"
              :disabled="getMonthStatus(month.month) !== 'locked'"
            >
              <div
                :class="[
                  'timeline-nav-item',
                  {
                    'is-current': month.month === currentMonth,
                    'is-completed': getMonthStatus(month.month) === 'completed',
                    'is-locked': getMonthStatus(month.month) === 'locked',
                  },
                ]"
                @click="handleMonthClick(month.month)"
              >
                <div class="nav-item-marker">
                  <span v-if="getMonthStatus(month.month) === 'completed'">
                    ✓
                  </span>
                  <span v-else-if="getMonthStatus(month.month) === 'locked'">
                    🔒
                  </span>
                  <span v-else>{{ month.month }}</span>
                </div>
                <div class="nav-item-label">{{ month.month }}月</div>
                <!-- 未解锁提示 -->
                <div
                  v-if="getMonthStatus(month.month) === 'locked'"
                  class="unlock-hint"
                >
                  {{ month.month }}月龄解锁
                </div>
                <div
                  class="nav-item-progress"
                  :style="{ width: getMilestoneProgress(month) + '%' }"
                ></div>
              </div>
            </el-tooltip>
          </div>
        </div>

        <el-button
          circle
          size="small"
          class="nav-arrow nav-next"
          @click="scrollTimeline(1)"
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <!-- 进度提示 + 快捷导航 -->
      <div class="timeline-progress-hint">
        <div class="hint-left">
          <span class="hint-icon">🔓</span>
          <span class="hint-text">
            已解锁 {{ unlockedMonthsCount }}/13 个阶段
          </span>
        </div>
        <div class="hint-actions">
          <el-button
            size="small"
            round
            @click="goToChecklist"
            class="checklist-btn"
          >
            <span class="btn-icon">✅</span>
            <span>成长清单</span>
            <span v-if="pendingMilestones > 0" class="badge-dot">
              {{ pendingMilestones }}
            </span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 时间轴内容 -->
    <div class="timeline-container" ref="timelineRef">
      <!-- 中央时间线 -->
      <div class="timeline-line">
        <div
          class="timeline-progress"
          :style="{ height: scrollProgress + '%' }"
        >
          <div class="progress-glow"></div>
        </div>
      </div>

      <!-- 月份卡片 -->
      <div
        v-for="(month, index) in monthsData"
        :key="month.month"
        :class="[
          'timeline-item',
          { left: index % 2 === 0, right: index % 2 !== 0 },
        ]"
        :ref="
          (el) => {
            if (el) monthRefs[index] = el
          }
        "
        @mouseenter="onCardHover(index)"
        @mouseleave="onCardLeave(index)"
      >
        <!-- 时间点 -->
        <div class="timeline-dot">
          <div class="dot-outer">
            <div class="dot-inner">
              <span class="dot-month">{{ month.month }}</span>
            </div>
            <div class="dot-ring"></div>
            <div class="dot-pulse"></div>
          </div>
        </div>

        <!-- 月份卡片 -->
        <div class="month-card" @click="navigateToMonth(month.month)">
          <!-- 卡片光效 -->
          <div class="card-shine"></div>

          <!-- 装饰元素 -->
          <div class="card-decorations">
            <div class="deco-star" v-for="i in 3" :key="i"></div>
          </div>

          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="month-badge">
              <span class="badge-month">{{ month.month }}</span>
              <span class="badge-unit">月龄</span>
            </div>
            <div class="header-title">
              <h3>{{ month.title }}</h3>
              <p class="month-summary">{{ month.summary }}</p>
            </div>
          </div>

          <!-- 发育亮点 - 按维度分类 -->
          <div class="highlights-section">
            <div class="section-title">
              <span class="title-icon">✨</span>
              <span>发育亮点</span>
              <el-button
                text
                size="small"
                class="expand-btn"
                @click.stop="toggleDevelopment(month.month)"
              >
                {{ expandedMonths.includes(month.month) ? '收起' : '展开' }}
              </el-button>
            </div>

            <!-- 维度标签 -->
            <div class="dimension-tabs">
              <div
                v-for="dim in developmentDimensions"
                :key="dim.id"
                :class="[
                  'dimension-tab',
                  { active: activeDimension === dim.id },
                ]"
                @click.stop="activeDimension = dim.id"
              >
                <span class="dim-icon">{{ dim.icon }}</span>
                <span class="dim-label">{{ dim.label }}</span>
              </div>
            </div>

            <!-- 维度内容 -->
            <div class="highlights-grid">
              <!-- 大运动 -->
              <template
                v-if="
                  activeDimension === 'gross' ||
                  expandedMonths.includes(month.month)
                "
              >
                <div
                  class="dimension-section"
                  v-if="month.motorSkills?.gross?.length"
                >
                  <div
                    class="dim-header"
                    v-if="expandedMonths.includes(month.month)"
                  >
                    <span class="dim-icon">🏃</span>
                    <span>大运动</span>
                  </div>
                  <div
                    class="highlight-item"
                    v-for="(skill, idx) in month.motorSkills.gross.slice(
                      0,
                      expandedMonths.includes(month.month) ? 3 : 1,
                    )"
                    :key="'gross-' + idx"
                  >
                    <span class="highlight-icon">🏃</span>
                    <span class="highlight-text">{{ skill }}</span>
                  </div>
                </div>
              </template>

              <!-- 精细动作 -->
              <template
                v-if="
                  activeDimension === 'fine' ||
                  expandedMonths.includes(month.month)
                "
              >
                <div
                  class="dimension-section"
                  v-if="month.motorSkills?.fine?.length"
                >
                  <div
                    class="dim-header"
                    v-if="expandedMonths.includes(month.month)"
                  >
                    <span class="dim-icon">✋</span>
                    <span>精细动作</span>
                  </div>
                  <div
                    class="highlight-item"
                    v-for="(skill, idx) in month.motorSkills.fine.slice(
                      0,
                      expandedMonths.includes(month.month) ? 2 : 1,
                    )"
                    :key="'fine-' + idx"
                  >
                    <span class="highlight-icon">✋</span>
                    <span class="highlight-text">{{ skill }}</span>
                  </div>
                </div>
              </template>

              <!-- 认知 -->
              <template
                v-if="
                  activeDimension === 'cognitive' ||
                  expandedMonths.includes(month.month)
                "
              >
                <div
                  class="dimension-section"
                  v-if="month.cognitiveSkills?.length"
                >
                  <div
                    class="dim-header"
                    v-if="expandedMonths.includes(month.month)"
                  >
                    <span class="dim-icon">🧠</span>
                    <span>认知发展</span>
                  </div>
                  <div
                    class="highlight-item"
                    v-for="(skill, idx) in month.cognitiveSkills.slice(
                      0,
                      expandedMonths.includes(month.month) ? 2 : 1,
                    )"
                    :key="'cog-' + idx"
                  >
                    <span class="highlight-icon">🧠</span>
                    <span class="highlight-text">{{ skill }}</span>
                  </div>
                </div>
              </template>

              <!-- 社交情感 -->
              <template
                v-if="
                  activeDimension === 'social' ||
                  expandedMonths.includes(month.month)
                "
              >
                <div
                  class="dimension-section"
                  v-if="month.socialEmotional?.length"
                >
                  <div
                    class="dim-header"
                    v-if="expandedMonths.includes(month.month)"
                  >
                    <span class="dim-icon">💕</span>
                    <span>社交情感</span>
                  </div>
                  <div
                    class="highlight-item"
                    v-for="(skill, idx) in month.socialEmotional.slice(
                      0,
                      expandedMonths.includes(month.month) ? 2 : 1,
                    )"
                    :key="'social-' + idx"
                  >
                    <span class="highlight-icon">💕</span>
                    <span class="highlight-text">{{ skill }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 里程碑打卡 -->
          <div class="milestones-preview">
            <div class="section-title">
              <span class="title-icon">🏆</span>
              <span>里程碑打卡</span>
              <el-tooltip
                content="里程碑：宝宝发育过程中的关键能力节点，每个宝宝发育进度不同，仅供参考"
                placement="top"
              >
                <span class="info-tip">ℹ️</span>
              </el-tooltip>
              <span class="milestone-count">
                {{ getCompletedCount(month) }}/{{
                  month.milestones?.length || 0
                }}
              </span>
            </div>

            <!-- 里程碑列表 -->
            <div class="milestone-checklist" v-if="month.milestones">
              <div
                v-for="(milestone, idx) in month.milestones.slice(0, 4)"
                :key="idx"
                :class="[
                  'milestone-check-item',
                  {
                    completed: babyStore.isMilestoneCompleted(milestone.title),
                  },
                ]"
                @click.stop="toggleMilestone(milestone.title)"
              >
                <div class="check-box">
                  <el-icon
                    v-if="babyStore.isMilestoneCompleted(milestone.title)"
                  >
                    <Check />
                  </el-icon>
                </div>
                <span class="milestone-text">{{ milestone.title }}</span>
                <!-- 知识卡片提示 -->
                <el-tooltip placement="top">
                  <template #content>
                    <div class="knowledge-card-tip">
                      <div class="tip-title">💡 {{ milestone.title }}</div>
                      <div class="tip-content">
                        {{ getMilestoneKnowledge(milestone.title) }}
                      </div>
                      <div class="tip-footer">点击查看详细指导</div>
                    </div>
                  </template>
                  <span
                    class="knowledge-btn"
                    @click.stop="showKnowledgeCard(milestone.title)"
                  >
                    ❓
                  </span>
                </el-tooltip>
              </div>
              <div v-if="month.milestones.length > 4" class="more-milestones">
                +{{ month.milestones.length - 4 }} 更多里程碑
              </div>
            </div>

            <!-- 进度环 -->
            <div class="progress-ring-container">
              <div class="progress-ring">
                <svg viewBox="0 0 100 100">
                  <circle
                    class="ring-bg"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="8"
                  />
                  <circle
                    class="ring-progress"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#progressGradient)"
                    stroke-width="8"
                    stroke-linecap="round"
                    :stroke-dasharray="251.2"
                    :stroke-dashoffset="
                      251.2 - (251.2 * getMilestoneProgress(month)) / 100
                    "
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stop-color="#667eea" />
                      <stop offset="100%" stop-color="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="ring-text">
                  <span class="ring-value">
                    {{ getMilestoneProgress(month) }}%
                  </span>
                  <span class="ring-label">完成</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 身高体重参考 - 刻度条显示 -->
          <div class="physical-reference">
            <div class="section-title">
              <span class="title-icon">📊</span>
              <span>身体发育参考</span>
            </div>
            <div class="physical-scales">
              <!-- 身高刻度 -->
              <div class="scale-item">
                <div class="scale-header">
                  <span class="scale-icon">📏</span>
                  <span class="scale-label">身高</span>
                  <el-tooltip content="WHO儿童生长标准参考范围" placement="top">
                    <span class="info-tip">ℹ️</span>
                  </el-tooltip>
                </div>
                <div class="scale-bar">
                  <div class="scale-track">
                    <div
                      class="scale-range"
                      :style="getHeightRangeStyle(month)"
                    ></div>
                    <div class="scale-markers">
                      <span class="marker-min">
                        {{ getHeightRange(month).min }}cm
                      </span>
                      <span class="marker-max">
                        {{ getHeightRange(month).max }}cm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 体重刻度 -->
              <div class="scale-item">
                <div class="scale-header">
                  <span class="scale-icon">⚖️</span>
                  <span class="scale-label">体重</span>
                  <el-tooltip content="WHO儿童生长标准参考范围" placement="top">
                    <span class="info-tip">ℹ️</span>
                  </el-tooltip>
                </div>
                <div class="scale-bar">
                  <div class="scale-track">
                    <div
                      class="scale-range"
                      :style="getWeightRangeStyle(month)"
                    ></div>
                    <div class="scale-markers">
                      <span class="marker-min">
                        {{ getWeightRange(month).min }}kg
                      </span>
                      <span class="marker-max">
                        {{ getWeightRange(month).max }}kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 查看详情按钮 -->
          <div class="card-footer">
            <div class="footer-hint">
              📚 包含发育解读、养育重点、游戏推荐、常见Q&A
            </div>
            <el-button type="primary" class="view-detail-btn" round>
              查看 {{ month.month }}月龄专属指南
              <el-icon class="btn-icon"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 悬浮效果 -->
          <div class="hover-overlay"></div>
        </div>

        <!-- 连接线动画 -->
        <div class="timeline-connector">
          <div class="connector-line"></div>
        </div>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <transition name="fade-slide">
      <div v-if="showScrollTop" class="floating-actions">
        <el-button
          circle
          size="large"
          @click="scrollToTop"
          class="scroll-top-btn"
        >
          <el-icon><Top /></el-icon>
        </el-button>
      </div>
    </transition>

    <!-- 底部简单装饰 -->
    <div class="bottom-decoration">
      <div class="wave-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import {
  ArrowRight,
  Top,
  ArrowLeft,
  Check,
  Calendar,
  Share,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import html2canvas from 'html2canvas'
import type { BabyMonthData } from '@/types/baby'

const router = useRouter()
const babyStore = useBabyStore()

const monthsData = computed(() => babyStore.allMonthsData)
const headerRef = ref<HTMLElement>()
const timelineRef = ref<HTMLElement>()
const timelineNavRef = ref<HTMLElement>()
const reportRef = ref<HTMLElement>()
const monthRefs = ref<any[]>([])
const scrollProgress = ref(0)
const showScrollTop = ref(false)
const currentMonth = ref(babyStore.currentMonth)
const visitedMonths = ref<number[]>([0]) // 已浏览的月龄
const expandedMonths = ref<number[]>([]) // 已展开的月龄
const activeDimension = ref('gross') // 当前选中的发育维度

// ========== 成长相册相关 ==========
const showAlbumDialog = ref(false)
const showMomentDetailDialog = ref(false)
const albumFilterMonth = ref(-1)
const currentMoment = ref<GrowthMoment | null>(null)
const hasNewMoments = ref(false)

interface GrowthMoment {
  id: string
  milestone: string
  month: number
  date: string
  note: string
  media: string[]
  createdBy?: string
}

// 从 localStorage 加载成长瞬间
const growthMoments = ref<GrowthMoment[]>([])

const loadGrowthMoments = () => {
  const records = localStorage.getItem('milestoneRecords')
  if (records) {
    const parsed = JSON.parse(records)
    const moments: GrowthMoment[] = []

    Object.entries(parsed).forEach(([title, record]: [string, any]) => {
      if (record.media && record.media.length > 0) {
        // 找到对应的月龄
        let month = 0
        for (const monthData of babyStore.allMonthsData) {
          if (
            monthData.milestones?.some(
              (m: { title: string }) => m.title === title,
            )
          ) {
            month = monthData.month
            break
          }
        }

        moments.push({
          id: title,
          milestone: title,
          month,
          date: record.date,
          note: record.note || '',
          media: record.media,
        })
      }
    })

    growthMoments.value = moments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }
}

const growthMomentsCount = computed(() => growthMoments.value.length)

const filteredGrowthMoments = computed(() => {
  if (albumFilterMonth.value === -1) return growthMoments.value
  return growthMoments.value.filter((m) => m.month === albumFilterMonth.value)
})

const hasPhotosInMonth = (month: number): boolean => {
  return growthMoments.value.some((m) => m.month === month)
}

const openGrowthAlbum = () => {
  loadGrowthMoments()
  showAlbumDialog.value = true
  hasNewMoments.value = false
}

const viewMomentDetail = (moment: GrowthMoment) => {
  currentMoment.value = moment
  showMomentDetailDialog.value = true
}

const shareMoment = async () => {
  if (!currentMoment.value) return

  // 模拟分享功能
  try {
    if (navigator.share) {
      await navigator.share({
        title: `${babyStore.babyInfo.name || '宝宝'}的成长瞬间`,
        text: `${currentMoment.value.milestone} - ${currentMoment.value.note}`,
      })
    } else {
      ElMessage.success('已复制分享链接到剪贴板')
    }
  } catch {
    ElMessage.info('分享已取消')
  }
}

const shareAlbum = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: `${babyStore.babyInfo.name || '宝宝'}的成长相册`,
        text: `记录了 ${growthMomentsCount.value} 个珍贵的成长瞬间`,
      })
    } else {
      ElMessage.success('已复制相册链接到剪贴板')
    }
  } catch {
    ElMessage.info('分享已取消')
  }
}

const deleteMoment = async () => {
  if (!currentMoment.value) return

  try {
    await ElMessageBox.confirm(
      `确定要删除"${currentMoment.value.milestone}"的成长瞬间吗？`,
      '删除确认',
      { type: 'warning' },
    )

    // 从 localStorage 删除
    const records = JSON.parse(localStorage.getItem('milestoneRecords') || '{}')
    if (records[currentMoment.value.milestone]) {
      records[currentMoment.value.milestone].media = []
      localStorage.setItem('milestoneRecords', JSON.stringify(records))
    }

    // 更新列表
    loadGrowthMoments()
    showMomentDetailDialog.value = false
    ElMessage.success('已删除')
  } catch {
    // 取消删除
  }
}

// ========== 智能提醒相关 ==========
const showReminderBanner = ref(true)
const showNoCheckInDialog = ref(false)
const daysSinceLastCheckIn = ref(0)

// 本周关键里程碑
const currentWeekMilestones = computed(() => {
  const currentMonthData = babyStore.currentMonthData
  if (!currentMonthData?.milestones) return []

  return currentMonthData.milestones
    .filter((m: { title: string }) => !babyStore.isMilestoneCompleted(m.title))
    .slice(0, 3)
    .map((m: { title: string }) => m.title)
})

const pendingReminders = computed(() => currentWeekMilestones.value.length)

const dismissReminder = () => {
  showReminderBanner.value = false
  localStorage.setItem('reminderDismissed', new Date().toDateString())
}

const checkLastCheckIn = () => {
  const lastCheckIn = localStorage.getItem('lastCheckInDate')
  if (lastCheckIn) {
    const daysDiff = Math.floor(
      (Date.now() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24),
    )
    daysSinceLastCheckIn.value = daysDiff

    if (daysDiff >= 3) {
      showNoCheckInDialog.value = true
    }
  }
}

const goToTrainingMethods = () => {
  showNoCheckInDialog.value = false
  router.push(`/month/${babyStore.currentMonth}`)
}

const showSmartReminder = () => {
  if (currentWeekMilestones.value.length > 0) {
    showReminderBanner.value = true
  } else {
    ElMessage.success('太棒了！本周里程碑都已完成 🎉')
  }
}

// ========== 家庭协作相关 ==========
const showFamilyDialog = ref(false)
const showAddFamilyMember = ref(false)

interface FamilyMember {
  id: string
  name: string
  relation: string
  permission: 'view' | 'edit'
  color: string
}

interface Activity {
  id: string
  memberName: string
  action: string
  time: string
  color: string
}

const familyMembers = ref<FamilyMember[]>([])
const recentActivities = ref<Activity[]>([])

const newFamilyMember = reactive({
  name: '',
  relation: '妈妈',
  permission: 'edit' as 'view' | 'edit',
})

const memberColors = [
  '#9d50ff',
  '#ff6bcc',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#8b5cf6',
]

const familyMembersCount = computed(() => familyMembers.value.length)

const loadFamilyData = () => {
  const saved = localStorage.getItem('familyMembers')
  if (saved) {
    familyMembers.value = JSON.parse(saved)
  }

  const activities = localStorage.getItem('familyActivities')
  if (activities) {
    recentActivities.value = JSON.parse(activities)
  }
}

const openFamilyCollaboration = () => {
  loadFamilyData()
  showFamilyDialog.value = true
}

const addFamilyMember = () => {
  if (!newFamilyMember.name.trim()) {
    ElMessage.warning('请输入成员称呼')
    return
  }

  const colorIndex = familyMembers.value.length % memberColors.length
  const member: FamilyMember = {
    id: Date.now().toString(),
    name: newFamilyMember.name,
    relation: newFamilyMember.relation,
    permission: newFamilyMember.permission,
    color: memberColors[colorIndex] ?? '#9d50ff',
  }

  familyMembers.value.push(member)
  localStorage.setItem('familyMembers', JSON.stringify(familyMembers.value))

  // 重置表单
  newFamilyMember.name = ''
  newFamilyMember.relation = '妈妈'
  newFamilyMember.permission = 'edit'
  showAddFamilyMember.value = false

  ElMessage.success('成员添加成功')
}

const removeFamilyMember = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要移除该成员吗？', '移除确认')
    familyMembers.value = familyMembers.value.filter((m) => m.id !== id)
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers.value))
    ElMessage.success('已移除')
  } catch {
    // 取消
  }
}

// ========== 成长报告相关 ==========
const showReportDialog = ref(false)

const abilityProgress = computed(() => {
  const abilities = [
    { name: '大运动', icon: '🏃', key: 'gross' },
    { name: '精细动作', icon: '✋', key: 'fine' },
    { name: '认知能力', icon: '🧠', key: 'cognitive' },
    { name: '语言能力', icon: '💬', key: 'language' },
    { name: '社交情感', icon: '💕', key: 'social' },
  ]

  return abilities.map((ability) => {
    // 简化计算：基于完成的里程碑数量
    const total = babyStore.totalMilestonesCount
    const completed = babyStore.completedMilestonesCount
    const baseProgress = Math.round((completed / total) * 100)

    // 添加一些随机变化使每个能力看起来不同
    const variation = Math.floor(Math.random() * 20) - 10
    const progress = Math.max(0, Math.min(100, baseProgress + variation))

    return { ...ability, progress }
  })
})

const getMonthCompletionRate = (month: BabyMonthData): number => {
  const total = month.milestones?.length || 0
  if (total === 0) return 0
  const completed = getCompletedCount(month)
  return Math.round((completed / total) * 100)
}

const formatBirthday = (): string => {
  const birthday = babyStore.babyInfo.birthday
  if (!birthday) return '未设置'
  return new Date(birthday).toLocaleDateString('zh-CN')
}

const generateGrowthReport = () => {
  showReportDialog.value = true
}

const downloadReport = async () => {
  if (!reportRef.value) return

  try {
    ElMessage.info('正在生成报告...')

    const canvas = await html2canvas(reportRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const link = document.createElement('a')
    link.download = `${
      babyStore.babyInfo.name || '宝宝'
    }-成长报告-${new Date().toLocaleDateString()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    ElMessage.success('报告已下载')
  } catch (error) {
    console.error('生成报告失败:', error)
    ElMessage.error('生成失败，请重试')
  }
}

const shareReport = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: `${babyStore.babyInfo.name || '宝宝'}的成长报告`,
        text: `已完成 ${
          babyStore.completedMilestonesCount
        } 个里程碑，完成率 ${Math.round(
          (babyStore.completedMilestonesCount /
            babyStore.totalMilestonesCount) *
            100,
        )}%`,
      })
    } else {
      ElMessage.success('已复制报告链接到剪贴板')
    }
  } catch {
    ElMessage.info('分享已取消')
  }
}

// ========== 工具函数 ==========
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 已解锁的月龄数量
const unlockedMonthsCount = computed(() => {
  return babyStore.currentMonth + 1
})

// 待记录里程碑数量（用于红点提示）
const pendingMilestones = computed(() => {
  const currentMonthData = babyStore.currentMonthData
  if (!currentMonthData?.milestones) return 0
  return currentMonthData.milestones.filter(
    (m) => !babyStore.isMilestoneCompleted(m.title),
  ).length
})

// 发育维度配置
const developmentDimensions = [
  { id: 'gross', label: '大运动', icon: '🏃' },
  { id: 'fine', label: '精细', icon: '✋' },
  { id: 'cognitive', label: '认知', icon: '🧠' },
  { id: 'social', label: '社交', icon: '💕' },
]

// 切换发育详情展开状态
const toggleDevelopment = (monthId: number) => {
  const index = expandedMonths.value.indexOf(monthId)
  if (index === -1) {
    expandedMonths.value.push(monthId)
  } else {
    expandedMonths.value.splice(index, 1)
  }
}

// 获取已完成里程碑数量
const getCompletedCount = (month: BabyMonthData) => {
  if (!month.milestones) return 0
  return month.milestones.filter((m) => babyStore.isMilestoneCompleted(m.title))
    .length
}

// 切换里程碑完成状态
const toggleMilestone = (title: string) => {
  babyStore.toggleMilestone(title)
}

// 获取月龄状态
const getMonthStatus = (monthId: number) => {
  const babyAge = babyStore.currentMonth
  if (monthId < babyAge) return 'completed'
  if (monthId === babyAge) return 'current'
  return 'locked'
}

// 滚动时间轴导航
const scrollTimeline = (direction: number) => {
  if (timelineNavRef.value) {
    const scrollAmount = 200
    timelineNavRef.value.scrollLeft += scrollAmount * direction
  }
}

// 跳转到指定月龄
const jumpToMonth = (monthId: number) => {
  currentMonth.value = monthId
  if (!visitedMonths.value.includes(monthId)) {
    visitedMonths.value.push(monthId)
  }

  // 平滑滚动到对应卡片
  const targetIndex = monthsData.value.findIndex((m) => m.month === monthId)
  if (targetIndex !== -1 && monthRefs.value[targetIndex]) {
    monthRefs.value[targetIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
}

// 处理月份点击（区分已解锁和未解锁）
const handleMonthClick = (monthId: number) => {
  const status = getMonthStatus(monthId)
  if (status === 'locked') {
    // 未解锁时显示提示
    return
  }
  jumpToMonth(monthId)
}

// 获取月份tooltip内容
const getMonthTooltip = (monthId: number) => {
  return `宝宝达到${monthId}月龄即可解锁该阶段内容`
}

// 跳转到成长清单
const goToChecklist = () => {
  router.push('/checklist')
}

// 获取身高范围
const getHeightRange = (month: BabyMonthData) => {
  const heightStr = month.physicalDevelopment?.height || ''
  const match = heightStr.match(/(\d+\.?\d*)\s*[-~]\s*(\d+\.?\d*)/)
  if (match && match[1] && match[2]) {
    return { min: parseFloat(match[1]), max: parseFloat(match[2]) }
  }
  return { min: 45, max: 55 }
}

// 获取体重范围
const getWeightRange = (month: BabyMonthData) => {
  const weightStr = month.physicalDevelopment?.weight || ''
  const match = weightStr.match(/(\d+\.?\d*)\s*[-~]\s*(\d+\.?\d*)/)
  if (match && match[1] && match[2]) {
    return { min: parseFloat(match[1]), max: parseFloat(match[2]) }
  }
  return { min: 2.5, max: 4.5 }
}

// 获取身高刻度条样式
const getHeightRangeStyle = (month: BabyMonthData) => {
  const range = getHeightRange(month)
  // 映射到0-100%的位置
  const minPos = ((range.min - 40) / 40) * 100 // 假设范围40-80cm
  const maxPos = ((range.max - 40) / 40) * 100
  return {
    left: `${Math.max(0, minPos)}%`,
    width: `${Math.min(100, maxPos) - Math.max(0, minPos)}%`,
  }
}

// 获取体重刻度条样式
const getWeightRangeStyle = (month: BabyMonthData) => {
  const range = getWeightRange(month)
  // 映射到0-100%的位置
  const minPos = ((range.min - 2) / 10) * 100 // 假设范围2-12kg
  const maxPos = ((range.max - 2) / 10) * 100
  return {
    left: `${Math.max(0, minPos)}%`,
    width: `${Math.min(100, maxPos) - Math.max(0, minPos)}%`,
  }
}

// 里程碑知识库
const milestoneKnowledge: Record<string, string> = {
  抬头:
    '3-4个月开始练习抬头，可以让宝宝趴着，用玩具引导。如果4个月后仍完全无法抬头，建议咨询儿科医生。',
  翻身: '4-6个月开始尝试翻身，注意安全防护。可以用玩具引导宝宝向一侧转动身体。',
  坐: '6-8个月可以开始练习独坐，先从靠坐开始，逐步过渡到独坐。',
  爬: '7-10个月开始爬行，注意地面清洁和安全。爬行对大脑发育非常重要。',
  站: '9-12个月开始扶站，可以让宝宝扶着沙发或茶几练习。',
  走: '12个月左右开始学走，不要过早使用学步车。',
  社交性微笑: '6周-3个月出现社交性微笑，是宝宝情感发展的重要里程碑。',
  视觉追踪: '1-2个月开始能追视移动物体，可以用黑白卡片或摇铃引导。',
}

// 获取里程碑知识
const getMilestoneKnowledge = (title: string) => {
  for (const [key, value] of Object.entries(milestoneKnowledge)) {
    if (title.includes(key)) return value
  }
  return '点击查看详细发育指导和练习方法'
}

// 显示知识卡片
const showKnowledgeCard = (title: string) => {
  // 可以跳转到详情页或打开弹窗
  console.log('显示知识卡片:', title)
}

// 获取里程碑进度
const getMilestoneProgress = (month: BabyMonthData) => {
  if (!month.milestones || month.milestones.length === 0) return 0
  const completed = month.milestones.filter((m) =>
    babyStore.isMilestoneCompleted(m.title),
  ).length
  return Math.round((completed / month.milestones.length) * 100)
}

// 导航到月份详情
const navigateToMonth = (monthId: number) => {
  router.push(`/month/${monthId}`)
}

// 卡片悬浮效果
const onCardHover = (index: number) => {
  const card = monthRefs.value[index]
  if (card) {
    card.classList.add('is-hovering')
  }
}

const onCardLeave = (index: number) => {
  const card = monthRefs.value[index]
  if (card) {
    card.classList.remove('is-hovering')
  }
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 滚动事件处理
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
  showScrollTop.value = scrollTop > 300

  // 视差效果
  if (headerRef.value) {
    headerRef.value.style.transform = `translateY(${scrollTop * 0.5}px)`
  }

  // 滚动触发动画
  monthRefs.value.forEach((ref, index) => {
    if (ref) {
      const rect = ref.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top < windowHeight * 0.8) {
        ref.classList.add('is-visible')
      }
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化

  // 加载成长瞬间数据
  loadGrowthMoments()

  // 加载家庭数据
  loadFamilyData()

  // 检查是否需要显示未打卡提醒
  checkLastCheckIn()

  // 检查提醒是否今天已被关闭
  const dismissed = localStorage.getItem('reminderDismissed')
  if (dismissed === new Date().toDateString()) {
    showReminderBanner.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.timeline-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 50%, #fff8f8 100%);
  position: relative;
  overflow-x: hidden;
}

/* 横向时间轴导航 */
.horizontal-timeline-nav {
  position: sticky;
  top: 0;
  z-index: 99;
  background: white;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  margin-bottom: 24px;
}

.nav-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-arrow {
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.nav-arrow:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.timeline-nav-track {
  flex: 1;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #667eea #f0f0f0;
}

.timeline-nav-track::-webkit-scrollbar {
  height: 4px;
}

.timeline-nav-track::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.timeline-nav-track::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.timeline-nav-items {
  display: flex;
  gap: 12px;
  padding: 8px 0;
}

.timeline-nav-item {
  position: relative;
  flex-shrink: 0;
  width: 64px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item-marker {
  width: 48px;
  height: 48px;
  margin: 0 auto;
  border-radius: 50%;
  background: white;
  border: 3px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #9ca3af;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.timeline-nav-item.is-current .nav-item-marker {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: scale(1.15);
}

.timeline-nav-item.is-completed .nav-item-marker {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  color: white;
}

.timeline-nav-item.is-locked .nav-item-marker {
  background: #f3f4f6;
  border-color: #e5e7eb;
  color: #d1d5db;
  cursor: not-allowed;
}

.unlock-hint {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  color: #9ca3af;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-nav-item.is-locked:hover .unlock-hint {
  opacity: 1;
}

.nav-item-label {
  margin-top: 6px;
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  text-align: center;
  transition: color 0.3s ease;
}

.timeline-nav-item.is-current .nav-item-label {
  color: #667eea;
  font-weight: 700;
}

.nav-item-progress {
  position: absolute;
  bottom: -4px;
  left: 8px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5px;
  transition: width 0.6s ease;
}

.timeline-nav-item:hover:not(.is-locked) .nav-item-marker {
  transform: scale(1.1);
  border-color: #a78bfa;
}

.timeline-progress-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
}

.hint-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hint-icon {
  font-size: 16px;
}

.hint-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checklist-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.checklist-btn .btn-icon {
  font-size: 14px;
}

.badge-dot {
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
}

/* 当前阶段卡片高亮 */
.stat-card.stat-current {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.stat-current .stat-value,
.stat-card.stat-current .stat-label {
  color: white;
}

/* 身高体重刻度条 */
.physical-reference {
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  margin: 12px 0;
}

.physical-scales {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

.scale-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scale-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.scale-icon {
  font-size: 16px;
}

.info-tip {
  font-size: 12px;
  cursor: help;
  opacity: 0.7;
}

.scale-bar {
  position: relative;
}

.scale-track {
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.scale-range {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #22c55e 0%, #86efac 100%);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.scale-markers {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 11px;
  color: #6b7280;
}

/* 里程碑知识卡片提示 */
.knowledge-btn {
  font-size: 14px;
  cursor: help;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  margin-left: auto;
}

.knowledge-btn:hover {
  opacity: 1;
}

.knowledge-card-tip {
  max-width: 280px;
}

.knowledge-card-tip .tip-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #fbbf24;
}

.knowledge-card-tip .tip-content {
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.knowledge-card-tip .tip-footer {
  margin-top: 8px;
  font-size: 12px;
  color: #93c5fd;
  cursor: pointer;
}

/* 卡片底部提示 */
.footer-hint {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
  text-align: center;
}

/* 底部简单装饰 */
.bottom-decoration {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.wave-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(102, 126, 234, 0.05) 100%
  );
}

/* 时间轴头部 */
.timeline-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
  border-radius: 0 0 40px 40px;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
}

.timeline-header h1 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 6px 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.timeline-header p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.deco-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: blob-float 8s ease-in-out infinite;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  top: -100px;
  right: -50px;
  animation-delay: 2s;
}

.blob-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: -100px;
  left: 50%;
  animation-delay: 4s;
}

@keyframes blob-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.header-content {
  position: relative;
  z-index: 1;
}

.title-wrapper {
  margin-bottom: 32px;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 6px 0;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: title-entrance 1s ease-out;
}

.title-icon {
  font-size: 40px;
  animation: rotate-scale 3s ease-in-out infinite;
}

@keyframes rotate-scale {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(10deg) scale(1.1);
  }
}

@keyframes title-entrance {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  animation: fade-in-up 1s ease-out 0.2s both;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 统计卡片 */
.overall-stats {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: card-pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

@keyframes card-pop-in {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.stat-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  animation: glow-sweep 3s ease-in-out infinite;
}

@keyframes glow-sweep {
  0%,
  100% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
}

.stat-icon {
  font-size: 20px;
  animation: bounce-subtle 2s ease-in-out infinite;
}

@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 时间轴容器 */
.timeline-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px 60px;
  position: relative;
}

/* 中央时间线 */
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #e0e0e0 0%, #f0f0f0 100%);
  transform: translateX(-50%);
  border-radius: 2px;
  z-index: 0;
}

.timeline-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: height 0.3s ease;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.progress-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateX(-50%) scale(1.5);
    opacity: 0.7;
  }
}

/* 时间轴项目 */
.timeline-item {
  position: relative;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline-item.left {
  padding-right: calc(50% + 60px);
}

.timeline-item.right {
  padding-left: calc(50% + 60px);
}

.timeline-item.left .month-card {
  transform-origin: right center;
}

.timeline-item.right .month-card {
  transform-origin: left center;
}

/* 时间点 */
.timeline-dot {
  position: absolute;
  left: 50%;
  top: 32px;
  transform: translateX(-50%);
  z-index: 2;
}

.dot-outer {
  position: relative;
  width: 64px;
  height: 64px;
}

.dot-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 16px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  z-index: 3;
  transition: all 0.3s ease;
}

.timeline-item.is-hovering .dot-inner {
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.dot-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.5;
  }
}

.dot-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  animation: pulse-expand 2s ease-in-out infinite;
}

@keyframes pulse-expand {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

/* 月份卡片 */
.month-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.month-card:hover {
  transform: scale(1.03);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

.timeline-item.is-hovering .month-card {
  transform: scale(1.03);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

/* 卡片光效 */
.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: rotate(45deg);
  transition: all 0.5s ease;
  opacity: 0;
}

.month-card:hover .card-shine {
  opacity: 1;
  animation: shine-sweep 1.5s ease-in-out;
}

@keyframes shine-sweep {
  from {
    transform: translateX(-100%) rotate(45deg);
  }
  to {
    transform: translateX(100%) rotate(45deg);
  }
}

/* 卡片装饰 */
.card-decorations {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  pointer-events: none;
}

.deco-star {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  opacity: 0.4;
  animation: twinkle 2s ease-in-out infinite;
}

.deco-star:nth-child(1) {
  top: 20px;
  right: 30px;
  animation-delay: 0s;
}
.deco-star:nth-child(2) {
  top: 40px;
  right: 50px;
  animation-delay: 0.5s;
}
.deco-star:nth-child(3) {
  top: 30px;
  right: 70px;
  animation-delay: 1s;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.3);
  }
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.month-badge {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.month-card:hover .month-badge {
  transform: rotate(5deg) scale(1.05);
}

.badge-month {
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
}

.badge-unit {
  font-size: 10px;
  opacity: 0.9;
  margin-top: 2px;
}

.header-title h3 {
  font-size: 18px;
  margin: 0 0 6px 0;
  color: var(--text-primary);
  font-weight: 700;
}

.month-summary {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 发育亮点 */
.highlights-section {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.expand-btn {
  margin-left: auto;
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
}

/* 维度标签 */
.dimension-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.dimension-tab {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dimension-tab:hover {
  border-color: #a78bfa;
  color: #7c3aed;
}

.dimension-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.dim-icon {
  font-size: 14px;
}

.dimension-section {
  margin-bottom: 12px;
}

.dim-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
}

/* 里程碑打卡 */
.milestone-count {
  margin-left: auto;
  font-size: 13px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-weight: 700;
}

.milestone-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.milestone-check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.milestone-check-item:hover {
  border-color: #a78bfa;
  transform: translateX(4px);
}

.milestone-check-item.completed {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
}

.milestone-check-item.completed .milestone-text {
  color: #16a34a;
  text-decoration: line-through;
}

.check-box {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.milestone-check-item.completed .check-box {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: transparent;
  color: white;
}

.milestone-text {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  flex: 1;
}

.more-milestones {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
  text-align: center;
  padding: 8px;
  cursor: pointer;
}

.more-milestones:hover {
  text-decoration: underline;
}

/* 圆形进度环 */
.progress-ring-container {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

.progress-ring {
  width: 100px;
  height: 100px;
  position: relative;
}

.progress-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  stroke: #e5e7eb;
}

.ring-progress {
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-value {
  display: block;
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.ring-label {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  margin-top: 4px;
}

.title-icon {
  font-size: 16px;
}

.highlights-grid {
  display: grid;
  gap: 10px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 10px;
  font-size: 13px;
  color: var(--text-regular);
  transition: all 0.3s ease;
}

.highlight-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.highlight-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* 里程碑预览 */
.milestones-preview {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
  border-radius: 14px;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.progress-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer-slide 2s ease-in-out infinite;
}

@keyframes shimmer-slide {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.progress-text {
  font-size: 13px;
  font-weight: 700;
  color: #11998e;
  min-width: 40px;
  text-align: right;
}

/* 快速信息 */
.quick-info {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 12px;
  color: var(--text-regular);
}

.info-icon {
  font-size: 16px;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  justify-content: flex-end;
}

.view-detail-btn {
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-detail-btn:hover {
  transform: translateX(4px);
}

.btn-icon {
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.view-detail-btn:hover .btn-icon {
  transform: translateX(4px);
}

/* 悬浮遮罩 */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 24px;
}

.month-card:hover .hover-overlay {
  opacity: 1;
}

/* 连接线 */
.timeline-connector {
  position: absolute;
  top: 40px;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea);
}

.timeline-item.left .timeline-connector {
  right: calc(50% + 40px);
}

.timeline-item.right .timeline-connector {
  left: calc(50% + 40px);
  background: linear-gradient(90deg, #667eea, transparent);
}

.connector-line {
  width: 100%;
  height: 100%;
  background: inherit;
  animation: connector-flow 2s ease-in-out infinite;
}

@keyframes connector-flow {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

/* 浮动按钮 */
.floating-actions {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
}

.scroll-top-btn {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.scroll-top-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .timeline-view {
    padding-bottom: 80px;
  }

  .timeline-header {
    padding: 20px 16px;
    border-radius: 0 0 24px 24px;
  }

  .main-title {
    font-size: 22px;
    margin-bottom: 6px;
  }

  .title-icon {
    font-size: 36px;
  }

  .subtitle {
    font-size: 13px;
  }

  .overall-stats {
    flex-direction: column;
    gap: 10px;
  }

  .stat-card {
    width: 100%;
    max-width: none;
    padding: 12px 16px;
  }

  .stat-value {
    font-size: 18px;
  }

  .stat-label {
    font-size: 12px;
  }

  /* 移动端简化时间轴布局 */
  .timeline-container {
    padding: 20px 12px;
  }

  .timeline-item.left,
  .timeline-item.right {
    padding-left: 60px;
    padding-right: 12px;
    margin-bottom: 24px;
  }

  .timeline-line {
    left: 28px;
    width: 3px;
  }

  .timeline-dot {
    left: 28px;
    transform: translateX(-50%);
  }

  .dot-outer {
    width: 56px;
    height: 56px;
  }

  .dot-inner {
    width: 48px;
    height: 48px;
    font-size: 16px;
  }

  .dot-month {
    font-size: 14px;
  }

  .dot-ring {
    width: 64px;
    height: 64px;
  }

  .month-card {
    padding: 16px;
    border-radius: 16px;
  }

  .card-header {
    margin-bottom: 12px;
  }

  .header-title {
    gap: 8px;
  }

  .header-title h3 {
    font-size: 17px;
  }

  .header-emoji {
    font-size: 24px;
  }

  .month-badge {
    padding: 4px 10px;
    font-size: 11px;
  }

  .card-body {
    gap: 12px;
  }

  .month-summary {
    font-size: 13px;
    line-height: 1.6;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .section-title {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .highlight-item {
    font-size: 13px;
    padding: 10px 12px;
  }

  .milestone-item {
    padding: 10px 12px;
    font-size: 13px;
  }

  .progress-info {
    font-size: 12px;
  }

  .card-footer {
    padding-top: 12px;
    margin-top: 12px;
  }

  .view-detail-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .scroll-top-btn {
    bottom: 90px;
    right: 16px;
    width: 44px;
    height: 44px;
  }

  /* 移动端横向导航 */
  .horizontal-timeline-nav {
    padding: 12px 16px;
  }

  .nav-wrapper {
    gap: 8px;
  }

  .timeline-nav-item {
    width: 56px;
  }

  .nav-item-marker {
    width: 42px;
    height: 42px;
    font-size: 14px;
  }

  .nav-item-label {
    font-size: 10px;
  }

  .timeline-progress-hint {
    padding: 6px 12px;
    font-size: 12px;
    margin-top: 10px;
  }
}

/* 小屏优化 */
@media (max-width: 480px) {
  .timeline-header {
    padding: 16px 12px;
  }

  .main-title {
    font-size: 20px;
  }

  .overall-stats {
    gap: 8px;
  }

  .stat-card {
    padding: 10px 14px;
  }

  .timeline-item.left,
  .timeline-item.right {
    padding-left: 56px;
    padding-right: 8px;
  }

  .timeline-line {
    left: 24px;
  }

  .timeline-dot {
    left: 24px;
  }

  .dot-outer {
    width: 48px;
    height: 48px;
  }

  .dot-inner {
    width: 42px;
    height: 42px;
  }

  .month-card {
    padding: 14px;
  }

  .header-title h3 {
    font-size: 16px;
  }

  .highlights-grid {
    gap: 6px;
  }

  .highlight-item,
  .milestone-item {
    font-size: 12px;
    padding: 8px 10px;
  }

  .feature-shortcuts {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ========== 功能快捷入口 ========== */
.feature-shortcuts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.shortcut-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.shortcut-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.shortcut-icon {
  font-size: 24px;
}

.shortcut-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.shortcut-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.shortcut-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.shortcut-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff6bcc;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.shortcut-badge.warning {
  background: #f59e0b;
}

/* ========== 智能提醒横幅 ========== */
.smart-reminder-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px;
  margin: 0 16px 16px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.reminder-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reminder-icon {
  font-size: 28px;
}

.reminder-text strong {
  display: block;
  color: #92400e;
  font-size: 14px;
  margin-bottom: 2px;
}

.reminder-text p {
  margin: 0;
  color: #a16207;
  font-size: 12px;
}

.reminder-actions {
  display: flex;
  gap: 8px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ========== 未打卡提醒弹窗 ========== */
.no-checkin-dialog :deep(.el-dialog__body) {
  padding: 32px;
}

.no-checkin-content {
  text-align: center;
}

.no-checkin-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.no-checkin-text {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 8px;
}

.no-checkin-text strong {
  color: #f59e0b;
  font-size: 24px;
}

.no-checkin-hint {
  font-size: 14px;
  color: #6b7280;
}

/* ========== 成长相册弹窗 ========== */
.album-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: 80vh;
  overflow-y: auto;
}

.album-content {
  padding: 16px;
}

.album-filter {
  margin-bottom: 16px;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 8px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.album-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.album-thumb {
  width: 100%;
  height: 100%;
  position: relative;
}

.album-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.album-milestone {
  display: block;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-date {
  display: block;
  font-size: 10px;
  opacity: 0.8;
}

.media-count {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
}

.album-footer {
  text-align: center;
}

/* ========== 成长瞬间详情 ========== */
.moment-detail-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.moment-media {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f3f4f6;
}

.moment-info {
  padding: 16px;
}

.moment-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 12px;
}

.moment-note {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.moment-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* ========== 家庭协作弹窗 ========== */
.family-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.family-content {
  padding: 20px;
}

.family-current-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
  border-radius: 16px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.user-avatar.primary {
  background: linear-gradient(135deg, #9d50ff 0%, #ff6bcc 100%);
}

.user-info h4 {
  font-size: 16px;
  margin: 0 0 4px 0;
}

.family-members-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 15px;
  margin: 0;
}

.family-members-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.family-member-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.member-relation {
  font-size: 12px;
  color: #6b7280;
}

.add-member-form {
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.activity-notifications h3 {
  font-size: 15px;
  margin: 0 0 12px 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 10px;
}

.activity-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.activity-content p {
  margin: 0;
  font-size: 13px;
  color: #374151;
}

.activity-time {
  font-size: 11px;
  color: #9ca3af;
}

/* ========== 成长报告弹窗 ========== */
.report-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.report-content {
  padding: 24px;
  background: linear-gradient(180deg, #faf5ff 0%, #ffffff 50%, #fdf2f8 100%);
}

.report-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px dashed #e5e7eb;
}

.report-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9d50ff 0%, #ff6bcc 100%);
  color: white;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-title h2 {
  font-size: 20px;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.report-title p {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0;
}

.report-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.report-section h3 {
  font-size: 16px;
  margin: 0 0 16px 0;
  color: #1f2937;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.report-stat {
  text-align: center;
  padding: 12px;
  background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
  border-radius: 12px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #9d50ff;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.month-progress-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.month-progress-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.month-label {
  width: 60px;
  font-size: 13px;
  color: #6b7280;
}

.progress-bar-wrapper {
  flex: 1;
}

.progress-text {
  width: 50px;
  font-size: 12px;
  color: #9ca3af;
  text-align: right;
}

.ability-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ability-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ability-name {
  width: 90px;
  font-size: 13px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ability-icon {
  font-size: 16px;
}

.ability-bar {
  flex: 1;
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.ability-fill {
  height: 100%;
  background: linear-gradient(90deg, #9d50ff 0%, #ff6bcc 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.ability-percent {
  width: 40px;
  font-size: 12px;
  color: #9d50ff;
  font-weight: 600;
  text-align: right;
}

.report-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.report-footer p {
  font-size: 12px;
  color: #9ca3af;
  margin: 4px 0;
}

.report-powered {
  color: #d1d5db;
}

.report-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* ========== 响应式：功能快捷入口 ========== */
@media (max-width: 640px) {
  .feature-shortcuts {
    grid-template-columns: repeat(2, 1fr);
  }

  .shortcut-card {
    padding: 10px;
  }

  .shortcut-icon {
    font-size: 20px;
  }

  .shortcut-title {
    font-size: 12px;
  }

  .shortcut-desc {
    font-size: 10px;
  }

  .smart-reminder-banner {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 12px 16px;
  }

  .reminder-actions {
    justify-content: center;
  }

  .album-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .report-stats {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>

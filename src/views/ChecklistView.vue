<template>
  <div class="checklist-view">
    <!-- 页面头部 - 环形进度图 -->
    <div class="page-header">
      <div class="header-top">
        <el-button class="back-btn" @click="router.back()" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1>📋 成长清单</h1>
        <el-dropdown trigger="click" @command="handleExportCommand">
          <el-button circle>
            <el-icon><More /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="export-json">
                📁 导出JSON
              </el-dropdown-item>
              <el-dropdown-item command="export-report">
                📄 生成成长报告
              </el-dropdown-item>
              <el-dropdown-item command="family">
                👨‍👩‍👧 家庭协作
              </el-dropdown-item>
              <el-dropdown-item command="import">📥 导入记录</el-dropdown-item>
              <el-dropdown-item command="reset" divided>
                🔄 重置记录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 环形进度主视图 -->
      <div class="progress-hero">
        <div class="ring-progress-container">
          <svg class="ring-progress" viewBox="0 0 120 120">
            <!-- 渐变定义 -->
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stop-color="#a855f7" />
                <stop offset="50%" stop-color="#ec4899" />
                <stop offset="100%" stop-color="#10b981" />
              </linearGradient>
              <filter id="ringGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle class="ring-bg" cx="60" cy="60" r="52" />
            <circle
              class="ring-fill"
              cx="60"
              cy="60"
              r="52"
              stroke="url(#progressGradient)"
              :style="{ strokeDashoffset: ringOffset }"
              filter="url(#ringGlow)"
            />
          </svg>
          <div class="ring-center">
            <span class="ring-value">{{ completedCount }}</span>
            <span class="ring-divider">/</span>
            <span class="ring-total">{{ totalMilestones }}</span>
          </div>
          <!-- 完成度动画光圈 -->
          <div v-if="completionRate === 100" class="ring-complete-pulse"></div>
        </div>
        <div class="progress-info">
          <h2>{{ babyStore.babyInfo.name }}的成长进度</h2>
          <p class="progress-rate">
            已完成
            <strong>{{ completionRate }}%</strong>
            的里程碑
          </p>
          <!-- 增强的分段进度条 -->
          <div class="stage-progress-bars">
            <div
              v-for="(stage, index) in stageProgress"
              :key="stage.name"
              class="stage-progress-item"
              @mouseenter="hoveredStage = stage.name"
              @mouseleave="hoveredStage = null"
            >
              <div class="stage-label">
                <span class="stage-icon">{{ stage.icon }}</span>
                <span class="stage-name">{{ stage.name }}</span>
              </div>
              <div class="stage-bar-container">
                <div
                  class="stage-bar-fill"
                  :style="{
                    width: `${stage.rate}%`,
                    background: getStageGradient(index),
                    boxShadow:
                      stage.rate > 0
                        ? `0 0 8px ${getStageColor(index)}40`
                        : 'none',
                  }"
                ></div>
                <span class="stage-percent">{{ stage.rate }}%</span>
              </div>
              <!-- 悬停详情 -->
              <Transition name="tooltip-fade">
                <div v-if="hoveredStage === stage.name" class="stage-tooltip">
                  <div class="tooltip-content">
                    <span>
                      {{ stage.completed }}/{{ stage.total }} 项已完成
                    </span>
                    <span v-if="stage.rate === 100" class="complete-badge">
                      ✨ 已达成
                    </span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前月龄提示 -->
      <div class="current-month-hint" v-if="pendingCurrentMonth > 0">
        <el-icon><Bell /></el-icon>
        <span>
          当前月龄有
          <strong>{{ pendingCurrentMonth }}</strong>
          个待完成里程碑
        </span>
        <el-button
          size="small"
          type="primary"
          round
          @click="scrollToCurrentMonth"
        >
          立即查看
        </el-button>
      </div>
    </div>

    <!-- 智能提醒卡片 -->
    <div
      class="smart-reminder-section"
      v-if="smartReminders.length > 0 || daysSinceLastRecord > 3"
    >
      <!-- 未打卡提醒 -->
      <Transition name="reminder-slide">
        <div v-if="daysSinceLastRecord > 3" class="no-checkin-reminder">
          <div class="reminder-icon">⏰</div>
          <div class="reminder-content">
            <h4>别忘了记录成长</h4>
            <p>
              已经
              <strong>{{ daysSinceLastRecord }}</strong>
              天没有打卡了，宝宝每天都在成长哦！
            </p>
          </div>
          <el-button
            type="warning"
            size="small"
            round
            @click="scrollToCurrentMonth"
          >
            立即打卡
          </el-button>
        </div>
      </Transition>

      <!-- 本周关键里程碑提醒 -->
      <div v-if="smartReminders.length > 0" class="key-milestones-reminder">
        <div class="reminder-header">
          <span class="reminder-title">🎯 本周关键里程碑</span>
          <span class="reminder-subtitle">
            根据{{ babyStore.babyInfo.name }}当前月龄推荐
          </span>
        </div>
        <div class="reminder-milestones">
          <div
            v-for="(milestone, index) in smartReminders.slice(0, 3)"
            :key="milestone.title"
            class="reminder-milestone-item"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="handleReminderClick(milestone)"
          >
            <div class="milestone-priority" :class="milestone.priority">
              {{
                milestone.priority === 'high'
                  ? '🔥'
                  : milestone.priority === 'medium'
                  ? '⭐'
                  : '💡'
              }}
            </div>
            <div class="milestone-info">
              <span class="milestone-name">{{ milestone.title }}</span>
              <span class="milestone-tip">{{ milestone.tip }}</span>
            </div>
            <el-icon class="milestone-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="reminder-footer" v-if="smartReminders.length > 3">
          <span>还有 {{ smartReminders.length - 3 }} 项待完成</span>
        </div>
      </div>
    </div>

    <!-- 月龄快速切换 -->
    <div class="month-nav">
      <el-button circle @click="prevMonth" :disabled="activeMonth <= 0">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <div class="month-tabs-scroll" ref="monthTabsRef">
        <div
          v-for="monthData in babyStore.allMonthsData"
          :key="monthData.month"
          :class="[
            'month-tab',
            {
              active: activeMonth === monthData.month,
              current: monthData.month === babyStore.currentMonth,
              completed: getMonthCompletion(monthData.month) === 100,
            },
          ]"
          :ref="el => { if (monthData.month === activeMonth) activeTabRef = el as HTMLElement }"
          @click="activeMonth = monthData.month"
        >
          <span class="tab-month">{{ monthData.month }}月</span>
          <div class="tab-progress-bar">
            <div
              class="tab-progress-fill"
              :style="{ width: getMonthCompletion(monthData.month) + '%' }"
            ></div>
          </div>
          <span class="tab-status">
            <el-icon
              v-if="getMonthCompletion(monthData.month) === 100"
              color="#10b981"
            >
              <Check />
            </el-icon>
            <span v-else class="tab-count">
              {{ getCompletedCount(monthData.month) }}/{{
                getMonthMilestones(monthData.month).length
              }}
            </span>
          </span>
        </div>
      </div>
      <el-button circle @click="nextMonth" :disabled="activeMonth >= 12">
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 当前月龄内容 -->
    <div class="month-content" v-if="currentMonthData">
      <div class="month-header">
        <div class="month-info">
          <h2>
            <span class="month-icon">{{ getMonthIcon(activeMonth) }}</span>
            {{ currentMonthData.title }}
          </h2>
          <p>{{ currentMonthData.summary }}</p>
        </div>
        <div class="month-progress-ring">
          <el-progress
            type="circle"
            :percentage="getMonthCompletion(activeMonth)"
            :width="80"
            :stroke-width="8"
            :color="progressColor"
          >
            <template #default>
              <span class="mini-progress-text">
                {{ getMonthCompletion(activeMonth) }}%
              </span>
            </template>
          </el-progress>
        </div>
      </div>

      <!-- 里程碑网格 -->
      <div class="milestones-grid">
        <div
          v-for="(milestone, index) in currentMonthData.milestones"
          :key="milestone.title"
          :class="[
            'milestone-card',
            { completed: isMilestoneCompleted(milestone.title) },
          ]"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="openMilestoneDialog(milestone)"
        >
          <div class="card-check">
            <div
              class="check-circle"
              @click.stop="quickToggle(milestone.title)"
            >
              <transition name="check-pop">
                <el-icon
                  v-if="isMilestoneCompleted(milestone.title)"
                  class="check-icon"
                >
                  <Check />
                </el-icon>
              </transition>
            </div>
          </div>
          <div class="card-body">
            <h3>{{ milestone.title }}</h3>
            <p>{{ milestone.description }}</p>
            <div class="card-footer">
              <el-tag
                :type="
                  isMilestoneCompleted(milestone.title) ? 'success' : 'info'
                "
                size="small"
                effect="plain"
                round
              >
                {{
                  isMilestoneCompleted(milestone.title) ? '✓ 已达成' : '待完成'
                }}
              </el-tag>
              <span
                v-if="getMilestoneRecord(milestone.title)"
                class="record-hint"
              >
                <el-icon><Picture /></el-icon>
              </span>
            </div>
          </div>
          <div
            class="card-glow"
            v-if="isMilestoneCompleted(milestone.title)"
          ></div>
        </div>
      </div>

      <el-empty
        v-if="currentMonthData.milestones.length === 0"
        description="该月龄暂无里程碑数据"
      />
    </div>

    <!-- 自定义里程碑入口 -->
    <div class="custom-milestone-section">
      <el-button type="primary" plain round @click="showCustomDialog = true">
        <el-icon><Plus /></el-icon>
        添加自定义里程碑
      </el-button>
    </div>

    <!-- 成就展示 -->
    <div class="achievements-section">
      <div class="achievements-header">
        <h2>🏆 成就徽章</h2>
        <span class="unlocked-count">
          已解锁 {{ unlockedCount }}/{{ achievements.length }}
        </span>
      </div>

      <!-- 成就进度条 -->
      <div class="achievements-progress">
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{
              width: `${(unlockedCount / achievements.length) * 100}%`,
            }"
          ></div>
          <div
            v-for="(achievement, index) in achievements"
            :key="achievement.id"
            :class="['progress-node', { unlocked: achievement.unlocked }]"
            :style="{ left: `${((index + 1) / achievements.length) * 100}%` }"
          >
            <span class="node-icon">{{ achievement.icon }}</span>
          </div>
        </div>
      </div>

      <div class="achievements-grid">
        <div
          v-for="(achievement, index) in achievements"
          :key="achievement.id"
          :class="[
            'achievement-card',
            {
              unlocked: achievement.unlocked,
              'newly-unlocked':
                achievement.unlocked && isNewlyUnlocked(achievement.id),
            },
          ]"
          :style="{ animationDelay: `${index * 0.08}s` }"
          @click="showAchievementDetail(achievement)"
        >
          <!-- 徽章图标 -->
          <div :class="['achievement-badge', { shine: achievement.unlocked }]">
            <span class="badge-icon">{{ achievement.icon }}</span>
            <div v-if="achievement.unlocked" class="badge-glow"></div>
          </div>

          <!-- 徽章信息 -->
          <div class="achievement-info">
            <h4>{{ achievement.title }}</h4>
            <p>{{ achievement.description }}</p>
            <div v-if="achievement.unlocked" class="unlock-time">
              {{ getUnlockTimeText(achievement.id) }}
            </div>
          </div>

          <!-- 状态标识 -->
          <div class="achievement-status">
            <Transition name="trophy-pop">
              <div v-if="achievement.unlocked" class="status-unlocked">
                <span class="sparkle">✨</span>
              </div>
              <div v-else class="status-locked">
                <el-icon><Lock /></el-icon>
              </div>
            </Transition>
          </div>

          <!-- 解锁光效 -->
          <div v-if="achievement.unlocked" class="card-shine"></div>
        </div>
      </div>
    </div>

    <!-- 里程碑打卡对话框 -->
    <el-dialog
      v-model="showMilestoneDialog"
      :title="currentMilestone?.title"
      width="90%"
      class="milestone-dialog"
    >
      <div class="dialog-content" v-if="currentMilestone">
        <p class="milestone-desc">{{ currentMilestone.description }}</p>

        <div class="record-form">
          <el-form-item label="完成日期">
            <el-date-picker
              v-model="milestoneRecord.date"
              type="date"
              placeholder="选择日期"
              :disabled-date="disabledDate"
              style="width: 100%;"
            />
          </el-form-item>

          <el-form-item label="备注">
            <el-input
              v-model="milestoneRecord.note"
              type="textarea"
              :rows="3"
              placeholder="记录这个特别的时刻..."
            />
          </el-form-item>

          <el-form-item label="照片/视频">
            <div class="media-upload">
              <div
                v-for="(media, idx) in milestoneRecord.media"
                :key="idx"
                class="media-item"
              >
                <img :src="media" alt="记录照片" />
                <el-button
                  class="remove-media"
                  circle
                  size="small"
                  type="danger"
                  @click="removeMedia(idx)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
              <div class="upload-btn" @click="triggerMediaUpload">
                <el-icon :size="24"><Plus /></el-icon>
                <span>添加</span>
              </div>
              <input
                ref="mediaInputRef"
                type="file"
                accept="image/*,video/*"
                multiple
                style="display: none;"
                @change="handleMediaUpload"
              />
            </div>
          </el-form-item>
        </div>
      </div>

      <template #footer>
        <el-button @click="showMilestoneDialog = false">取消</el-button>
        <el-button
          type="success"
          @click="confirmMilestone"
          :disabled="isMilestoneCompleted(currentMilestone?.title || '')"
        >
          <el-icon><Check /></el-icon>
          {{
            isMilestoneCompleted(currentMilestone?.title || '')
              ? '已完成'
              : '确认完成'
          }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 自定义里程碑对话框 -->
    <el-dialog
      v-model="showCustomDialog"
      title="➕ 添加自定义里程碑"
      width="90%"
    >
      <el-form :model="customMilestone" label-position="top">
        <el-form-item label="里程碑名称" required>
          <el-input
            v-model="customMilestone.title"
            placeholder="如：第一次笑出声"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="customMilestone.description"
            type="textarea"
            :rows="2"
            placeholder="描述这个里程碑..."
          />
        </el-form-item>
        <el-form-item label="所属月龄">
          <el-select v-model="customMilestone.month" style="width: 100%;">
            <el-option
              v-for="m in 13"
              :key="m - 1"
              :label="`${m - 1}个月`"
              :value="m - 1"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCustomDialog = false">取消</el-button>
        <el-button type="primary" @click="addCustomMilestone">添加</el-button>
      </template>
    </el-dialog>

    <!-- 成长报告对话框 -->
    <el-dialog
      v-model="showReportDialog"
      title="📊 成长报告"
      width="95%"
      class="report-dialog"
      :close-on-click-modal="false"
    >
      <div class="report-preview" ref="reportRef">
        <!-- 报告头部 -->
        <div class="report-header">
          <div class="report-avatar">
            {{ babyStore.babyInfo.name.charAt(0) }}
          </div>
          <div class="report-title-info">
            <h2>{{ babyStore.babyInfo.name }}的成长报告</h2>
            <p>生成时间：{{ new Date().toLocaleDateString('zh-CN') }}</p>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="report-section">
          <h3>👶 宝宝信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">姓名</span>
              <span class="value">{{ babyStore.babyInfo.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">出生日期</span>
              <span class="value">
                {{ formatDate(babyStore.babyInfo.birthday) }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">当前月龄</span>
              <span class="value">{{ babyStore.currentMonth }}个月</span>
            </div>
            <div class="info-item">
              <span class="label">性别</span>
              <span class="value">
                {{
                  babyStore.babyInfo.gender === 'boy'
                    ? '男宝宝 👦'
                    : babyStore.babyInfo.gender === 'girl'
                    ? '女宝宝 👧'
                    : '宝宝 👶'
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- 成长进度 -->
        <div class="report-section">
          <h3>📈 成长进度概览</h3>
          <div class="progress-overview">
            <div class="big-progress">
              <div class="progress-ring-report">
                <svg viewBox="0 0 100 100">
                  <circle class="ring-bg-report" cx="50" cy="50" r="40" />
                  <circle
                    class="ring-fill-report"
                    cx="50"
                    cy="50"
                    r="40"
                    :style="{
                      strokeDashoffset: 251.2 - (251.2 * completionRate) / 100,
                    }"
                  />
                </svg>
                <div class="ring-text">
                  <span class="rate">{{ completionRate }}%</span>
                  <span class="label">总完成率</span>
                </div>
              </div>
            </div>
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-value">{{ completedCount }}</span>
                <span class="stat-label">已完成里程碑</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">
                  {{ totalMilestones - completedCount }}
                </span>
                <span class="stat-label">待完成里程碑</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ unlockedCount }}</span>
                <span class="stat-label">解锁成就数</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 各阶段进度 -->
        <div class="report-section">
          <h3>🎯 各阶段完成情况</h3>
          <div class="stage-report-list">
            <div
              v-for="(stage, index) in stageProgress"
              :key="stage.name"
              class="stage-report-item"
            >
              <div class="stage-header">
                <span class="stage-icon">{{ stage.icon }}</span>
                <span class="stage-name">{{ stage.name }}</span>
                <span
                  class="stage-rate"
                  :style="{ color: getStageColor(index) }"
                >
                  {{ stage.rate }}%
                </span>
              </div>
              <div class="stage-bar">
                <div
                  class="stage-bar-fill"
                  :style="{
                    width: `${stage.rate}%`,
                    background: getStageGradient(index),
                  }"
                ></div>
              </div>
              <div class="stage-detail">
                已完成 {{ stage.completed }}/{{ stage.total }} 项
              </div>
            </div>
          </div>
        </div>

        <!-- 月度完成明细 -->
        <div class="report-section">
          <h3>📅 月度完成明细</h3>
          <div class="month-report-grid">
            <div
              v-for="monthData in babyStore.allMonthsData"
              :key="monthData.month"
              class="month-report-item"
            >
              <div class="month-label">{{ monthData.month }}月龄</div>
              <div class="month-bar">
                <div
                  class="month-bar-fill"
                  :style="{ width: `${getMonthCompletion(monthData.month)}%` }"
                ></div>
              </div>
              <div class="month-stat">
                {{ getCompletedCount(monthData.month) }}/{{
                  monthData.milestones.length
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- 已获成就 -->
        <div class="report-section">
          <h3>🏆 已获成就</h3>
          <div class="achievements-report">
            <div
              v-for="achievement in achievements.filter((a) => a.unlocked)"
              :key="achievement.id"
              class="achievement-report-item"
            >
              <span class="icon">{{ achievement.icon }}</span>
              <span class="title">{{ achievement.title }}</span>
            </div>
            <div v-if="unlockedCount === 0" class="no-achievements">
              暂无解锁成就
            </div>
          </div>
        </div>

        <!-- 报告底部 -->
        <div class="report-footer">
          <p>💝 宝宝的每一步成长都值得记录</p>
          <p class="app-name">—— 宝宝成长指南</p>
        </div>
      </div>

      <template #footer>
        <div class="report-actions">
          <el-button @click="showReportDialog = false">关闭</el-button>
          <el-button type="primary" @click="downloadReportImage">
            📷 保存为图片
          </el-button>
          <el-button type="success" @click="shareToWechat">
            📤 分享到微信
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 家庭协作对话框 -->
    <el-dialog
      v-model="showFamilyDialog"
      title="👨‍👩‍👧 家庭协作"
      width="95%"
      class="family-dialog"
    >
      <div class="family-content">
        <!-- 当前用户信息 -->
        <div class="current-user-card">
          <div class="user-avatar primary">
            {{ currentUser.name.charAt(0) }}
          </div>
          <div class="user-info">
            <h4>{{ currentUser.name }}</h4>
            <span class="role-badge admin">管理员</span>
          </div>
        </div>

        <!-- 家庭成员列表 -->
        <div class="family-section">
          <div class="section-header">
            <h3>👪 家庭成员</h3>
            <el-button
              type="primary"
              size="small"
              round
              @click="showAddMemberForm = true"
            >
              <el-icon><Plus /></el-icon>
              添加成员
            </el-button>
          </div>

          <div class="members-list">
            <div
              v-for="member in familyMembers"
              :key="member.id"
              class="member-card"
            >
              <div class="member-avatar" :style="{ background: member.color }">
                {{ member.name.charAt(0) }}
              </div>
              <div class="member-info">
                <h4>{{ member.name }}</h4>
                <span class="member-role">{{ member.relation }}</span>
              </div>
              <div class="member-permission">
                <el-tag
                  :type="member.permission === 'edit' ? 'success' : 'info'"
                  size="small"
                >
                  {{ member.permission === 'edit' ? '可记录' : '仅查看' }}
                </el-tag>
              </div>
              <div class="member-actions">
                <el-button
                  type="primary"
                  size="small"
                  text
                  @click="editMember(member)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  text
                  @click="removeMember(member.id)"
                >
                  移除
                </el-button>
              </div>
            </div>

            <div v-if="familyMembers.length === 0" class="empty-members">
              <span class="empty-icon">👨‍👩‍👧</span>
              <p>还没有添加家庭成员</p>
              <p class="hint">添加家人一起记录宝宝的成长</p>
            </div>
          </div>
        </div>

        <!-- 添加成员表单 -->
        <Transition name="slide-up">
          <div v-if="showAddMemberForm" class="add-member-form">
            <h4>{{ editingMember ? '编辑成员' : '添加新成员' }}</h4>
            <el-form :model="newMember" label-position="top">
              <el-form-item label="称呼" required>
                <el-input
                  v-model="newMember.name"
                  placeholder="如：爸爸、妈妈、奶奶"
                />
              </el-form-item>
              <el-form-item label="关系">
                <el-select v-model="newMember.relation" style="width: 100%;">
                  <el-option label="爸爸 👨" value="爸爸" />
                  <el-option label="妈妈 👩" value="妈妈" />
                  <el-option label="爷爷 👴" value="爷爷" />
                  <el-option label="奶奶 👵" value="奶奶" />
                  <el-option label="外公 👴" value="外公" />
                  <el-option label="外婆 👵" value="外婆" />
                  <el-option label="其他 👤" value="其他" />
                </el-select>
              </el-form-item>
              <el-form-item label="权限">
                <el-radio-group v-model="newMember.permission">
                  <el-radio value="view">
                    <span>👁️ 仅查看</span>
                    <p class="permission-hint">只能查看成长记录</p>
                  </el-radio>
                  <el-radio value="edit">
                    <span>✏️ 可记录</span>
                    <p class="permission-hint">可以查看和记录里程碑</p>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div class="form-actions">
              <el-button @click="cancelAddMember">取消</el-button>
              <el-button type="primary" @click="saveMember">
                {{ editingMember ? '保存' : '添加' }}
              </el-button>
            </div>
          </div>
        </Transition>

        <!-- 活动通知设置 -->
        <div class="family-section notifications-section">
          <h3>🔔 活动通知</h3>
          <div class="notification-options">
            <div class="notification-item">
              <div class="notification-info">
                <span class="notification-title">里程碑完成通知</span>
                <span class="notification-desc">有人记录里程碑时通知家人</span>
              </div>
              <el-switch v-model="notificationSettings.milestone" />
            </div>
            <div class="notification-item">
              <div class="notification-info">
                <span class="notification-title">每周成长报告</span>
                <span class="notification-desc">每周日推送宝宝成长概况</span>
              </div>
              <el-switch v-model="notificationSettings.weekly" />
            </div>
            <div class="notification-item">
              <div class="notification-info">
                <span class="notification-title">重要里程碑提醒</span>
                <span class="notification-desc">
                  宝宝即将达到重要里程碑时提醒
                </span>
              </div>
              <el-switch v-model="notificationSettings.important" />
            </div>
          </div>
        </div>

        <!-- 分享邀请 -->
        <div class="share-invite-section">
          <el-button type="primary" plain @click="generateInviteLink">
            🔗 生成邀请链接
          </el-button>
          <p class="invite-hint">邀请家人加入，一起记录宝宝成长</p>
        </div>
      </div>

      <template #footer>
        <el-button @click="showFamilyDialog = false">关闭</el-button>
        <el-button type="primary" @click="saveFamilySettings">
          保存设置
        </el-button>
      </template>
    </el-dialog>

    <!-- 粒子动画容器 -->
    <div ref="particlesRef" class="particles-container"></div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none;"
      @change="handleFileImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Close,
  More,
  Bell,
  Picture,
  Trophy,
  Lock,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const babyStore = useBabyStore()

const activeMonth = ref(babyStore.currentMonth)
const showMilestoneDialog = ref(false)
const showCustomDialog = ref(false)
const showReportDialog = ref(false)
const showFamilyDialog = ref(false)
const showAddMemberForm = ref(false)
const editingMember = ref<FamilyMember | null>(null)
const currentMilestone = ref<{ title: string; description: string } | null>(
  null,
)
const fileInput = ref<HTMLInputElement | null>(null)
const mediaInputRef = ref<HTMLInputElement | null>(null)
const monthTabsRef = ref<HTMLElement | null>(null)
const activeTabRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const reportRef = ref<HTMLElement | null>(null)

// 家庭协作相关
interface FamilyMember {
  id: string
  name: string
  relation: string
  permission: 'view' | 'edit'
  color: string
  addedAt: string
}

const currentUser = ref({
  name: babyStore.babyInfo.name ? `${babyStore.babyInfo.name}的家长` : '我',
})

const familyMembers = ref<FamilyMember[]>([])

const newMember = ref({
  name: '',
  relation: '爸爸',
  permission: 'edit' as 'view' | 'edit',
})

const notificationSettings = ref({
  milestone: true,
  weekly: true,
  important: true,
})

const memberColors = [
  '#7c3aed',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#8b5cf6',
]

// 进度可视化相关
const hoveredStage = ref<string | null>(null)

// 阶段渐变色配置
interface StageColor {
  from: string
  to: string
}

const stageColors: StageColor[] = [
  { from: '#a855f7', to: '#c084fc' }, // 新生儿 - 紫色
  { from: '#ec4899', to: '#f472b6' }, // 婴儿早期 - 粉红
  { from: '#10b981', to: '#34d399' }, // 婴儿中期 - 绿色
  { from: '#f59e0b', to: '#fbbf24' }, // 婴儿后期 - 金色
]

const defaultColor: StageColor = { from: '#a855f7', to: '#c084fc' }

const getStageGradient = (index: number): string => {
  const color = stageColors[index] ?? defaultColor
  return `linear-gradient(90deg, ${color.from} 0%, ${color.to} 100%)`
}

const getStageColor = (index: number): string => {
  const color = stageColors[index] ?? defaultColor
  return color.from
}

// 里程碑记录表单
const milestoneRecord = ref({
  date: new Date(),
  note: '',
  media: [] as string[],
})

// 自定义里程碑表单
const customMilestone = ref({
  title: '',
  description: '',
  month: babyStore.currentMonth,
})

// 里程碑详细记录存储
const milestoneRecords = ref<
  Record<string, { date: string; note: string; media: string[] }>
>({})

// 进度颜色
const progressColor = [
  { color: '#f87171', percentage: 20 },
  { color: '#fbbf24', percentage: 50 },
  { color: '#34d399', percentage: 80 },
  { color: '#10b981', percentage: 100 },
]

// 环形进度偏移量
const ringOffset = computed(() => {
  const circumference = 2 * Math.PI * 52
  return circumference - (completionRate.value / 100) * circumference
})

// 当前月龄数据
const currentMonthData = computed(() => {
  return babyStore.allMonthsData.find((m) => m.month === activeMonth.value)
})

// 总里程碑数
const totalMilestones = computed(() => {
  return babyStore.allMonthsData.reduce(
    (sum, month) => sum + month.milestones.length,
    0,
  )
})

// 已完成数量
const completedCount = computed(() => {
  return babyStore.completedMilestones.length
})

// 完成率
const completionRate = computed(() => {
  if (totalMilestones.value === 0) return 0
  return Math.round((completedCount.value / totalMilestones.value) * 100)
})

// 当前月龄待完成数
const pendingCurrentMonth = computed(() => {
  const monthData = babyStore.allMonthsData.find(
    (m) => m.month === babyStore.currentMonth,
  )
  if (!monthData) return 0
  return monthData.milestones.filter(
    (m) => !babyStore.isMilestoneCompleted(m.title),
  ).length
})

// 智能提醒：距离上次打卡天数
const daysSinceLastRecord = computed(() => {
  const records = milestoneRecords.value
  if (!records || Object.keys(records).length === 0) return 0

  let lastDate: Date | null = null
  Object.values(records).forEach((record) => {
    const rec = record as {
      date?: string | Date
      note?: string
      media?: string[]
    }
    if (rec.date) {
      const recordDate = new Date(rec.date)
      if (!lastDate || recordDate > lastDate) {
        lastDate = recordDate
      }
    }
  })

  if (!lastDate) return 0
  const now = new Date()
  const diffTime = now.getTime() - (lastDate as Date).getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
})

// 智能提醒：本周关键里程碑
interface SmartReminder {
  title: string
  description: string
  tip: string
  priority: 'high' | 'medium' | 'low'
  month: number
}

const smartReminders = computed((): SmartReminder[] => {
  const currentMonth = babyStore.currentMonth
  const reminders: SmartReminder[] = []

  // 获取当前月龄和相邻月龄的里程碑
  const relevantMonths = [
    currentMonth - 1,
    currentMonth,
    currentMonth + 1,
  ].filter((m) => m >= 0 && m <= 12)

  relevantMonths.forEach((month) => {
    const monthData = babyStore.allMonthsData.find((m) => m.month === month)
    if (!monthData) return

    monthData.milestones.forEach((milestone) => {
      if (babyStore.isMilestoneCompleted(milestone.title)) return

      // 确定优先级
      let priority: 'high' | 'medium' | 'low' = 'low'
      let tip = ''

      if (month === currentMonth) {
        priority = 'high'
        tip = '本月重点关注'
      } else if (month === currentMonth - 1) {
        priority = 'medium'
        tip = '建议尽快完成'
      } else {
        priority = 'low'
        tip = '下个月即将到来'
      }

      reminders.push({
        title: milestone.title,
        description: milestone.description,
        tip,
        priority,
        month,
      })
    })
  })

  // 按优先级排序
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return reminders.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  )
})

// 处理提醒点击
const handleReminderClick = (reminder: SmartReminder) => {
  activeMonth.value = reminder.month
  nextTick(() => {
    scrollToActiveTab()
    // 找到对应的里程碑卡片并高亮
    const cards = document.querySelectorAll('.milestone-card')
    cards.forEach((card) => {
      const title = card.querySelector('h3')?.textContent
      if (title === reminder.title) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' })
        card.classList.add('highlight-pulse')
        setTimeout(() => card.classList.remove('highlight-pulse'), 2000)
      }
    })
  })
}

// 阶段进度
const stageProgress = computed(() => {
  const stages = [
    { name: '新生儿', icon: '👶', months: [0, 1, 2] },
    { name: '婴儿早期', icon: '🌱', months: [3, 4, 5] },
    { name: '婴儿中期', icon: '🌿', months: [6, 7, 8] },
    { name: '婴儿后期', icon: '🌳', months: [9, 10, 11, 12] },
  ]

  return stages.map((stage) => {
    let total = 0
    let completed = 0
    stage.months.forEach((m) => {
      const monthData = babyStore.allMonthsData.find((md) => md.month === m)
      if (monthData) {
        total += monthData.milestones.length
        completed += monthData.milestones.filter((ms) =>
          babyStore.isMilestoneCompleted(ms.title),
        ).length
      }
    })
    return {
      ...stage,
      total,
      completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })
})

// 获取月份图标
const getMonthIcon = (month: number) => {
  const icons = [
    '🌟',
    '💫',
    '⭐',
    '🌙',
    '☀️',
    '🌈',
    '🎈',
    '🎀',
    '🎁',
    '🎊',
    '🎉',
    '🏆',
    '👑',
  ]
  return icons[month] || '⭐'
}

// 获取月份里程碑
const getMonthMilestones = (month: number) => {
  const monthData = babyStore.allMonthsData.find((m) => m.month === month)
  return monthData?.milestones || []
}

// 获取指定月份的完成数
const getCompletedCount = (month: number) => {
  const monthData = babyStore.allMonthsData.find((m) => m.month === month)
  if (!monthData) return 0
  return monthData.milestones.filter((m) =>
    babyStore.isMilestoneCompleted(m.title),
  ).length
}

// 获取指定月份的完成率
const getMonthCompletion = (month: number) => {
  const monthData = babyStore.allMonthsData.find((m) => m.month === month)
  if (!monthData || !monthData.milestones.length) return 0
  const completed = getCompletedCount(month)
  return Math.round((completed / monthData.milestones.length) * 100)
}

const isMilestoneCompleted = (title: string) => {
  return babyStore.isMilestoneCompleted(title)
}

// 获取里程碑记录
const getMilestoneRecord = (title: string) => {
  return milestoneRecords.value[title]
}

// 快速切换完成状态
const quickToggle = (title: string) => {
  const wasCompleted = babyStore.isMilestoneCompleted(title)
  babyStore.toggleMilestone(title)

  if (!wasCompleted) {
    showCelebration()
    ElMessage({
      message: `🎉 太棒了！"${title}"已完成！`,
      type: 'success',
      duration: 2000,
    })
  }
}

// 打开里程碑对话框
const openMilestoneDialog = (milestone: {
  title: string
  description: string
}) => {
  currentMilestone.value = milestone
  const record = milestoneRecords.value[milestone.title]
  if (record) {
    milestoneRecord.value = {
      date: new Date(record.date),
      note: record.note,
      media: [...record.media],
    }
  } else {
    milestoneRecord.value = {
      date: new Date(),
      note: '',
      media: [],
    }
  }
  showMilestoneDialog.value = true
}

// 确认里程碑完成
const confirmMilestone = () => {
  if (!currentMilestone.value) return

  // 保存记录
  milestoneRecords.value[currentMilestone.value.title] = {
    date: milestoneRecord.value.date.toISOString(),
    note: milestoneRecord.value.note,
    media: milestoneRecord.value.media,
  }
  localStorage.setItem(
    'milestoneRecords',
    JSON.stringify(milestoneRecords.value),
  )

  // 标记完成
  if (!babyStore.isMilestoneCompleted(currentMilestone.value.title)) {
    babyStore.toggleMilestone(currentMilestone.value.title)
    showCelebration()
    ElMessage({
      message: `🎉 恭喜！"${currentMilestone.value.title}"已记录！`,
      type: 'success',
      duration: 2500,
    })
  } else {
    ElMessage.success('记录已更新！')
  }

  showMilestoneDialog.value = false
}

// 上传媒体
const triggerMediaUpload = () => {
  mediaInputRef.value?.click()
}

const handleMediaUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          milestoneRecord.value.media.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }
  input.value = ''
}

const removeMedia = (index: number) => {
  milestoneRecord.value.media.splice(index, 1)
}

// 添加自定义里程碑
const addCustomMilestone = () => {
  if (!customMilestone.value.title.trim()) {
    ElMessage.warning('请输入里程碑名称')
    return
  }

  // 保存到本地存储
  const customList = JSON.parse(
    localStorage.getItem('customMilestones') || '[]',
  )
  customList.push({
    ...customMilestone.value,
    id: Date.now().toString(),
  })
  localStorage.setItem('customMilestones', JSON.stringify(customList))

  ElMessage.success('自定义里程碑已添加！')
  showCustomDialog.value = false
  customMilestone.value = {
    title: '',
    description: '',
    month: babyStore.currentMonth,
  }
}

// 月龄导航
const prevMonth = () => {
  if (activeMonth.value > 0) {
    activeMonth.value--
    scrollToActiveTab()
  }
}

const nextMonth = () => {
  if (activeMonth.value < 12) {
    activeMonth.value++
    scrollToActiveTab()
  }
}

const scrollToActiveTab = () => {
  nextTick(() => {
    activeTabRef.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  })
}

const scrollToCurrentMonth = () => {
  activeMonth.value = babyStore.currentMonth
  scrollToActiveTab()
}

// 庆祝动画
const showCelebration = () => {
  if (!particlesRef.value) return

  const colors = ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4']
  const container = particlesRef.value

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.cssText = `
      left: ${50 + (Math.random() - 0.5) * 40}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.3}s;
    `
    container.appendChild(particle)

    setTimeout(() => particle.remove(), 1500)
  }
}

// 成就系统 - 7级徽章
const achievements = computed(() => [
  {
    id: 'sprout',
    icon: '🌱',
    title: '小芽苗',
    description: '完成第1个里程碑',
    unlocked: completedCount.value >= 1,
    level: 1,
    color: '#86efac',
  },
  {
    id: 'star',
    icon: '✨',
    title: '闪亮星星',
    description: '完成5个里程碑',
    unlocked: completedCount.value >= 5,
    level: 2,
    color: '#fde047',
  },
  {
    id: 'sun',
    icon: '☀️',
    title: '温暖阳光',
    description: '完成10个里程碑',
    unlocked: completedCount.value >= 10,
    level: 3,
    color: '#fb923c',
  },
  {
    id: 'trophy',
    icon: '🏆',
    title: '铜质奖杯',
    description: '完成25%的里程碑',
    unlocked: completionRate.value >= 25,
    level: 4,
    color: '#d97706',
  },
  {
    id: 'gold',
    icon: '💫',
    title: '璀璨金牌',
    description: '完成50%的里程碑',
    unlocked: completionRate.value >= 50,
    level: 5,
    color: '#fbbf24',
  },
  {
    id: 'diamond',
    icon: '💎',
    title: '稀世钻石',
    description: '完成90%的里程碑',
    unlocked: completionRate.value >= 90,
    level: 6,
    color: '#67e8f9',
  },
  {
    id: 'crown',
    icon: '👑',
    title: '育儿皇冠',
    description: '完成所有里程碑',
    unlocked: completionRate.value === 100,
    level: 7,
    color: '#e879f9',
  },
])

// 已解锁成就数量
const unlockedCount = computed(() => {
  return achievements.value.filter((a) => a.unlocked).length
})

// 成就解锁记录
const achievementUnlocks = ref<Record<string, string>>({})

// 检查是否新解锁
const isNewlyUnlocked = (id: string) => {
  const unlockTime = achievementUnlocks.value[id]
  if (!unlockTime) return false
  const timeDiff = Date.now() - new Date(unlockTime).getTime()
  return timeDiff < 10000 // 10秒内算新解锁
}

// 获取解锁时间文本
const getUnlockTimeText = (id: string) => {
  const unlockTime = achievementUnlocks.value[id]
  if (!unlockTime) return '已解锁'
  const date = new Date(unlockTime)
  return `${date.getMonth() + 1}月${date.getDate()}日解锁`
}

// 显示成就详情
const showAchievementDetail = (achievement: {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}) => {
  if (achievement.unlocked) {
    ElMessage({
      message: `🎉 "${achievement.title}" ${achievement.icon} - ${achievement.description}`,
      type: 'success',
      duration: 3000,
    })
  } else {
    ElMessage({
      message: `🔒 "${achievement.title}" 尚未解锁 - ${achievement.description}`,
      type: 'info',
      duration: 3000,
    })
  }
}

// 监听成就解锁
watch(
  achievements,
  (newVal, oldVal) => {
    if (!oldVal) return
    newVal.forEach((achievement, index) => {
      const old = oldVal[index]
      if (achievement.unlocked && old && !old.unlocked) {
        // 新解锁成就
        achievementUnlocks.value[achievement.id] = new Date().toISOString()
        localStorage.setItem(
          'achievementUnlocks',
          JSON.stringify(achievementUnlocks.value),
        )

        // 显示庆祝提示
        ElMessage({
          message: `🎊 恭喜解锁成就「${achievement.title}」${achievement.icon}`,
          type: 'success',
          duration: 4000,
        })

        // 触发粒子效果
        showCelebration()
      }
    })
  },
  { deep: true },
)

// 导出命令处理
const handleExportCommand = (command: string) => {
  switch (command) {
    case 'export-json':
      exportProgress()
      break
    case 'export-report':
      generateReport()
      break
    case 'family':
      openFamilyDialog()
      break
    case 'import':
      fileInput.value?.click()
      break
    case 'reset':
      resetProgress()
      break
  }
}

// 家庭协作功能
const openFamilyDialog = () => {
  // 加载已保存的家庭成员
  const savedMembers = localStorage.getItem('familyMembers')
  if (savedMembers) {
    familyMembers.value = JSON.parse(savedMembers)
  }
  const savedNotifications = localStorage.getItem('notificationSettings')
  if (savedNotifications) {
    notificationSettings.value = JSON.parse(savedNotifications)
  }
  showFamilyDialog.value = true
}

const saveMember = () => {
  if (!newMember.value.name.trim()) {
    ElMessage.warning('请输入成员称呼')
    return
  }

  if (editingMember.value) {
    // 编辑模式
    const editId = editingMember.value.id
    const index = familyMembers.value.findIndex((m) => m.id === editId)
    if (index !== -1) {
      const existingMember = familyMembers.value[index]
      if (existingMember) {
        familyMembers.value[index] = {
          id: existingMember.id,
          name: newMember.value.name,
          relation: newMember.value.relation,
          permission: newMember.value.permission,
          color: existingMember.color,
          addedAt: existingMember.addedAt,
        }
      }
    }
    ElMessage.success('成员信息已更新')
  } else {
    // 添加模式
    const colorIndex = familyMembers.value.length % memberColors.length
    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.value.name,
      relation: newMember.value.relation,
      permission: newMember.value.permission,
      color: memberColors[colorIndex] ?? '#7c3aed',
      addedAt: new Date().toISOString(),
    }
    familyMembers.value.push(member)
    ElMessage.success('成员添加成功')
  }

  cancelAddMember()
}

const editMember = (member: FamilyMember) => {
  editingMember.value = member
  newMember.value = {
    name: member.name,
    relation: member.relation,
    permission: member.permission,
  }
  showAddMemberForm.value = true
}

const removeMember = (id: string) => {
  ElMessageBox.confirm('确定要移除该成员吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      familyMembers.value = familyMembers.value.filter((m) => m.id !== id)
      localStorage.setItem('familyMembers', JSON.stringify(familyMembers.value))
      ElMessage.success('成员已移除')
    })
    .catch(() => {})
}

const cancelAddMember = () => {
  showAddMemberForm.value = false
  editingMember.value = null
  newMember.value = {
    name: '',
    relation: '爸爸',
    permission: 'edit',
  }
}

const saveFamilySettings = () => {
  localStorage.setItem('familyMembers', JSON.stringify(familyMembers.value))
  localStorage.setItem(
    'notificationSettings',
    JSON.stringify(notificationSettings.value),
  )
  ElMessage.success('设置已保存')
  showFamilyDialog.value = false
}

const generateInviteLink = () => {
  // 生成邀请链接（实际场景需要后端支持）
  const inviteCode = btoa(`${babyStore.babyInfo.name}-${Date.now()}`)
  const inviteUrl = `${window.location.origin}/invite/${inviteCode}`

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(inviteUrl)
      .then(() => {
        ElMessage.success('邀请链接已复制到剪贴板')
      })
      .catch(() => {
        ElMessage.info(`邀请链接：${inviteUrl}`)
      })
  } else {
    ElMessage.info(`邀请链接：${inviteUrl}`)
  }
}

const exportProgress = () => {
  const data = {
    babyInfo: babyStore.babyInfo,
    completedMilestones: babyStore.completedMilestones,
    milestoneRecords: milestoneRecords.value,
    exportDate: new Date().toISOString(),
    version: '2.0',
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${
    babyStore.babyInfo.name
  }-成长记录-${new Date().toLocaleDateString()}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('成长记录已导出！📁')
}

const generateReport = () => {
  showReportDialog.value = true
}

// 格式化日期
const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

// 下载报告为图片
const downloadReportImage = async () => {
  if (!reportRef.value) return

  try {
    ElMessage.info('正在生成图片...')

    // 动态导入 html2canvas
    const html2canvas = (await import('html2canvas')).default

    const canvas = await html2canvas(reportRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const link = document.createElement('a')
    link.download = `${
      babyStore.babyInfo.name
    }-成长报告-${new Date().toLocaleDateString()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    ElMessage.success('报告图片已保存！📷')
  } catch (error) {
    console.error('生成图片失败:', error)
    ElMessage.warning('图片生成失败，请尝试截图保存')
  }
}

// 分享到微信
const shareToWechat = async () => {
  if (!reportRef.value) return

  try {
    // 检查是否在微信环境
    const isWechat = /MicroMessenger/i.test(navigator.userAgent)

    if (isWechat) {
      // 微信环境 - 提示长按保存图片
      ElMessage.info('请长按下方报告图片保存后分享')
    } else {
      // 非微信环境 - 尝试使用 Web Share API
      if (navigator.share) {
        // 先生成图片
        const html2canvas = (await import('html2canvas')).default
        const canvas = await html2canvas(reportRef.value, {
          backgroundColor: '#ffffff',
          scale: 2,
        })

        canvas.toBlob(async (blob: Blob | null) => {
          if (blob) {
            const file = new File(
              [blob],
              `${babyStore.babyInfo.name}-成长报告.png`,
              { type: 'image/png' },
            )
            try {
              await navigator.share({
                title: `${babyStore.babyInfo.name}的成长报告`,
                text: `看看${babyStore.babyInfo.name}的成长进度！已完成${completionRate.value}%的里程碑 🎉`,
                files: [file],
              })
              ElMessage.success('分享成功！')
            } catch (err) {
              if ((err as Error).name !== 'AbortError') {
                ElMessage.info('请先保存图片后再分享到微信')
              }
            }
          }
        }, 'image/png')
      } else {
        // 不支持 Web Share API
        ElMessage.info('请先保存图片，然后打开微信分享')
        await downloadReportImage()
      }
    }
  } catch (error) {
    console.error('分享失败:', error)
    ElMessage.warning('分享失败，请手动保存图片后分享')
  }
}

const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.completedMilestones) {
        babyStore.completedMilestones = data.completedMilestones
        localStorage.setItem(
          'completedMilestones',
          JSON.stringify(data.completedMilestones),
        )
      }
      if (data.milestoneRecords) {
        milestoneRecords.value = data.milestoneRecords
        localStorage.setItem(
          'milestoneRecords',
          JSON.stringify(data.milestoneRecords),
        )
      }
      ElMessage.success('成长记录导入成功！🎉')
    } catch {
      ElMessage.error('文件格式错误，请选择正确的记录文件')
    }
  }
  reader.readAsText(file)
}

const resetProgress = () => {
  ElMessageBox.confirm(
    '确定要重置所有里程碑记录吗？此操作无法撤销。',
    '⚠️ 警告',
    {
      confirmButtonText: '确定重置',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      localStorage.removeItem('completedMilestones')
      localStorage.removeItem('milestoneRecords')
      babyStore.completedMilestones = []
      milestoneRecords.value = {}
      ElMessage.success('已重置所有记录')
    })
    .catch(() => {})
}

const disabledDate = (date: Date) => {
  return date > new Date()
}

// 监听月份变化滚动
watch(activeMonth, () => {
  scrollToActiveTab()
})

onMounted(() => {
  // 加载里程碑记录
  const saved = localStorage.getItem('milestoneRecords')
  if (saved) {
    milestoneRecords.value = JSON.parse(saved)
  }

  // 加载成就解锁记录
  const savedUnlocks = localStorage.getItem('achievementUnlocks')
  if (savedUnlocks) {
    achievementUnlocks.value = JSON.parse(savedUnlocks)
  }

  // 滚动到当前月龄
  nextTick(() => {
    scrollToActiveTab()
  })
})
</script>

<style scoped>
.checklist-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #faf5ff 0%, #ffffff 50%, #fdf2f8 100%);
  padding-bottom: 40px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  padding: 20px;
  padding-bottom: 24px;
  color: white;
  border-radius: 0 0 32px 32px;
  margin-bottom: 20px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-top h1 {
  font-size: 20px;
  margin: 0;
  font-weight: 700;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
}

/* 环形进度主视图 */
.progress-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.ring-progress-container {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.ring-progress {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 10;
}

.ring-fill {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 326.73;
  transition: stroke-dashoffset 0.8s ease;
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  align-items: baseline;
  gap: 2px;
}

/* 完成动画光圈 */
.ring-complete-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 3px solid #10b981;
  animation: pulse-ring 2s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.3;
  }
}

.ring-value {
  font-size: 28px;
  font-weight: 800;
}

.ring-divider {
  font-size: 16px;
  opacity: 0.7;
}

.ring-total {
  font-size: 16px;
  opacity: 0.8;
}

.progress-info {
  flex: 1;
}

.progress-info h2 {
  font-size: 18px;
  margin: 0 0 6px 0;
  font-weight: 700;
}

.progress-rate {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 12px 0;
}

.progress-rate strong {
  font-size: 18px;
  color: #fbbf24;
}

/* 分段进度条样式 */
.stage-progress-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stage-progress-item {
  position: relative;
}

.stage-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.stage-icon {
  font-size: 12px;
}

.stage-name {
  font-size: 11px;
  opacity: 0.85;
  font-weight: 500;
}

.stage-bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stage-bar-container {
  height: 8px;
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  overflow: visible;
  position: relative;
}

.stage-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.stage-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.stage-percent {
  font-size: 11px;
  font-weight: 600;
  min-width: 32px;
  text-align: right;
  opacity: 0.9;
}

/* 悬停提示 */
.stage-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  z-index: 100;
}

.tooltip-content {
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.85);
}

.complete-badge {
  color: #fbbf24;
  font-weight: 600;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: all 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}

.stage-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.stage-badge {
  font-size: 11px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  white-space: nowrap;
}

.stage-badge.completed {
  background: rgba(16, 185, 129, 0.3);
}

/* 当前月龄提示 */
.current-month-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  font-size: 13px;
}

/* 智能提醒区域 */
.smart-reminder-section {
  padding: 0 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 未打卡提醒 */
.no-checkin-reminder {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  animation: reminder-shake 0.5s ease-in-out;
}

@keyframes reminder-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
}

.reminder-icon {
  font-size: 32px;
  animation: bell-ring 2s ease-in-out infinite;
}

@keyframes bell-ring {
  0%,
  100% {
    transform: rotate(0);
  }
  5% {
    transform: rotate(15deg);
  }
  10% {
    transform: rotate(-15deg);
  }
  15% {
    transform: rotate(10deg);
  }
  20% {
    transform: rotate(-10deg);
  }
  25% {
    transform: rotate(0);
  }
}

.reminder-content {
  flex: 1;
}

.reminder-content h4 {
  font-size: 14px;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 4px 0;
}

.reminder-content p {
  font-size: 13px;
  color: #a16207;
  margin: 0;
}

.reminder-content strong {
  color: #dc2626;
  font-size: 16px;
}

/* 本周关键里程碑 */
.key-milestones-reminder {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.reminder-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e5e7eb;
}

.reminder-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.reminder-subtitle {
  font-size: 12px;
  color: #9ca3af;
}

.reminder-milestones {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-milestone-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

.reminder-milestone-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.milestone-priority {
  font-size: 20px;
  min-width: 32px;
  text-align: center;
}

.milestone-priority.high {
  animation: fire-pulse 1s ease-in-out infinite;
}

@keyframes fire-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.milestone-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.milestone-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.milestone-tip {
  font-size: 12px;
  color: #9ca3af;
}

.milestone-arrow {
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.reminder-milestone-item:hover .milestone-arrow {
  transform: translateX(4px);
  color: #7c3aed;
}

.reminder-footer {
  text-align: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
  font-size: 12px;
  color: #9ca3af;
}

/* 提醒滑入动画 */
.reminder-slide-enter-active,
.reminder-slide-leave-active {
  transition: all 0.4s ease;
}

.reminder-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.reminder-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 里程碑高亮脉冲 */
.highlight-pulse {
  animation: highlight-glow 0.5s ease-in-out 3;
}

@keyframes highlight-glow {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }
  50% {
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
  }
}

/* 月龄导航 */
.month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.month-tabs-scroll {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
  scroll-behavior: smooth;
}

.month-tabs-scroll::-webkit-scrollbar {
  display: none;
}

.month-tab {
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 70px;
}

.month-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.month-tab.active {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
}

.month-tab.current:not(.active) {
  border: 2px solid #a855f7;
}

.month-tab.completed .tab-month {
  color: #10b981;
}

.month-tab.active.completed .tab-month {
  color: white;
}

.tab-month {
  font-size: 14px;
  font-weight: 700;
}

.tab-progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.month-tab.active .tab-progress-bar {
  background: rgba(255, 255, 255, 0.3);
}

.tab-progress-fill {
  height: 100%;
  background: #10b981;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.tab-status {
  font-size: 11px;
  opacity: 0.7;
}

.tab-count {
  font-weight: 500;
}

/* 月龄内容 */
.month-content {
  padding: 0 16px;
  margin-bottom: 24px;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.month-info h2 {
  font-size: 20px;
  margin: 0 0 6px 0;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.month-icon {
  font-size: 24px;
}

.month-info p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.mini-progress-text {
  font-size: 14px;
  font-weight: 700;
  color: #7c3aed;
}

/* 里程碑网格 */
.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.milestone-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  overflow: hidden;
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

.milestone-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.15);
  border-color: rgba(124, 58, 237, 0.3);
}

.milestone-card.completed {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
}

.card-check {
  position: absolute;
  top: 16px;
  right: 16px;
}

.check-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: white;
}

.check-circle:hover {
  border-color: #7c3aed;
  transform: scale(1.1);
}

.milestone-card.completed .check-circle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: transparent;
  color: white;
}

.check-icon {
  font-size: 16px;
}

.check-pop-enter-active {
  animation: checkPop 0.3s ease;
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.card-body h3 {
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #1f2937;
  padding-right: 36px;
}

.card-body p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.record-hint {
  color: #a855f7;
  font-size: 16px;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(16, 185, 129, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* 自定义里程碑入口 */
.custom-milestone-section {
  padding: 0 16px;
  margin-bottom: 24px;
  text-align: center;
}

/* 成就展示 - 升级版 */
.achievements-section {
  padding: 0 16px;
  margin-bottom: 40px;
}

.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.achievements-header h2 {
  font-size: 18px;
  margin: 0;
  color: #1f2937;
}

.unlocked-count {
  font-size: 13px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 12px;
}

/* 成就进度条 */
.achievements-progress {
  margin-bottom: 20px;
  padding: 0 20px;
}

.progress-track {
  position: relative;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%);
  border-radius: 3px;
  transition: width 0.6s ease;
}

.progress-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-node.unlocked {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  animation: node-unlock 0.5s ease;
}

@keyframes node-unlock {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.node-icon {
  font-size: 12px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.achievement-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  background: #f9fafb;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: card-appear 0.5s ease forwards;
  opacity: 0;
  overflow: hidden;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 0.6;
    transform: translateY(0);
  }
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.achievement-card.unlocked {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  animation: card-unlock 0.5s ease forwards;
}

@keyframes card-unlock {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.achievement-card.newly-unlocked {
  animation: newly-unlocked-glow 2s ease infinite;
}

@keyframes newly-unlocked-glow {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  }
  50% {
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
  }
}

/* 徽章图标 */
.achievement-badge {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.achievement-card.unlocked .achievement-badge {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.achievement-badge.shine::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  border: 2px solid #fbbf24;
  animation: badge-shine 2s ease-in-out infinite;
}

@keyframes badge-shine {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.badge-icon {
  font-size: 28px;
  z-index: 1;
}

.badge-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(251, 191, 36, 0.3) 0%,
    transparent 70%
  );
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.2;
  }
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-info h4 {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.achievement-card:not(.unlocked) .achievement-info h4 {
  color: #9ca3af;
}

.achievement-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.unlock-time {
  font-size: 11px;
  color: #f59e0b;
  margin-top: 4px;
  font-weight: 500;
}

.achievement-status {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-unlocked {
  font-size: 24px;
  animation: sparkle-spin 1s ease-in-out;
}

@keyframes sparkle-spin {
  from {
    transform: rotate(0deg) scale(0);
  }
  to {
    transform: rotate(360deg) scale(1);
  }
}

.status-locked {
  color: #d1d5db;
}

/* 卡片光效 */
.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: card-shine-sweep 3s ease-in-out infinite;
}

@keyframes card-shine-sweep {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 150%;
  }
}

/* 奖杯弹出动画 */
.trophy-pop-enter-active {
  animation: trophy-pop 0.4s ease;
}

@keyframes trophy-pop {
  0% {
    transform: scale(0) rotate(-180deg);
  }
  70% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* 成长报告对话框样式 */
.report-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.report-preview {
  background: linear-gradient(180deg, #faf5ff 0%, #ffffff 50%, #fdf2f8 100%);
  padding: 24px;
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-title-info h2 {
  font-size: 20px;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.report-title-info p {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.report-section {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.report-section h3 {
  font-size: 15px;
  margin: 0 0 12px 0;
  color: #1f2937;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: #9ca3af;
}

.info-item .value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* 进度概览 */
.progress-overview {
  display: flex;
  align-items: center;
  gap: 24px;
}

.big-progress {
  flex-shrink: 0;
}

.progress-ring-report {
  position: relative;
  width: 100px;
  height: 100px;
}

.progress-ring-report svg {
  transform: rotate(-90deg);
}

.ring-bg-report {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 8;
}

.ring-fill-report {
  fill: none;
  stroke: url(#progressGradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 251.2;
  transition: stroke-dashoffset 0.8s ease;
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-text .rate {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: #7c3aed;
}

.ring-text .label {
  font-size: 10px;
  color: #9ca3af;
}

.progress-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #7c3aed;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

/* 阶段报告 */
.stage-report-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stage-report-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stage-icon {
  font-size: 16px;
}

.stage-name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.stage-rate {
  font-size: 14px;
  font-weight: 700;
}

.stage-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.stage-bar .stage-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.stage-detail {
  font-size: 11px;
  color: #9ca3af;
  text-align: right;
}

/* 月度报告网格 */
.month-report-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.month-report-item {
  text-align: center;
  padding: 8px;
  background: #f9fafb;
  border-radius: 8px;
}

.month-label {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
}

.month-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.month-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #a855f7 0%, #10b981 100%);
  border-radius: 2px;
}

.month-stat {
  font-size: 10px;
  color: #9ca3af;
}

/* 成就报告 */
.achievements-report {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.achievement-report-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-radius: 20px;
  font-size: 12px;
}

.achievement-report-item .icon {
  font-size: 16px;
}

.achievement-report-item .title {
  font-weight: 600;
  color: #92400e;
}

.no-achievements {
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
  padding: 16px;
}

/* 报告底部 */
.report-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px dashed #e5e7eb;
}

.report-footer p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.report-footer .app-name {
  margin-top: 8px;
  font-size: 12px;
  color: #a855f7;
  font-weight: 600;
}

.report-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* 家庭协作对话框样式 */
.family-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.family-content {
  padding: 20px;
}

.current-user-card {
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
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
}

.user-info h4 {
  font-size: 16px;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.role-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.family-section {
  margin-bottom: 20px;
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
  color: #1f2937;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.member-info {
  flex: 1;
}

.member-info h4 {
  font-size: 14px;
  margin: 0 0 2px 0;
  color: #1f2937;
}

.member-role {
  font-size: 12px;
  color: #9ca3af;
}

.member-permission {
  margin-right: 8px;
}

.member-actions {
  display: flex;
  gap: 4px;
}

.empty-members {
  text-align: center;
  padding: 32px 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.empty-members p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.empty-members .hint {
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
}

/* 添加成员表单 */
.add-member-form {
  background: #f9fafb;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.add-member-form h4 {
  font-size: 15px;
  margin: 0 0 16px 0;
  color: #1f2937;
}

.add-member-form .el-radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-member-form .el-radio {
  height: auto;
  align-items: flex-start;
}

.permission-hint {
  font-size: 11px;
  color: #9ca3af;
  margin: 2px 0 0 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

/* 通知设置 */
.notifications-section h3 {
  font-size: 15px;
  margin: 0 0 12px 0;
  color: #1f2937;
}

.notification-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.notification-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.notification-desc {
  font-size: 12px;
  color: #9ca3af;
}

/* 分享邀请 */
.share-invite-section {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%);
  border-radius: 16px;
}

.invite-hint {
  font-size: 12px;
  color: #6b7280;
  margin: 8px 0 0 0;
}

/* 滑入动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 对话框样式 */
.milestone-dialog .milestone-desc {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.record-form .el-form-item {
  margin-bottom: 16px;
}

.media-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.media-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-media {
  position: absolute;
  top: 4px;
  right: 4px;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  gap: 4px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  border-color: #7c3aed;
  color: #7c3aed;
}

.upload-btn span {
  font-size: 12px;
}

/* 粒子动画 */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: particle-fly 1.2s ease-out forwards;
}

@keyframes particle-fly {
  0% {
    top: 40%;
    opacity: 1;
    transform: scale(1);
  }
  100% {
    top: -10%;
    opacity: 0;
    transform: scale(0) translateX(calc((var(--random, 0.5) - 0.5) * 200px));
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .progress-hero {
    flex-direction: column;
    text-align: center;
  }

  .progress-info h2 {
    font-size: 16px;
  }

  .stage-badges {
    justify-content: center;
  }

  .month-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .milestones-grid {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 16px;
  }

  .ring-progress-container {
    width: 100px;
    height: 100px;
  }

  .ring-value {
    font-size: 24px;
  }

  .month-tab {
    min-width: 60px;
    padding: 8px 10px;
  }

  .tab-month {
    font-size: 12px;
  }

  .milestone-card {
    padding: 16px;
  }

  .card-body h3 {
    font-size: 14px;
  }
}
</style>

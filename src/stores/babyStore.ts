import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { babyMonthsData } from '../data/babyMonthsData'

export const useBabyStore = defineStore('baby', () => {
  // 当前宝宝月龄
  const currentMonth = ref(0)

  // 宝宝基本信息
  const babyInfo = ref({
    name: '宝宝',
    birthday: new Date(),
    gender: 'unknown' as 'boy' | 'girl' | 'unknown'
  })

  // 已完成的里程碑
  const completedMilestones = ref<string[]>([])

  // 获取所有月龄数据
  const allMonthsData = computed(() => babyMonthsData)

  // 获取当前月龄数据
  const currentMonthData = computed(() => {
    return babyMonthsData.find(m => m.month === currentMonth.value) || babyMonthsData[0]
  })

  // 计算宝宝实际月龄
  const calculateBabyAge = () => {
    const now = new Date()
    const birth = new Date(babyInfo.value.birthday)
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
    return Math.max(0, Math.min(12, months))
  }

  // 设置宝宝信息
  const setBabyInfo = (info: { name: string; birthday: Date; gender: 'boy' | 'girl' | 'unknown' }) => {
    babyInfo.value = info
    currentMonth.value = calculateBabyAge()
    // 保存到本地存储
    localStorage.setItem('babyInfo', JSON.stringify(info))
  }

  // 切换月龄
  const setCurrentMonth = (month: number) => {
    if (month >= 0 && month <= 12) {
      currentMonth.value = month
    }
  }

  // 标记里程碑完成
  const toggleMilestone = (milestoneTitle: string) => {
    const index = completedMilestones.value.indexOf(milestoneTitle)
    if (index > -1) {
      completedMilestones.value.splice(index, 1)
    } else {
      completedMilestones.value.push(milestoneTitle)
    }
    // 保存到本地存储
    localStorage.setItem('completedMilestones', JSON.stringify(completedMilestones.value))
  }

  // 检查里程碑是否完成
  const isMilestoneCompleted = (milestoneTitle: string) => {
    return completedMilestones.value.includes(milestoneTitle)
  }

  // 初始化从本地存储加载数据
  const initFromStorage = () => {
    const savedBabyInfo = localStorage.getItem('babyInfo')
    if (savedBabyInfo) {
      const info = JSON.parse(savedBabyInfo)
      info.birthday = new Date(info.birthday)
      babyInfo.value = info
      currentMonth.value = calculateBabyAge()
    }

    const savedMilestones = localStorage.getItem('completedMilestones')
    if (savedMilestones) {
      completedMilestones.value = JSON.parse(savedMilestones)
    }
  }

  return {
    currentMonth,
    babyInfo,
    completedMilestones,
    allMonthsData,
    currentMonthData,
    setBabyInfo,
    setCurrentMonth,
    toggleMilestone,
    isMilestoneCompleted,
    initFromStorage,
    calculateBabyAge
  }
})

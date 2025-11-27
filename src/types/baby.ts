// 婴儿成长阶段数据类型定义

export interface BabyMonthData {
  month: number; // 月龄
  title: string; // 标题
  summary: string; // 简介
  physicalDevelopment: PhysicalDevelopment; // 身体发育
  cognitiveSkills: string[]; // 认知能力
  motorSkills: MotorSkills; // 运动能力
  socialEmotional: string[]; // 社交情感
  careGuidelines: CareGuideline[]; // 护理指南
  nutritionTips: NutritionTip[]; // 营养建议
  safetyWarnings: string[]; // 安全警示
  milestones: Milestone[]; // 成长里程碑
  commonIssues: CommonIssue[]; // 常见问题
  videos: MediaResource[]; // 视频资源
  images: MediaResource[]; // 图片资源
}

export interface PhysicalDevelopment {
  weight: string; // 体重范围
  height: string; // 身高范围
  headCircumference: string; // 头围范围
  description: string; // 描述
}

export interface MotorSkills {
  gross: string[]; // 大运动
  fine: string[]; // 精细动作
}

export interface CareGuideline {
  category: string; // 分类（如：睡眠、洗澡、换尿布等）
  icon: string; // 图标
  tips: string[]; // 提示
  duration?: string; // 时长或频率
}

export interface NutritionTip {
  type: string; // 类型（母乳、配方奶、辅食等）
  frequency: string; // 频率
  amount: string; // 量
  notes: string[]; // 注意事项
}

export interface Milestone {
  title: string; // 标题
  description: string; // 描述
  achieved: boolean; // 是否达成
  icon: string; // 图标
}

export interface CommonIssue {
  problem: string; // 问题
  symptoms: string[]; // 症状
  solutions: string[]; // 解决方案
  whenToSeeDr: string; // 何时就医
}

export interface MediaResource {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  type: 'video' | 'image' | 'gif';
  duration?: string; // 视频时长
}

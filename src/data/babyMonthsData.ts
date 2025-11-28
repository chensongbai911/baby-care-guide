import type { BabyMonthData } from '../types/baby'

// 0-12个月婴儿成长数据
export const babyMonthsData: BabyMonthData[] = [
  {
    month: 0,
    title: '新生儿期（0-1个月）',
    summary: '欢迎来到这个世界！这是宝宝适应新环境的关键时期，需要格外细心的照顾。',
    physicalDevelopment: {
      weight: '2.5-4.5kg',
      height: '46-52cm',
      headCircumference: '33-38cm',
      description: '新生儿大部分时间在睡觉，每天睡眠16-20小时。体重可能在出生后几天略有下降，这是正常现象。'
    },
    cognitiveSkills: [
      '能看到20-30cm范围内的物体',
      '对强光有反应',
      '能听到声音并转向声源',
      '对妈妈的声音有特殊反应'
    ],
    motorSkills: {
      gross: [
        '具有原始反射（抓握反射、吸吮反射、惊跳反射）',
        '俯卧时能短暂抬头',
        '四肢活动不协调但有力'
      ],
      fine: [
        '手通常握拳',
        '会抓住放在手中的物品（反射性）'
      ]
    },
    socialEmotional: [
      '通过哭声表达需求',
      '能够识别妈妈的气味',
      '对温柔的触摸有积极反应',
      '开始出现社交性微笑的萌芽'
    ],
    careGuidelines: [
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['仰卧睡眠最安全，避免趴睡', '保持房间安静、温暖（20-22°C）', '每天睡眠16-20小时'],
        duration: '16-20小时/天'
      },
      {
        category: '洗澡',
        icon: 'bath',
        tips: ['脐带未脱落前用海绵擦浴', '水温37-38°C，用肘部测试', '洗澡时间5-10分钟即可'],
        duration: '2-3次/周'
      },
      {
        category: '脐带护理',
        icon: 'medical',
        tips: ['保持脐带干燥清洁', '用75%酒精消毒', '通常1-2周自然脱落']
      }
    ],
    nutritionTips: [
      {
        type: '母乳喂养',
        frequency: '按需喂养',
        amount: '8-12次/天',
        notes: ['母乳是最好的营养来源', '按需哺乳，不必严格定时', '喂奶后要拍嗝']
      },
      {
        type: '配方奶',
        frequency: '每3-4小时',
        amount: '60-90ml/次',
        notes: ['选择适合新生儿的配方奶', '严格按说明冲调']
      }
    ],
    safetyWarnings: [
      '❗ 绝不能让宝宝独自待在高处',
      '❗ 不要在婴儿床放置枕头、毛绒玩具',
      '❗ 不要摇晃宝宝',
      '❗ 抱宝宝时一定要支撑头部和颈部'
    ],
    milestones: [
      { title: '抬头', description: '俯卧时能短暂抬头45度', achieved: false, icon: 'baby-face' },
      { title: '视觉追踪', description: '能跟踪移动的物体', achieved: false, icon: 'eye' },
      { title: '声音反应', description: '对突然的声音有惊跳反应', achieved: false, icon: 'sound' }
    ],
    commonIssues: [
      {
        problem: '黄疸',
        symptoms: ['皮肤、眼白发黄', '精神萎靡'],
        solutions: ['多晒太阳', '增加喂养频率'],
        whenToSeeDr: '黄疸超过2周、皮肤越来越黄'
      },
      {
        problem: '肠绞痛',
        symptoms: ['无缘无故哭闹', '面色涨红'],
        solutions: ['飞机抱或腹部按摩', '白噪音安抚'],
        whenToSeeDr: '持续哭闹超过3小时'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 1,
    title: '第1个月',
    summary: '宝宝开始对周围世界有更多反应，睡眠时间略有减少，互动增加。',
    physicalDevelopment: {
      weight: '3.4-5.8kg',
      height: '50-56cm',
      headCircumference: '35-40cm',
      description: '生长迅速，平均每天增重25-30克。'
    },
    cognitiveSkills: ['能够注视人脸', '开始识别主要照顾者', '会跟随移动的物体'],
    motorSkills: {
      gross: ['俯卧时能抬头45度', '腿部力量增强'],
      fine: ['手指开始偶尔张开', '能短暂握住拨浪鼓']
    },
    socialEmotional: ['开始有意识地微笑', '能发出"咕咕"声', '眼神交流增多'],
    careGuidelines: [
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天睡眠15-18小时', '开始区分昼夜'],
        duration: '15-18小时/天'
      },
      {
        category: '趴趴练习',
        icon: 'exercise',
        tips: ['每天2-3次，每次3-5分钟', '用玩具吸引抬头'],
        duration: '每天累计15分钟'
      }
    ],
    nutritionTips: [
      {
        type: '母乳',
        frequency: '按需喂养',
        amount: '8-10次/天',
        notes: ['继续按需哺乳', '观察尿布量判断奶量充足']
      }
    ],
    safetyWarnings: ['❗ 开始能够踢腿，注意防止从床上滚落', '❗ 外出时要做好保暖或防晒'],
    milestones: [
      { title: '社交性微笑', description: '看到熟悉的人会微笑', achieved: false, icon: 'smile' },
      { title: '抬头', description: '俯卧时能抬头45度并保持', achieved: false, icon: 'baby' }
    ],
    commonIssues: [
      {
        problem: '吐奶',
        symptoms: ['喂奶后吐出少量奶液'],
        solutions: ['喂奶后要充分拍嗝', '喂奶后保持竖抱15-20分钟'],
        whenToSeeDr: '喷射性呕吐、体重不增'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 2,
    title: '第2个月',
    summary: '宝宝变得更加活跃和机警，互动性大大增强。',
    physicalDevelopment: {
      weight: '4.3-7.1kg',
      height: '54-60cm',
      headCircumference: '37-42cm',
      description: '继续快速生长，头部控制能力明显增强。'
    },
    cognitiveSkills: ['能认出父母的脸', '开始理解因果关系', '喜欢看人脸'],
    motorSkills: {
      gross: ['俯卧时能抬头90度', '腿部蹬踢更有力'],
      fine: ['手指大部分时间张开', '开始尝试抓握玩具']
    },
    socialEmotional: ['经常对人微笑', '开始发出笑声', '喜欢与人互动'],
    careGuidelines: [
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天睡眠14-17小时', '夜间睡眠逐渐延长'],
        duration: '14-17小时/天'
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '按需喂养',
        amount: '7-9次/天',
        notes: ['喂养间隔可能拉长']
      }
    ],
    safetyWarnings: ['❗ 开始能够翻身，绝不能独自留在高处', '❗ 疫苗接种：2个月要打疫苗'],
    milestones: [
      { title: '头部控制', description: '俯卧时能抬头90度', achieved: false, icon: 'strength' },
      { title: '社交互动', description: '对熟悉的人微笑并发出声音', achieved: false, icon: 'heart' }
    ],
    commonIssues: [
      {
        problem: '猛长期',
        symptoms: ['突然频繁要吃奶', '烦躁不安'],
        solutions: ['按需哺乳，不要限制', '通常持续2-3天'],
        whenToSeeDr: '体重下降、脱水症状'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 3,
    title: '第3个月',
    summary: '宝宝进入一个相对稳定期，作息逐渐规律。',
    physicalDevelopment: {
      weight: '5.0-8.0kg',
      height: '57-64cm',
      headCircumference: '38-43cm',
      description: '体重增速开始放缓，变得更加匀称。'
    },
    cognitiveSkills: ['能识别熟悉的物品和人', '对音乐有明显反应', '记忆力提升'],
    motorSkills: {
      gross: ['俯卧时能用前臂支撑', '可能开始尝试翻身'],
      fine: ['能够握住玩具并摇晃', '会吸吮手指']
    },
    socialEmotional: ['经常大笑', '主动寻求互动', '模仿面部表情'],
    careGuidelines: [
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天睡眠14-16小时', '白天3-4次小睡'],
        duration: '14-16小时/天'
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '6-8次/天',
        amount: '按需',
        notes: ['喂养间隔进一步拉长']
      }
    ],
    safetyWarnings: ['❗ 随时可能翻身，注意防摔', '❗ 疫苗接种：3个月疫苗'],
    milestones: [
      { title: '翻身', description: '能从趴着翻到仰卧', achieved: false, icon: 'rotate' },
      { title: '大笑', description: '发出清晰的笑声', achieved: false, icon: 'laugh' }
    ],
    commonIssues: [
      {
        problem: '3个月睡眠倒退',
        symptoms: ['之前睡得好突然频繁醒', '白天小睡变短'],
        solutions: ['保持一致的作息', '通常2-6周会好转'],
        whenToSeeDr: '持续超过2个月'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 4,
    title: '第4个月',
    summary: '宝宝的社交能力和运动能力都有显著提升，开始对周围世界充满好奇。',
    physicalDevelopment: {
      weight: '5.7-8.7kg',
      height: '60-67cm',
      headCircumference: '39-44cm',
      description: '体重增长稳定，肌肉力量明显增强，可能开始长牙。头部控制越来越好，能够稳定地支撑自己的头部。'
    },
    cognitiveSkills: [
      '能够识别熟悉的人和物品',
      '对镜子中的自己感兴趣',
      '注意力时间延长到5-10分钟',
      '开始理解因果关系（按按钮会发出声音）',
      '能够追踪快速移动的物体',
      '对鲜艳的颜色更感兴趣'
    ],
    motorSkills: {
      gross: [
        '能够翻身（双向）',
        '能够坐起但需要支撑',
        '俯卧时能用双手撑起上身',
        '腿部力量增强，喜欢蹬腿',
        '被抱着站立时能支撑部分体重'
      ],
      fine: [
        '能准确抓取物品',
        '会把物品从一只手换到另一只手',
        '会用双手握住奶瓶',
        '能够有目的地伸手够物品',
        '喜欢把东西放进嘴里探索'
      ]
    },
    socialEmotional: [
      '笑声更加频繁和响亮',
      '开始咿呀学语，发出更多音节',
      '对表扬有积极反应',
      '能够表达高兴、不满等情绪',
      '开始对陌生人有警觉',
      '喜欢和照顾者玩互动游戏'
    ],
    careGuidelines: [
      {
        category: '睡眠管理',
        icon: 'moon',
        tips: [
          '每天睡眠12-15小时',
          '可能出现4个月睡眠倒退',
          '建立固定的睡前仪式',
          '白天安排3次小睡',
          '夜间可能还需喂奶1-2次'
        ],
        duration: '12-15小时/天'
      },
      {
        category: '趴趴时间',
        icon: 'exercise',
        tips: [
          '每天累计30-60分钟',
          '可以用玩具吸引宝宝抬头',
          '在宝宝清醒时进行',
          '铺设安全的游戏垫'
        ],
        duration: '30-60分钟/天'
      },
      {
        category: '亲子互动',
        icon: 'heart',
        tips: [
          '多进行面对面交流',
          '唱歌、说话刺激语言发展',
          '玩躲猫猫游戏',
          '提供不同质地的玩具探索'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '5-7次/天',
        amount: '每次150-180ml',
        notes: [
          '6个月前不需要辅食',
          '按需喂养，不必严格定量',
          '注意观察饥饿信号',
          '喂奶后记得拍嗝'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 会翻身了，睡觉时绝不能独自留在床上',
      '❗ 疫苗接种：4个月需要打脊灰疫苗、百白破疫苗',
      '❗ 不要让宝宝接触小物品，避免误食',
      '❗ 玩具要定期消毒清洁',
      '❗ 抱宝宝时注意支撑腰部'
    ],
    milestones: [
      { title: '双向翻身', description: '能自如地从仰卧翻到俯卧，再从俯卧翻回仰卧', achieved: false, icon: 'rotate' },
      { title: '咿呀学语', description: '开始发出"ba"、"da"、"ma"等音节', achieved: false, icon: 'sound' },
      { title: '抓握物品', description: '能够准确伸手抓取想要的物品', achieved: false, icon: 'hand' },
      { title: '认人', description: '能区分熟悉的人和陌生人', achieved: false, icon: 'people' }
    ],
    commonIssues: [
      {
        problem: '4个月睡眠倒退',
        symptoms: ['频繁夜醒', '小睡变短', '入睡困难', '睡眠规律被打乱'],
        solutions: [
          '建立固定的睡前仪式',
          '保持卧室环境安静黑暗',
          '不要养成奶睡、抱睡习惯',
          '通常持续2-6周会好转'
        ],
        whenToSeeDr: '持续超过2个月、严重影响生长发育'
      },
      {
        problem: '出牙不适',
        symptoms: ['流口水增多', '喜欢咬东西', '烦躁易怒', '牙龈红肿'],
        solutions: [
          '提供安全的磨牙玩具',
          '用干净的湿纱布按摩牙龈',
          '冷藏的磨牙环可缓解不适'
        ],
        whenToSeeDr: '发烧超过38.5°C、拒绝进食'
      }
    ],
    videos: [
      {
        id: 'v401',
        title: '4个月宝宝发育特点',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
        description: '了解4个月宝宝的发育里程碑和护理要点',
        type: 'video'
      },
      {
        id: 'v402',
        title: '如何帮助宝宝学翻身',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400',
        description: '专业指导宝宝翻身训练技巧',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i401',
        title: '4个月宝宝发育对照表',
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
        description: '4个月宝宝身高体重标准参考',
        type: 'image'
      },
      {
        id: 'i402',
        title: '趴趴时间指南',
        url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800',
        description: '正确进行趴趴时间的姿势示范',
        type: 'image'
      }
    ]
  },
  {
    month: 5,
    title: '第5个月',
    summary: '宝宝变得更加活跃，运动能力突飞猛进，对周围环境的探索欲望越来越强烈。',
    physicalDevelopment: {
      weight: '6.3-9.3kg',
      height: '62-70cm',
      headCircumference: '40-45cm',
      description: '身体比例更加匀称，肌肉发育良好。核心力量增强，为坐立和爬行做准备。部分宝宝可能开始长第一颗牙。'
    },
    cognitiveSkills: [
      '能区分熟人和陌生人',
      '对自己的名字有反应',
      '注意力更集中，可达10-15分钟',
      '开始理解简单的因果关系',
      '对新事物表现出强烈好奇心',
      '能够记住经常见到的物品'
    ],
    motorSkills: {
      gross: [
        '能翻滚移动',
        '可能开始尝试爬行动作',
        '俯卧时能用手臂撑起整个上半身',
        '有支撑时能够坐立',
        '站立时腿部能够承受更多体重'
      ],
      fine: [
        '能准确抓取想要的物品',
        '能握住奶瓶',
        '会用双手探索物品',
        '开始学习将物品从一只手传到另一只手',
        '喜欢敲打、摇晃玩具'
      ]
    },
    socialEmotional: [
      '对陌生人可能有警惕',
      '会主动发起互动',
      '开始有分离焦虑的萌芽',
      '能够通过声音和表情表达情绪',
      '喜欢被逗笑，笑声更加丰富',
      '开始表现出对特定玩具的偏好'
    ],
    careGuidelines: [
      {
        category: '睡眠管理',
        icon: 'moon',
        tips: [
          '每天睡眠12-14小时',
          '建立稳定的睡眠习惯',
          '白天安排2-3次小睡',
          '睡前仪式：洗澡、换衣、读书',
          '夜间喂奶次数可能减少到1次'
        ],
        duration: '12-14小时/天'
      },
      {
        category: '运动锻炼',
        icon: 'exercise',
        tips: [
          '每天趴趴时间60分钟以上',
          '鼓励翻滚和移动',
          '在安全垫上自由活动',
          '用玩具引导宝宝够取'
        ],
        duration: '60分钟+/天'
      },
      {
        category: '感官刺激',
        icon: 'brain',
        tips: [
          '提供不同质地的玩具',
          '播放音乐和儿歌',
          '多进行面对面交流',
          '带宝宝接触大自然'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '5-6次/天',
        amount: '每次180-210ml',
        notes: [
          '为6个月添加辅食做准备',
          '观察宝宝对食物的兴趣',
          '不要过早添加辅食',
          '保持奶量充足'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 开始能移动，要做好家居安全检查',
      '❗ 电源插座要加保护盖',
      '❗ 地面保持清洁，收起小物品',
      '❗ 不要让宝宝独自在床上或沙发上',
      '❗ 玩具要检查是否有可脱落的小零件'
    ],
    milestones: [
      { title: '独立翻滚', description: '能自如地翻滚来移动位置', achieved: false, icon: 'move' },
      { title: '辨认名字', description: '听到自己名字会有反应、转头', achieved: false, icon: 'ear' },
      { title: '物品传递', description: '能把物品从一只手换到另一只手', achieved: false, icon: 'hand' },
      { title: '发声增加', description: '发出更多不同的声音和音节', achieved: false, icon: 'sound' }
    ],
    commonIssues: [
      {
        problem: '分离焦虑开始',
        symptoms: ['妈妈离开就哭', '粘人', '只要特定的人抱'],
        solutions: [
          '短暂离开练习，逐渐延长时间',
          '离开时说再见，不要偷偷走',
          '回来时给予拥抱和安慰',
          '这是正常的发育阶段'
        ],
        whenToSeeDr: '严重影响日常生活、进食和睡眠'
      },
      {
        problem: '出牙症状',
        symptoms: ['流口水多', '喜欢咬东西', '睡眠不安', '轻微发热'],
        solutions: [
          '提供安全的磨牙玩具',
          '冷藏的毛巾让宝宝咬',
          '轻轻按摩牙龈',
          '保持口腔清洁'
        ],
        whenToSeeDr: '高烧、腹泻、拒绝进食'
      }
    ],
    videos: [
      {
        id: 'v501',
        title: '5个月宝宝发育指南',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=400',
        description: '5个月宝宝应该达到的发育里程碑',
        type: 'video'
      },
      {
        id: 'v502',
        title: '如何应对分离焦虑',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400',
        description: '帮助宝宝度过分离焦虑期的技巧',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i501',
        title: '5个月宝宝运动发展',
        url: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800',
        description: '5个月宝宝的运动能力发展参考',
        type: 'image'
      },
      {
        id: 'i502',
        title: '安全的游戏环境',
        url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
        description: '如何为宝宝创造安全的游戏空间',
        type: 'image'
      }
    ]
  },
  {
    month: 6,
    title: '第6个月',
    summary: '重要的里程碑月份！宝宝半岁啦，可以开始添加辅食，进入全新的成长阶段。',
    physicalDevelopment: {
      weight: '6.8-9.7kg',
      height: '64-72cm',
      headCircumference: '41-46cm',
      description: '半岁啦！体重约为出生时的2倍，身长增加约15cm。大部分宝宝开始长牙，下门牙通常最先萌出。'
    },
    cognitiveSkills: [
      '能找到部分隐藏的物品',
      '开始理解简单的指令',
      '记忆力明显提升',
      '对因果关系更加感兴趣',
      '能够区分熟人和陌生人',
      '开始理解"不"的含义'
    ],
    motorSkills: {
      gross: [
        '能独立坐稳几分钟',
        '可能开始爬行（肚子贴地）',
        '俯卧时能撑起整个上半身',
        '喜欢在大人帮助下站立弹跳',
        '能够从坐姿转换到俯卧'
      ],
      fine: [
        '能用手指和手掌抓握',
        '会用双手同时抓握物品',
        '喜欢撕纸、敲打物品',
        '能够将物品从一只手传到另一只',
        '开始尝试用拇指和其他手指抓取'
      ]
    },
    socialEmotional: [
      '认生更明显，见到陌生人可能哭',
      '会用声音和表情表达情绪',
      '喜欢照镜子，对镜中的自己感兴趣',
      '分离焦虑可能开始出现',
      '喜欢和照顾者玩互动游戏',
      '能够表达高兴、生气、害怕等情绪'
    ],
    careGuidelines: [
      {
        category: '辅食添加',
        icon: 'food',
        tips: [
          '从单一食材开始，观察3-5天',
          '强化铁米糊是好的第一选择',
          '不要添加盐、糖、蜂蜜',
          '辅食要打成细腻的糊状',
          '逐渐增加种类：蔬菜泥、水果泥、肉泥'
        ],
        duration: '每天1-2次'
      },
      {
        category: '睡眠管理',
        icon: 'moon',
        tips: [
          '每天睡眠12-14小时',
          '白天2-3次小睡',
          '建立固定的睡前仪式',
          '夜间可能还需喂奶1次'
        ],
        duration: '12-14小时/天'
      },
      {
        category: '口腔护理',
        icon: 'tooth',
        tips: [
          '长牙后开始清洁牙齿',
          '用纱布或指套牙刷擦拭',
          '不要让宝宝含着奶瓶睡觉',
          '提供安全的磨牙玩具'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '4-6次/天',
        amount: '每天800-1000ml',
        notes: [
          '奶仍是主要营养来源',
          '辅食是补充，不是替代',
          '先喂奶再喂辅食',
          '保持规律的喂养时间'
        ]
      },
      {
        type: '辅食',
        frequency: '1-2次/天',
        amount: '每次30-60ml',
        notes: [
          '首选：强化铁米糊',
          '质地：稀糊状',
          '温度：接近体温',
          '观察过敏反应'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 可能开始爬行，全面检查地面安全',
      '❗ 疫苗接种：6个月疫苗（乙肝第三针等）',
      '❗ 蜂蜜！1岁前绝对禁止',
      '❗ 辅食不要添加任何调味料',
      '❗ 小心呛咳和过敏',
      '❗ 玩具要定期清洁消毒'
    ],
    milestones: [
      { title: '独坐', description: '能独自坐稳不需要支撑', achieved: false, icon: 'sit' },
      { title: '第一口辅食', description: '开始尝试母乳/奶粉以外的食物', achieved: false, icon: 'food' },
      { title: '发音丰富', description: '发出更多元音和辅音组合', achieved: false, icon: 'sound' },
      { title: '物体恒存', description: '知道物品被遮住后仍然存在', achieved: false, icon: 'brain' }
    ],
    commonIssues: [
      {
        problem: '拒绝辅食',
        symptoms: ['推开勺子', '吐出食物', '转头躲避', '哭闹'],
        solutions: [
          '不要强迫，保持耐心',
          '换个时间再试',
          '尝试不同的食材',
          '让宝宝看大人吃饭',
          '营造愉快的进餐氛围'
        ],
        whenToSeeDr: '持续拒绝导致体重不增、营养不良'
      },
      {
        problem: '出牙不适',
        symptoms: ['流口水增多', '牙龈红肿', '喜欢咬东西', '烦躁哭闹', '睡眠不安'],
        solutions: [
          '提供冷藏的磨牙环',
          '轻轻按摩牙龈',
          '保持口腔清洁',
          '及时擦干口水防止皮疹'
        ],
        whenToSeeDr: '发烧超过38.5°C、腹泻、严重拒食'
      }
    ],
    videos: [
      {
        id: 'v601',
        title: '6个月宝宝辅食添加指南',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        description: '详细讲解如何正确给宝宝添加第一口辅食',
        type: 'video'
      },
      {
        id: 'v602',
        title: '宝宝辅食制作技巧',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400',
        description: '营养师教你制作宝宝爱吃的辅食',
        type: 'video'
      },
      {
        id: 'v603',
        title: '6个月宝宝发育评估',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400',
        description: '儿科医生讲解6个月发育里程碑',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i601',
        title: '6个月辅食添加时间表',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        description: '科学的辅食添加顺序和时间安排',
        type: 'image'
      },
      {
        id: 'i602',
        title: '宝宝独坐姿势示范',
        url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800',
        description: '正确的独坐姿势和练习方法',
        type: 'image'
      },
      {
        id: 'i603',
        title: '第一颗牙护理',
        url: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800',
        description: '宝宝长牙后的口腔护理指南',
        type: 'image'
      }
    ]
  },
  {
    month: 7,
    title: '第7个月',
    summary: '宝宝越来越独立，运动能力快速发展，开始尝试爬行探索世界。',
    physicalDevelopment: {
      weight: '7.2-10.3kg',
      height: '66-74cm',
      headCircumference: '42-46cm',
      description: '动作更加灵活协调，可能已经长出1-2颗牙齿。核心肌肉力量增强，为爬行和站立做准备。'
    },
    cognitiveSkills: [
      '理解简单的因果关系',
      '对"不"有初步反应',
      '能找到完全隐藏的物品',
      '开始理解物体恒存性',
      '注意力可持续15-20分钟',
      '能够记住最近发生的事情'
    ],
    motorSkills: {
      gross: [
        '能独立坐稳较长时间',
        '开始爬行（各种姿势）',
        '能够从坐姿转换到爬行姿势',
        '可能会尝试扶着东西站起来',
        '俯卧时能自如地转圈'
      ],
      fine: [
        '用手指和拇指抓握（钳式抓握萌芽）',
        '会拍手',
        '能够敲打两个物品',
        '喜欢撕纸、撕书',
        '能把物品从一只手传到另一只手'
      ]
    },
    socialEmotional: [
      '分离焦虑明显，黏人',
      '认生达到高峰期',
      '喜欢模仿大人的动作',
      '会用声音和动作表达需求',
      '开始有明确的喜好和厌恶',
      '喜欢和照顾者玩互动游戏'
    ],
    careGuidelines: [
      {
        category: '爬行练习',
        icon: 'crawl',
        tips: [
          '提供安全宽敞的爬行空间',
          '用玩具吸引宝宝爬行',
          '不要长时间放在学步车里',
          '铺设爬行垫保护膝盖',
          '让宝宝穿宽松舒适的衣服'
        ],
        duration: '每天自由爬行1-2小时'
      },
      {
        category: '睡眠管理',
        icon: 'moon',
        tips: [
          '每天睡眠11-14小时',
          '白天2次小睡（上午和下午各1次）',
          '建立固定的睡前仪式',
          '可能出现分离焦虑导致的睡眠问题'
        ],
        duration: '11-14小时/天'
      },
      {
        category: '语言刺激',
        icon: 'book',
        tips: [
          '多和宝宝说话、唱歌',
          '每天读绘本15-20分钟',
          '描述日常活动',
          '回应宝宝的咿呀声'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '4-5次/天',
        amount: '600-800ml/天',
        notes: [
          '奶仍是主要营养来源',
          '可以尝试用杯子喝奶',
          '继续保持奶量'
        ]
      },
      {
        type: '辅食',
        frequency: '2-3次/天',
        amount: '每次60-120ml',
        notes: [
          '可以添加肉类、鱼类',
          '质地从稠糊状过渡到小颗粒',
          '尝试更多种类的蔬菜水果',
          '可以开始尝试蛋黄'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 会爬行了，全面检查家居安全',
      '❗ 所有柜子要加儿童安全锁',
      '❗ 楼梯口必须装安全门',
      '❗ 电源插座加保护盖',
      '❗ 收起所有小物品和危险物品',
      '❗ 桌角要加防撞条'
    ],
    milestones: [
      { title: '爬行', description: '能用各种方式（匍匐、四肢）移动', achieved: false, icon: 'crawl' },
      { title: '拍手', description: '会拍手，能玩拍手歌游戏', achieved: false, icon: 'clap' },
      { title: '挥手再见', description: '学会挥手再见（有的宝宝）', achieved: false, icon: 'wave' },
      { title: '发音增加', description: '发出更多音节组合，如"baba""mama"', achieved: false, icon: 'sound' }
    ],
    commonIssues: [
      {
        problem: '分离焦虑高峰',
        symptoms: ['妈妈离开就大哭', '只要特定的人抱', '见到陌生人哭闹', '睡前哭闹'],
        solutions: [
          '短时间分离练习，逐渐延长',
          '离开时说再见，不要偷偷走',
          '建立固定的离开和回来仪式',
          '给宝宝一个安抚物（小毯子、玩偶）',
          '这是正常发育阶段，保持耐心'
        ],
        whenToSeeDr: '极端焦虑、完全拒绝进食睡眠'
      },
      {
        problem: '不愿意爬行',
        symptoms: ['只想坐着', '害怕爬行', '用其他方式移动'],
        solutions: [
          '用玩具吸引宝宝向前移动',
          '和宝宝一起趴着玩',
          '每个宝宝发育节奏不同',
          '有的宝宝会跳过爬行直接走'
        ],
        whenToSeeDr: '10个月后仍无任何移动能力'
      }
    ],
    videos: [
      {
        id: 'v701',
        title: '7个月宝宝爬行训练',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
        description: '如何帮助宝宝学习爬行的技巧和方法',
        type: 'video'
      },
      {
        id: 'v702',
        title: '应对7个月分离焦虑',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400',
        description: '帮助宝宝度过分离焦虑高峰期',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i701',
        title: '安全爬行环境布置',
        url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
        description: '如何为宝宝创造安全的爬行空间',
        type: 'image'
      },
      {
        id: 'i702',
        title: '7个月辅食食谱',
        url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800',
        description: '适合7个月宝宝的辅食种类和做法',
        type: 'image'
      }
    ]
  },
  {
    month: 8,
    title: '第8个月',
    summary: '宝宝的探索欲望强烈，运动技能更加熟练，开始展现更多个性。',
    physicalDevelopment: {
      weight: '7.5-10.7kg',
      height: '68-76cm',
      headCircumference: '42-47cm',
      description: '行动更加敏捷灵活，可能已经长出2-4颗牙齿。手部精细动作发展迅速。'
    },
    cognitiveSkills: [
      '完全理解物体恒存性',
      '喜欢玩因果关系游戏（按按钮听声音）',
      '开始理解简单词汇的含义',
      '能够模仿简单的声音和动作',
      '记忆力增强，能记住熟悉的人和事',
      '开始有解决问题的能力'
    ],
    motorSkills: {
      gross: [
        '爬行熟练且速度快',
        '能扶着家具站立',
        '可能开始扶着家具移步',
        '能从爬行姿势坐起来',
        '站立时能弯腰捡东西'
      ],
      fine: [
        '钳式抓握成熟（拇指和食指）',
        '能把物品放进容器',
        '能用手指戳、按',
        '喜欢翻书页',
        '能同时握住两个物品'
      ]
    },
    socialEmotional: [
      '认生和分离焦虑持续',
      '开始有幽默感，喜欢搞笑',
      '喜欢逗大人笑',
      '能理解"不"的语气',
      '开始表现出害羞',
      '对其他宝宝感兴趣'
    ],
    careGuidelines: [
      {
        category: '安全探索',
        icon: 'explore',
        tips: [
          '提供安全的探索环境',
          '收起所有危险物品',
          '让宝宝自由探索（在安全范围内）',
          '不要过度限制宝宝的活动',
          '陪伴但不过度干预'
        ]
      },
      {
        category: '手指食物',
        icon: 'finger',
        tips: [
          '提供适合的手指食物',
          '鼓励宝宝自己抓着吃',
          '切成小块便于抓握',
          '选择软烂易咀嚼的食物',
          '全程监督，防止呛咳'
        ]
      },
      {
        category: '语言发展',
        icon: 'book',
        tips: [
          '多描述看到的事物',
          '重复简单的词汇',
          '唱儿歌、读绘本',
          '回应宝宝的发声'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '3-4次/天',
        amount: '600-800ml/天',
        notes: [
          '奶仍是重要营养来源',
          '可以开始练习用杯子',
          '不建议睡前奶瓶喂奶（护牙）'
        ]
      },
      {
        type: '辅食',
        frequency: '3次正餐+1-2次小点',
        amount: '每餐120-180ml',
        notes: [
          '质地：小颗粒、软块状',
          '增加手指食物比例',
          '可以尝试全蛋（无过敏情况下）',
          '食物种类更加丰富'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 能站能爬，跌倒风险大增',
      '❗ 手指食物注意窒息风险',
      '❗ 抽屉、柜子全部要锁好',
      '❗ 桌布不要垂下来（会被拉扯）',
      '❗ 热水、热汤远离宝宝',
      '❗ 药品、清洁剂放到高处锁好'
    ],
    milestones: [
      { title: '钳式抓握', description: '能熟练用拇指和食指捏起小物品', achieved: false, icon: 'pinch' },
      { title: '扶站', description: '能扶着家具稳稳站立', achieved: false, icon: 'stand' },
      { title: '模仿', description: '会模仿简单的动作和声音', achieved: false, icon: 'copy' },
      { title: '放物入容器', description: '能有意识地把物品放进容器', achieved: false, icon: 'box' }
    ],
    commonIssues: [
      {
        problem: '不愿坐餐椅',
        symptoms: ['坐餐椅就哭闹', '挣扎想出来', '吃饭时到处爬'],
        solutions: [
          '从短时间开始，逐渐延长',
          '给有趣的餐具分散注意力',
          '全家一起吃饭，营造氛围',
          '不要在餐椅上待太久',
          '保持用餐时间愉快'
        ],
        whenToSeeDr: '严重抗拒、影响正常进食和营养'
      },
      {
        problem: '频繁夜醒',
        symptoms: ['夜间多次醒来', '需要抱哄才能入睡', '睡眠质量差'],
        solutions: [
          '检查是否出牙不适',
          '建立固定的睡眠仪式',
          '减少夜间喂奶次数',
          '白天保证足够活动量'
        ],
        whenToSeeDr: '持续影响生长发育'
      }
    ],
    videos: [
      {
        id: 'v801',
        title: '8个月宝宝精细动作训练',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
        description: '锻炼宝宝手部精细动作的游戏和活动',
        type: 'video'
      },
      {
        id: 'v802',
        title: '8个月手指食物推荐',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400',
        description: '适合8个月宝宝的手指食物种类和做法',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i801',
        title: '钳式抓握示范',
        url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800',
        description: '宝宝钳式抓握的正确姿势',
        type: 'image'
      },
      {
        id: 'i802',
        title: '家居安全检查清单',
        url: 'https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=800',
        description: '8个月宝宝家居安全要点',
        type: 'image'
      }
    ]
  },
  {
    month: 9,
    title: '第9个月',
    summary: '宝宝更加独立，开始有自己的小个性，可能说出第一个有意义的词。',
    physicalDevelopment: {
      weight: '7.8-11.0kg',
      height: '69-78cm',
      headCircumference: '43-48cm',
      description: '体格强壮，动作协调性大大提高。可能已经长出4-6颗牙齿，咀嚼能力增强。'
    },
    cognitiveSkills: [
      '能理解并执行简单的指令',
      '喜欢搜索隐藏的物品（躲猫猫）',
      '记忆力显著提升',
      '开始理解更多词汇',
      '能够用手势表达需求',
      '开始有简单的问题解决能力'
    ],
    motorSkills: {
      gross: [
        '爬行非常熟练快速',
        '能扶着家具走几步（扶走）',
        '可能独自站立片刻',
        '能从站立蹲下捡东西',
        '平衡能力大大增强'
      ],
      fine: [
        '钳式抓握非常熟练',
        '能翻书页（可能一次翻几页）',
        '能用手指指物',
        '能够堆叠1-2块积木',
        '喜欢扔东西'
      ]
    },
    socialEmotional: [
      '会用手势沟通（指、挥手、摇头）',
      '有明确的喜好和厌恶',
      '可能开始说"妈妈""爸爸"',
      '能够表达多种情绪',
      '喜欢模仿大人的行为',
      '对表扬和鼓励有积极反应'
    ],
    careGuidelines: [
      {
        category: '促进行走',
        icon: 'walk',
        tips: [
          '提供稳固的扶持物（沙发、矮桌）',
          '光脚在安全地面走效果更好',
          '不建议使用学步车（有安全风险）',
          '可以扶着宝宝的腋下练习走',
          '每个宝宝节奏不同，不要着急'
        ]
      },
      {
        category: '睡眠管理',
        icon: 'moon',
        tips: [
          '每天睡眠11-14小时',
          '白天1-2次小睡',
          '建立固定的作息时间',
          '睡前避免过度兴奋'
        ],
        duration: '11-14小时/天'
      },
      {
        category: '语言启蒙',
        icon: 'book',
        tips: [
          '多说简单的词汇，重复',
          '指着物品说名称',
          '鼓励宝宝模仿发音',
          '每天读绘本',
          '唱简单的儿歌'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '3-4次/天',
        amount: '500-700ml/天',
        notes: [
          '辅食比例增加',
          '奶仍是重要营养来源',
          '可以用杯子喝奶'
        ]
      },
      {
        type: '辅食',
        frequency: '3次正餐+2次小点',
        amount: '每餐180-240ml',
        notes: [
          '质地：小块、碎末',
          '鼓励自己抓着吃',
          '可以尝试更多种类',
          '注意营养均衡'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 开始能站能走，防跌倒是重点',
      '❗ 楼梯上下都要装安全门',
      '❗ 疫苗接种：9个月需要接种麻风疫苗',
      '❗ 家具要固定，防止倾倒',
      '❗ 窗户要加护栏',
      '❗ 不要让宝宝接触塑料袋'
    ],
    milestones: [
      { title: '扶走', description: '能扶着家具走几步', achieved: false, icon: 'walk' },
      { title: '挥手再见', description: '理解并会挥手再见', achieved: false, icon: 'wave' },
      { title: '有意义的发音', description: '开始说"妈妈""爸爸"等有意义的词', achieved: false, icon: 'speak' },
      { title: '理解指令', description: '能理解简单的指令如"给我"', achieved: false, icon: 'brain' }
    ],
    commonIssues: [
      {
        problem: '9个月焦虑',
        symptoms: ['特别粘人', '不让陌生人抱', '睡眠倒退', '分离时大哭'],
        solutions: [
          '给予更多安全感和拥抱',
          '保持耐心，这是正常发育阶段',
          '建立固定的分离仪式',
          '不要强迫宝宝接触陌生人',
          '通常几周到几个月会好转'
        ],
        whenToSeeDr: '极端焦虑、发育倒退、拒绝进食'
      },
      {
        problem: '还不会爬',
        symptoms: ['不愿意趴着', '用其他方式移动', '坐着挪动'],
        solutions: [
          '有的宝宝会跳过爬行',
          '用玩具吸引宝宝移动',
          '多趴趴时间锻炼',
          '只要能移动就好'
        ],
        whenToSeeDr: '完全无法移动、肌肉力量明显不足'
      }
    ],
    videos: [
      {
        id: 'v901',
        title: '9个月宝宝发育评估',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
        description: '9个月宝宝应该达到的发育里程碑',
        type: 'video'
      },
      {
        id: 'v902',
        title: '如何帮助宝宝学走路',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400',
        description: '安全有效地帮助宝宝学走路的方法',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i901',
        title: '9个月运动发展',
        url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
        description: '9个月宝宝的运动能力参考',
        type: 'image'
      },
      {
        id: 'i902',
        title: '安全学步环境',
        url: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800',
        description: '为宝宝学步创造安全的环境',
        type: 'image'
      }
    ]
  },
  {
    month: 10,
    title: '第10个月',
    summary: '宝宝的个性更加鲜明，运动和语言能力都在快速发展，开始展现独立意识。',
    physicalDevelopment: {
      weight: '8.0-11.3kg',
      height: '71-79cm',
      headCircumference: '43-48cm',
      description: '体格健壮，协调性好，可能已经长出6-8颗牙齿。身体比例更接近幼儿，四肢更加有力。'
    },
    cognitiveSkills: [
      '理解更多词汇（可能理解50个以上）',
      '能完成简单的指令（如"给我""放下"）',
      '喜欢模仿大人的行为',
      '知道物品的用途（用梳子梳头、用电话打电话）',
      '开始有简单的问题解决能力',
      '对因果关系非常感兴趣'
    ],
    motorSkills: {
      gross: [
        '可能独自站立较长时间',
        '扶着家具走得很稳',
        '有的宝宝开始独立走几步',
        '能从站立位置蹲下',
        '能够爬上矮的家具'
      ],
      fine: [
        '能有意识地放开手中的物品',
        '喜欢扔东西看反应',
        '能堆叠2-3块积木',
        '能用手指指向想要的东西',
        '开始尝试用勺子（虽然不熟练）'
      ]
    },
    socialEmotional: [
      '依恋主要照顾者更加明显',
      '可能害羞或认生',
      '开始有同理心的萌芽',
      '喜欢逗人笑',
      '能理解简单的情绪表达',
      '开始有自己的意愿和偏好'
    ],
    careGuidelines: [
      {
        category: '鼓励行走',
        icon: 'steps',
        tips: [
          '牵着宝宝的手练习走',
          '光脚走在安全地面效果最好',
          '每个宝宝发育节奏不同，不要比较',
          '提供稳固的推拉玩具',
          '多鼓励，少扶抱'
        ]
      },
      {
        category: '认知游戏',
        icon: 'brain',
        tips: [
          '玩躲猫猫、找东西游戏',
          '堆积木、套圈游戏',
          '形状配对、颜色认知',
          '看图认物、指认游戏',
          '简单的角色扮演'
        ]
      },
      {
        category: '语言发展',
        icon: 'book',
        tips: [
          '多说话，语速放慢',
          '每天读绘本20-30分钟',
          '唱儿歌、做手指游戏',
          '回应宝宝的每一次发声',
          '不要用叠词（如"饭饭"）'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '2-3次/天',
        amount: '450-600ml/天',
        notes: [
          '辅食为主要营养来源',
          '奶作为营养补充',
          '用杯子喝奶',
          '逐渐减少奶瓶依赖'
        ]
      },
      {
        type: '辅食',
        frequency: '3次正餐+2次小点',
        amount: '每餐200-250ml',
        notes: [
          '食物质地更接近成人',
          '鼓励自主进食',
          '提供多样化食物',
          '营养要均衡'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 能走能爬能站，需要全程监督',
      '❗ 喜欢扔东西，注意周围人和物',
      '❗ 电源、药品、清洁剂要锁好',
      '❗ 能够够到更高的地方，检查高处物品',
      '❗ 浴室门要关好，马桶盖要盖上',
      '❗ 不要让宝宝独自在浴缸或泳池附近'
    ],
    milestones: [
      { title: '独站', description: '能独自站立几秒钟到十几秒', achieved: false, icon: 'stand' },
      { title: '听懂指令', description: '能理解并执行简单的指令', achieved: false, icon: 'listen' },
      { title: '主动交流', description: '用手势、声音主动表达需求', achieved: false, icon: 'communicate' },
      { title: '模仿行为', description: '模仿大人的日常行为', achieved: false, icon: 'copy' }
    ],
    commonIssues: [
      {
        problem: '不爱吃饭',
        symptoms: ['拒绝进食', '只吃某些食物', '吃几口就不吃', '边吃边玩'],
        solutions: [
          '不强迫进食，保持用餐愉快',
          '提供多样化选择',
          '让宝宝参与食物选择',
          '和家人一起吃饭',
          '控制零食，保持饥饿感'
        ],
        whenToSeeDr: '体重下降、营养不良、持续拒食'
      },
      {
        problem: '还不会走',
        symptoms: ['只能扶走', '不敢独立站立', '害怕放手'],
        solutions: [
          '每个宝宝发育节奏不同',
          '多鼓励，少比较',
          '提供安全的练习环境',
          '12-15个月学会走都正常'
        ],
        whenToSeeDr: '15个月后仍完全不能独立站立'
      }
    ],
    videos: [
      {
        id: 'v1001',
        title: '10个月宝宝学步训练',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400',
        description: '安全有效地帮助宝宝学习走路',
        type: 'video'
      },
      {
        id: 'v1002',
        title: '10个月认知游戏',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
        description: '适合10个月宝宝的认知训练游戏',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i1001',
        title: '10个月发育里程碑',
        url: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800',
        description: '10个月宝宝应达到的发育里程碑',
        type: 'image'
      },
      {
        id: 'i1002',
        title: '学步安全指南',
        url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
        description: '宝宝学步期间的安全注意事项',
        type: 'image'
      }
    ]
  },
  {
    month: 11,
    title: '第11个月',
    summary: '接近1岁，宝宝变得越来越独立，个性更加鲜明，可能已经能独立行走。',
    physicalDevelopment: {
      weight: '8.2-11.5kg',
      height: '72-80cm',
      headCircumference: '44-49cm',
      description: '身体比例更像幼儿，动作灵活协调。大部分宝宝已经长出6-8颗牙齿，咀嚼能力明显增强。'
    },
    cognitiveSkills: [
      '理解更多日常词汇',
      '能完成2步简单指令',
      '记忆力很好，能记住经常做的事',
      '开始有简单的假装游戏',
      '能够指认熟悉的图片和物品',
      '开始理解简单的规则'
    ],
    motorSkills: {
      gross: [
        '很多宝宝能独立行走',
        '能弯腰捡东西不摔倒',
        '扶着能上楼梯',
        '能从站立蹲下再站起',
        '能够爬上沙发、椅子'
      ],
      fine: [
        '能用笔涂鸦（虽然是乱画）',
        '堆2-3块积木',
        '能指认图片中的物品',
        '能够翻书页（一次一页）',
        '开始尝试自己穿脱鞋袜'
      ]
    },
    socialEmotional: [
      '开始有小脾气和挫折感',
      '会说"不"或摇头表示拒绝',
      '喜欢模仿大人的各种行为',
      '情绪更加丰富和明显',
      '开始有占有欲（"我的"）',
      '可能开始测试边界'
    ],
    careGuidelines: [
      {
        category: '独立行走',
        icon: 'walking',
        tips: [
          '提供鼓励和支持，不要过度保护',
          '保证环境安全，铺设软垫',
          '摔倒是正常的学习过程',
          '不要使用学步车',
          '穿防滑的软底鞋或光脚'
        ]
      },
      {
        category: '规则设定',
        icon: 'rule',
        tips: [
          '开始设定简单、一致的规则',
          '用简短清晰的语言说"不可以"',
          '对好的行为给予表扬',
          '保持一致性，不要朝令夕改',
          '用正面语言引导'
        ]
      },
      {
        category: '情绪引导',
        icon: 'heart',
        tips: [
          '帮助宝宝识别和表达情绪',
          '对发脾气保持冷静',
          '提供安慰但不溺爱',
          '转移注意力是有效方法',
          '建立固定的作息减少情绪波动'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '2-3次/天',
        amount: '400-500ml/天',
        notes: [
          '准备过渡到鲜奶（1岁后）',
          '用杯子喝奶，戒奶瓶',
          '不要睡前喝奶后不刷牙'
        ]
      },
      {
        type: '正餐',
        frequency: '3次正餐+2次小点',
        amount: '自主进食',
        notes: [
          '基本和家人同食',
          '少盐少糖，清淡为主',
          '鼓励自己用勺子吃',
          '提供适合抓握的食物'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 独立行走后跌倒碰撞风险高',
      '❗ 能爬能跳能走，需要全面安全检查',
      '❗ 好奇心强，误食风险增加',
      '❗ 会开门开抽屉，加装儿童锁',
      '❗ 能够够到桌面物品，注意热水热汤',
      '❗ 户外活动注意交通安全'
    ],
    milestones: [
      { title: '独立行走', description: '能独自走几步到十几步（有的宝宝）', achieved: false, icon: 'walk-alone' },
      { title: '说词汇', description: '能说2-3个有意义的词', achieved: false, icon: 'vocabulary' },
      { title: '理解指令', description: '能完成"把球给我"等指令', achieved: false, icon: 'understand' },
      { title: '假装游戏', description: '开始简单的假装游戏', achieved: false, icon: 'play' }
    ],
    commonIssues: [
      {
        problem: '发脾气',
        symptoms: ['哭闹', '扔东西', '打人', '在地上打滚'],
        solutions: [
          '保持冷静，不要以怒制怒',
          '设定清晰一致的界限',
          '理解这是正常发育阶段',
          '发脾气时不要讲道理，等冷静后再说',
          '转移注意力'
        ],
        whenToSeeDr: '极端暴力行为、伤害自己、持续无法安抚'
      },
      {
        problem: '睡眠问题',
        symptoms: ['不愿睡觉', '半夜醒来', '早醒', '白天不午睡'],
        solutions: [
          '建立固定的睡前仪式',
          '保持一致的就寝时间',
          '睡前避免过度兴奋',
          '白天保证足够活动量',
          '卧室环境安静黑暗'
        ],
        whenToSeeDr: '严重影响生长发育、打鼾呼吸暂停'
      }
    ],
    videos: [
      {
        id: 'v1101',
        title: '11个月宝宝发育评估',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
        description: '11个月宝宝应该达到的发育里程碑',
        type: 'video'
      },
      {
        id: 'v1102',
        title: '应对宝宝发脾气',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400',
        description: '如何正确应对宝宝发脾气',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i1101',
        title: '11个月发育对照',
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
        description: '11个月宝宝的发育参考标准',
        type: 'image'
      },
      {
        id: 'i1102',
        title: '安全行走环境',
        url: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800',
        description: '为学步宝宝创造安全环境',
        type: 'image'
      }
    ]
  },
  {
    month: 12,
    title: '第12个月（1岁）🎉',
    summary: '恭喜！宝宝1岁了！这是一个重要的里程碑，宝宝从婴儿变成了幼儿，开启全新的成长阶段。',
    physicalDevelopment: {
      weight: '8.5-12.0kg',
      height: '73-82cm',
      headCircumference: '44-49cm',
      description: '体重约为出生时的3倍，身高约为出生时的1.5倍。通常有6-8颗牙齿，有的宝宝可能更多。大脑发育到成人的60%左右。'
    },
    cognitiveSkills: [
      '理解很多日常词汇（可能理解70个以上）',
      '能完成简单的指令',
      '知道物品的名称和用途',
      '开始有简单的假装游戏',
      '记忆力好，能记住人和事',
      '开始理解"我的"概念',
      '能够指认身体部位'
    ],
    motorSkills: {
      gross: [
        '大多数宝宝能独立行走（约75%）',
        '能弯腰捡东西不摔倒',
        '能推拉玩具走',
        '能爬上沙发、椅子',
        '有的能踢球',
        '能够倒退走几步'
      ],
      fine: [
        '能用杯子喝水（虽然会洒）',
        '尝试用勺子吃饭',
        '能涂鸦画线',
        '堆2-4块积木',
        '能翻书页',
        '能指认物品'
      ]
    },
    socialEmotional: [
      '有明显的个性特点',
      '会说几个词（妈妈、爸爸、不要等）',
      '喜欢模仿大人的各种行为',
      '对其他孩子感兴趣',
      '有分离焦虑（会好转）',
      '开始有独立意识',
      '会表达喜怒哀乐',
      '开始有自我意识'
    ],
    careGuidelines: [
      {
        category: '1岁体检',
        icon: 'medical',
        tips: [
          '身高体重头围测量',
          '全面发育评估',
          '疫苗接种（麻腮风等）',
          '视力听力检查',
          '咨询医生任何问题'
        ]
      },
      {
        category: '饮食过渡',
        icon: 'milk',
        tips: [
          '可以开始喝全脂鲜奶',
          '每天400-500ml鲜奶',
          '丰富的固体食物',
          '用杯子喝奶，戒掉奶瓶',
          '可以尝试蜂蜜了'
        ]
      },
      {
        category: '睡眠管理',
        icon: 'moon',
        tips: [
          '每天11-14小时',
          '夜间10-12小时',
          '白天1-2次小睡',
          '建立固定的作息',
          '睡前仪式很重要'
        ],
        duration: '11-14小时/天'
      },
      {
        category: '语言发展',
        icon: 'book',
        tips: [
          '多说话、多描述',
          '每天读绘本',
          '唱儿歌做游戏',
          '鼓励宝宝表达',
          '不要用叠词'
        ]
      }
    ],
    nutritionTips: [
      {
        type: '鲜奶/母乳',
        frequency: '2-3次/天',
        amount: '400-500ml',
        notes: [
          '可以喝全脂鲜奶',
          '或继续母乳喂养',
          '用杯子喝，戒掉奶瓶',
          '不要超过600ml（影响吃饭）'
        ]
      },
      {
        type: '固体食物',
        frequency: '3次正餐+2次小点',
        amount: '自主进食',
        notes: [
          '和家人同食',
          '营养均衡（主食、肉蛋、蔬果）',
          '少盐少糖不加调料',
          '鼓励自己用勺子吃',
          '蜂蜜可以吃了，坚果仍需磨碎'
        ]
      }
    ],
    safetyWarnings: [
      '❗ 能走能跑，需要时刻监督',
      '❗ 好奇心极强，误食风险最高',
      '❗ 能开门拉抽屉，全面做好防护',
      '❗ 户外活动注意交通安全',
      '❗ 疫苗接种：1岁需要接种多种疫苗',
      '❗ 蜂蜜可以吃了，但坚果仍需小心呛咳',
      '❗ 不要让宝宝独自在水边、楼梯、阳台'
    ],
    milestones: [
      { title: '独立行走', description: '能独自行走（约75%的宝宝）', achieved: false, icon: 'walk-independent' },
      { title: '说词汇', description: '能说1-3个有意义的词', achieved: false, icon: 'first-words' },
      { title: '自主进食', description: '能用手指抓食物、尝试用勺子', achieved: false, icon: 'self-feed' },
      { title: '社交互动', description: '挥手再见、拍手、模仿大人', achieved: false, icon: 'social' },
      { title: '指认物品', description: '能用手指指向想要的东西', achieved: false, icon: 'point' }
    ],
    commonIssues: [
      {
        problem: '还不会走',
        symptoms: ['12-15个月仍不会独立走'],
        solutions: [
          '不要焦虑，每个宝宝发育节奏不同',
          '18个月前学会走都是正常的',
          '多鼓励练习，少抱',
          '检查是否有肌肉力量问题'
        ],
        whenToSeeDr: '18个月还不会走、其他发育迟缓、肌肉明显无力'
      },
      {
        problem: '不说话',
        symptoms: ['不会说任何有意义的词', '不回应名字', '不模仿发音'],
        solutions: [
          '多说话多读书',
          '给宝宝反应时间',
          '不要代替宝宝表达',
          '创造需要说话的场景'
        ],
        whenToSeeDr: '18个月仍不说话、不理解指令、不回应名字、不与人眼神交流'
      },
      {
        problem: '挑食',
        symptoms: ['只吃几种食物', '拒绝新食物', '只喝奶不吃饭'],
        solutions: [
          '继续提供多样化食物',
          '不强迫进食',
          '家长做好榜样',
          '让宝宝参与食物选择',
          '减少奶量增加饥饿感'
        ],
        whenToSeeDr: '体重下降、营养不良、生长曲线下滑'
      }
    ],
    videos: [
      {
        id: 'v1201',
        title: '1岁宝宝发育里程碑',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
        description: '1岁宝宝应该掌握的技能和发育标准',
        type: 'video'
      },
      {
        id: 'v1202',
        title: '1岁宝宝营养指南',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        description: '1岁宝宝的饮食过渡和营养需求',
        type: 'video'
      },
      {
        id: 'v1203',
        title: '1岁体检项目详解',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
        description: '1岁体检需要做哪些检查',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i1201',
        title: '1岁成长对照表',
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
        description: '1岁宝宝的身高体重发育标准',
        type: 'image'
      },
      {
        id: 'i1202',
        title: '1岁宝宝饮食金字塔',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        description: '1岁宝宝每日营养摄入指南',
        type: 'image'
      },
      {
        id: 'i1203',
        title: '1岁疫苗接种计划',
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        description: '1岁需要接种的疫苗清单',
        type: 'image'
      }
    ]
  }
]

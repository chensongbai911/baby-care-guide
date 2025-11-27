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
    summary: '宝宝的社交能力和运动能力都有显著提升。',
    physicalDevelopment: {
      weight: '5.7-8.7kg',
      height: '60-67cm',
      headCircumference: '39-44cm',
      description: '体重增长稳定，肌肉力量明显增强，可能开始长牙。'
    },
    cognitiveSkills: ['能够识别熟悉的人和物品', '对镜子中的自己感兴趣', '注意力时间延长'],
    motorSkills: {
      gross: ['能够翻身（双向）', '能够坐起但需要支撑'],
      fine: ['能准确抓取物品', '会把物品从一只手换到另一只手']
    },
    socialEmotional: ['笑声更加频繁', '开始咿呀学语', '对表扬有积极反应'],
    careGuidelines: [
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天睡眠12-15小时', '可能出现4个月睡眠倒退'],
        duration: '12-15小时/天'
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '5-7次/天',
        amount: '按需',
        notes: ['6个月前不需要辅食']
      }
    ],
    safetyWarnings: ['❗ 会翻身，睡觉时注意安全', '❗ 疫苗接种：4个月疫苗'],
    milestones: [
      { title: '双向翻身', description: '能自如地从仰卧翻到俯卧', achieved: false, icon: 'rotate' },
      { title: '咿呀学语', description: '开始发出"ba"、"da"等音节', achieved: false, icon: 'sound' }
    ],
    commonIssues: [
      {
        problem: '4个月睡眠倒退',
        symptoms: ['频繁夜醒', '小睡变短'],
        solutions: ['建立固定作息', '通常持续2-6周'],
        whenToSeeDr: '严重影响生长发育'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 5,
    title: '第5个月',
    summary: '宝宝变得更加活跃，运动能力突飞猛进。',
    physicalDevelopment: {
      weight: '6.3-9.3kg',
      height: '62-70cm',
      headCircumference: '40-45cm',
      description: '身体比例更加匀称，肌肉发育良好。'
    },
    cognitiveSkills: ['能区分熟人和陌生人', '对自己的名字有反应', '注意力更集中'],
    motorSkills: {
      gross: ['能翻滚移动', '可能开始尝试爬行动作'],
      fine: ['能准确抓取想要的物品', '能握住奶瓶']
    },
    socialEmotional: ['对陌生人可能有警惕', '会主动发起互动', '开始有分离焦虑的萌芽'],
    careGuidelines: [
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天睡眠12-14小时', '建立稳定的睡眠习惯'],
        duration: '12-14小时/天'
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '5-6次/天',
        amount: '按需',
        notes: ['为6个月添加辅食做准备']
      }
    ],
    safetyWarnings: ['❗ 开始能移动，要做好家居安全', '❗ 电源插座要加保护盖'],
    milestones: [
      { title: '独立翻滚', description: '能自如地翻滚来移动', achieved: false, icon: 'move' },
      { title: '辨认名字', description: '听到名字会有反应', achieved: false, icon: 'ear' }
    ],
    commonIssues: [
      {
        problem: '分离焦虑开始',
        symptoms: ['妈妈离开就哭', '粘人'],
        solutions: ['短暂离开练习', '离开时说再见'],
        whenToSeeDr: '严重影响日常生活'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 6,
    title: '第6个月',
    summary: '重要的里程碑月份！可以开始添加辅食。',
    physicalDevelopment: {
      weight: '6.8-9.7kg',
      height: '64-72cm',
      headCircumference: '41-46cm',
      description: '半岁啦！体重约为出生时的2倍，可能开始长牙。'
    },
    cognitiveSkills: ['能找到部分隐藏的物品', '开始理解简单的指令', '记忆力明显提升'],
    motorSkills: {
      gross: ['能独立坐一会儿', '可能开始爬行'],
      fine: ['能用手指和手掌抓握', '喜欢撕纸']
    },
    socialEmotional: ['认生更明显', '会用声音表达情绪', '喜欢照镜子'],
    careGuidelines: [
      {
        category: '辅食添加',
        icon: 'food',
        tips: ['从单一食材开始', '米糊是好的第一选择', '不要添加盐、糖、蜂蜜'],
        duration: '每天1-2次'
      },
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天睡眠12-14小时', '白天2次小睡'],
        duration: '12-14小时/天'
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '4-6次/天',
        amount: '奶为主',
        notes: ['奶仍是主要营养', '保持每天800ml以上']
      },
      {
        type: '辅食',
        frequency: '1-2次/天',
        amount: '30-60ml',
        notes: ['首选：强化铁米糊', '质地：稀糊状']
      }
    ],
    safetyWarnings: ['❗ 可能开始爬行，检查地面安全', '❗ 疫苗接种：6个月疫苗', '❗ 蜂蜜！1岁前禁止'],
    milestones: [
      { title: '独坐', description: '能独自坐稳不倒', achieved: false, icon: 'sit' },
      { title: '第一口辅食', description: '开始尝试母乳/奶粉以外的食物', achieved: false, icon: 'food' }
    ],
    commonIssues: [
      {
        problem: '拒绝辅食',
        symptoms: ['推开勺子', '吐出食物'],
        solutions: ['不要强迫', '换个时间再试'],
        whenToSeeDr: '体重不增'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 7,
    title: '第7个月',
    summary: '宝宝越来越独立，运动能力快速发展。',
    physicalDevelopment: {
      weight: '7.2-10.3kg',
      height: '66-74cm',
      headCircumference: '42-46cm',
      description: '动作更加灵活，可能已经长出1-2颗牙齿。'
    },
    cognitiveSkills: ['理解简单的因果关系', '对"不"有反应', '能找到完全隐藏的物品'],
    motorSkills: {
      gross: ['能独立坐稳', '开始爬行（各种姿势）'],
      fine: ['用手指和拇指抓握', '会拍手']
    },
    socialEmotional: ['分离焦虑明显', '认生达到高峰', '喜欢模仿'],
    careGuidelines: [
      {
        category: '爬行练习',
        icon: 'crawl',
        tips: ['提供安全的爬行空间', '用玩具吸引宝宝爬']
      },
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天11-14小时', '白天2次小睡'],
        duration: '11-14小时/天'
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '4-5次/天',
        amount: '600-800ml',
        notes: ['继续保持奶量']
      },
      {
        type: '辅食',
        frequency: '2-3次/天',
        amount: '60-120ml',
        notes: ['食材：肉类、鱼类可加入', '质地：稠糊状到小颗粒']
      }
    ],
    safetyWarnings: ['❗ 会爬行，全面检查家居安全', '❗ 柜子要加儿童锁', '❗ 楼梯口要装安全门'],
    milestones: [
      { title: '爬行', description: '能用各种方式移动', achieved: false, icon: 'crawl' },
      { title: '拍手', description: '会拍手、挥手再见', achieved: false, icon: 'clap' }
    ],
    commonIssues: [
      {
        problem: '分离焦虑高峰',
        symptoms: ['妈妈离开就大哭', '只要妈妈抱'],
        solutions: ['短时间分离练习', '建立离开和回来的仪式'],
        whenToSeeDr: '极端焦虑、影响进食睡眠'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 8,
    title: '第8个月',
    summary: '宝宝的探索欲望强烈，运动技能更加熟练。',
    physicalDevelopment: {
      weight: '7.5-10.7kg',
      height: '68-76cm',
      headCircumference: '42-47cm',
      description: '行动更加敏捷，可能已经长出2-4颗牙齿。'
    },
    cognitiveSkills: ['理解物体恒存性', '喜欢因果关系游戏', '开始理解简单词汇'],
    motorSkills: {
      gross: ['爬行熟练', '能扶着家具站立'],
      fine: ['钳式抓握（拇指和食指）', '能把物品放进容器']
    },
    socialEmotional: ['认生和分离焦虑持续', '开始有幽默感', '喜欢逗大人笑'],
    careGuidelines: [
      {
        category: '安全探索',
        icon: 'explore',
        tips: ['提供安全的探索环境', '收起危险物品']
      },
      {
        category: '手指食物',
        icon: 'finger',
        tips: ['提供适合的手指食物', '鼓励自己抓着吃']
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '3-4次/天',
        amount: '600-800ml',
        notes: ['奶仍很重要']
      },
      {
        type: '辅食',
        frequency: '3次正餐+1-2次小点',
        amount: '120-180ml/餐',
        notes: ['质地：小颗粒、软块状', '增加手指食物']
      }
    ],
    safetyWarnings: ['❗ 能站能爬，跌倒风险增加', '❗ 手指食物注意窒息风险', '❗ 抽屉、柜子要锁好'],
    milestones: [
      { title: '钳式抓握', description: '能用拇指和食指捏起小物品', achieved: false, icon: 'pinch' },
      { title: '扶站', description: '能扶着家具站起来', achieved: false, icon: 'stand' },
      { title: '模仿', description: '会模仿简单的动作和声音', achieved: false, icon: 'copy' }
    ],
    commonIssues: [
      {
        problem: '不愿坐餐椅',
        symptoms: ['哭闹', '挣扎'],
        solutions: ['从短时间开始', '给玩具分散注意力'],
        whenToSeeDr: '严重抗拒、影响进食'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 9,
    title: '第9个月',
    summary: '宝宝更加独立，开始有自己的小个性。',
    physicalDevelopment: {
      weight: '7.8-11.0kg',
      height: '69-78cm',
      headCircumference: '43-48cm',
      description: '体格强壮，动作协调性大大提高，可能已经长出4-6颗牙齿。'
    },
    cognitiveSkills: ['能理解简单的指令', '喜欢搜索隐藏的物品', '记忆力提升'],
    motorSkills: {
      gross: ['爬行非常熟练', '能扶着走几步', '可能独自站立片刻'],
      fine: ['钳式抓握熟练', '能翻书页', '能用手指指物']
    },
    socialEmotional: ['会用手势沟通', '有自己的喜好', '可能开始说"妈妈""爸爸"'],
    careGuidelines: [
      {
        category: '促进行走',
        icon: 'walk',
        tips: ['提供稳固的扶持物', '光脚在安全地面走', '不建议使用学步车']
      },
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天11-14小时', '白天1-2次小睡'],
        duration: '11-14小时/天'
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '3-4次/天',
        amount: '500-700ml',
        notes: ['辅食比例增加', '但奶仍重要']
      },
      {
        type: '辅食',
        frequency: '3次正餐+2次小点',
        amount: '180-240ml/餐',
        notes: ['质地：小块、碎末', '自己抓着吃']
      }
    ],
    safetyWarnings: ['❗ 开始能站能走，防跌倒', '❗ 楼梯要装安全门', '❗ 疫苗接种：9个月疫苗'],
    milestones: [
      { title: '扶走', description: '能扶着家具走几步', achieved: false, icon: 'walk' },
      { title: '挥手再见', description: '理解并会挥手再见', achieved: false, icon: 'wave' },
      { title: '有意义的发音', description: '开始说"妈妈""爸爸"等', achieved: false, icon: 'speak' }
    ],
    commonIssues: [
      {
        problem: '9个月焦虑',
        symptoms: ['粘人', '不让陌生人抱'],
        solutions: ['给予更多安全感', '保持耐心'],
        whenToSeeDr: '极端焦虑、发育倒退'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 10,
    title: '第10个月',
    summary: '宝宝的个性更加鲜明，运动和语言能力都在快速发展。',
    physicalDevelopment: {
      weight: '8.0-11.3kg',
      height: '71-79cm',
      headCircumference: '43-48cm',
      description: '体格健壮，协调性好，可能已经长出6-8颗牙齿。'
    },
    cognitiveSkills: ['理解更多词汇', '能完成简单的指令', '喜欢模仿', '知道物品的用途'],
    motorSkills: {
      gross: ['可能独自站立', '扶着走很稳', '有的开始独立走'],
      fine: ['能放开手中的物品', '喜欢扔东西', '能堆叠积木']
    },
    socialEmotional: ['依恋主要照顾者', '害羞或认生', '开始有同理心', '喜欢逗人笑'],
    careGuidelines: [
      {
        category: '鼓励行走',
        icon: 'steps',
        tips: ['牵手练习走', '光脚走最好', '每个宝宝节奏不同']
      },
      {
        category: '认知游戏',
        icon: 'brain',
        tips: ['躲猫猫', '堆积木', '形状配对']
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '2-3次/天',
        amount: '450-600ml',
        notes: ['辅食为主要营养', '奶作为补充']
      },
      {
        type: '辅食',
        frequency: '3次正餐+2次小点',
        amount: '200-250ml/餐',
        notes: ['食物更接近成人', '自主进食为主']
      }
    ],
    safetyWarnings: ['❗ 能走能爬，监督很重要', '❗ 喜欢扔东西，注意周围', '❗ 电源、药品要锁好'],
    milestones: [
      { title: '独站', description: '能独自站立几秒钟', achieved: false, icon: 'stand' },
      { title: '听懂指令', description: '能理解简单的指令', achieved: false, icon: 'listen' },
      { title: '主动交流', description: '用手势、声音主动表达', achieved: false, icon: 'communicate' }
    ],
    commonIssues: [
      {
        problem: '不爱吃饭',
        symptoms: ['拒绝进食', '只吃某些食物'],
        solutions: ['不强迫', '提供多样选择'],
        whenToSeeDr: '体重下降、营养不良'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 11,
    title: '第11个月',
    summary: '接近1岁，宝宝变得越来越独立。',
    physicalDevelopment: {
      weight: '8.2-11.5kg',
      height: '72-80cm',
      headCircumference: '44-49cm',
      description: '身体比例更像幼儿，动作灵活协调。'
    },
    cognitiveSkills: ['理解更多日常词汇', '能完成2步指令', '记忆力很好', '开始有简单的假装游戏'],
    motorSkills: {
      gross: ['很多宝宝能独立走', '能弯腰捡东西', '扶着能上楼梯'],
      fine: ['能用笔涂鸦', '堆2-3块积木', '能指认图片中的物品']
    },
    socialEmotional: ['开始有小脾气', '会说"不"（摇头）', '喜欢模仿大人', '情绪更丰富'],
    careGuidelines: [
      {
        category: '独立行走',
        icon: 'walking',
        tips: ['提供鼓励和支持', '保证环境安全', '摔倒是正常的']
      },
      {
        category: '规则设定',
        icon: 'rule',
        tips: ['开始设定简单规则', '保持一致性', '用正面语言']
      }
    ],
    nutritionTips: [
      {
        type: '母乳/配方奶',
        frequency: '2-3次/天',
        amount: '400-500ml',
        notes: ['准备过渡到鲜奶（1岁后）']
      },
      {
        type: '正餐',
        frequency: '3次正餐+2次小点',
        amount: '自主进食',
        notes: ['基本和家人同食', '少盐少糖']
      }
    ],
    safetyWarnings: ['❗ 独立行走，跌倒碰撞风险高', '❗ 能爬能跳，全面安全检查', '❗ 好奇心强，误食风险'],
    milestones: [
      { title: '独立行走', description: '能独自走几步（有的宝宝）', achieved: false, icon: 'walk-alone' },
      { title: '说词汇', description: '能说2-3个有意义的词', achieved: false, icon: 'vocabulary' },
      { title: '理解指令', description: '能完成"把球给我"等指令', achieved: false, icon: 'understand' }
    ],
    commonIssues: [
      {
        problem: '发脾气',
        symptoms: ['哭闹', '扔东西'],
        solutions: ['保持冷静', '设定清晰界限'],
        whenToSeeDr: '极端暴力行为、伤害自己'
      }
    ],
    videos: [],
    images: []
  },
  {
    month: 12,
    title: '第12个月（1岁）🎉',
    summary: '恭喜！宝宝1岁了！这是一个重要的里程碑，宝宝从婴儿变成了幼儿。',
    physicalDevelopment: {
      weight: '8.5-12.0kg',
      height: '73-82cm',
      headCircumference: '44-49cm',
      description: '体重约为出生时的3倍，身高约为出生时的1.5倍。通常有6-8颗牙齿。'
    },
    cognitiveSkills: ['理解很多日常词汇', '能完成简单的指令', '知道物品的名称和用途', '开始有简单的假装游戏', '记忆力好，能记住人和事', '开始理解"我的"概念'],
    motorSkills: {
      gross: ['大多数能独立行走', '能弯腰捡东西', '能推拉玩具', '能爬上沙发/椅子', '有的能踢球'],
      fine: ['能用杯子喝水', '尝试用勺子', '能涂鸦', '堆2-4块积木', '翻书页', '指认物品']
    },
    socialEmotional: ['有明显的个性', '会说几个词（妈妈、爸爸等）', '喜欢模仿', '对其他孩子感兴趣', '有分离焦虑', '开始有独立意识', '会表达喜怒哀乐'],
    careGuidelines: [
      {
        category: '1岁体检',
        icon: 'medical',
        tips: ['身高体重头围测量', '发育评估', '疫苗接种', '咨询医生任何问题']
      },
      {
        category: '饮食过渡',
        icon: 'milk',
        tips: ['可以开始喝全脂鲜奶', '每天400-500ml鲜奶', '丰富的固体食物']
      },
      {
        category: '睡眠',
        icon: 'moon',
        tips: ['每天11-14小时', '夜间10-12小时', '白天1-2次小睡'],
        duration: '11-14小时/天'
      }
    ],
    nutritionTips: [
      {
        type: '鲜奶/母乳',
        frequency: '2-3次/天',
        amount: '400-500ml',
        notes: ['可以喝全脂鲜奶', '或继续母乳喂养', '用杯子喝', '不要超过600ml']
      },
      {
        type: '固体食物',
        frequency: '3次正餐+2次小点',
        amount: '自主进食',
        notes: ['和家人同食', '营养均衡', '少盐少糖不加调料', '鼓励自己吃']
      }
    ],
    safetyWarnings: ['❗ 能走能跑，时刻监督', '❗ 好奇心极强，误食风险高', '❗ 能开门拉抽屉，做好防护', '❗ 户外活动注意交通安全', '❗ 疫苗接种：1岁疫苗', '❗ 蜂蜜可以吃了，但坚果仍需小心'],
    milestones: [
      { title: '独立行走', description: '能独自行走（90%的宝宝）', achieved: false, icon: 'walk-independent' },
      { title: '说词汇', description: '能说1-3个有意义的词', achieved: false, icon: 'first-words' },
      { title: '自主进食', description: '能用手指抓食物、尝试用勺子', achieved: false, icon: 'self-feed' },
      { title: '社交互动', description: '挥手再见、拍手、模仿', achieved: false, icon: 'social' }
    ],
    commonIssues: [
      {
        problem: '还不会走',
        symptoms: ['12-15个月仍不会独立走'],
        solutions: ['不要焦虑，每个宝宝不同', '18个月前都正常', '多鼓励练习'],
        whenToSeeDr: '18个月还不会走、其他发育迟缓'
      },
      {
        problem: '不说话',
        symptoms: ['不会说任何词', '不回应名字'],
        solutions: ['多说话多读书', '给反应时间'],
        whenToSeeDr: '18个月不说话、不理解指令、不回应名字'
      },
      {
        problem: '挑食',
        symptoms: ['只吃几种食物', '拒绝新食物'],
        solutions: ['继续提供多样食物', '不强迫', '榜样作用'],
        whenToSeeDr: '体重下降、营养不良'
      }
    ],
    videos: [
      {
        id: 'v1201',
        title: '1岁宝宝发育里程碑',
        url: 'https://example.com/videos/12-month-milestones.mp4',
        thumbnail: '/images/video-thumb-12m.jpg',
        description: '1岁宝宝应该掌握的技能',
        type: 'video'
      }
    ],
    images: [
      {
        id: 'i1201',
        title: '1岁成长对照',
        url: '/images/1-year-growth.jpg',
        description: '1岁宝宝的发育对照表',
        type: 'image'
      }
    ]
  }
]

// 汉字数据 - 100个常用汉字
const characters = [
  // 基础字（1-20）
  { id: 1, char: '人', pinyin: 'rén', words: ['人民', '人们', '人口'], image: '👤', strokes: 2, category: 'basic' },
  { id: 2, char: '口', pinyin: 'kǒu', words: ['人口', '门口', '口水'], image: '👄', strokes: 3, category: 'basic' },
  { id: 3, char: '手', pinyin: 'shǒu', words: ['手指', '手机', '手工'], image: '✋', strokes: 4, category: 'basic' },
  { id: 4, char: '足', pinyin: 'zú', words: ['足球', '手足', '满足'], image: '🦶', strokes: 7, category: 'basic' },
  { id: 5, char: '大', pinyin: 'dà', words: ['大人', '大小', '大家'], image: '📏', strokes: 3, category: 'basic' },
  { id: 6, char: '小', pinyin: 'xiǎo', words: ['小孩', '小事', '小心'], image: '🔬', strokes: 3, category: 'basic' },
  { id: 7, char: '上', pinyin: 'shàng', words: ['上面', '上山', '上学'], image: '⬆️', strokes: 3, category: 'direction' },
  { id: 8, char: '下', pinyin: 'xià', words: ['下面', '下雨', '下山'], image: '⬇️', strokes: 3, category: 'direction' },
  { id: 9, char: '左', pinyin: 'zuǒ', words: ['左边', '左右', '左手'], image: '⬅️', strokes: 5, category: 'direction' },
  { id: 10, char: '右', pinyin: 'yòu', words: ['右边', '右手', '左右'], image: '➡️', strokes: 5, category: 'direction' },

  // 自然字（11-30）
  { id: 11, char: '山', pinyin: 'shān', words: ['大山', '山水', '上山'], image: '⛰️', strokes: 3, category: 'nature' },
  { id: 12, char: '水', pinyin: 'shuǐ', words: ['水果', '喝水', '河水'], image: '💧', strokes: 4, category: 'nature' },
  { id: 13, char: '火', pinyin: 'huǒ', words: ['火车', '火锅', '大火'], image: '🔥', strokes: 4, category: 'nature' },
  { id: 14, char: '木', pinyin: 'mù', words: ['树木', '木头', '森林'], image: '🌳', strokes: 4, category: 'nature' },
  { id: 15, char: '日', pinyin: 'rì', words: ['日出', '日记', '日子'], image: '☀️', strokes: 4, category: 'nature' },
  { id: 16, char: '月', pinyin: 'yuè', words: ['月亮', '月饼', '岁月'], image: '🌙', strokes: 4, category: 'nature' },
  { id: 17, char: '星', pinyin: 'xīng', words: ['星星', '明星', '星空'], image: '⭐', strokes: 9, category: 'nature' },
  { id: 18, char: '云', pinyin: 'yún', words: ['白云', '云朵', '乌云'], image: '☁️', strokes: 4, category: 'nature' },
  { id: 19, char: '天', pinyin: 'tiān', words: ['天空', '白天', '天气'], image: '🌌', strokes: 4, category: 'nature' },
  { id: 20, char: '地', pinyin: 'dì', words: ['地球', '土地', '地方'], image: '🌍', strokes: 6, category: 'nature' },

  // 动物字（21-40）
  { id: 21, char: '狗', pinyin: 'gǒu', words: ['小狗', '狗熊', '热狗'], image: '🐕', strokes: 8, category: 'animal' },
  { id: 22, char: '猫', pinyin: 'māo', words: ['小猫', '猫咪', '熊猫'], image: '🐱', strokes: 11, category: 'animal' },
  { id: 23, char: '鸟', pinyin: 'niǎo', words: ['小鸟', '鸟儿', '鸟蛋'], image: '🐦', strokes: 5, category: 'animal' },
  { id: 24, char: '鱼', pinyin: 'yú', words: ['小鱼', '金鱼', '鱼缸'], image: '🐟', strokes: 8, category: 'animal' },
  { id: 25, char: '马', pinyin: 'mǎ', words: ['小马', '斑马', '马儿'], image: '🐴', strokes: 3, category: 'animal' },
  { id: 26, char: '牛', pinyin: 'niú', words: ['牛奶', '黄牛', '牛肉'], image: '🐂', strokes: 4, category: 'animal' },
  { id: 27, char: '羊', pinyin: 'yáng', words: ['小羊', '山羊', '羊毛'], image: '🐑', strokes: 6, category: 'animal' },
  { id: 28, char: '兔', pinyin: 'tù', words: ['兔子', '白兔', '兔耳'], image: '🐰', strokes: 8, category: 'animal' },
  { id: 29, char: '虫', pinyin: 'chóng', words: ['虫子', '昆虫', '毛虫'], image: '🐛', strokes: 6, category: 'animal' },
  { id: 30, char: '虎', pinyin: 'hǔ', words: ['老虎', '虎头', '虎年'], image: '🐯', strokes: 8, category: 'animal' },

  // 食物字（31-50）
  { id: 31, char: '米', pinyin: 'mǐ', words: ['大米', '米饭', '米线'], image: '🍚', strokes: 6, category: 'food' },
  { id: 32, char: '饭', pinyin: 'fàn', words: ['米饭', '吃饭', '饭菜'], image: '🍲', strokes: 7, category: 'food' },
  { id: 33, char: '果', pinyin: 'guǒ', words: ['水果', '苹果', '果树'], image: '🍎', strokes: 8, category: 'food' },
  { id: 34, char: '菜', pinyin: 'cài', words: ['蔬菜', '买菜', '菜花'], image: '🥬', strokes: 11, category: 'food' },
  { id: 35, char: '肉', pinyin: 'ròu', words: ['牛肉', '猪肉', '肉丸'], image: '🥩', strokes: 6, category: 'food' },
  { id: 36, char: '蛋', pinyin: 'dàn', words: ['鸡蛋', '蛋糕', '蛋壳'], image: '🥚', strokes: 11, category: 'food' },
  { id: 37, char: '奶', pinyin: 'nǎi', words: ['牛奶', '奶奶', '奶茶'], image: '🥛', strokes: 5, category: 'food' },
  { id: 38, char: '茶', pinyin: 'chá', words: ['喝茶', '茶叶', '茶杯'], image: '🍵', strokes: 9, category: 'food' },
  { id: 39, char: '瓜', pinyin: 'guā', words: ['西瓜', '冬瓜', '瓜子'], image: '🍉', strokes: 5, category: 'food' },
  { id: 40, char: '豆', pinyin: 'dòu', words: ['豆子', '红豆', '豆浆'], image: '🫘', strokes: 7, category: 'food' },

  // 家庭字（41-60）
  { id: 41, char: '爸', pinyin: 'bà', words: ['爸爸', '老爸', '爸妈'], image: '👨', strokes: 8, category: 'family' },
  { id: 42, char: '妈', pinyin: 'mā', words: ['妈妈', '奶奶', '大妈'], image: '👩', strokes: 6, category: 'family' },
  { id: 43, char: '爷', pinyin: 'yé', words: ['爷爷', '大爷', '老爷'], image: '👴', strokes: 6, category: 'family' },
  { id: 44, char: '奶', pinyin: 'nǎi', words: ['奶奶', '牛奶', '奶粉'], image: '👵', strokes: 5, category: 'family' },
  { id: 45, char: '哥', pinyin: 'gē', words: ['哥哥', '大哥', '哥们'], image: '👦', strokes: 10, category: 'family' },
  { id: 46, char: '弟', pinyin: 'dì', words: ['弟弟', '兄弟', '弟子'], image: '👦', strokes: 7, category: 'family' },
  { id: 47, char: '姐', pinyin: 'jiě', words: ['姐姐', '姐妹', '大姐'], image: '👧', strokes: 8, category: 'family' },
  { id: 48, char: '妹', pinyin: 'mèi', words: ['妹妹', '姐妹', '姐妹'], image: '👧', strokes: 8, category: 'family' },
  { id: 49, char: '家', pinyin: 'jiā', words: ['家人', '回家', '大家'], image: '🏠', strokes: 10, category: 'family' },
  { id: 50, char: '亲', pinyin: 'qīn', words: ['亲人', '亲爱', '父亲'], image: '👨‍👩‍👧', strokes: 9, category: 'family' },

  // 动作字（51-70）
  { id: 51, char: '吃', pinyin: 'chī', words: ['吃饭', '好吃', '吃东西'], image: '😋', strokes: 6, category: 'action' },
  { id: 52, char: '喝', pinyin: 'hē', words: ['喝水', '喝茶', '喝酒'], image: '🥤', strokes: 12, category: 'action' },
  { id: 53, char: '看', pinyin: 'kàn', words: ['看书', '看见', '好看'], image: '👀', strokes: 9, category: 'action' },
  { id: 54, char: '听', pinyin: 'tīng', words: ['听歌', '好听', '听见'], image: '👂', strokes: 7, category: 'action' },
  { id: 55, char: '说', pinyin: 'shuō', words: ['说话', '说话', '小说'], image: '🗣️', strokes: 9, category: 'action' },
  { id: 56, char: '走', pinyin: 'zǒu', words: ['走路', '行走', '走开'], image: '🚶', strokes: 7, category: 'action' },
  { id: 57, char: '跑', pinyin: 'pǎo', words: ['跑步', '跑步', '奔跑'], image: '🏃', strokes: 11, category: 'action' },
  { id: 58, char: '跳', pinyin: 'tiào', words: ['跳舞', '跳绳', '跳远'], image: '🤸', strokes: 11, category: 'action' },
  { id: 59, char: '坐', pinyin: 'zuò', words: ['坐下', '坐车', '请坐'], image: '🪑', strokes: 7, category: 'action' },
  { id: 60, char: '站', pinyin: 'zhàn', words: ['站立', '车站', '站着'], image: '🧍', strokes: 10, category: 'action' },

  // 形容字（61-80）
  { id: 61, char: '好', pinyin: 'hǎo', words: ['好人', '好看', '友好'], image: '👍', strokes: 6, category: 'adj' },
  { id: 62, char: '美', pinyin: 'měi', words: ['美丽', '美好', '美术'], image: '🌸', strokes: 9, category: 'adj' },
  { id: 63, char: '丑', pinyin: 'chǒu', words: ['丑陋', '丑小鸭'], image: '🦆', strokes: 4, category: 'adj' },
  { id: 64, char: '多', pinyin: 'duō', words: ['多少', '很多', '多多'], image: '➕', strokes: 6, category: 'adj' },
  { id: 65, char: '少', pinyin: 'shǎo', words: ['多少', '少女', '少数'], image: '➖', strokes: 4, category: 'adj' },
  { id: 66, char: '高', pinyin: 'gāo', words: ['高山', '高兴', '高矮'], image: '📏', strokes: 10, category: 'adj' },
  { id: 67, char: '矮', pinyin: 'ǎi', words: ['高矮', '矮小'], image: '🤏', strokes: 13, category: 'adj' },
  { id: 68, char: '长', pinyin: 'cháng', words: ['长城', '长长', '长度'], image: '📏', strokes: 4, category: 'adj' },
  { id: 69, char: '短', pinyin: 'duǎn', words: ['长短', '短暂'], image: '✂️', strokes: 12, category: 'adj' },
  { id: 70, char: '快', pinyin: 'kuài', words: ['快乐', '快跑', '快点'], image: '⚡', strokes: 7, category: 'adj' },

  // 颜色字（71-85）
  { id: 71, char: '红', pinyin: 'hóng', words: ['红色', '红火', '苹果'], image: '🔴', strokes: 6, category: 'color' },
  { id: 72, char: '黄', pinyin: 'huáng', words: ['黄色', '金黄', '黄瓜'], image: '🟡', strokes: 11, category: 'color' },
  { id: 73, char: '蓝', pinyin: 'lán', words: ['蓝色', '蓝天', '蓝天'], image: '🔵', strokes: 13, category: 'color' },
  { id: 74, char: '绿', pinyin: 'lǜ', words: ['绿色', '绿叶', '草地'], image: '🟢', strokes: 11, category: 'color' },
  { id: 75, char: '白', pinyin: 'bái', words: ['白色', '白天', '白云'], image: '⚪', strokes: 5, category: 'color' },
  { id: 76, char: '黑', pinyin: 'hēi', words: ['黑色', '黑夜', '黑板'], image: '⚫', strokes: 12, category: 'color' },

  // 常用字（86-100）
  { id: 86, char: '书', pinyin: 'shū', words: ['书本', '看书', '读书'], image: '📚', strokes: 4, category: 'object' },
  { id: 87, char: '本', pinyin: 'běn', words: ['本子', '书本', '本人'], image: '📓', strokes: 5, category: 'object' },
  { id: 88, char: '笔', pinyin: 'bǐ', words: ['铅笔', '毛笔', '笔头'], image: '✏️', strokes: 10, category: 'object' },
  { id: 89, char: '画', pinyin: 'huà', words: ['画画', '图画', '画家'], image: '🎨', strokes: 8, category: 'object' },
  { id: 90, char: '花', pinyin: 'huā', words: ['花朵', '鲜花', '花园'], image: '🌸', strokes: 7, category: 'nature' },
  { id: 91, char: '草', pinyin: 'cǎo', words: ['小草', '草地', '青草'], image: '🌿', strokes: 9, category: 'nature' },
  { id: 92, char: '树', pinyin: 'shù', words: ['大树', '树木', '树林'], image: '🌲', strokes: 9, category: 'nature' },
  { id: 93, char: '叶', pinyin: 'yè', words: ['叶子', '树叶', '绿叶'], image: '🍃', strokes: 5, category: 'nature' },
  { id: 94, char: '车', pinyin: 'chē', words: ['汽车', '火车', '车子'], image: '🚗', strokes: 4, category: 'object' },
  { id: 95, char: '船', pinyin: 'chuán', words: ['小船', '轮船', '船头'], image: '🚢', strokes: 11, category: 'object' },
  { id: 96, char: '门', pinyin: 'mén', words: ['门口', '开门', '大门'], image: '🚪', strokes: 3, category: 'object' },
  { id: 97, char: '窗', pinyin: 'chuāng', words: ['窗户', '门窗', '窗口'], image: '🪟', strokes: 12, category: 'object' },
  { id: 98, char: '灯', pinyin: 'dēng', words: ['电灯', '台灯', '灯光'], image: '💡', strokes: 6, category: 'object' },
  { id: 99, char: '衣', pinyin: 'yī', words: ['衣服', '穿衣', '大衣'], image: '👕', strokes: 6, category: 'object' },
  { id: 100, char: '鞋', pinyin: 'xié', words: ['鞋子', '皮鞋', '穿鞋'], image: '👟', strokes: 15, category: 'object' }
];

// 数字数据 - 1-20
const numbers = [
  { id: 1, number: '1', chinese: '一', pinyin: 'yī', image: '1️⃣' },
  { id: 2, number: '2', chinese: '二', pinyin: 'èr', image: '2️⃣' },
  { id: 3, number: '3', chinese: '三', pinyin: 'sān', image: '3️⃣' },
  { id: 4, number: '4', chinese: '四', pinyin: 'sì', image: '4️⃣' },
  { id: 5, number: '5', chinese: '五', pinyin: 'wǔ', image: '5️⃣' },
  { id: 6, number: '6', chinese: '六', pinyin: 'liù', image: '6️⃣' },
  { id: 7, number: '7', chinese: '七', pinyin: 'qī', image: '7️⃣' },
  { id: 8, number: '8', chinese: '八', pinyin: 'bā', image: '8️⃣' },
  { id: 9, number: '9', chinese: '九', pinyin: 'jiǔ', image: '9️⃣' },
  { id: 10, number: '10', chinese: '十', pinyin: 'shí', image: '🔟' },
  { id: 11, number: '11', chinese: '十一', pinyin: 'shí yī', image: '🔢' },
  { id: 12, number: '12', chinese: '十二', pinyin: 'shí èr', image: '🔢' },
  { id: 13, number: '13', chinese: '十三', pinyin: 'shí sān', image: '🔢' },
  { id: 14, number: '14', chinese: '十四', pinyin: 'shí sì', image: '🔢' },
  { id: 15, number: '15', chinese: '十五', pinyin: 'shí wǔ', image: '🔢' },
  { id: 16, number: '16', chinese: '十六', pinyin: 'shí liù', image: '🔢' },
  { id: 17, number: '17', chinese: '十七', pinyin: 'shí qī', image: '🔢' },
  { id: 18, number: '18', chinese: '十八', pinyin: 'shí bā', image: '🔢' },
  { id: 19, number: '19', chinese: '十九', pinyin: 'shí jiǔ', image: '🔢' },
  { id: 20, number: '20', chinese: '二十', pinyin: 'èr shí', image: '🔢' }
];

// 导出数据
window.AppData = {
  characters,
  numbers,
  // 获取分类
  getCategories() {
    return {
      basic: '基础字',
      direction: '方向字',
      nature: '自然字',
      animal: '动物字',
      food: '食物字',
      family: '家庭字',
      action: '动作字',
      adj: '形容词',
      color: '颜色字',
      object: '物品字'
    };
  },
  // 根据分类获取汉字
  getByCategory(category) {
    return this.characters.filter(c => c.category === category);
  },
  // 获取随机汉字
  getRandomChars(count = 4) {
    const shuffled = [...this.characters].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  },
  // 获取随机数字
  getRandomNumbers(count = 4) {
    const shuffled = [...this.numbers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
};
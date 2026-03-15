# 快乐识字 - 幼儿识字学习应用

幼儿园小朋友学习汉字和数字的趣味Web应用。

## 功能特性

- 📖 **100个常用汉字** + 🔢 **20个数字** 学习
- ✏️ **描红游戏** - 触控书写练习
- 🔗 **连连看** - 汉字图片配对
- 🎯 **拖拽配对** - 触控拖拽游戏
- 🔊 **听音选字** - 语音互动游戏
- 🔥 **连击系统** - 连续答对奖励翻倍
- 🐾 **宠物伙伴** - 可爱的学习伙伴
- 🏆 **关卡系统** - 循序渐进的学习关卡
- 🌟 **勋章收集** - 17种成就勋章

## 安卓手机使用方法

### 方法一：GitHub Pages（推荐）

1. **Fork 本仓库到你的 GitHub 账号**

2. **启用 GitHub Pages**
   - 进入你 Fork 的仓库
   - 点击 `Settings` → `Pages`
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`，文件夹选择 `/ (root)`
   - 点击 Save

3. **访问应用**
   - 等待几分钟后，访问：
   ```
   https://你的用户名.github.io/仓库名/
   ```

4. **添加到主屏幕**（类似App体验）
   - 用手机浏览器打开网址
   - Chrome: 菜单 → "添加到主屏幕"
   - Safari: 分享 → "添加到主屏幕"

### 方法二：本地网络访问

1. 在电脑上启动服务器：
   ```bash
   cd kids-learn-app
   python3 -m http.server 8080
   ```

2. 确保手机和电脑在同一WiFi网络

3. 查看电脑IP地址：
   - Mac: `系统偏好设置` → `网络`
   - Windows: `cmd` → `ipconfig`

4. 手机浏览器访问：`http://电脑IP:8080`

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/你的用户名/kids-learn-app.git

# 进入目录
cd kids-learn-app

# 启动本地服务器
python3 -m http.server 8080

# 浏览器打开
# http://localhost:8080
```

## 技术栈

- 原生 HTML/CSS/JavaScript（无需构建）
- Web Speech API（语音朗读）
- Canvas API（描红功能）
- LocalStorage（进度保存）
- Service Worker（离线支持）
- PWA（可安装到主屏幕）

## 文件结构

```
kids-learn-app/
├── index.html          # 主入口
├── manifest.json       # PWA配置
├── sw.js               # Service Worker
├── css/
│   ├── main.css        # 主样式
│   ├── animations.css  # 动画效果
│   └── games.css       # 游戏样式
├── js/
│   ├── app.js          # 主应用逻辑
│   ├── data.js         # 汉字数字数据
│   ├── speech.js       # 语音朗读
│   ├── storage.js      # 本地存储
│   ├── rewards.js      # 奖励系统
│   ├── levels.js       # 关卡系统
│   ├── pet.js          # 宠物系统
│   └── games/          # 游戏模块
│       ├── tracing.js
│       ├── matching.js
│       ├── drag.js
│       └── listen.js
└── assets/             # 资源文件
```

## 浏览器兼容性

- Chrome 80+
- Safari 13+
- Firefox 75+
- Edge 80+

## License

MIT
# Period Tracker - 女性经期追踪管理应用

## 项目简介

Period Tracker 是一款简洁易用的女性经期追踪管理应用，帮助用户记录和预测月经周期。纯前端实现，数据存储在浏览器本地，保护用户隐私。

## 功能特性

- 📅 记录月经开始/结束日期
- 📊 周期统计（平均周期、平均经期天数）
- 🔮 预测下次月经日期
- 🗓️ 日历可视化展示经期和预测
- 📱 响应式设计，支持移动端访问

## 技术栈

- HTML5 / CSS3 / JavaScript (原生)
- LocalStorage 本地数据存储
- 无需后端，无需安装，开箱即用

## 快速开始

直接在浏览器中打开 `index.html` 即可使用。

```bash
# 或者使用本地服务器
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

## 项目结构

```
period-tracker/
├── index.html      # 主页面
├── css/
│   └── style.css   # 样式文件
├── js/
│   ├── app.js      # 主应用逻辑与状态管理
│   ├── calendar.js # 日历组件与渲染
│   └── storage.js  # LocalStorage 数据持久化
├── .gitignore
└── README.md
```

## 使用说明

1. 点击「开始经期」记录月经开始日期
2. 月经结束后点击「结束经期」记录结束日期
3. 系统自动计算周期统计数据
4. 记录至少两次完整经期后，系统会预测下次经期日期
5. 日历上会用不同颜色标记：经期（粉色）、预测（虚线）

## 浏览器兼容性

支持所有现代浏览器：Chrome、Firefox、Safari、Edge

## 许可证

MIT License

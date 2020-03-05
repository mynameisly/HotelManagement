# hotelManegement

基于 Vue + Element UI 的酒店管理系统解决方案。前端仓库地址(https://github.com/mynameisly/HotelManagement.git)

> fontend-manage(Vue + Element UI) + backend (springboot) 的版本正在开发中，仓库地址：[hotelManagement](http://120.24.186.190/XXX)

## 前言

酒店管理系统，基于 vue.js，使用 vue-cli3 脚手架，引用 Element UI 组件库，方便开发快速简洁好看的组件。分离颜色样式，支持手动切换主题色，而且很方便使用自定义主题色。

## 功能模块

-   [x] 登录/注销
-   [x] 员工管理
-   [x] 客房信息
-   [x] 入住信息
-   [x] 退房办理
-   [x] 客房服务
-   [x] 富文本编辑器
-   [x] 财务管理

## 安装步骤

```
git clone https://github.com/mynameisly/HotelManagement.git     or download zip     // 把模板下载到本地
cd hotelManagement    // 进入模板目录
npm install         // 安装项目依赖，等待安装完成之后，安装失败可用 cnpm 或 yarn

// 开启服务器，浏览器访问 http://localhost:8080
npm run serve

// 执行构建命令，生成的dist文件夹放在服务器下即可访问
npm run build
```

## 其他注意事项

### 一、如何切换主题色呢？

第一步：打开 src/main.js 文件，找到引入 element 样式的地方，换成浅绿色主题。

```javascript
import 'element-ui/lib/theme-default/index.css'; // 默认主题
// import './assets/css/theme-green/index.css';       // 浅绿色主题
```

第二步：打开 src/App.vue 文件，找到 style 标签引入样式的地方，切换成浅绿色主题。

```javascript
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";     /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   !*浅绿色主题*!*/
```

第三步：打开 src/components/common/Sidebar.vue 文件，找到 el-menu 标签，把 background-color/text-color/active-text-color 属性去掉即可。


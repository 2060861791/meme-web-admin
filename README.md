# 🖼Meme网站作品展示与管理系统后台（前端）

## 🎨 项目简介

这是一个为Meme网站提供支持的前端管理系统，用于展示和管理网页设计作品。该系统基于Vue 3 + Vite + Element Plus开发，提供了完善的作品管理、图片上传、主题与特性标签筛选等功能，支持与后端服务对接，并已配置Docker自动化部署。

![预览](public/预览.png)

## ✨ 功能特性

- **作品管理**：支持作品的添加、编辑、删除和查询
- **图片上传**：支持JPEG、PNG、GIF、WEBP等多种格式的图片上传
- **主题与标签**：支持添加、删除和筛选主题与技术特性标签
- **预览功能**：添加作品时可实时预览展示效果
- **响应式设计**：适配不同尺寸屏幕，提供良好的用户体验
- **JWT认证**：集成JWT鉴权，保障管理系统安全
- **Docker支持**：提供Dockerfile和Nginx配置，便于部署

## 🛠️ 技术栈

- **Vue 3**：使用Composition API进行组件开发
- **Vite**：高效的前端构建工具
- **Element Plus**：UI组件库，提供美观的界面
- **Vue Router**：处理前端路由
- **Axios**：处理HTTP请求
- **Docker**：容器化部署

## 🚀 快速开始

### 开发环境

1. **克隆项目**

```bash
git clone <仓库地址>
cd <项目目录>
```

2. **安装依赖**

```bash
npm install
```

3. **启动开发服务器**

```bash
npm run dev
```

### 生产环境

1. **构建项目**

```bash
npm run build
```

2. **预览构建结果**

```bash
npm run preview
```

---

## 🔧 自动化部署（已更新）

原本项目使用 GitHub Actions 实现自动部署，流程包括：

1. 构建 Docker 镜像并打包为 `.tar` 文件
2. 将压缩后的镜像通过 `scp` 上传至服务器
3. 在服务器解压并运行容器

⚠️ **该方式存在构建慢、传输慢的问题（总耗时约 10 分钟），现已废弃。**

------

✅ 当前部署方式（部署时间缩短至 40 秒内）

现在采用更高效的部署流程，结合 GitHub Actions 和服务器本地构建，大幅提升效率：

1. 在 GitHub 仓库中配置了 SSH 私钥（通过 `Secrets` 管理），并启用了 `actions/checkout` 直接拉取源码
2. 自动登录服务器并执行如下部署流程：
   - 进入项目目录，`git pull` 获取最新代码
   - 使用服务器本地的 `Dockerfile` 构建镜像
   - 重启容器，完成部署

该方式避免了远程打包上传 `.tar` 文件的环节，整体部署耗时已从 **10 分钟+ 降低至约 60 秒**。

---

## 📁 项目结构

```
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/          # 资源文件（图片、样式等）
│   ├── components/      # 通用组件
│   ├── layout/          # 布局组件
│   ├── router/          # 路由配置
│   ├── views/           # 页面视图
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── config.js            # 全局配置
├── Dockerfile           # Docker配置
├── nginx.conf           # Nginx配置
├── index.html           # HTML模板
├── vite.config.js       # Vite配置
└── package.json         # 项目依赖
```

## 🔧 环境配置

在`config.js`文件中，可以根据需要调整以下配置：

- **服务器配置**：API服务器地址、超时时间等
- **上传配置**：支持的图片类型、大小限制、建议尺寸等
- **静态资源配置**：默认占位图片等

## 📄 页面说明

- **登录页面**：管理员登录入口
- **作品列表**：展示、筛选和管理所有作品
- **添加作品**：上传图片，添加作品信息，实时预览效果
- **主题与特性管理**：管理作品的主题与技术特性标签

## 🔒 权限控制

系统实现了基于JWT的权限控制：

- 路由守卫确保未登录用户无法访问管理页面
- Axios拦截器自动处理请求中的Token携带和认证失败的跳转

## 🔄 与后端接口

本系统与后端服务进行对接，主要涉及以下API：

- **认证接口**：管理员登录
- **上传接口**：上传作品图片
- **作品管理**：添加、编辑、删除、查询作品
- **标签管理**：添加、删除、查询主题与特性标签

## 📢 注意事项

- 本系统需要配合后端API服务一起使用，请确保后端服务已正确配置
- 图片上传大小限制为5MB，支持jpg、jpeg、png、gif、webp格式
- 建议图片尺寸为800x600像素，以获得最佳显示效果 

## 📢 说明

本项目为网页设计售卖平台的前端展示部分，需配合对应的后台管理系统与后端服务使用。整体项目融合了现代前端技术栈与最佳实践，致力于提供良好的用户浏览体验与便捷的内容管理能力。

> ⚠️ 本项目及相关代码仅为**个人学习与项目练习**使用。

### 🔗 项目结构与相关仓库

以下是该平台相关的项目仓库链接：

- 🖼 前台展示页面（前台项目）：
   [meme-web-frontend](https://github.com/2060861791/meme-web-frontend)
- **🛠 后台管理系统（当前项目）：**
   [meme-web-admin](https://github.com/2060861791/meme-web-admin)
- ⚙️ 后端服务（API接口与业务逻辑）：
   [meme-web-server](https://github.com/2060861791/meme-web-server)

# 第一阶段：构建前端资源
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件并安装依赖（利用 Docker 缓存）
COPY package*.json ./
RUN npm install --registry=https://registry.npm.taobao.org

# 复制源码
COPY . .

# 构建项目（根据你的实际命令调整，如 umi build 或 npm run build）
RUN npm run build

# 第二阶段：使用 Nginx 托管静态文件
FROM nginx:alpine

# 删除默认配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置（可选，见下方说明）
COPY nginx.conf /etc/nginx/conf.d/

# 从 builder 阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]

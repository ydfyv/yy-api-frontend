# 第一阶段：构建前端资源
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm（使用国内镜像，避免 DNS 和速度问题）
RUN npm install -g pnpm --registry=https://registry.npmmirror.com

# 复制 package.json 和 lock 文件（关键！）
COPY package*.json ./

# 使用 pnpm 安装依赖（自动处理 peer dependency 冲突，比 npm 更宽容）
RUN pnpm install

# 复制源代码
COPY . .

# 构建生产版本（关闭 source map 加速）
RUN GENERATE_SOURCEMAP=false pnpm run build


# 第二阶段：Nginx 托管静态文件
FROM nginx:alpine

# 清除默认配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置（确保项目根目录有 nginx.conf）
# 如果没有，可删除下一行
COPY nginx.conf /etc/nginx/conf.d/

# 从 builder 阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]

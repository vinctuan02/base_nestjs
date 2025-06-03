FROM node:20

# Tạo thư mục làm việc
WORKDIR /app
RUN mkdir -p logs/base_nestjs

# Copy file cấu hình và cài dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy toàn bộ source code
COPY . .
COPY .env .env

# Build ứng dụng NestJS
RUN yarn build

# Mở port (NestJS mặc định là 3000)
EXPOSE 8081

# Chạy ứng dụng
CMD ["node", "dist/main"]

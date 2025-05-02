# ビルドステージ
FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package.json package-lock.json ./
RUN npm ci

# アプリケーションのコピー
COPY . .

# ビルド
RUN npm run build

# 実行ステージ
FROM node:18-alpine AS runner

WORKDIR /app

# 必要なファイルのみをコピー
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 環境変数の設定
ENV NODE_ENV=production
ENV PORT=3000

# ポートの公開
EXPOSE 3000

# アプリケーションの起動
CMD ["node", "server.js"] 
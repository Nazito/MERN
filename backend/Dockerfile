FROM node:20-bookworm-slim

WORKDIR /app

# OpenSSL / ca for Mongo Atlas + Cloudinary HTTPS
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "app.js"]

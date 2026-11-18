# Stage 1: Dependencies & Build
FROM node:26.13.1-alpine AS builder

WORKDIR /app

# Patch OS packages to remediate Alpine/musl/busybox CVEs
RUN apk update && apk upgrade --no-cache

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npm run build
RUN npm prune --omit=dev

# Stage 2: Production Runner
FROM node:26.13.1-alpine AS runner

WORKDIR /app

# Patch OS packages in the final minimal runtime
RUN apk update && apk upgrade --no-cache

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npx", "react-router-serve", "./build/server/index.js"]

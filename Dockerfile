# Multi-stage Dockerfile (simple two stages: development, production)

# =======================
# Development stage
# =======================
FROM node:18-alpine AS development
WORKDIR /usr/src/app

# Install all dependencies (dev + prod)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# =======================
# Production stage
# =======================
FROM node:18-alpine AS production
WORKDIR /usr/src/app

# Install full deps to build, then prune to production-only
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build \
  && npm prune --production \
  && npm cache clean --force

EXPOSE 3000
CMD ["node", "dist/main.js"]
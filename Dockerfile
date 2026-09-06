# Step 1: Build Frontend & Install Dependencies
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build Vite static bundle
RUN npm run build

# Step 2: Production Server Container
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy server script and built frontend dist directory
COPY server ./server
COPY --from=builder /app/dist ./dist

# Expose server port
EXPOSE 3001

# Start National World Central Server Engine
CMD ["node", "server/server.js"]

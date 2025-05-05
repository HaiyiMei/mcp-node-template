FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Copy built files from builder stage
COPY --from=builder /app/dist /app/dist
COPY scripts/entrypoint.sh /app/scripts/entrypoint.sh

# Pre-install supergateway globally
RUN npm install -g supergateway

# Expose the port
EXPOSE 3000

# RUN
RUN ls -la /app/scripts/entrypoint.sh

# Set the command to run the application
ENTRYPOINT ["sh", "/app/scripts/entrypoint.sh"]
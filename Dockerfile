# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy only built files and necessary assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/Admin ./Admin
# COPY --from=builder /app/Api ./Api
COPY --from=builder /app/public ./public

RUN npm i 

# Create a non-root user and use it
RUN useradd --user-group --create-home --shell /bin/false appuser
USER appuser

EXPOSE 3000

CMD ["node", "dist/app.js"]

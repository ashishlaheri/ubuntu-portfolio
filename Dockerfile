# ==========================================
# STAGE 1: Build the React/Vite Application
# ==========================================
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package manifests first — maximises Docker layer cache reuse
COPY package.json package-lock.json ./

# Install dependencies using the lockfile for reproducibility
RUN npm ci

# Copy all source files (respects .dockerignore)
COPY . .

# Run the Vite production build → outputs to /app/dist
# public/ assets (including PDFs) are automatically included by Vite
RUN npm run build

# ==========================================
# STAGE 2: Serve with Nginx (tiny final image)
# ==========================================
FROM nginx:1.27-alpine

# Remove default nginx placeholder content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config (SPA routing + PDF support + gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verify the nginx config is valid before the image is finalised
RUN nginx -t

# Expose HTTP
EXPOSE 80

# Run nginx in the foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]


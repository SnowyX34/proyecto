# Stage 1: Build Angular application
FROM node:20.19.1-alpine AS build

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Debug: Check what files were copied
RUN ls -la

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Angular app for production
RUN npm run build --configuration=production

# List contents to verify build output (optional debug step)
RUN ls -la dist/

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built Angular app from build stage
# Adjust this path based on your actual build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
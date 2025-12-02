# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.21.0

FROM node:${NODE_VERSION}-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create node_modules/.vite-temp with correct permissions
RUN mkdir -p node_modules/.vite-temp && \
    chown -R node:node /usr/src/app

# Switch to node user
USER node

# Expose port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

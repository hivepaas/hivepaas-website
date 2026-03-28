FROM node:20-alpine

WORKDIR /app

# Enable corepack for yarn
RUN corepack enable

# Copy root manifest and workspace manifests
COPY package.json yarn.lock ./
COPY docs/package.json ./docs/
COPY landing/package.json ./landing/

# Install dependencies (frozen-lockfile for consistency)
RUN yarn install --frozen-lockfile

# Copy all source code
COPY . .

# Build both applications
RUN yarn build

# Expose ports for both applications
# 3100: Docusaurus
# 3200: Astro
EXPOSE 3100 3200

# Start both servers concurrently
CMD ["yarn", "serve"]

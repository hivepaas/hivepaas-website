# The website: the docs (Docusaurus) and the landing page (Astro), built as
# static files and served by nginx - the docs on 3100, the landing page on 3200.
# Their preview servers (docusaurus serve, astro preview) are for a laptop: the
# latter refuses any host but localhost.

FROM node:24-alpine AS builder

WORKDIR /app
RUN corepack enable

# The manifests first, so a change to the sources reuses the installed packages.
COPY package.json yarn.lock ./
COPY docs/package.json ./docs/
COPY landing/package.json ./landing/
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# nginx without root: the ports are above 1024, and nothing it serves is written.
FROM nginxinc/nginx-unprivileged:1.30.5-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/docs/build /usr/share/nginx/docs
COPY --from=builder /app/landing/dist /usr/share/nginx/landing

EXPOSE 3100 3200

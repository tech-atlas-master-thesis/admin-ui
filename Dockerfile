FROM node:alpine AS builder

RUN npm install -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install
COPY . .
RUN pnpm run build
# The entrypoint must have LF line endings, also when the image is built from a Windows checkout.
RUN sed -i 's/\r$//' docker-entrypoint.sh

FROM nginxinc/nginx-unprivileged:alpine AS runner
USER nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=builder /app/dist/techAtlas-admin-ui/browser /usr/share/nginx/html
COPY --chmod=755 --from=builder /app/docker-entrypoint.sh /docker-entrypoint.sh

EXPOSE 8080

# Writes /config.json from OAUTH_ISSUER / OAUTH_CLIENT_ID, then starts nginx.
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["-g", "daemon off;"]

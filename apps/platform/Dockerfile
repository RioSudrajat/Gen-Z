FROM node:24.11.0-bookworm-slim AS builder
WORKDIR /repo
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/platform ./apps/platform
COPY apps/marketing/package.json ./apps/marketing/package.json
COPY workers/operations/package.json ./workers/operations/package.json
RUN npm ci --workspace=@gen-z/platform --include-workspace-root --no-audit --no-fund
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build:packages && npm run build --workspace=@gen-z/platform

FROM node:24.11.0-bookworm-slim AS runner
WORKDIR /app
LABEL org.opencontainers.image.title="Gen-Z Platform"
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /repo/apps/platform/.next/standalone ./
COPY --from=builder --chown=node:node /repo/apps/platform/.next/static ./apps/platform/.next/static
COPY --from=builder --chown=node:node /repo/apps/platform/public ./apps/platform/public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["node", "apps/platform/server.js"]

# Stage 1: Development
FROM node:21.7.3-alpine AS development
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"

RUN corepack enable

USER node

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node tsconfig*.json ./

RUN pnpm install

COPY --chown=node:node src/ src/
COPY --chown=node:node public/ public/

CMD [ "pnpm", "run", "start:dev" ]

# Stage 2: Build
FROM node:21.7.3-alpine AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"

RUN corepack enable

USER node

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node src/ src/
COPY --chown=node:node --from=development /app/node_modules node_modules/

RUN pnpm run build

ENV NODE_ENV production

RUN pnpm install --prod

# Stage 3: Production
FROM gcr.io/distroless/nodejs22-debian12
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"

USER nonroot

ENV NODE_ENV production

WORKDIR /app

COPY --chown=nonroot:nonroot package.json ./
COPY --chown=nonroot:nonroot public/ public/
COPY --chown=nonroot:nonroot --from=build /app/node_modules node_modules/
COPY --chown=nonroot:nonroot --from=build /app/dist dist/

CMD ["dist/main.js"]
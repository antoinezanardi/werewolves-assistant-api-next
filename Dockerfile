FROM node:21-alpine AS development

USER node

WORKDIR /app

COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node package*.json ./

RUN npm ci --ignore-scripts

COPY --chown=node:node src/ src/
COPY --chown=node:node public/ public/

CMD [ "npm", "run", "start:dev" ]

FROM node:21-alpine AS build

USER node

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node src/ src/
COPY --chown=node:node --from=development /app/node_modules node_modules/

RUN npm run build

ENV NODE_ENV production

RUN npm ci --omit=dev --ignore-scripts
RUN npm cache clean --force

FROM node:21-alpine AS production

USER node

ENV NODE_ENV production

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node public/ public/
COPY --chown=node:node --from=build /app/node_modules node_modules/
COPY --chown=node:node --from=build /app/dist dist/

CMD [ "npm", "run", "start:prod" ]
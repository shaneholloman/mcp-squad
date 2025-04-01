FROM node:22.12-alpine AS builder

WORKDIR /app

COPY . /app
COPY tsconfig.json /tsconfig.json

RUN --mount=type=cache,target=/root/.yarn yarn install

RUN --mount=type=cache,target=/root/.yarn yarn build


FROM node:22-alpine AS release

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock

ENV NODE_ENV=production

RUN yarn install --production --frozen-lockfile

ENTRYPOINT ["node", "/app/dist/index.js"]
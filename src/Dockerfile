FROM node:18-alpine as base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD ["pnpm", "run", "dev"]

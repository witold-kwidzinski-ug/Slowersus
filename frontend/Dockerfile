FROM node:24-alpine AS deps

WORKDIR /deps

COPY package*.json ./

RUN npm ci



FROM node:24-alpine AS build

WORKDIR /app

COPY --from=deps /deps/node_modules ./node_modules

COPY . .

RUN npm run build



FROM nginx:alpine AS production

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s \
    CMD wget -qO- http://localhost/ || exit 1


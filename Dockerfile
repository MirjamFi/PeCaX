FROM node:10.24.1 AS BUILD_IMAGE

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine
WORKDIR /app

ENV NODE_ENV=production
ADD package.json ./
ADD nuxt.config.js ./

COPY --from=BUILD_IMAGE /app/.nuxt ./.nuxt
COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/static ./static

ENV HOST 0.0.0.0
ENV NUXT_PORT=3030
EXPOSE 3030
CMD ["npm", "start"]
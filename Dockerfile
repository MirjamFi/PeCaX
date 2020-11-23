FROM node:14.15.1


RUN mkdir -p /app
COPY . /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

ENV NODE_ENV=development

COPY . /app
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3030
CMD ["npm", "start"]
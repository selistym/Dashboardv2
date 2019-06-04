FROM node:dubnium

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production=true

COPY src ./src

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]

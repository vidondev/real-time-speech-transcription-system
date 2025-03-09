FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn db:generate
RUN yarn db:push
RUN yarn build

EXPOSE 3001

CMD ["node", "dist/main"]
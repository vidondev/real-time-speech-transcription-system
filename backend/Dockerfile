FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn db:generate
RUN yarn build

EXPOSE 3001

# CMD ["node", "dist/main"]
CMD ["sh", "-c", "yarn db:migrate:deploy && yarn start:prod"]


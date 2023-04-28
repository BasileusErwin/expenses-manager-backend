FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . /app

ENV PORT 3000

EXPOSE 3000

RUN npm run build

CMD [ "npm", "start" ]

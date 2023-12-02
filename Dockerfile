FROM node:18.18.0-alpine3.15 as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]


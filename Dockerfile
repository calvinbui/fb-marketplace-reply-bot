FROM node:14.5.0-alpine
WORKDIR /replybot
COPY package*.json ./
RUN apk add --no-cache git
RUN npm install -g --production
COPY . .
CMD ["node", "index.js"]

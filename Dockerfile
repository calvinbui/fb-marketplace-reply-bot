FROM node:v14.5.0-alpine
WORKDIR /replybot
COPY package*.json ./
RUN npm install -g --production
COPY . .
CMD ["node", "index.js"]

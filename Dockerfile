FROM node:22

WORKDIR /usr/src/bot

COPY package*.json ./

RUN npm install

COPY . .

HEALTHCHECK --interval=15m --timeout=5s \
  CMD curl -f http://localhost:8001 || exit 1

CMD ["npm", "start"]
FROM node:20

WORKDIR D:/CIVIL_PROTECTION

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "server.js" ]
FROM node:14

WORKDIR /user/src/app

COPY pckage*.json app.js ./

RUN npm install

EXPOSE 3030

CMD ["node", "app.js"]
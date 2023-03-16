FROM node:8
ENV PORT_VAL=3333
ENV NAME = vw-srv-0001
ENV PASSWORD = Apple#123
ENV  PORT = 6603
ENV SERVEURl = http://localhost:4545

WORKDIR /index

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["node", "index.js"]

FROM node

WORKDIR /app

COPY . .

RUN npm install -g typescript

RUN npm install

EXPOSE 3000

VOLUME [ "/app" ]

CMD ["node" , "/app/src/server.js"]
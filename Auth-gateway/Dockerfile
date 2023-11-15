FROM node

WORKDIR /c/Users/ABDUL RAZZAK/Desktop/node-backend/containerized-microservices-using-node/Auth-gateway

ENV NODE_ENV=production

COPY . .

RUN npm ci

# run sequelize commands
RUN cd src && npx sequelize db:create
RUN cd src && npx sequelize db:migrate

CMD ["npm","run","dev"]
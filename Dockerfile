# Production environment image for north2south

FROM node:6.10.3

RUN mkdir -p /home/node/app/aurelia-app
WORKDIR /home/node/app

COPY package.json .
RUN npm install --production

COPY aurelia-app/package.json aurelia-app/
RUN cd aurelia-app && npm install --production && cd ..

COPY . .

RUN npm run build:au -- --env prod

# Note that the image won't run with production keys
# Use docker-compose which uses env-file when running locally
ENV NODE_ENV=production JWT_SECRET=jwt_secret MASTER_KEY=masterKey

ENTRYPOINT ["npm"]
CMD ["start"]
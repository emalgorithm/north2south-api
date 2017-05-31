# Production environment image for north2south

FROM node:6.10.3

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json .
RUN npm install --production
COPY . .

ENTRYPOINT ["npm"]
CMD ["run", "web"]
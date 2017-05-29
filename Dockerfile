FROM node:6.10.3

RUN useradd -m app
#USER app

RUN mkdir /app
WORKDIR /app

COPY package.json /app

RUN npm install
RUN npm install -g yo
RUN npm install -g generator-rest
EXPOSE 9000

CMD npm run dev

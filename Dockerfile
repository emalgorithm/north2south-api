FROM node:6.10.3
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
EXPOSE 9000
CMD npm run dev
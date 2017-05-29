FROM node:6.10.3

RUN useradd --create-home --user-group app

ENV HOME=/home/app

RUN mkdir $HOME/north2south
COPY package.json $HOME/north2south
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/north2south

RUN npm install
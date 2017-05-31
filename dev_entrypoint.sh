#!/bin/bash

cd aurelia-app
npm install
au run --watch &

cd ..
npm run dev
#!/bin/bash

cd aurelia-app
au run --env development --watch &

cd ..
npm run dev
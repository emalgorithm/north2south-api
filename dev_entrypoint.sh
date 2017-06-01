#!/bin/bash

cd aurelia-app
au run --env dev --watch &

cd ..
npm run dev
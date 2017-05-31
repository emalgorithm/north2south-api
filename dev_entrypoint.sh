#!/bin/bash

cd aurelia-app
au install
au run --watch &

cd ..
npm run dev
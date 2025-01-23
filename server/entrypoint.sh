#!/bin/sh

npm run migrate:prod
node dist/index.js

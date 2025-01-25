#!/bin/sh

npm run prisma:generate
npm run migrate:prod
node dist/index.js

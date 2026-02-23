FROM node:22-alpine

WORKDIR /workspace

COPY package.json ./
COPY apps/lumen/package.json ./apps/lumen/package.json
COPY server/package.json ./server/package.json
COPY packages/protocol/package.json ./packages/protocol/package.json

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev:server"]

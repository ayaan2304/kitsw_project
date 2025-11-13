FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ .
RUN npm run build

FROM node:22-alpine AS server-deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm install --production

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=server-deps /app/server node-server
COPY server/src node-server/src
COPY server/scripts node-server/scripts
COPY server/package.json node-server/package.json
COPY --from=client-build /app/client/dist client/dist
COPY server/public node-server/public
COPY server/data node-server/data

WORKDIR /app/node-server
EXPOSE 4000
CMD ["node", "src/index.js"]


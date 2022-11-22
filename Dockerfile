FROM node:18.12.0 as node-frontend-build

WORKDIR /build

COPY frontend/game/src ./src
COPY frontend/game/webpack ./webpack
COPY frontend/game/.babelrc .
COPY frontend/game/index.html .
COPY frontend/game/package.json .
COPY frontend/game/tsconfig.json .

RUN npm i
RUN npm run build

FROM node:18.12.0 as node-backend-build

WORKDIR /build

COPY backend/*.js .
COPY backend/index.html .
COPY backend/.env .
COPY backend/package.json .

RUN npm i

FROM node:18.12.0 as grap-form-back

WORKDIR /app

COPY --from=node-frontend-build /build/webpack/dist front
COPY --from=node-backend-build /build back

WORKDIR /app/back

EXPOSE 3000

CMD npm start

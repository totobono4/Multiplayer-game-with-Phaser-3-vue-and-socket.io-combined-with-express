FROM node:18.12.0 as node-frontend-build

WORKDIR /build

COPY frontend/src ./src
COPY frontend/webpack ./webpack
COPY frontend/.babelrc .
COPY frontend/index.html .
COPY frontend/package.json .
COPY frontend/tsconfig.json .

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

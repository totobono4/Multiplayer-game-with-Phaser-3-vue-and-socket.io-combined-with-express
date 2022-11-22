FROM node:18.12.0 as node-backend-build

WORKDIR /build

COPY *.js .
COPY index.html .
COPY .env .
COPY package.json .

RUN npm i

FROM node:18.12.0 as grap-form-back

WORKDIR /backend

COPY --from=node-backend-build /build .

EXPOSE 3000

CMD npm start

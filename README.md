# NodeProject

## Docker

### Dev

```docker
docker rmi grap-form-dev
docker build -f Dockerfile.dev -t grap-form-dev .
docker run -it --rm --mount type=bind,source="$(pwd)"/backend,target=/back --publish 3000:3000 --name grap-form-dev grap-form-dev
```

### Prod

```docker
docker rmi grap-form-prod
docker build -f Dockerfile.prod -t grap-form-prod .
docker run -it --rm --publish 3000:3000 --name grap-form-prod grap-form-prod
```

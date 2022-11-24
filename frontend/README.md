# Grap-Form UI

## Env
For environment variables, make sure to add the `.env.development.local` for development build and `.env.production.local` for production build.

### Env variables
The variable `VITE_SOCKET_PORT` is required and has to be a number.  
The variable `VITE_SOCKET_HOST` is optional, if not declared app will take the page host as a socket host.

### Examples

Example develoment env file `.env.development.local`
```c#
VITE_SOCKET_HOST="10.3.2.10"
VITE_SOCKET_PORT=3000
```

Example production env file `.env.production.local`
```c#
```

---

## Start project
### Development mode
To start project in development mode, use the following command
```
npm run dev
```
### Production mode
To build project for production, use the following command
```
npm run build
```

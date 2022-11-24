/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SOCKET_HOST: string
    readonly VITE_SOCKET_PORT: number
// more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
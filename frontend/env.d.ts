/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SOCKET_HOST: string
    readonly VITE_SOCKET_PORT: number
    readonly VITE_DEBUG_MODE: boolean
// more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
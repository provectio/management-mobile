/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NETW_API_BASE_URL: string
  readonly VITE_NETW_CLIENT_ID: string
  readonly VITE_NETW_CLIENT_SECRET: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

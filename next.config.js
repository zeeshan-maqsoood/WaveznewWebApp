const webpack = require('webpack')

const {parsed: myEnv} = require('dotenv').config()

module.exports = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en'
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv))
    return config
  },
  env: {
    apiBaseUrl: process.env.API_BASE_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    googleAnalyticsID: process.env.NEXT_PUBLIC_GA_ID,
    googleAnalyticsClientID: process.env.CLIENT_ID,
    sessionStorageSecretKey: process.env.SESSION_STORAGE_SECRET_KEY,
    socketBackendUrl: process.env.SOCKET_BACKEND_URL,
    verificationUrl: process.env.VERIFICATION_URL,
    cryptoCipher: process.env.CRYPTO_CIPHER,
    backendSocketSecretKey: process.env.BACKEND_SOCKET_SECRET_KEY,
    appId: process.env.APP_ID,
    safariWebId: process.env.SAFARI_WEB_ID
  }
}

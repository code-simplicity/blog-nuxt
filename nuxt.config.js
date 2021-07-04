export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'sobblognuxt',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon-head.ico'}
    ],
    //集成百度统计
    script: [
      {
        src: 'https://hm.baidu.com/hm.js?be13a00e53c923291aa53b5ac4c7f653'
        // src: 'https://hm.baidu.com/hm.js?be13a00e53c923291aa53b5ac4c7f653'
      },
    ],
    __dangerouslyDisableSanitizers: ['script']
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/icons/iconfont.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '@/plugins/baiduHm.js', /*百度统计*/
      ssr: true
    },

    {
      src: '@/plugins/element-ui',
      ssr: true
    },
    {
      src: '@/plugins/dateformat',
      ssr: true
    },
    {
      src: '@/plugins/word-cloud',
      ssr: false
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: {
    '/portal': {
      target: 'http://localhost:8080',
    },
    // '/shop': {
    //   target: 'https://api.sunofbeach.net/',
    // },
    '/user/': {
      target: 'http://localhost:8080',
    },
    // '/images/': {
    //   target: 'https://cdn.sunofbeaches.com',
    // }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
}

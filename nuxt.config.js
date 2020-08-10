import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package'
import fs from 'fs'
import path from 'path'


//import { readFileSync } from 'fs'
//import { GuessPlugin } from 'guess-webpack'

export default {
  server: {
    port: 3030, 
  },

  mode: 'spa',

  hooks: {
    build: {
      done (builder) {
        const extraFilePath = path.join(builder.nuxt.options.buildDir, 'extra-file')
        fs.writeFileSync(extraFilePath, 'Something extra')
      }
    }
  },

  /*
  ** Headers of the page
  */
  head: {
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: pkg.description}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#fff'},

  /*
  ** Global CSS
  */
  css: [
    '~/static/styling.css'

  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    //'@/plugins/vuetify'
    '@/plugins/plugins.js'
  ],

  buildModules: [
    // Simple usage
    '@nuxtjs/vuetify',

    // With options
    ['@nuxtjs/vuetify', { /* module options */}]
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '~/node_modules/bootstrap-vue/nuxt',
  ],

  /*
  ** Axios module configuration
  */
axios: {
  proxy: true
},

proxy: {
  '/sbml4j/': { target: 'http://localhost:8080/sbml4j/', pathRewrite: {'^/sbml4j/': ''}, changeOrigin: true }
},

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx ) {

        config.node = {
          fs: 'empty',
          child_process: 'empty',
        }

      }


    }
 // },
}

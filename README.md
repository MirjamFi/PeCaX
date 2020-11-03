# ClinVAP report and networks

## Build Setup

``` bash
# install nuxtjs
$ npm install nuxt
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```
If you have a local instance of SBML4J running, change the proxy target in nuxt.config.js to your url:

<pre>
proxy: {
  '/sbml4j/': { target: '<b>http://abidocker:48080/sbml4j/</b>', pathRewrite: {'^/sbml4j/': ''}, changeOrigin: true }
}
</pre>
For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

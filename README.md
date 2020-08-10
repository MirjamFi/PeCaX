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

## Current status 

### 04.12.2019

The clinVar report can be displayed from index.vue
In reference part, each reference can be displayed individually from the web browser.

### 27.02.2020
The user uploads a ClinVAP .json-file and the report is displayed on the index page.
Click on a gene opens a new tab showing the specific up/downstream network from SBML4j (runnning on abidocker!)
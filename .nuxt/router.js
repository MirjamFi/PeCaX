import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1074da55 = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _6db72530 = () => interopDefault(import('../pages/contact.vue' /* webpackChunkName: "pages/contact" */))
const _0c784f34 = () => interopDefault(import('../pages/datenschutzerklarung.vue' /* webpackChunkName: "pages/datenschutzerklarung" */))
const _6a2ae9fc = () => interopDefault(import('../pages/documentation.vue' /* webpackChunkName: "pages/documentation" */))
const _70ab68d1 = () => interopDefault(import('../pages/imprint.vue' /* webpackChunkName: "pages/imprint" */))
const _302cb51a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/about",
    component: _1074da55,
    name: "about"
  }, {
    path: "/contact",
    component: _6db72530,
    name: "contact"
  }, {
    path: "/datenschutzerklarung",
    component: _0c784f34,
    name: "datenschutzerklarung"
  }, {
    path: "/documentation",
    component: _6a2ae9fc,
    name: "documentation"
  }, {
    path: "/imprint",
    component: _70ab68d1,
    name: "imprint"
  }, {
    path: "/",
    component: _302cb51a,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}

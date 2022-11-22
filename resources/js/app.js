require('./bootstrap');

import Vue from "vue"
import VueRouter from "vue-router";
import router from "./routes";

Vue.use(VueRouter);

window.Vue = require('vue').default;

const files = require.context('./', true, /\.vue$/i)
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

const app = new Vue({
    el: '#app',
    router
});

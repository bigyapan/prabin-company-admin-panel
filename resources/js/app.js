require('./bootstrap');

import Vue from "vue"
import VueRouter from "vue-router";
import router from "./routes";
import vuetify from "./plugins/vuetify";
import store from "./store";
import i18n from "./plugins/i18n"
import VueCookies from 'vue-cookies'
import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);
Vue.use(VueCookies, {expires: '7d'})
Vue.use(VueRouter);

window.Vue = require('vue').default;

const files = require.context('./', true, /\.vue$/i)
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

const app = new Vue({
    el: '#app',
    router,
    vuetify,
    i18n,
    store
});

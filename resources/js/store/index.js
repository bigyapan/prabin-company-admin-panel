import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import auth from './auth'
import brands from './brands'
import contacts from './contacts'
import quotes from './quotes'
import incoterms from './incoterms'
import containers from './containers'
import packagings from './packagings'
import Swal from 'sweetalert2'
Vue.use(Vuex)

const vuexLocalStorage = new VuexPersistence({
    key: "vuex",
    storage: window.localStorage
})

export default new Vuex.Store({
    modules:{
        auth,
        brands,
        contacts,
        quotes,
        incoterms,
        containers,
        packagings
    },
    state: {
    },
    mutations: {},
    actions: {
        showSweetAlert({ commit }, options) {
            Swal.fire(options)
        }
    },
    getters: {},
    plugins: [vuexLocalStorage.plugin]
})

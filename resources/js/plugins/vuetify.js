import Vue from 'vue'
import Vuetify from 'vuetify'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'fa',
    },
    theme: {
        themes: {
            light: {
                primary: '#263238',
                secondary: '#FF9800',
                accent: '#F5F5F5',
                error: '#b71c1c',
            },
            dark: {
                primary: '#263238',
                secondary: '#FF9800',
                accent: '#F5F5F5',
                error: '#b71c1c',
            }
        },
    },
})

import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);
export default new VueI18n({
    strategy: 'prefix_except_default',
    /* module options */
    locales: [
        {
            code: 'en',
            file: 'en.json'
        },
        {
            code: 'ru',
            file: 'ru.json'
        }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'ru',
    vueI18n: {
        fallbackLocale: 'en',
    },
});

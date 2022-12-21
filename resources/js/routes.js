import VueRouter from "vue-router";
import store from './store'
import App from "./App.vue";
import Dashboard from "./pages/Dashboard.vue";
import Login from "./pages/Login.vue";
import GRMContacts from "./pages/GRMContacts/index.vue";
import GRMQuotations from "./pages/GRMQuotations/index.vue";
import Settings from "./pages/Settings.vue";

const routes = [
    {
        path: "/",
        component: App,
        meta: {requiresAuth: true},
        children: [
            {
                path: "",
                name: "Dashboard",
                component: Dashboard,
                meta: {requiresAuth: true}
            },
            {
                path: "/grm-contacts",
                name: "GRMContacts",
                component: GRMContacts,
                meta: {requiresAuth: true}
            },
            {
                path: "/grm-quotations",
                name: "GRMQuotations",
                component: GRMQuotations,
                meta: {requiresAuth: true}
            },
            {
                path: "/settings",
                name: "Settings",
                component: Settings,
                meta: {requiresAuth: true}
            },
        ],
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    }
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    // you could define your own authentication logic with token
    let isAuthenticated = !!$cookies.get('accessToken')

    // check route meta if it requires auth or not
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({
                path: '/login',
                params: {nextUrl: to.fullPath}
            })
        } else {
            next()
        }
    } else {
        if (to.path.includes('login')) {
            if (isAuthenticated) {
                next({
                    path: '/',
                    params: {nextUrl: to.fullPath}
                })
            }else{
                next()
            }
        } else {
            next()
        }
    }
})

export default router;

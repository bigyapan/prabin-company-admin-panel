import VueRouter from "vue-router";
import App from "./App.vue";
import Dashboard from "./pages/Dashboard.vue";
import Login from "./pages/Login.vue";
import GrmContacts from "./pages/GrmContacts";
import GrmQuotations from "./pages/GrmQuotations";
import Settings from "./pages/Settings";
import GrmBrands from "./pages/GrmBrands";
import GrmContainers from "./pages/GrmContainers";
import GrmIncoterms from "./pages/GrmIncoterms";
import GrmPackagings from "./pages/GrmPackagings";

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
                name: "GrmContacts",
                component: GrmContacts,
                meta: {requiresAuth: true}
            },
            {
                path: "/grm-quotations",
                name: "GrmQuotations",
                component: GrmQuotations,
                meta: {requiresAuth: true}
            },
            {
                path: "/settings",
                name: "Settings",
                component: Settings,
                meta: {requiresAuth: true}
            },
            {
                path: "/grm-brands",
                name: "GrmBrands",
                component: GrmBrands,
                meta: {requiresAuth: true}
            },
            {
                path: "/grm-containers",
                name: "GrmContainers",
                component: GrmContainers,
                meta: {requiresAuth: true}
            },
            {
                path: "/grm-incoterms",
                name: "GrmIncoterms",
                component: GrmIncoterms,
                meta: {requiresAuth: true}
            },
            {
                path: "/grm-packagings",
                name: "GrmPackagings",
                component: GrmPackagings,
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
            } else {
                next()
            }
        } else {
            next()
        }
    }
})

export default router;

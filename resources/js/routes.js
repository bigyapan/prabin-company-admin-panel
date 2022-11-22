import VueRouter from "vue-router";
import App from "./App.vue";
import Dashboard from "./components/Dashboard.vue";

const routes = [
    {
        path: "/",
        name: "App",
        component: App,
        children: [
            {
                path: "",
                name: "Dashboard",
                component: Dashboard
            }
        ]
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

export default router;

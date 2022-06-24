import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import Home from "../views/Home.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/pet/:type',
        name: 'Home',
        component: Home
    }
]
const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router
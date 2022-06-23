import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import Home from "../views/Home.vue";
import Detail from "../views/Detail.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/detail/:id',
        name: 'Detail',
        component: Detail
    }
]
const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router
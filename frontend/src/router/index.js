import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
/*eslint-disable*/

Vue.use(VueRouter)

const routes = [
    // {
    //     path: '/home',
    //     name: 'home',
    //     component: Home,
    // },
    {
        path: '/',
        name: 'Login',
        component: Login,
        alias: '/login'
    },
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router

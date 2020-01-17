import Vue from 'vue'
import VueRouter from 'vue-router'
import Players from '@/views/Players.vue';
import GameConfig from '@/views/GameConfig.vue';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/players'
    },
    {
        path: '/players',
        name: 'players',
        component: Players
    },
    {
        path: '/game-config',
        name: 'game-config',
        component: GameConfig
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

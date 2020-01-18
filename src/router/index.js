import Vue from 'vue'
import VueRouter from 'vue-router'
import Players from '@/views/Players.vue';
import GameConfig from '@/views/GameConfig.vue';
import Game from '@/views/Game.vue';
import Results from '@/views/Results.vue';
import GameResults from '@/views/GameResults.vue';

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
    },
    {
        path: '/game/:id',
        name: 'game',
        component: Game
    },
    {
        path: '/results',
        name: 'results',
        component: Results
    },
    {
        path: '/game/:id/results',
        name: 'game-results',
        component: GameResults
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

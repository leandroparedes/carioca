import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SetupPlayers from '../views/setup/Players.vue';
import SetupGames from '../views/setup/Games.vue';

Vue.use(VueRouter);

const routes = [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/setup/players',
      name: 'setup-players',
      component: SetupPlayers
    },
    {
      path: '/setup/games',
      name: 'setup-games',
      component: SetupGames
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;

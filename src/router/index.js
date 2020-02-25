import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SetupPlayers from '../views/setup/Players.vue';
import SetupGames from '../views/setup/Games.vue';
import Preparation from '../views/Preparation.vue';
import Game from '../views/Game.vue';
import GameResult from '../views/GameResult.vue';
import Results from '../views/Results.vue';
import Admin from '../views/Admin.vue';
import Auth from '../views/Auth.vue';

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
    },
    {
      path: '/preparation',
      name: 'preparation',
      component: Preparation
    },
    {
      path: '/game/:id',
      name: 'game',
      component: Game
    },
    {
      path: '/game/:id/results',
      name: 'game-result',
      component: GameResult
    },
    {
      path: '/results',
      name: 'results',
      component: Results
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    const store = require('@/store').default;
    const router = require('@/router').default;

    window.scrollTo(0, 0);

    if (store.state.globalStatus.gameOver && to.path != '/results') {
        router.push('/results');
    } else {
        next();
    }
});

export default router;

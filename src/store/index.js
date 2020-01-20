import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        globalStatus: {
            gameInit: false,
            playersSetupCompleted: false,
            gamesSetupCompleted: false,
        },
        players: [],
        games: [],
    },
    mutations: {
        game_init (state) {
            state.globalStatus.gameInit = true;
        },
        set_player (state, player) {
            state.players.push(player);
        },
        players_setup_complete (state) {
            state.globalStatus.playersSetupCompleted = true;
        },
        set_game (state, game) {
            state.games.push(game);
        },
        games_setup_complete (state) {
            state.globalStatus.gamesSetupCompleted = true;
        }
    },
    actions: {
        set_players ({commit}, players) {
            players.forEach(player => {
                commit('set_player', player);
            });
        },
        set_games ({commit}, games) {
            games.forEach(game => {
                commit('set_game', game);
            });
        }
    },
    modules: {
    }
});

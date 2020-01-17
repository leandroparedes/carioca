import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        players: [],
        games: []
    },
    mutations: {
        reset (state) {
            state.players = [];
            state.games = [];
        },
        add_players (state, players) {
            players.map(player => {
                state.players.push(player);
            })
        },
        add_games (state, games) {
            games.map(game => {
                state.games.push(game);
            });
        }
    },
    actions: {
    },
    modules: {
    }
})

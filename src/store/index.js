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
        },
        set_left_time (state, data) {
            let currentPlayer = state.players.find(player => player.pos == data.pos);
            currentPlayer.leftTime = data.leftTime;
        },
        out_player (state, pos) {
            let currentPlayer = state.players.find(player => player.pos == pos);
            currentPlayer.status = 'out';

            // re arrange positions
        }
    },
    actions: {
    },
    getters: {
        gameById: (state) => (id) => {
            return state.games.find(game => game.id == id);
        },
        playerByPos: (state) => (pos) => {
            return state.players.find(player => player.pos == pos && player.status != 'out')
        },
        playersLength: (state) => {
            return state.players.filter(player => player.status != 'out').length;
        }
    },
    modules: {
    }
})

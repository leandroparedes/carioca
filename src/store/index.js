import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        players: [],
        games: [],
        results: []
    },
    mutations: {
        reset (state) {
            state.players = [];
            state.games = [];
            state.results = [];
        },
        add_players (state, players) {
            players.map(player => {
                state.players.push(player);
            });
        },
        add_games (state, games) {
            games.map(game => {
                state.games.push(game);
            });
        },
        set_timer (state, data) {
            let player = state.players.find(player => player.id == data.playerId);
            player.timeLeft = data.timeLeft;
        },
        save_result(state, data) {
            state.results.push(data);
        }
    },
    getters: {
        gameById: (state) => (id) => {
            return state.games.find(game => game.id == id);
        },
        playerById: (state) => (id) => {
            return state.players.find(player => player.id == id);
        },
        nextPlayer: (state) => (id) => {
            let validPlayers = state.players.filter(player => player.timeLeft > 0);

            let index = validPlayers.indexOf(state.players.find(player => player.id == id));

            if (index == -1 || index >= validPlayers.length - 1) {
                index = -1;
            }

            return validPlayers[index + 1];
        },
        playersLeft: (state) => {
            return state.players.filter(player => player.timeLeft > 0).length
        },
        otherPlayers: (state) => (id) => {
            return state.players.filter(player => player.id != id);
        },
        allPlayers: (state) => {
            return state.players;
        }
    },
    actions: {
        save_results ({commit, getters}, data) {
            var game = getters.gameById(data.gameId).name;

            var result = {
                game: game,
                players: []
            };

            for (const [key, value] of Object.entries(data.results)) {
                var player = getters.playerById(key).name;
                result.players.push({ player, value });
            }

            commit('save_result', result);
        },
        set_timers({ commit, getters }, gameSecs) {
            getters.allPlayers.map(player => {
                commit('set_timer', {
                    playerId: player.id,
                    timeLeft: gameSecs
                });
            });
        }
    },
    modules: {
    }
})

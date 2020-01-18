import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        players: [],
        games: [],
        results: [],
        current_game: null,
        current_player: null
    },
    mutations: {
        reset (state) {
            state.players = [];
            state.games = [];
            state.results = [];
            state.current_game = null;
            state.current_player = null;
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
        save_result (state, data) {
            state.results.push(data);
        },
        save_current_game (state, game) {
            state.current_game = game;
        },
        save_current_player (state, player) {
            state.current_player = player;
        },
        clear (state) {
            state.current_game = null;
            state.current_player = null;

            state.players.map(player => {
                player.timeLeft = null
            });
        },
        set_player_score (state, data) {
            let player = state.players.find(player => player.id == data.playerId);
            player.score = player.score + parseInt(data.score);
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
        },
        playerLowerScore: (state) => {
            return state.players.reduce(function(prev, curr) {
                return prev.score < curr.score ? prev : curr;
            });
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
                var player = getters.playerById(key);
                var playerName = player.name;

                result.players.push({ name: playerName, value });

                commit('set_player_score', {
                    playerId: player.id,
                    score: value
                });
            }

            commit('save_result', result);
        },
        set_timers({ commit, getters }, gameSecs) {
            getters.allPlayers.map(player => {
                commit('set_timer', {
                    playerId: player.id,
                    timeLeft: player.timeLeft != null ? player.timeLeft : gameSecs
                });
            });
        },
        current_game ({ commit, getters }, gameId) {
            const game = getters.gameById(gameId);
            commit('save_current_game', game);
        },
        current_player ({ commit, getters }, playerId) {
            const player = getters.playerById(playerId);
            commit('save_current_player', player);
        },
    },
    modules: {
    }
})

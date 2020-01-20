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
        currentGame: null,
        currentPlayer: null
    },
    mutations: {
        reset (state) {
            state.globalStatus.gameInit = false;
            state.globalStatus.playersSetupCompleted = false;
            state.globalStatus.gamesSetupCompleted = false;

            state.players = [];
            state.games = [];

            state.currentGame = null;
            state.currentPlayer = null;
        },
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
        },
        set_current_game (state, gameId) {
            state.currentGame = state.games.find(game => game.id == gameId);
        },
        set_current_player (state, playerId) {
            state.currentPlayer = state.players.find(player => player.id == playerId);
        },
        set_timer_for_player (state, data) {
            let player = state.players.find(player => player.id == data.playerId);
            player.timeLeft = data.time;
        }
    },
    actions: {
        set_players ({ commit }, players) {
            players.forEach(player => {
                commit('set_player', player);
            });
        },
        set_games ({ commit }, games) {
            games.forEach(game => {
                commit('set_game', game);
            });
        },
        set_timers ({ commit, state }, gameTime) {
            state.players.forEach(player => {
                commit('set_timer_for_player', {
                    playerId: player.id,
                    time: player.timeLeft || gameTime * 60
                });
            });
        }
    },
    modules: {
    }
});

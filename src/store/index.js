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
            gameOver: false
        },
        players: [],
        games: [],
        currentGameId: null,
        currentPlayerId: null,
        rotatingPlayerId: null,
        results: []
    },
    mutations: {
        reset (state) {
            state.globalStatus.gameInit = false;
            state.globalStatus.playersSetupCompleted = false;
            state.globalStatus.gamesSetupCompleted = false;
            state.globalStatus.gameOver = false;

            state.players = [];
            state.games = [];

            state.currentGameId = null;
            state.currentPlayerId = null;

            state.rotatingPlayerId = null;

            state.results = [];
        },
        game_init (state) {
            state.globalStatus.gameInit = true;
        },
        game_over (state) {
            state.globalStatus.gameOver = true;
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
            state.currentGameId = state.games.find(game => game.id == gameId).id;
        },
        set_current_player (state, playerId) {
            state.currentPlayerId = state.players.find(player => player.id == playerId).id;
        },
        set_rotating_player (state, playerId) {
            state.rotatingPlayerId = playerId;
        },
        set_timer_for_player (state, data) {
            let player = state.players.find(player => player.id == data.playerId);
            player.timeLeft = data.time;
        },
        set_player_score (state, data) {
            let player = state.players.find(player => player.id == data.playerId);
            let score = parseInt(data.score);

            player.score = player.score + score;

            if (score <= 0) {
                player.gamesWon = player.gamesWon + 1;
            }
        },
        save_result (state, result) {
            state.results.push(result);
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
                    time: player.timeLeft != null && player.timeLeft >= 0 ? player.timeLeft : gameTime * 60
                });
            });
        },
        clear_timers ({ commit, state }) {
            state.players.forEach(player => {
                commit('set_timer_for_player', {
                    playerId: player.id,
                    time: null
                });
            });
        },
        save_result ({ commit, getters }, result) {
            const game = getters.gameById(result.gameId);

            var finalResult = {
                game: game,
                scores: []
            };

            for (const [key, value] of Object.entries(result.scores)) {
                var player = getters.playerById(key);

                finalResult.scores.push({
                    player: player.name,
                    score: value
                });

                commit('set_player_score', {
                    playerId: player.id,
                    score: value
                });
            }

            commit('save_result', finalResult);
        }
    },
    getters: {
        gameById: (state) => (id) => {
            return state.games.find(game => game.id == id);
        },
        playerById: (state) => (id) => {
            return state.players.find(player => player.id == id);
        },
        nextPlayerAfter: (state) => (playerId) => {
            let playersWithTimeLeft = state.players.filter(player => player.timeLeft > 0);

            let index = playersWithTimeLeft.indexOf(state.players.find(player => player.id == playerId));

            if (index == -1 || index >= playersWithTimeLeft.length - 1) {
                index = -1;
            }

            return playersWithTimeLeft[index + 1];
        },
        playersLeftCount: (state) => {
            return state.players.filter(player => player.timeLeft > 0).length;
        },
        winner: (state) => {
            return state.players.filter(player => player.timeLeft > 0)[0];
        },
        winnerOfTheGame: (state) => {
            return state.players.filter(player => player.score <= 0)[0];
        }
    },
    modules: {
    }
});

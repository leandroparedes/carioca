import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        players: []
    },
    mutations: {
        add_players (state, players) {
            players.map(player => {
                state.players.push(player);
            })
        }
    },
    actions: {
    },
    modules: {
    }
})

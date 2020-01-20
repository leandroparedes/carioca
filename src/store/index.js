import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        globalStatus: {
            gameInit: false,
            playerSetupInit: false,
        },
    },
    mutations: {
        game_init (state) {
            state.globalStatus.gameInit = true;
        },
    },
    actions: {
    },
    modules: {
    }
});

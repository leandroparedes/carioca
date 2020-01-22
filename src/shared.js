export default {
    save: function () {
        const store = require('@/store').default;
        const router = require('@/router').default;

        const state = Object.assign({}, store.state);
        const path = router.currentRoute.path;

        localStorage.savegame = JSON.stringify({ state, path });
    }
};
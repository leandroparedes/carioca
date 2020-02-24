export default {
    save: function () {
        const store = require('@/store').default;
        const router = require('@/router').default;

        const state = Object.assign({}, store.state);
        const path = router.currentRoute.path;

        localStorage.savegame = JSON.stringify({ state, path });

        fetch('/save-game', {
            method: 'POST',
            body: JSON.stringify({ gameID: state.gameID, state, path}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            console.log('success');
        });
    }
};
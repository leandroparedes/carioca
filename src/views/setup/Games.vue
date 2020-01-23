<template>
    <div class="px-10 pb-10">
        <h1 class="heading text-center py-5">
            Juegos <span v-if="games.length">({{ games.length }})</span>
        </h1>

        <div class="mb-4 flex justify-center">
            <button class="btn btn-sm btn-green mr-2" @click="games.forEach(game => game.time++)"><font-awesome-icon icon="clock"/> +1</button>
            <button class="btn btn-sm btn-red ml-2" @click="games.forEach(game => game.time--)"><font-awesome-icon icon="clock"/> -1</button>
        </div>

        <div class="flex justify-between text-gray-400 mb-5">
            <div>Juego</div>
            <div>Minutos</div>
        </div>

       
        <div
            v-for="game in games" :key="game.id"
            class="flex justify-between mb-3 text-2xl font-semibold"
        >
            <div class="w-5/6">{{ game.name }}</div>

            <input
                type="number" min="1"
                v-model="game.time"
                class="w-1/6 px-2 py-1 text-gray-800 rounded text-center"
            >
        </div>

        <div class="flex my-10">
            <input
                type="text"
                class="mr-1 w-3/4 text-2xl text-gray-800 rounded px-2 py-1"
                v-model.trim="name"
                placeholder="Ej: 2 Trios"
            >

            <input
                type="text"
                class="mx-1 w-1/4 text-2xl text-gray-800 rounded px-2 py-1"
                v-model.trim="shortname"
                placeholder="2T"
            >

            <button
                class="w-1/6 ml-1 btn btn-md btn-blue"
                @click="add"
            >
                <font-awesome-icon icon="plus" />
            </button>
        </div>

        <div class="text-center">
            <button
                class="btn btn-lg btn-green"
                @click="next"
                :disabled="loading"
            >
                {{ loading ? 'Guardando' : 'Continuar' }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    beforeRouteEnter (to, from, next) {
        const store = require('@/store').default;
        const router = require('@/router').default;

        if (store.state.globalStatus.gamesSetupCompleted) {
            router.push('/preparation');
        } else {
            next();
        }
    },
    data: function () {
        return {
            name: '',
            shortname: '',
            games: [
                { id: 1, name: '2 Trios', shortname: '2T', time: 5 },
                { id: 2, name: '1 Trio 1 Escala', shortname: '1T 1E', time: 5 },
                { id: 3, name: '2 Escalas', shortname: '2E', time: 5 },
                { id: 4, name: '3 Trios', shortname: '3T', time: 5 },
                { id: 5, name: '2 Trios 1 Escala', shortname: '2T 1E', time: 5 },
                { id: 6, name: '2 Escalas 1 Trio', shortname: '2E 1T', time: 5 },
                { id: 7, name: '4 Trios', shortname: '4T', time: 5 },
                { id: 8, name: '3 Escalas', shortname: '3E', time: 5 },
                { id: 9, name: 'Escala sucia', shortname: 'ES', time: 5 },
                { id: 10, name: 'Escala real', shortname: 'ER', time: 5 },
            ],
            loading: false
        }
    },
    methods: {
        add: function () {
            if (this.name.length && this.shortname.length) {
                this.games.push({
                    id: this.games.length + 1,
                    name: this.name.charAt(0).toUpperCase() + this.name.slice(1),
                    shortname: this.shortname.toUpperCase(),
                    time: 5
                });
                
                this.name = '';
                this.shortname = '';
            }
        },
        next: function () {
            this.loading = true;
            this.$store.dispatch('set_games', this.games);
            this.$store.commit('games_setup_complete');

            this.$store.commit('set_current_game', 1);
            this.$store.commit('set_current_player', 1);

            this.$store.commit('set_rotating_player', 1);

            this.$store.commit('game_init');

            this.$router.push('/preparation');
        }
    }
}
</script>
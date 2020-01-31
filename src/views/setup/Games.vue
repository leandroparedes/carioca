<template>
    <div class="px-10 pb-10">
        <h1 class="heading text-center py-5">
            Juegos <span v-if="games.length">({{ games.length }})</span>
        </h1>

        <div class="mb-8 flex justify-center">
            <button class="btn btn-sm btn-green mr-2" @click="addTimeGlobal">
                <font-awesome-icon icon="clock"/> + 0:30
            </button>
            <button class="btn btn-sm btn-blue" @click="resetTimes">
                <font-awesome-icon icon="redo"/>
            </button>
            <button class="btn btn-sm btn-red ml-2" @click="substractTimeGlobal">
                <font-awesome-icon icon="clock"/> - 0:30
            </button>
        </div>

        <div
            v-for="game in games" :key="game.id"
            class="bg-gray-900 rounded shadow-lg p-3 flex justify-between mb-3 font-semibold"
        >
            <div class="w-5/6 text-xl">{{ game.name }}</div>

            <div class="flex">
                <button class="focus:outline-none text-red-500" @click="removeTime(game.id)">
                    <font-awesome-icon icon="minus"/>
                </button>

                <div class="text-xl mx-2">{{ game.time | formatTime }}</div>

                <button class="focus:outline-none text-green-500" @click="addTime(game.id)">
                    <font-awesome-icon icon="plus"/>
                </button>
            </div>
        </div>

        <div class="flex my-10">
            <input
                type="text"
                class="mr-1 w-3/4 input input-lg"
                v-model.trim="name"
                placeholder="Ej: 2 Trios"
            >

            <input
                type="text"
                class="mx-1 w-1/4 input input-lg"
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
                { id: 1, name: '2 Trios', shortname: '2T', time: 300 },
                { id: 2, name: '1 Trio 1 Escala', shortname: '1T 1E', time: 300 },
                { id: 3, name: '2 Escalas', shortname: '2E', time: 300 },
                { id: 4, name: '3 Trios', shortname: '3T', time: 300 },
                { id: 5, name: '2 Trios 1 Escala', shortname: '2T 1E', time: 300 },
                { id: 6, name: '2 Escalas 1 Trio', shortname: '2E 1T', time: 300 },
                { id: 7, name: '4 Trios', shortname: '4T', time: 300 },
                { id: 8, name: '3 Escalas', shortname: '3E', time: 300 },
                { id: 9, name: 'Escala sucia', shortname: 'ES', time: 300 },
                { id: 10, name: 'Escala real', shortname: 'ER', time: 300 },
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
                    time: 300
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
        },
        addTimeGlobal: function () {
            this.games.forEach(game => {
                game.time += 30;
            })
        },
        substractTimeGlobal: function () {
            this.games.forEach(game => {
                if (game.time > 30) {
                    game.time -= 30;
                }
            });
        },
        removeTime: function (gameID) {
            let game = this.games.find(game => game.id == gameID);
            if (game.time > 30) {
                game.time -= 30;
            }
        },
        addTime: function (gameID) {
            let game = this.games.find(game => game.id == gameID);
            game.time += 30;
        },
        resetTimes: function () {
            this.games.forEach(game => {
                game.time = 300;
            });
        }
    }
}
</script>
<template>
    <div class="px-10">
        <h1 class="text-blue-500 text-4xl font-semibold text-center py-5">
            Jugadores <span v-if="players.length">({{ players.length }})</span>
        </h1>

        <div
            v-if="!players.length"
            class="text-2xl font-thin text-center text-gray-400"
        >
            No hay jugadores registrados
        </div>
        <div
            v-else
            v-for="player in players" :key="player.id"
            class="text-3xl font-semibold"
        >
            {{ player.id }}. {{ player.name }}
        </div>

        <div class="flex mt-10">
            <input
                type="text" 
                ref="player"
                class="mr-1 w-5/6 text-2xl text-gray-800 rounded px-2 py-1"
                v-model="name"
                placeholder="Añade un nuevo jugador"
            >

            <button
                class="w-1/6 ml-1 bg-blue-500 text-xl text-white font-bold rounded"
                @click="add"
            >
                <font-awesome-icon icon="plus" />
            </button>
        </div>

        <div
            v-if="players.length >= 2"
            class="mt-10 text-center"
        >
            <button
                class="bg-green-500 text-white text-2xl font-bold px-3 py-1 rounded"
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

        if (store.state.globalStatus.playersSetupCompleted) {
            router.push('/setup/games');
        } else {
            next();
        }
    },
    data: function () {
        return {
            name: '',
            players: [],
            loading: false
        }
    },
    methods: {
        add: function () {
            if (this.name.length) {
                this.players.push({
                    id: this.players.length + 1,
                    name: this.name,
                    score: 0,
                    gamesWon: 0,
                    timeLeft: null
                });

                this.name = '';

                this.$nextTick(() => {
                    this.$refs.player.focus();
                });
            }
        },
        next: function () {
            this.loading = true;
            this.$store.dispatch('set_players', this.players);
            this.$store.commit('players_setup_complete');
            this.$router.push('/setup/games');
        }
    }
}
</script>

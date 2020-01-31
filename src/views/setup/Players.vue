<template>
    <div class="px-10">
        <h1 class="heading text-center py-5">
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
            v-for="(player, index) in players" :key="player.id"
            class="bg-gray-900 rounded shadow-lg p-3 mb-3 flex justify-between"
        >
            <div class="text-xl font-semibold">
                <span class="text-gray-500 text-sm mr-2">#{{ player.id }}</span> {{ player.name }}
            </div>

            <div class="flex">
                <span v-if="index == 0" class="flex rounded-full my-1 bg-green-500 uppercase text-xs font-bold p-1">Juega</span>

                <button class="text-red-500 ml-4 mr-2 text-xl focus:outline-none" @click="deletePlayer(player.id)">
                    <font-awesome-icon icon="times"/>
                </button>
            </div>
        </div>

        <div class="flex mt-10">
            <input
                type="text" 
                ref="player"
                class="mr-1 w-5/6 input input-lg"
                v-model="name"
                placeholder="Nuevo jugador"
            >

            <button
                class="w-1/6 ml-1 btn btn-md btn-blue"
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
        },
        deletePlayer: function (playerID) {
            this.players = this.players.filter(player => player.id != playerID);

            let count = 1;
            this.players.forEach(player => {
                player.id = count++;
            });
        }
    }
}
</script>

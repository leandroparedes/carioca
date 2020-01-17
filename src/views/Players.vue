<template>
    <div class="px-4">
        <h1 class="text-center text-6xl font-semibold mb-3">Jugadores</h1>

        <div v-if="players.length > 0" class="mb-5">
            <div v-for="(player, index) in players" :key="index" class="text-3xl font-semibold">
                {{index + 1}}. {{ player.name }}
            </div>
        </div>

        <div class="flex mb-5 -mx-2">
            <div class="w-2/3 px-2">
                <input type="text" v-model="player.name" class="text-gray-800 rounded text-2xl font-semibold p-2 w-full" ref="player">
            </div>
            <div class="w-1/3 px-2">
                <button
                    class="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none font-bold px-3 py-2 rounded text-2xl w-full"
                    @click="addPlayer"
                >
                    Add
                </button>
            </div>
        </div>

        <button
            class="bg-green-600 text-4xl rounded px-1 py-2 font-bold w-full text-white"
            v-if="players.length >= 2"
            @click="next"
            :disabled="loading"
        >
            {{ loading ? 'Guardando' : 'Continuar' }}
        </button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            player: {
                name: ''
            },
            players: [],
            loading: false
        }
    },
    methods: {
        addPlayer: function () {
            if (this.player.name.length > 0) {
                this.players.push({
                    name: this.player.name
                });
                this.player.name = '';
                this.$nextTick(() => this.$refs.player.focus());
            }
        },
        next: function () {
            if (this.players.length >= 2) {
                this.loading = true;
                this.$store.commit('add_players', this.players);
                this.$router.push('/game-config');
            }
        }
    }
}
</script>
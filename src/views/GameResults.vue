<template>
    <div class="min-h-screen">
        <button
            class="text-red-500 font-semibold px-2 pt-2 focus:outline-none"
            @click="cancel"
            v-if="$route.query.final == 'false'"
        >Cancelar</button>
        <div class="px-4">
            <h1 class="font-bold text-4xl text-center">Resultados</h1>
            <div v-for="player in $store.state.players" :key="player.id" class="flex -mx-2 mt-8">
                <div class="w-1/2 px-2 text-3xl text-center font-semibold">
                    {{ player.name }}
                </div>
                <div class="w-1/2 px-2">
                    <input
                        type="number" min="1" class="text-gray-800 rounded text-2xl font-semibold p-2 w-1/2"
                        v-model="results.players[player.id]"
                    >
                </div>
            </div>
            <button class="bg-green-500 text-white px-2 py-4 text-2xl rounded w-full mt-8 font-semibold" @click="save">Continuar a {{ game.id + 1 > $store.state.games.length ? 'Resultados' : $store.getters.gameById(game.id + 1).name }}</button>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            game: this.$store.state.current_game,
            playerId: this.$route.query.player,
            results: {
                players: {}
            }
        }
    },
    methods: {
        save: function () {
            if (Object.entries(this.results.players).length < this.$store.state.players.length) {
                return;
            }
            
            this.$store.dispatch('save_results', {
                results: this.results.players,
                gameId: this.game.id
            });

            let gameId = this.game.id + 1;
            let nextPlayerId = parseInt(this.playerId) + 1;

            if (nextPlayerId > this.$store.state.players.length) {
                nextPlayerId = 1;
            }

            this.$store.commit('clear');

            if (gameId <= this.$store.state.games.length) {
                this.$router.push({
                    path: '/preptime',
                    query: {
                        nextGame: gameId,
                        player: nextPlayerId
                    }
                });
            } else {
                window.location.href = `/results`;
            }
        },
        cancel: function () {
            this.$router.go(-1);
        }
    }
}
</script>
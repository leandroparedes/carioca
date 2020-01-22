<template>
    <div class="px-10 pb-10">
        <h1 class="text-center text-blue-500 text-4xl font-semibold pt-2 mb-2">
            Resultados
        </h1>

        <div class="text-center text-lg text-gray-400 font-semibold mb-10">
            Juego {{ currentGame.id }} &#183; <span class="text-green-500">{{ currentGame.name }}</span>
        </div>

        <div class="px-10">
            <div
                v-for="player in $store.state.players" :key="player.id"
                class="flex justify-between mb-3 text-2xl font-semibold mb-4"
            >
                <div class="w-4/6" :class="{'text-green-500': scores[player.name] < 1}">{{ player.name }}</div>

                <input
                    type="number" min="0"
                    v-model.number="scores[player.name]"
                    class="w-2/6 px-2 py-1 text-gray-800 rounded text-center"
                >
            </div>
        </div>

        <div class="flex flex-col mt-10 px-10">
            <button
                @click="continueGame"
                class="bg-green-500 text-white text-2xl font-bold px-3 py-1 rounded"
                :disabled="loading"
            >
                {{ loading ? 'Guardando' : 'Continuar' }}
            </button>

            <button
                @click.once="$router.go(-1)"
                class="text-left text-red-500 font-semibold pt-2 text-center mt-5"
            >
                Volver atrás
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            currentGame: this.$store.getters.gameById(this.$store.state.currentGameId),
            scores: {},
            loading: false
        };
    },
    methods: {
        continueGame: function () {
            if (this.saveResults()) {
                this.setNextPlayer();
                this.nextGameOrResults();
            }
        },
        saveResults: function () {
            this.loading = true;

            if (Object.entries(this.scores).length < this.$store.state.players.length) {
                this.loading = false;
                return false;
            }

            this.$store.commit('save_result', {
                game: this.$store.getters.gameById(this.$store.state.currentGameId).name,
                scores: this.scores
            });

            this.$store.dispatch('clear_timers');

            return true;
        },
        setNextPlayer: function () {
            const nextRotatingPlayer = this.$store.getters.playerById(this.$store.state.rotatingPlayerId + 1);

            if (nextRotatingPlayer) {
                this.$store.commit('set_rotating_player', nextRotatingPlayer.id);
                this.$store.commit('set_current_player', nextRotatingPlayer.id);
            } else {
                this.$store.commit('set_rotating_player', 1);
                this.$store.commit('set_current_player', 1);
            }
        },
        nextGameOrResults: function () {
            const nextGame = this.$store.getters.gameById(this.$store.state.currentGameId + 1);

            if (nextGame) {
                this.$store.commit('set_current_game', nextGame.id);
                this.$router.push(`/game/${nextGame.id}`);
            } else {
                this.$router.push('/results');
                this.$store.commit('game_over');
            }
        }
    }
}
</script>
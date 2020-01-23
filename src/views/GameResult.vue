<template>
    <div class="px-10 pb-10">
        <h1 class="heading text-center pt-5">
            Resultados
        </h1>

        <div class="text-center text-lg text-gray-400 font-semibold mb-10">
            Juego {{ currentGame.id }} &#183; {{ currentGame.name }}
        </div>

        <div class="px-10">
            <div
                v-for="player in $store.state.players" :key="player.id"
                class="flex justify-between mb-3 font-semibold"
            >
                <div
                    class="w-4/6 text-2xl"
                    :class="{'text-green-500': scores[player.id] == 0}"
                >
                    {{ player.name }}
                </div>

                <input
                    type="number" min="0"
                    v-model.number="scores[player.id]"
                    class="w-2/6 text-center input input-lg"
                >
            </div>
        </div>

        <div v-if="error" class="text-center text-red-500 font-semibold mt-8">{{ error }}</div>

        <div class="flex flex-col mt-5 px-10">
            <button
                @click="continueGame"
                class="btn btn-lg btn-green"
                :disabled="loading"
            >
                {{ loading ? 'Guardando' : 'Continuar' }}
            </button>

            <button
                @click.once="$router.go(-1)"
                class="text-blue-500 text-xl font-semibold text-center mt-5"
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
            loading: false,
            error: null
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
            this.error = null;

            if (Object.entries(this.scores).length < this.$store.state.players.length) {
                this.loading = false;
                return false;
            }

            let values = [];

            Object.entries(this.scores).forEach(score => {
                values.push(score[1]);
            });

            let filtered = values.filter(v => v <= 0);

            if (filtered.length == 0 || filtered.length > 1) {
                this.error = "Solamente un jugador debe tener score 0."
                this.loading = false;
                return false;
            }

            let result = {
                gameId: this.$store.state.currentGameId,
                scores: this.scores
            };

            this.$store.dispatch('save_result', result);

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
                this.$router.push('/preparation');
            } else {
                this.$router.push('/results');
                this.$store.commit('game_over');
            }
        }
    }
}
</script>
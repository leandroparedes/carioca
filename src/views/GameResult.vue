<template>
    <div class="px-10 pb-10 relative">

        <button
            @click="$modal.show('results')"
            class="absolute top-0 right-0 mt-2 mr-2 text-2xl text-gray-500"
        >
            <font-awesome-icon icon="calculator"/>
        </button>

        <modal name="results" width="90%" height="auto" :clickToClose="false" classes="rounded-lg">
            <div class="bg-gray-800 w-full h-full rounded p-6">
                <div class="text-center text-green-500 text-lg font-semibold mb-4">
                    Guardando el score de {{ $store.getters.playerById(selectedForScore).name.toUpperCase() }}
                </div>
                
                <div class="font-semibold text-gray-500 text-lg mb-2">Seleccione un jugador</div>
                <select
                    class="w-full block input input-lg mb-6 focus:outline-none"
                    v-model="selectedForScore"
                >
                    <option
                        v-for="player in playersWithoutSelected" :key="player.id"
                        :value="player.id"
                        selected
                    >
                        {{ player.name }}
                    </option>
                </select>

                <div class="font-semibold text-gray-500 text-lg">Ingrese las cartas en mano</div>
                <div class="text-gray-500 text-sm mb-2">Separadas por un espacio</div>
                <input
                    type="text"
                    class="input input-lg w-full"
                    placeholder="3 a j 4 j q k"
                    v-model="cardsOnHand"
                >
            
                <div class="text-2xl py-4 text-green-500 font-semibold text-center">
                    Puntaje: {{ playerScore }}
                </div>

                <div class="text-center">
                    <button
                        class="btn btn-md btn-green mb-4"
                        @click="saveScoreForPlayer"
                    >
                        Guardar score
                    </button>
                </div>

                <div class="text-center">
                    <button @click="closeModal" class="btn btn-sm btn-red">Cerrar</button>
                </div>
            </div>
        </modal>

        <h1 class="heading text-center pt-5">
            Resultados
        </h1>

        <div class="text-center text-lg text-gray-500 font-semibold mb-4">
            Juego {{ currentGame.id }} &#183; {{ currentGame.name }}
        </div>

        <div class="px-8">
            <div class="font-semibold text-green-500 text-lg mb-2">Ganador</div>

            <select v-model="selected" class="w-full block input input-lg mb-8 focus:outline-none" @change="changeSelect">
                <option
                    v-for="player in $store.state.players" :key="player.id"
                    :value="player.id"
                    selected
                >
                    {{ player.name }}
                </option>
            </select>

            <div class="flex justify-between text-gray-500 mb-1">
                <div class="w-4/6">Jugador</div>
                <div class="w-2/6 text-center">Puntos</div>
            </div>
            <hr class="mb-3 border-1 border-gray-500">

            <div class="flex justify-between font-semibold mb-5 text-green-500">
                <div class="w-4/6 text-2xl">{{ selectedPlayer.name }}</div>
                <div class="w-2/6 text-2xl text-center">0</div>
            </div>

            <div
                v-for="player in playersWithoutSelected" :key="player.id"
                class="flex justify-between mb-5 font-semibold"
            >
                <div class="w-4/6 text-2xl">
                    {{ player.name }}
                </div>

                <input
                    type="number" min="1"
                    v-model.number="scores[player.id]"
                    @change="errorMessage = null"
                    :ref="'player-' + player.id"
                    :id="player.id"
                    class="w-2/6 text-center input input-lg"
                >
            </div>

            <div
                v-if="errorMessage"
                class="text-red-500 font-semibold text-lg text-center"
            >
                {{ errorMessage }}
            </div>

            <div class="flex flex-col mt-8">
                <button
                    @click="continueGame"
                    class="btn btn-lg btn-green"
                    :disabled="loading"
                >
                    {{ loading ? 'Guardando' : 'Continuar' }}
                </button>

                <button
                    @click.once="$router.go(-1)"
                    class="text-blue-500 text-lg font-semibold text-center mt-6"
                >
                    Volver atrás
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            selected: this.$store.state.currentPlayerId,
            currentGame: this.$store.getters.gameById(this.$store.state.currentGameId),
            scores: {},
            loading: false,
            errorMessage: null,
            cardsOnHand: '',
            playerScore: 0,
            selectedForScore: null
        };
    },
    created () {
        this.selectedForScore = this.playersWithoutSelected[0].id;
    },
    methods: {
        changeSelect: function () {
            this.scores = {};
        },
        continueGame: function () {
            this.errorMessage = null;
            this.loading = true;

            // save the result
            let scoresValues = Object.entries(this.scores);

            if (scoresValues.length && scoresValues.length == this.playersWithoutSelected.length) {
                let validData = true;
                scoresValues.some(score => {
                    if (!score[1] || score[1] < 1 || !Number.isInteger(score[1])) {
                        validData = false;
                        return;
                    }
                });
                if (!validData) {
                    this.loading = false;
                    this.errorMessage = 'Hay un problema con los resultados ingresados';
                    return;
                }
            } else {
                this.loading = false;
                this.errorMessage = 'Hay un problema con los resultados ingresados'
                return;
            }

            let score = Object.assign({}, this.scores);
            score[this.selectedPlayer.id] = 0;

            let result = {
                gameId: this.$store.state.currentGameId,
                scores: score
            };

            this.$store.dispatch('save_result', result);

            // set the next player
            const nextRotatingPlayer = this.$store.getters.playerById(this.$store.state.rotatingPlayerId + 1);

            if (nextRotatingPlayer) {
                this.$store.commit('set_rotating_player', nextRotatingPlayer.id);
                this.$store.commit('set_current_player', nextRotatingPlayer.id);
            } else {
                this.$store.commit('set_rotating_player', 1);
                this.$store.commit('set_current_player', 1);
            }

            // set the next game
            const nextGame = this.$store.getters.gameById(this.$store.state.currentGameId + 1);

            if (nextGame) {
                this.$store.commit('set_current_game', nextGame.id);
                this.$router.push('/preparation');
            } else {
                this.$router.push('/results');
                this.$store.commit('game_over');
            }

            this.$store.dispatch('clear_timers');
        },
        saveScoreForPlayer: function () {
            if (this.playerScore == 0) {
                return;
            }

            const playerId = this.$refs['player-' + this.selectedForScore][0].id;
            this.scores[playerId] = this.playerScore;
            this.cardsOnHand = '';
            this.playerScore = 0;
        },
        closeModal: function () {
            this.$modal.hide('results');
        }
    },
    watch: {
        cardsOnHand: function (value) {
            const cards = value.trim().split(/\s+/);

            let score = 0;

            cards.forEach(card => {
                let value;

                switch (card) {
                    case 'a': value = 20; break;
                    case 'j': value = 10; break;
                    case 'q': value = 10; break;
                    case 'k': value = 10; break;
                    default: value = parseInt(card); break;
                }

                score = score + value;
            });

            this.playerScore = score || 0;
        },
        playersWithoutSelected: function () {
            this.selectedForScore = this.playersWithoutSelected[0].id;
        }
    },
    computed: {
        selectedPlayer: function () {
            return this.$store.getters.playerById(this.selected);
        },
        playersWithoutSelected: function () {
            return this.$store.state.players.filter(player => player.id != this.selected);
        }
    }
}
</script>

<style scoped>
    .v--modal-overlay {
        background: rgba(0, 0, 0, 0.6);
    }
</style>
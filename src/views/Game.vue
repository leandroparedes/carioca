<template>
    <div>
        <div class="flex justify-between">
            <button v-if="!isOver && !isFinished" class="bg-green-500 font-bold p-2 text-white rounded m-2" @click="togglePause">
                {{ paused ? 'Reanudar' : 'Pausar' }}
            </button>
            <button class="bg-yellow-500 font-bold p-2 text-white rounded m-2" @click="finishGame" v-if="!isFinished">Terminar</button>
            <button v-else class="bg-red-500 font-bold p-2 text-white rounded m-2" @click="cancel">Cancelar</button>
        </div>
        <button
            class="w-full min-h-screen text-2xl font-bold text-white focus:outline-none"
            @click="finishTurn"
            :disabled="paused"
            v-if="!isFinished"
        >
            <div class="-mt-48">
                <div v-if="paused" class="text-6xl font-thin">Pausado</div>

                <div class="text-xl pt-3 text-gray-500">{{ game.name }}</div>

                <div :class="textColor" v-if="!isOver">
                    <h1 class="text-6xl font-bold">{{ currentPlayer.name.toUpperCase() }}</h1>
                    <div class="text-6xl font-black mb-10">
                        {{ currentPlayer.timeLeft }}
                    </div>
                </div>
                <div v-else>
                    <div class="text-3xl mt-4">Ganador</div>
                    <h1 class="text-6xl font-bold text-green-500 mb-10">{{ currentPlayer.name.toUpperCase() }}</h1>
                </div>

                <div
                    v-for="player in $store.getters.otherPlayers(currentPlayer.id)" :key="player.id"
                    class="font-normal" :class="{'text-red-500': player.timeLeft <= 0 && player.timeLeft != null}"
                >
                    {{ player.name }} {{ player.timeLeft == null ? game.secs : player.timeLeft }}
                </div>
            </div>
        </button>
        <div v-else class="min-h-screen px-4">
            <h1 class="font-bold text-4xl text-center mt-4">Resultados</h1>
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
            game: this.$store.getters.gameById(this.$route.params.id),
            currentPlayer: this.$store.getters.playerById(this.$route.query.player),
            currentPlayerInterval: null,
            isOver: false,
            currentPlayerLose: false,
            paused: false,
            isFinished: false,
            results: {
                players: {}
            }
        }
    },
    mounted() {
        this.$store.dispatch('set_timers', this.game.secs);

        this.currentPlayerInterval = setInterval(() => {

            if (this.currentPlayer.timeLeft <= 0) {
                clearInterval(this.currentPlayerInterval);
                return;
            }

            this.$set(this.currentPlayer, 'timeLeft', --this.currentPlayer.timeLeft);
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.currentPlayerInterval);
    },
    methods: {
        save: function () {
            this.$store.dispatch('save_results', {
                results: this.results.players,
                gameId: this.game.id
            });

            let gameId = this.game.id + 1;
            let nextPlayerId = this.currentPlayer.id + 1;

            if (nextPlayerId > this.$store.state.players.length) {
                nextPlayerId = 1;
            }

            if (gameId <= this.$store.state.games.length) {
                window.location.href = `/game/${gameId}?player=${nextPlayerId}`;
            } else {
                window.location.href = `/results`;
            }
        },
        finishGame: function () {
            this.isFinished = true;
        },
        cancel: function () {
            this.isFinished = false;
        },
        togglePause: function () {
            this.$store.commit('set_timer', {
                playerId: this.currentPlayer.id,
                timeLeft: this.currentPlayer.timeLeft
            });

            this.paused = !this.paused;

            if (this.paused) {
                clearInterval(this.currentPlayerInterval);
            } else {
                this.currentPlayerInterval = setInterval(() => {
                    if (this.currentPlayer.timeLeft <= 0) {
                        clearInterval(this.currentPlayerInterval);
                        this.currentPlayerLose = true;
                        return;
                    }
                    this.$set(this.currentPlayer, 'timeLeft', --this.currentPlayer.timeLeft);
                }, 1000);
            }
            
        },
        finishTurn: function () {
            this.currentPlayerLose = false;
            
            // guardamos el tiempo actualizado del jugador
            this.$store.commit('set_timer', {
                playerId: this.currentPlayer.id,
                timeLeft: this.currentPlayer.timeLeft
            });

            // limpiamos el interval del jugador
            clearInterval(this.currentPlayerInterval);

            // hacemos la rotacion de jugador
            this.currentPlayer = this.$store.getters.nextPlayer(this.currentPlayer.id);

            // seteamos el tiempo del jugador nuevo
            this.$store.commit('set_timer', {
                playerId: this.currentPlayer.id,
                timeLeft: this.currentPlayer.timeLeft != null ? this.currentPlayer.timeLeft : this.game.secs
            });

            if (this.$store.getters.playersLeft == 1) {
                clearInterval(this.currentPlayerInterval);
                this.isOver = true;
                return;
            }

            // iniciamos el intervalo de ese jugador
            this.currentPlayerInterval = setInterval(() => {
                if (this.currentPlayer.timeLeft <= 0) {
                    clearInterval(this.currentPlayerInterval);
                    this.currentPlayerLose = true;
                    return;
                }
                this.$set(this.currentPlayer, 'timeLeft', --this.currentPlayer.timeLeft);
            }, 1000);
        }
    },
    computed: {
        textColor: function () {
            return {
                'text-yellow-400': this.currentPlayer.timeLeft <= 60 && this.currentPlayer.timeLeft > 30,
                'text-red-500': this.currentPlayer.timeLeft <= 30 && this.currentPlayer.timeLeft >= 0
            }
        }
    }
}
</script>
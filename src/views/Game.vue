<template>
    <div>
        <div class="flex justify-between">
            <button v-if="!onlyOnePLayerLeft && !savingResults" class="text-green-500 font-bold focus:outline-none pl-2 pt-2" @click="togglePause">
                {{ paused ? 'Reanudar' : 'Pausar' }}
            </button>

            <button
                class="font-bold px-2 pt-2 focus:outline-none"
                :class="{'text-red-500': savingResults, 'text-yellow-500': !savingResults}"
                @click="toggleSaveResults"
            >
                {{ savingResults ? 'Cancelar' : 'Terminar' }}
            </button>
        </div>

        <button
            class="w-full min-h-screen text-2xl font-bold text-white focus:outline-none"
            @click="finishTurn"
            :disabled="paused"
            v-if="!savingResults"
        >
            <div class="-mt-48">
                <div v-if="paused" class="text-6xl font-thin">Pausado</div>

                <div class="text-xl pt-3 text-gray-500">{{ game.name }}</div>

                <div v-if="!currentPlayerLost">
                    <div :class="textColor" v-if="!onlyOnePLayerLeft">
                    <h1 class="text-6xl font-bold">{{ currentPlayer.name.toUpperCase() }}</h1>
                    <div class="text-6xl font-black mb-10">
                        {{ formatTime(currentPlayer.timeLeft) }}
                    </div>
                    </div>
                    <div v-else>
                        <div class="text-3xl mt-4">Ganador</div>
                        <h1 class="text-6xl font-bold text-green-500 mb-10">{{ currentPlayer.name.toUpperCase() }}</h1>
                    </div>
                </div>
                <div v-else class="px-4">
                    <img src="../assets/images/heh.jpeg" alt="heh">
                </div>

                <div
                    v-for="player in $store.getters.otherPlayers(currentPlayer.id)" :key="player.id"
                    class="font-normal" :class="{'text-red-500': player.timeLeft <= 30}"
                >
                    {{ player.name }} {{ formatTime(player.timeLeft) }}
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
            currentPlayerLost: false,
            onlyOnePLayerLeft: false,
            paused: false,
            savingResults: false,
            results: {
                players: {}
            }
        }
    },
    mounted() {
        this.$store.dispatch('set_timers', this.game.secs);

        this.initInterval();
    },
    beforeDestroy() {
        clearInterval(this.currentPlayerInterval);
    },
    methods: {
        initInterval: function () {
            this.currentPlayerInterval = setInterval(() => {
                if (this.currentPlayer.timeLeft <= 0) {
                    clearInterval(this.currentPlayerInterval);
                    this.currentPlayerLost = true;
                    return;
                }
                this.$set(this.currentPlayer, 'timeLeft', --this.currentPlayer.timeLeft);
            }, 1000);
        },
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
        toggleSaveResults: function () {
            this.savingResults = !this.savingResults;
            this.paused = true;
            this.$store.commit('set_timer', {
                playerId: this.currentPlayer.id,
                timeLeft: this.currentPlayer.timeLeft
            });
            clearInterval(this.currentPlayerInterval);
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
                this.initInterval();
            }
            
        },
        finishTurn: function () {
            this.currentPlayerLost = false;
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
                timeLeft: this.currentPlayer.timeLeft
            });

            if (this.$store.getters.playersLeft == 1) {
                clearInterval(this.currentPlayerInterval);
                this.onlyOnePLayerLeft = true;
                return;
            }

            // iniciamos el intervalo de ese jugador
            this.initInterval();
        },
        formatTime: function (s){
            return (s-(s%=60))/60+(9<s?':':':0')+s;
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
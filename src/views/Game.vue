<template>
    <div>
        <div class="flex justify-between">
            <button v-if="!onlyOnePLayerLeft" class="text-green-500 font-bold focus:outline-none pl-2 pt-2" @click="togglePause">
                {{ paused ? 'Reanudar' : 'Pausar' }}
            </button>

            <button
                class="text-yellow-500 font-bold px-2 pt-2 focus:outline-none"
                @click="save"
            >
                Terminar
            </button>
        </div>

        <button
            class="w-full min-h-screen text-2xl font-bold text-white focus:outline-none"
            @click="finishTurn"
            :disabled="paused"
            :class="{'opacity-25': paused}"
        >
            <div class="-mt-48">
                <small class="text-gray-600 text-sm">Juego {{ $route.params.id }} </small>
                <div class="text-2xl text-gray-500">{{ game.name }}</div>

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
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            game: this.$store.getters.gameById(this.$route.params.id),
            currentPlayer: this.$store.state.current_player || this.$store.getters.playerById(this.$route.query.player),
            currentPlayerInterval: null,
            currentPlayerLost: false,
            onlyOnePLayerLeft: false,
            paused: false
        }
    },
    mounted() {
        this.$store.dispatch('set_timers', this.game.mins * 60);
        this.$store.dispatch('current_game', this.game.id);
        this.$store.dispatch('current_player', this.currentPlayer.id);

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
                    this.$store.commit('set_timer', {
                        playerId: this.currentPlayer.id,
                        timeLeft: 0
                    });
                    return;
                }
                this.$set(this.currentPlayer, 'timeLeft', --this.currentPlayer.timeLeft);
            }, 1000);
        },
        save: function () {
            this.$store.dispatch('current_player', this.currentPlayer.id);

            this.$router.push({
                path: `/game/${this.game.id}/results`,
                query: {
                    player: this.$route.query.player,
                    final: this.onlyOnePLayerLeft ? 'true' : 'false'
                }
            });
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

            this.$store.dispatch('current_player', this.currentPlayer.id);

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
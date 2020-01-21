<template>
    <button @click="finishTurn" class="min-w-full focus:outline-none">
        <div class="min-h-screen">
            <h1 class="text-blue-500 text-4xl font-semibold py-5">
                {{ currentGame.name }}
            </h1>

            <div>
                <div class="text-gray-400 text-xl">Jugando</div>
                <div class="text-5xl font-bold text-green-400">{{ currentPlayer.name.toUpperCase() }}</div>
            </div>

            <countdown-timer
                v-if="currentPlayer.timeLeft > 0"
                :time="currentPlayer.timeLeft"
                autoinit
                @updatedTime="handleUpdatedTime"
                @timeout="handleTimeout"
            />
            <div v-else class="mt-2 font-semibold text-red-500 text-6xl">
                Perdiste
            </div>

            <div class="mt-10">
                <div
                    v-for="player in playersWithoutCurrent" :key="player.id"
                    class="text-xl font-semibold mb-1"
                >
                    {{ player.name }}: {{ player.timeLeft | formatTime }}
                </div>
            </div>
        </div>
    </button>
</template>

<script>
import CountdownTimer from '@/components/CountdownTimer.vue';

export default {
    beforeRouteEnter (to, from, next) {
        const store = require('@/store').default;
        const router = require('@/router').default;

        if (! store.state.globalStatus.gameInit) {
            router.push('/setup/players');
        } else {
            next();
        }
    },
    components: { CountdownTimer },
    data: function () {
        return {
            currentGame: this.$store.getters.gameById(this.$store.state.currentGameId),
            currentPlayer: this.$store.getters.playerById(this.$store.state.currentPlayerId)
        };
    },
    created () {
        window.addEventListener('beforeunload', this.leaving);
        this.$store.dispatch('set_timers', this.currentGame.time);
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.leaving);
    },
    methods: {
        handleUpdatedTime: function (newTime) {
            this.$set(this.currentPlayer, 'timeLeft', newTime);
        },
        handleTimeout: function () {
            this.savePlayerCurrentTime();
        },
        finishTurn: function () {
            this.savePlayerCurrentTime();

            this.currentPlayer = this.$store.getters.nextPlayerAfter(this.currentPlayer.id);

            this.$store.commit('set_current_player', this.currentPlayer.id);
        },
        leaving: function () {
            this.savePlayerCurrentTime();
        },
        savePlayerCurrentTime: function () {
            this.$store.commit('set_timer_for_player', {
                playerId: this.currentPlayer.id,
                time: this.currentPlayer.timeLeft
            });
        }
    },
    computed: {
        playersWithoutCurrent: function () {
            return this.$store.state.players.filter(player => player.id != this.currentPlayer.id);
        }
    }
}
</script>
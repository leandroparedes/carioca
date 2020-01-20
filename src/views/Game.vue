<template>
    <div>
        <button @click="endTurn" class="min-h-screen min-w-full focus:outline-none">
            <div class="-mt-64">
                <h1 class="text-blue-500 text-4xl font-semibold py-5">
                    {{ currentGame.name }}
                </h1>

                <div>
                    <div class="text-gray-400 text-xl">Jugando</div>
                    <div class="text-5xl font-bold text-green-400">{{ currentPlayer.name.toUpperCase() }}</div>
                </div>

                <timer :time="currentPlayer.timeLeft" :init="true" @timeUpdated="setUpdatedTime"/>
            </div>
        </button>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Timer from '@/components/Timer.vue';

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
    components: { Timer },
    data: function () {
        return {
            currentGame: this.$store.getters.gameById(this.$store.state.currentGameId),
            currentPlayer: this.$store.getters.playerById(this.$store.state.currentPlayerId),
            currentTime: 0
        };
    },
    created () {
        this.$store.dispatch('set_timers', this.currentGame.time);
    },
    mounted () {
        window.addEventListener('beforeunload', this.leaving);
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.leaving);
    },
    methods: {
        leaving: function () {
            this.saveTimeCurrentPlayer();
        },
        setUpdatedTime: function (updatedTime) {
            this.currentTime = updatedTime;
        },
        saveTimeCurrentPlayer: function () {
            this.$store.commit('set_timer_for_player', {
                playerId: this.currentPlayer.id,
                time: this.currentTime
            });
        },
        endTurn: function () {
            this.saveTimeCurrentPlayer();

            // change to next player
        }
    }
}
</script>
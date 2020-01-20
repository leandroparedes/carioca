<template>
    <div class="px-10 pb-10 text-center">
        <h1 class="text-blue-500 text-4xl font-semibold py-5">
            {{ currentGame.name }}
        </h1>

        <div>
            <div class="text-gray-400 text-xl">Jugando</div>
            <div class="text-5xl font-bold text-green-400">{{ currentPlayer.name.toUpperCase() }}</div>
        </div>

        <timer :time="currentPlayer.timeLeft" :init="true" />
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
    created () {
        this.$store.commit('set_current_game', this.$route.params.id);
        this.$store.commit('clear_next_game');
        
        this.$store.commit('set_current_player', this.currentPlayer ? this.currentPlayer.id : this.$store.state.nextPlayer.id);
        this.$store.commit('clear_next_player');

        this.$store.dispatch('set_timers', this.currentGame.time);
    },
    computed: mapState(['currentGame', 'currentPlayer'])
}
</script>
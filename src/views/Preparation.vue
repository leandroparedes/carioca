<template>
    <div class="px-10 pb-10 text-center">
        <h1 class="text-blue-500 text-4xl font-semibold py-5">
            Preparación
        </h1>

        <div class="mb-3">
            <div class="text-gray-400 text-lg">Próximo juego</div>
            <div class="text-4xl font-bold">{{ currentGame.name }}</div>
        </div>

        <div>
            <div class="text-gray-400 text-lg">Juega</div>
            <div class="text-4xl font-bold text-green-500">{{ currentPlayer.name.toUpperCase() }}</div>
        </div>

        <div class="mt-5 mb-5">
            <button @click="togglePause" class="focus:outline-none">
                <countdown-timer
                    :time="initialTime"
                    :autoinit="autoinit"
                    :paused="paused"
                    @timeout="handleTimeout"
                    @updatedTime="handleUpdatedTime"
                    class="text-6xl font-bold"
                />
            </button>
        </div>

        <button
            v-if="!autoinit"
            class="bg-blue-500 text-white text-2xl font-bold px-3 py-1 rounded"
            @click="autoinit = true"
        >
            Iniciar tiempo
        </button>
        <button
            v-else
            class="bg-green-500 text-white text-2xl font-bold px-3 py-1 rounded"
            @click="$router.push(`/game/${currentGame.id}`)"
        >
            Continuar al juego
        </button>
    </div>
</template>

<script>
import { mapState } from 'vuex';
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
    data: function () {
        return {
            initialTime: 120,
            autoinit: false,
            currentGame: this.$store.getters.gameById(this.$store.state.currentGameId),
            currentPlayer: this.$store.getters.playerById(this.$store.state.currentPlayerId),
            paused: false
        };
    },
    components: { CountdownTimer },
    methods: {
        handleUpdatedTime: function (newTime) {
            this.initialTime = newTime;
        },
        handleTimeout: function () {
            this.$router.push(`/game/${this.currentGame.id}`);
        },
        togglePause: function () {
            this.paused = !this.paused;
        }
    }
}
</script>
<template>
    <div class="px-10 pb-10 text-center">
        <h1 class="heading py-5">
            Preparación
        </h1>

        <div class="mb-3">
            <div class="text-gray-400 text-lg">Próximo juego</div>
            <div class="text-4xl font-bold">{{ currentGame.name }}</div>
        </div>

        <div>
            <div class="text-gray-400 text-lg">Juega</div>
            <div class="text-4xl font-bold text-green-500 break-all">{{ currentPlayer.name.toUpperCase() }}</div>
        </div>

        <div class="-mt-3 mb-4">
            <button @click="togglePause" class="focus:outline-none" :disabled="!autoinit">
                <countdown-timer
                    :time="initialTime"
                    :autoinit="autoinit"
                    :paused="paused"
                    @timeout="handleTimeout"
                    @updatedTime="handleUpdatedTime"
                    class="text-7xl font-bold"
                />
            </button>
            <div class="-mt-4 font-semibold mb-8" v-if="autoinit">Tocar para pausar</div>
        </div>

        <button
            v-if="!autoinit"
            class="btn btn-lg btn-blue"
            @click="autoinit = true"
        >
            Iniciar tiempo
        </button>
        <button
            v-else
            class="btn btn-lg btn-green"
            @click="$router.push(`/game/${currentGame.id}`)"
        >
            Continuar al juego
        </button>

        <div class="mt-4">
            <p class="text-gray-600 font-semibold">GameID</p>
            <p class="text-2xl font-bold text-green-500">{{ $store.state.gameID }}</p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import CountdownTimer from '@/components/CountdownTimer.vue';
import shared from '@/shared';

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
    created () {
        shared.save();
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
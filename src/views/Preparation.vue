<template>
    <div class="preparation px-10">
        <h1 class="headline text-center mt-5">Preparacion</h1>

        <div class="mb-3 text-center mt-5">
            <div class="text-gray-400 text-lg">Próximo juego</div>
            <div class="text-4xl font-bold">{{ currentGame.name }}</div>
        </div>

        <div class="text-center mt-5">
            <div class="text-gray-400 text-lg">Juega</div>
            <div class="text-4xl font-bold text-green-500 break-all">{{ currentPlayer.name.toUpperCase() }}</div>
        </div>

        <div class="-mt-3 mb-4 text-center">
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

        <v-btn
            v-if="!autoinit"
            color="primary"
            x-large
            @click="autoinit = true"
            block
        >
            Iniciar tiempo
        </v-btn>
        <v-btn
            v-else
            color="success"
            x-large
            @click="$router.push(`/game/${currentGame.id}`)"
            block
        >
            Continuar al juego
        </v-btn>
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
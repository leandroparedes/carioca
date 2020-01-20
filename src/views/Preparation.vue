<template>
    <div class="px-10 pb-10 text-center">
        <h1 class="text-blue-500 text-4xl font-semibold py-5">
            Preparación
        </h1>

        <div class="mb-3">
            <div class="text-gray-400 text-lg">Próximo juego</div>
            <div class="text-3xl font-bold">{{ nextGame.name }}</div>
        </div>

        <div>
            <div class="text-gray-400 text-lg">Juega</div>
            <div class="text-3xl font-bold text-green-400">{{ nextPlayer.name.toUpperCase() }}</div>
        </div>

        <timer :time="120" :init="timeHasStarted" @timeout="timeout" class="mt-5 mb-10"/>

        <button
            v-if="!timeHasStarted"
            class="bg-blue-500 text-white text-2xl font-bold px-3 py-1 rounded"
            @click="timeHasStarted = true"
        >
            Iniciar tiempo
        </button>
        <button
            v-else
            class="bg-green-500 text-white text-2xl font-bold px-3 py-1 rounded"
            @click="$router.push(`/game/${nextGame.id}`)"
        >
            Jugar {{ nextGame.name }}
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
    data: function () {
        return {
            timeHasStarted: false
        };
    },
    components: { Timer },
    computed: mapState(['nextGame', 'nextPlayer']),
    methods: {
        timeout: function () {
            this.$router.push(`/game/${this.nextGame.id}`);
        }
    }
}
</script>
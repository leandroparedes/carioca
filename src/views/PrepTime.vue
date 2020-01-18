<template>
    <div class="px-4 min-h-screen text-center pt-10">
        <div class="text-3xl">Próximo juego: <span class="font-semibold">{{ nextGame.name }}</span></div>
        <div class="text-3xl">Juega: <span class="font-semibold text-green-500">{{ nextPlayer.name }}</span></div>

        <div class="text-yellow-500 text-6xl mt-10">{{ formatTime(prepTime) }}</div>

        <button
            class="bg-green-500 px-3 py-2 font-semibold text-white rounded mt-10 text-3xl"
            @click="play"
            v-if="initialized"
        >
            Jugar
        </button>
        <button v-else @click="initInterval" class="bg-green-500 px-3 py-2 font-semibold text-white rounded mt-10 text-3xl">Iniciar tiempo de preparación</button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            initialized: false,
            prepTime: 120,
            prepTimeInterval: null,
            nextGame: this.$store.getters.gameById(this.$route.query.nextGame),
            nextPlayer: this.$store.getters.playerById(this.$route.query.player),
        }
    },
    beforeDestroy () {
        clearInterval(this.prepTimeInterval);
    },
    methods: {
        play: function () {
            this.$router.push({
                path: `/game/${this.$route.query.nextGame}`,
                query: { player: this.$route.query.player }
            });
        },
        formatTime: function (s){
            return (s-(s%=60))/60+(9<s?':':':0')+s;
        },
        initInterval: function () {
            this.initialized = true;
            this.prepTimeInterval = setInterval(() => {
                if (this.prepTime <= 0) {
                    clearInterval(this.prepTimeInterval);
                    this.play();
                }
                this.prepTime = this.prepTime - 1;
            }, 1000);
        }
    }
}
</script>
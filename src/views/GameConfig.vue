<template>
    <div class="px-4">
        <h1 class="text-center text-6xl font-semibold mb-3">Juegos</h1>

        <div class="flex mb-4 -mx-2">
            <div class="w-3/4 px-2">Juego</div>
            <div class="w-1/4 px-2">Minutos</div>
        </div>

        <div v-for="(game, index) in games" :key="index" class="text-3xl font-semibold">
            <div class="flex mb-4 -mx-2">
                <div class="w-3/4 px-2">{{ game.name }}</div>
                <div class="w-1/4 px-2">
                    <input
                        type="number" min="1"
                        class="text-gray-800 rounded text-2xl font-semibold p-2 w-full"
                        v-model="game.minutes"
                    >
                </div>
            </div>
        </div>

        <button
            class="bg-green-600 text-4xl rounded px-1 py-2 font-bold w-full text-white my-4"
            @click="next"
            :disabled="loading"
        >
            {{ loading ? 'Guardando' : 'Continuar' }}
        </button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            games: [
                { id: 1, name: '2 Trios', minutes: 5 },
                { id: 2, name: '1 Escala 1 Trio', minutes: 5 },
                { id: 3, name: '2 Escalas', minutes: 5 },
                { id: 4, name: '3 Trios', minutes: 5 },
                { id: 5, name: '2 Trios 1 Escala', minutes: 5 },
                { id: 6, name: '2 Escalas 1 Trio', minutes: 5 },
                { id: 7, name: '4 Trios', minutes: 5 },
                { id: 8, name: '3 Escalas', minutes: 5 },
                { id: 9, name: 'Escala mariposa', minutes: 5 },
                 { id: 10, name: 'Escala Real', minutes: 5 }
            ],
            loading: false
        }
    },
    methods: {
        next: function () {
            this.loading = true;
            this.$store.commit('add_games', this.games);
            this.$router.push('/game/1');
        }
    }
}
</script>
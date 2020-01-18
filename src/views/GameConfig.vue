<template>
    <div class="px-4">
        <h1 class="text-center text-6xl font-semibold mb-3">Juegos</h1>

        <div class="mb-8 flex justify-between">
            <button class="bg-green-500 text-white rounded px-2 py-1 font-semibold" @click="games.forEach(game => game.mins++)">Añadir un minuto</button>
            <button class="bg-red-500 text-white rounded px-2 py-1 font-semibold" @click="games.forEach(game => game.mins--)">Quitar un minuto</button>
        </div>

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
                        v-model="game.mins"
                    >
                </div>
            </div>
        </div>

        <div class="flex my-5 -mx-2">
            <div class="w-2/3 px-2">
                <input type="text" v-model="game.name" class="text-gray-800 rounded text-2xl font-semibold p-2 w-full" placeholder="Añadir nuevo juego">
            </div>
            <div class="w-1/3 px-2">
                <button
                    class="bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none font-bold px-3 py-2 rounded text-2xl w-full"
                    @click="addGame"
                >
                    Add
                </button>
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
            game: {
                name: ''
            },
            games: [
                { id: 1, name: '2 Trios', mins: 5 },
                { id: 2, name: '1 Trio 1 Escala', mins: 5 },
                { id: 3, name: '2 Escalas', mins: 5 },
                { id: 4, name: '3 Trios', mins: 5 },
                { id: 5, name: '2 Trios 1 Escala', mins: 5 },
                { id: 6, name: '2 Escalas 1 Trio', mins: 5 },
                { id: 7, name: '4 Trios', mins: 5 },
                { id: 8, name: '3 Escalas', mins: 5 },
                { id: 9, name: 'Escala mariposa', mins: 5 },
                { id: 10, name: 'Escala Real', mins: 5 }
            ],
            loading: false
        }
    },
    methods: {
        addGame: function () {
            if (this.game.name.length) {
                this.games.push({
                    id: this.games.length + 1,
                    name: this.game.name,
                    mins: 5
                });
                this.game.name = '';
            }
        },
        next: function () {
            this.loading = true;
            this.$store.commit('add_games', this.games);
            this.$router.push({
                path: '/game/1',
                query: { player: 1 }
            });
        }
    }
}
</script>
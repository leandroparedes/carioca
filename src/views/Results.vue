<template>
    <div class="px-10 pb-10 text-center">
        <h1 class="text-blue-500 text-4xl font-semibold py-5">
            Resultados
        </h1>

        <div class="bg-gray-900 shadow-lg rounded-lg p-4 border border-yellow-500 mt-2">
            <div class="text-5xl text-yellow-500">
                <font-awesome-icon icon="trophy" />
                <div class="font-semibold">
                    {{ winner.name.toUpperCase() }}
                </div>
            </div>
            <div class="text-gray-500 mt-2 font-semibold">
                {{ winner.score }} puntos &#183; {{ winner.gamesWon }}/{{ $store.state.games.length }} juegos
            </div>
        </div>

        <div
            class="bg-gray-900 shadow-lg rounded p-4 mt-5 mx-4"
            v-for="(player, index) in playersWithoutWinner" :key="player.id"
        >
            <div class="font-semibold">
                <div class="text-xl text-gray-500 mb-2">{{ index + 2}}° Lugar</div>
                <div class="text-3xl">{{ player.name.toUpperCase() }}</div>
            </div>
            <div class="text-gray-500 mt-2 text-sm font-semibold">
                {{ player.score }} puntos &#183; {{ player.gamesWon }}/{{ $store.state.games.length }} juegos
            </div>
        </div>

        <div class="text-2xl mt-10 font-semibold text-blue-500">Detalles</div>

        <div class="flex flex-wrap -mx-2 mt-5">
            <div v-for="(result, index) in $store.state.results" :key="index" class="w-1/2 px-2 mb-4">
                <div class="bg-gray-900 p-2 rounded-lg shadow h-full">
                    <div class="text-sm text-gray-600">Juego {{ result.game.id }}</div>
                    <div class="font-semibold text-lg mb-1">{{ result.game.name }}</div>
                    <div v-for="(score, index) in result.scores" :key="index">
                        <span :class="textColor(score.score)">{{ score.player }}: {{ score.score }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            winner: this.$store.getters.winnerOfTheGame,
        };
    },
    methods: {
        textColor: function (playerScore) {
            return {
                'text-green-500': playerScore <= 0,
                'text-red-500': playerScore > 0
            };
        }
    },
    computed: {
        playersWithoutWinner: function () {
            return this.$store.state.players.filter(player => player.id != this.winner.id);
        }
    }
}
</script>
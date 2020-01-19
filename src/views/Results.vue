<template>
    <div class="px-2 text-center">
        <h1 class="text-center text-6xl font-semibold mb-3">Resultados</h1>

        <div class="mb-5 bg-gray-900 p-2 rounded shadow-lg">
            <div class="text-4xl text-green-500 font-semibold">Ganador</div>
            <div class="text-2xl font-bold mb-5">
                <div>{{ winner.name.toUpperCase() }} con {{ winner.score }} puntos.</div>
                <div>Juegos ganados {{winner.gamesWon }} de {{ $store.state.games.length }}</div>
            </div>

            <div class="text-xl text-yellow-500" v-for="(player, index) in $store.getters.otherPlayers(winner.id)" :key="index">
                <span class="font-semibold">{{ index + 2 }}. {{ player.name.toUpperCase() }}:</span> {{ player.score }} puntos
            </div>
        </div>

        <div v-for="(result, index) in $store.state.results" :key="index" class="mb-10">
            <div class="text-2xl font-semibold mb-2">{{ result.game }}</div>
            <div v-for="(player, index) in result.players" :key="index" class="text-xl font-semibold mb-2">
                <span :class="textColor(player.value)">{{ player.name }}: {{ player.value }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            winner: this.$store.getters.playerLowerScore
        }
    },
    methods: {
        textColor: function (value) {
            return {
                'text-green-500': value == 0,
                'text-red-500': value > 0
            }
        }
    }
}
</script>
<template>
    <div class="px-2 text-center">
        <h1 class="text-6xl font-semibold mb-3">Resultados</h1>

        <div class="mb-5 bg-gray-900 p-2 rounded shadow-lg">
            <div class="font-semibold mb-8">
                <div class="text-5xl text-green-500">1. {{ winner.name.toUpperCase() }}</div>
                <div class="text-4xl">{{ winner.score }} puntos</div>
                <div class="text-2xl">{{ winner.gamesWon }}/{{ $store.state.games.length }} juegos ganados</div>
            </div>

            <div class="font-semibold mb-5" v-for="(player, index) in $store.getters.otherPlayers(winner.id)" :key="index">
                <div class="text-3xl text-yellow-500">{{ index + 2 }}. {{ player.name.toUpperCase() }}</div>
                <div class="text-2xl">{{ player.score }} puntos</div>
                <div class="text-lg">{{ player.gamesWon }}/{{ $store.state.games.length }} juegos ganados</div>
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
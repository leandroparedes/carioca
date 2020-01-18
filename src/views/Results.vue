<template>
    <div class="px-2 text-center">
        <h1 class="text-center text-6xl font-semibold mb-3">Resultados</h1>

        <div v-for="(result, index) in $store.state.results" :key="index" class="mb-10">
            <div class="text-4xl font-semibold mb-2">{{ result.game }}</div>
            <div v-for="(player, index) in result.players" :key="index" class="text-2xl font-semibold mb-2">
                {{ player.player }}: {{ player.value }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>
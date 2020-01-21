<template>
    <div class="px-10 pb-10">
        <h1 class="text-center text-blue-500 text-4xl font-semibold pt-2 pb-5">
            Resultados
        </h1>

        <div class="px-12">
            <div
                v-for="player in $store.state.players" :key="player.id"
                class="flex justify-between mb-3 text-2xl font-semibold"
            >
                <div class="w-4/6">{{ player.name }}</div>

                <input
                    type="number" min="1"
                    class="w-2/6 px-2 py-1 text-gray-800 rounded text-center"
                >
            </div>
        </div>


        <button class="text-left text-red-500 font-semibold pt-2" @click.once="$router.go(-1);">Volver atrás</button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            
        };
    }
}
</script>
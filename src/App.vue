<template>
    <div id="app" class="bg-gray-800 text-gray-200">
        <div class="min-h-screen">
            <router-view/>
        </div>
        <div v-if="$store.state.globalStatus.gameInit" class="text-center py-3">
            <button class="text-red-500 font-semibold text-xl focus:outline-none" @click="exit">Exit Game</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        exit: function () {
            if (confirm('¿Salir?')) {
                this.$store.commit('reset');
                this.$router.push('/');
            }
        }
    }
}
</script>
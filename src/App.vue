<template>
    <div id="app" class="bg-gray-800 text-gray-200">
        <div class="min-h-screen">
            <router-view/>
        </div>
        <div v-if="$store.getters.gameStarted" class="text-center py-3">
            <button class="btn btn-sm btn-red" @click="exit">Salir</button>
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
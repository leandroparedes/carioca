<template>
    <div id="app" class="bg-gray-800 text-gray-300 min-h-screen">
        <router-view/>

        <div class="text-center" v-if="this.$store.state.players.length > 0 || this.$store.state.games.length > 0">
             <button @click="reset" class="bg-red-500 text-white px-2 rounded mt-2 mb-8">Reset</button>
         </div>
    </div>
</template>

<script>
export default {
    methods: {
        reset: function () {
            this.$store.commit('reset');
            this.$router.push('/');
        }
    }
}
</script>
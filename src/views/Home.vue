<template>
    <div class="text-center">
        <h1 class="text-6xl font-bold pt-10">Carioca</h1>
        <button
            class="bg-blue-500 text-white text-4xl font-bold rounded px-8 py-2 mt-10"
            @click="play"
        >
            Jugar
        </button>
    </div>
</template>

<script>
export default {
    methods: {
        play: function () {
            this.$router.push('/setup/players');
        }
    }
}
</script>
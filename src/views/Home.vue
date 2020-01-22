<template>
    <div class="text-center flex flex-col">
        <h1 class="text-6xl font-bold pt-10">Carioca</h1>
        <div>
            <button
                class="bg-blue-500 text-white text-4xl font-bold rounded px-8 py-2 mt-10"
                @click="play"
            >
                Jugar
            </button>
        </div>
        
        <div class="mt-10 text-gray-600" v-if="savegameExists">
            <save-button mode="load" class="text-4xl" />
            <div class="font-semibold text-lg">Load game</div>
        </div>
    </div>
</template>

<script>
import SaveButton from '@/components/SaveButton.vue';

export default {
    components: { SaveButton },
    data: function () {
        return {
            savegameExists: false
        };
    },
    created () {
        if (localStorage.savegame) {
            this.savegameExists = true;
        }
    },
    methods: {
        play: function () {
            this.$router.push('/setup/players');
        }
    }
}
</script>
<template>
    <div class="text-center flex flex-col">
        <h1 class="text-6xl font-semibold pt-10">Cariocart</h1>
        <div class="mt-10">
            <button
                class="border-8 border-blue-500 text-blue-500 text-4xl rounded-full w-32 h-32"
                @click="play"
            >
                <font-awesome-icon icon="play" class="ml-2"/>
            </button>
        </div>
        
        <div class="mt-10 text-gray-600" v-if="savegameExists">
            <save-button mode="load" class="text-4xl" />
            <div class="font-semibold text-lg">Cargar juego</div>
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
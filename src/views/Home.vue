<template>
    <div class="text-center flex flex-col">
        <h1 class="display-3 mt-10">Cariocart</h1>
        <div class="mt-10">
            <v-btn
                color="success"
                fab
                x-large
                @click="play"
            >
                <v-icon>mdi-play</v-icon>
            </v-btn>
        </div>
        
        <div class="mt-10 text-gray-600" v-if="savegameExists">
            <save-button mode="load" class="text-4xl">
                <div class="font-semibold text-lg">Cargar juego</div>
            </save-button>
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
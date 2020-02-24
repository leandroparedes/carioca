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
            <save-button mode="load" class="text-4xl">
                <div class="font-semibold text-lg">Cargar juego local</div>
            </save-button>
        </div>

        <div class="flex mt-10 mx-10">
            <input
                type="text"
                class="mr-1 w-5/6 input input-lg"
                placeholder="GameID"
                v-model="gameID"
            >

            <button
                class="w-1/6 ml-1 btn btn-md btn-blue"
                @click="loadRemoteGame"
            >
                <font-awesome-icon icon="save" />
            </button>
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
        },
        loadRemoteGame: function () {
            if (this.gameID) {
                fetch('/load-game/' + this.gameID).then(res => res.json()).then(data => {
                    this.$store.replaceState(data.state);

                    const { v4 } = require('uuid');
                    this.$store.commit('set_game_id', v4());
                    this.$router.push(data.path);
                }).catch(err => {
                    console.log('error');
                });
            }
        }
    }
}
</script>
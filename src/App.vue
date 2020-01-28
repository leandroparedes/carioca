<template>
    <v-app>
        <v-container>
            <router-view style="min-height: 100vh"></router-view>

            <div class="text-center">
                <v-btn
                    color="red"
                    class=""
                    small
                    @click="exit"
                >
                    Reset
                </v-btn>
            </div>
        </v-container>
    </v-app>
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
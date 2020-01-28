<template>
    <div class="players-setup px-10">
        <h1 class="headline text-center mt-5">Jugadores</h1>

        <v-card
            v-for="(player, index) in players" :key="player.id"
            class="d-flex justify-space-between align-center mt-5 pa-4"
            raised
        >
            <div>
                <span class="grey--text mr-1">#{{ index + 1 }}</span> {{ player.name }}
            </div>

            <div>
                 <v-chip
                    v-if="index == 0"
                    class="pa-2 mr-2"
                    small
                    color="green"
                >
                    Juega
                </v-chip>

                <v-btn
                    icon
                    color="red"
                    x-small
                    @click="remove(player.id)"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
        </v-card>

        <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
            autocomplete="off"
            class="mt-8"
        >
            <v-text-field
                v-model="name"
                ref="name"
                :counter="10"
                label="Nombre del jugador"
                :rules="nameRules"
                required
                v-on:keydown.enter.prevent="add"
                autocomplete="off"
            ></v-text-field>

            <v-btn
                :disabled="!valid"
                color="primary"
                class="mt-8"
                block
                @click.prevent="add"
            >
                Añadir jugador
            </v-btn>
        </v-form>

        <v-btn
            v-if="players.length >= 2"
            color="success"
            class="mt-8"
            block
            x-large
            @click.prevent="save"
            :loading="loading"
        >
            Continuar <v-icon class="ml-2">mdi-arrow-right-circle</v-icon>
        </v-btn>

        <div class="text-center mt-10">
            <router-link to="/">Volver atrás</router-link>
        </div>
    </div>
</template>

<script>
export default {
    beforeRouteEnter (to, from, next) {
        const store = require('@/store').default;
        const router = require('@/router').default;

        if (store.state.globalStatus.playersSetupCompleted) {
            router.push('/setup/games');
        } else {
            next();
        }
    },
    data: function () {
        return {
            name: '',
            players: [],
            loading: false,

            valid: true,
            lazy: false,
            nameRules: [
                v => !!v || 'Debe ingresar un nombre',
                v => (v && v.length <= 10) || 'El nombre no puede tener más de 10 caracteres',
                v => !this.players.find(p => p.name == v) || 'El nombre ya fue ingresado'
            ]
        }
    },
    methods: {
        add: function () {
            if (this.$refs.form.validate()) {
                this.players.push({
                    id: this.players.length + 1,
                    name: this.name,
                    score: 0,
                    gamesWon: 0,
                    timeLeft: null
                });

                this.name = '';

                this.$nextTick(() => this.$refs.name.focus());
            }
        },
        remove: function (playerID) {
            this.players = this.players.filter(player => player.id != playerID);
        },
        save: function () {
            this.loading = true;
            this.$store.dispatch('set_players', this.players);
            this.$store.commit('players_setup_complete');
            this.$router.push('/setup/games');
        }
    }
}
</script>

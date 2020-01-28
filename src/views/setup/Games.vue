<template>
    <div class="games-setup px-10">
        <h1 class="headline text-center mt-5">Juegos</h1>

        <div class="d-flex justify-space-between mt-5 mb-4">
            <v-btn color="green" class="mr-2" @click="globalAddTime">
                <v-icon>mdi-clock-outline</v-icon> <span class="ml-2">+ 0:30</span>
            </v-btn>

            <v-btn color="red" class="ml-2" @click="globalRemoveTime">
                <v-icon>mdi-clock-outline</v-icon> <span class="ml-2">- 0:30</span>
            </v-btn>
        </div>

        <v-card
            v-for="game in games" :key="game.id"
            class="d-flex justify-space-between align-center mt-5 py-4 pl-4 pr-2"
            raised
        >
            <div>{{ game.name }}</div>

            <div class="d-flex align-center">
                <v-btn text x-small color="red" fab @click="removeTime(game.id)" class="focus:outline-none">
                    <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span class="green--text mx-1 font-weight-bold">
                    {{ game.time | formatTime }}
                </span>
                <v-btn text x-small color="green" fab @click="addTime(game.id)" class="focus:outline-none">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>
        </v-card>

        <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
            autocomplete="off"
            class="mt-6"
        >
            <v-container>
                <v-row>
                    <v-col cols="8">
                        <v-text-field
                            v-model="name"
                            ref="name"
                            :counter="20"
                            label="Nombre del juego"
                            placeholder="2 Trios"
                            :rules="nameRules"
                            required
                            autocomplete="off"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <v-text-field
                            v-model="shortname"
                            ref="shortname"
                            :counter="5"
                            label="Nombre corto"
                            placeholder="2T"
                            :rules="shortnameRules"
                            required
                            autocomplete="off"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-container>

            <v-btn
                    :disabled="!valid"
                    color="primary"
                    block
                    @click.prevent="add"
                    class="mt-5"
                >
                    Añadir juego
                </v-btn>
        </v-form>

        <v-btn
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

        if (store.state.globalStatus.gamesSetupCompleted) {
            router.push('/preparation');
        } else {
            next();
        }
    },
    data: function () {
        return {
            name: '',
            shortname: '',
            games: [
                { id: 1, name: '2 Trios', shortname: '2T', time: 300 },
                { id: 2, name: '1 Trio 1 Escala', shortname: '1T 1E', time: 300 },
                { id: 3, name: '2 Escalas', shortname: '2E', time: 300 },
                { id: 4, name: '3 Trios', shortname: '3T', time: 300 },
                { id: 5, name: '2 Trios 1 Escala', shortname: '2T 1E', time: 300 },
                { id: 6, name: '2 Escalas 1 Trio', shortname: '2E 1T', time: 300 },
                { id: 7, name: '4 Trios', shortname: '4T', time: 300 },
                { id: 8, name: '3 Escalas', shortname: '3E', time: 300 },
                { id: 9, name: 'Escala sucia', shortname: 'ES', time: 300 },
                { id: 10, name: 'Escala real', shortname: 'ER', time: 300 },
            ],
            loading: false,

            valid: true,
            lazy: false,
            nameRules: [
                v => !!v || 'Debe ingresar un nombre',
                v => (v && v.length <= 20) || 'El nombre no puede tener más de 20 caracteres',
                v => !this.games.find(g => g.name.toLowerCase() == v) || 'El nombre ya fue ingresado'
            ],
            shortnameRules: [
                v => !!v,
                v => (v && v.length <= 5),
                v => !this.games.find(g => g.shortname.toLowerCase() == v)
            ]
        }
    },
    methods: {
        add: function () {
            if (this.$refs.form.validate()) {
                this.games.push({
                    id: this.games.length + 1,
                    name: this.name,
                    shortname: this.shortname,
                    time: 300
                });

                this.name = '';
                this.shortname = '';
            }
        },
        save: function () {
            this.loading = true;
            this.$store.dispatch('set_games', this.games);
            this.$store.commit('games_setup_complete');

            this.$store.commit('set_current_game', 1);
            this.$store.commit('set_current_player', 1);

            this.$store.commit('set_rotating_player', 1);

            this.$store.commit('game_init');

            this.$router.push('/preparation');
        },
        globalAddTime() {
            this.games.forEach(game => game.time += 30);
        },
        globalRemoveTime() {
            this.games.forEach(game => {
                if (game.time > 30) {
                    game.time -= 30;
                }
            });
        },
        removeTime: function (gameID) {
            let game = this.games.find(game => game.id == gameID);
            if (game.time > 30) {
                game.time -= 30;
            }
        },
        addTime: function (gameID) {
            let game = this.games.find(game => game.id == gameID);
            game.time += 30;
        }
    }
}
</script>
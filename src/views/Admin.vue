<template>
    <div class="mx-8 lg:mx-32">
        <h1 class="heading py-5">Savegames</h1>

        <table
            v-if="games.length"
            class="table-auto w-full bg-gray-900 shadow-lg rounded-lg"
        >
            <thead class="text-blue-500">
                <tr>
                    <th class="border border-gray-800 px-4 py-3">GameID</th>
                    <th class="border border-gray-800 px-4 py-3">Jugadores</th>
                    <th class="border border-gray-800 px-4 py-3">Juegos</th>
                    <th class="border border-gray-800 px-4 py-3">Ultimo guardado</th>
                    <th class="border border-gray-800 px-4 py-3"></th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="game in games" :key="game.gameID"
                >
                    <td class="border border-gray-800 px-4 py-3 text-center font-semibold text-green-500">
                        {{ game.gameID }}
                    </td>
                    <td class="border border-gray-800 px-4 py-3 text-center" :title="makePlayersTitle(game.gameID)">
                        {{ game.state.players.length }} jugadores
                    </td>
                    <td class="border border-gray-800 px-4 py-3 text-center" :title="makeGamesTitle(game.gameID)">
                        {{ game.state.results.length }} de {{ game.state.games.length }} juegos completados
                    </td>
                    <td class="border border-gray-800 px-4 py-3 text-center">
                        {{ game.lastSave | moment('from', 'now') }}
                    </td>
                    <td class="border border-gray-800 px-4 py-3 text-center">
                        <button class="text-red-500 focus:outline-none" title="Eliminar savegame" @click="deleteSavegame(game.gameID)">
                            <font-awesome-icon icon="trash-alt"/>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else>No hay savegames registrados.</div>

        <div class="text-blue-500 text-center pt-8">
            <router-link to="/">Volver al inicio</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'admin',
    data: function () {
        return {
            games: []
        };
    },
    mounted () {
        fetch('/game-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            this.games = data.games;
        });
    },
    methods: {
        makePlayersTitle: function (gameID) {
            const game = this.games.find(game => game.gameID == gameID);
            let text = '';
            game.state.players.map(player => {
                text += player.name + '\n';
            });
            return text;
        },
        makeGamesTitle: function (gameID) {
            const game = this.games.find(game => game.gameID == gameID);
            let text = '';
            game.state.games.map(game => {
                text += game.name + '\n';
            });
            return text;
        },
        deleteSavegame: function (gameID) {
            if (confirm('¿Está seguro de eliminar este savegame?')) {
                fetch('/game-data/' + gameID, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json()).then(gameID => {
                    this.games = this.games.filter(game => game.gameID != gameID);
                });
            }
        }
    }
}
</script>
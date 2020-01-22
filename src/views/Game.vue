<template>
    <div>
        <div class="flex justify-between p-2 text-gray-500 text-2xl" v-if="!gameover">
            <button
                class="focus:outline-none"
                @click="togglePause"
            >
                <font-awesome-icon :icon="paused ? 'play' : 'pause'"/>
            </button>

            <save-button v-if="!saving" class="focus:outline-none" @saved="handleSave"/>
            <div v-else class="flex items-center font-semibold">Guardando...</div>

            <button
                class="focus:outline-none"
                @click="finishGame"
            >
                <font-awesome-icon icon="check"/>
            </button>
        </div>

        <button
            @click="finishTurn"
            :class="{ 'opacity-25': paused }"
            class="min-w-full focus:outline-none"
            :disabled="paused"
        >
            <div class="min-h-screen pt-1">
                <div v-if="!gameover">
                    <h1 class="text-blue-500 text-4xl font-semibold pt-5">
                        {{ currentGame.name }}
                    </h1>
                    <div class="text-6xl font-bold -mb-4" :class="textColor(currentPlayer.timeLeft)">{{ currentPlayer.name.toUpperCase() }}</div>

                    <countdown-timer
                        v-if="currentPlayer.timeLeft > 0"
                        :time="currentPlayer.timeLeft"
                        autoinit
                        :paused="paused"
                        :warningTime="warningTime"
                        :dangerTime="dangerTime"
                        @updatedTime="handleUpdatedTime"
                        @timeout="handleTimeout"
                        class="font-bold text-7xl"
                    />
                    <div v-else class="mt-2 font-semibold text-red-500 text-6xl">
                        Perdiste
                    </div>

                    <div class="mt-4">
                        <div
                            v-for="player in playersWithoutCurrent" :key="player.id"
                            class="text-xl font-semibold mb-1"
                            :class="textColor(player.timeLeft)"
                        >
                            {{ player.name }}: {{ player.timeLeft | formatTime }}
                            <span v-if="player.timeLeft == 260" class="ml-1">
                                <font-awesome-icon icon="cannabis"/>
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else class="mt-8">
                    <h1 class="text-blue-500 text-4xl font-semibold">
                        {{ currentGame.name }}
                    </h1>
                    <div class="text-green-500 mt-8">
                        <div class="text-6xl">
                            <font-awesome-icon icon="crown" />
                        </div>
                        <div class="text-6xl font-bold -mt-4">
                            {{ currentPlayer.name.toUpperCase() }}
                        </div>
                    </div>

                    <div class="mt-10 text-4xl font-thin px-10 text-gray-500">Toque para continuar</div>
                </div>
            </div>
        </button>
    </div>
</template>

<script>
import CountdownTimer from '@/components/CountdownTimer.vue';
import SaveButton from '@/components/SaveButton.vue';

export default {
    beforeRouteEnter (to, from, next) {
        const store = require('@/store').default;
        const router = require('@/router').default;

        if (! store.state.globalStatus.gameInit) {
            router.push('/setup/players');
        } else {
            next();
        }
    },
    components: {
        CountdownTimer,
        SaveButton
    },
    data: function () {
        return {
            currentGame: this.$store.getters.gameById(this.$store.state.currentGameId),
            currentPlayer: this.$store.getters.playerById(this.$store.state.currentPlayerId),
            warningTime: 60,
            dangerTime: 30,
            gameover: false,
            paused: false,
            saving: false
        };
    },
    created () {
        window.addEventListener('beforeunload', this.leaving);
        this.$store.dispatch('set_timers', this.currentGame.time);
        this.checkWinner(0);
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.leaving);
    },
    methods: {
        handleUpdatedTime: function (newTime) {
            this.$set(this.currentPlayer, 'timeLeft', newTime);
        },
        handleTimeout: function () {
            this.savePlayerCurrentTime();

            this.checkWinner(1500);
        },
        handleSave: function () {
            this.saving = true;

            setTimeout(() => {
                this.saving = false;
            }, 2000);
        },
        togglePause: function () {
            this.paused = !this.paused;
        },
        finishTurn: function () {
            if (this.$store.getters.playersLeftCount == 1) {
                this.finishGame();
                return;
            }

            this.savePlayerCurrentTime();

            this.currentPlayer = this.$store.getters.nextPlayerAfter(this.currentPlayer.id);

            this.$store.commit('set_current_player', this.currentPlayer.id);
        },
        leaving: function () {
            this.savePlayerCurrentTime();
        },
        savePlayerCurrentTime: function () {
            this.$store.commit('set_timer_for_player', {
                playerId: this.currentPlayer.id,
                time: this.currentPlayer.timeLeft
            });
        },
        checkWinner: function (timeout) {
            if (this.$store.getters.playersLeftCount == 1) {
                setTimeout(() => {
                    this.gameover = true;

                    this.currentPlayer = this.$store.getters.winner;

                    this.$store.commit('set_current_player', this.currentPlayer.id);
                }, timeout);
            }
        },
        finishGame: function () {
            this.$router.push(`/game/${this.currentGame.id}/results`);
        },
        textColor: function (value) {
            // estos valores deberian conncidir con los warningTime y darngerTime del countdown-timer
            return {
                'text-yellow-500': value <= this.warningTime && value > this.dangerTime,
                'text-red-500': value <= this.dangerTime,
                'text-green-500': value == 260
            };
        }
    },
    computed: {
        playersWithoutCurrent: function () {
            return this.$store.state.players.filter(player => player.id != this.currentPlayer.id);
        }
    }
}
</script>
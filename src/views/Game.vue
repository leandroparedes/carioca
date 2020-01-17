<template>
    <div class="px-4">
        <div class="text-center font-semibold pt-3">
            <div class="text-2xlpt-3 text-gray-500">{{ game.name }}</div>
            <h1 class="text-6xl font-bold">{{ current.player.name.toUpperCase() }}</h1>
            <div>{{ current.player.leftTime }}</div>
        </div>
        <button @click="finishTurn">Finish turn</button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            currentPos: 0,
            game: this.$store.getters.gameById(this.$route.params.id),
            current: {
                player: this.$store.getters.playerByPos(0),
                interval: null
            }
        }
    },
    mounted () {
        this.$store.commit('set_left_time', {
            pos: this.current.player.pos,
            leftTime: this.current.player.leftTime || this.game.secs
        });

        var that = this;
        this.current.interval = setInterval(function () {
            if (that.current.player.leftTime <= 0) {
                clearInterval(that.current.interval);
                that.$store.commit('out_player', that.current.player.pos);
                return;
            }

            that.$set(that.current.player, 'leftTime', --that.current.player.leftTime);
        }, 1000);
    },
    methods: {
        finishTurn: function () {
            ++this.currentPos;

            if (this.currentPos > this.$store.getters.playersLength - 1) {
                this.currentPos = 0;
            }

            //paramos el tiempo del current
            clearInterval(this.current.interval);
            
            // change player
            this.$set(this.current, 'player', this.$store.getters.playerByPos(this.currentPos));

            // set timer new current player
            var that = this;
            this.current.interval = setInterval(function () {
                if (that.current.player.leftTime <= 0) {
                    clearInterval(that.current.interval);
                    that.$store.commit('out_player', that.current.player.pos);
                    return;
                }

                that.$set(that.current.player, 'leftTime', --that.current.player.leftTime);
            }, 1000);

            // comenzamos el tiempo del nuevo
            this.$store.commit('set_left_time', {
                pos: this.current.player.pos,
                leftTime: this.current.player.leftTime || this.game.secs
            });
        }
    }
}
</script>
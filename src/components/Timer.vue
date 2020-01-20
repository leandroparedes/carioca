<template>
    <div class="text-6xl font-bold" :class="textColor">
        {{ timerTime | formatTime }}
    </div>
</template>

<script>
export default {
    props: ['time', 'init'],
    data: function () {
        return {
            timerTime: this.time,
            timerInterval: null
        };
    },
    computed: {
        textColor: function () {
            return {
                'text-yellow-500': this.timerTime <= 30 && this.timerTime > 15,
                'text-red-500': this.timerTime <= 15
            };
        }
    },
    watch: {
        init: function () {
            if (this.init) {
                this.initTime();
            }
        }
    },
    created () {
        if (this.init) {
            this.initTime();
        }
    },
    methods: {
        initTime: function () {
            this.timerInterval = setInterval(() => {
                if (this.timerTime <= 0) {
                    this.$emit('timeout');
                    clearInterval(this.timerInterval);
                }
                this.timerTime--;
            }, 1000);
        }
    },
    beforeDestroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}
</script>
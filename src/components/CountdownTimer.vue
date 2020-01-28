<template>
    <div :class="classObject">
        {{ initialTime | formatTime }}
    </div>
</template>

<script>
export default {
    name: 'CountdownTimer',
    props: {
        time: { type: Number, required: true },
        autoinit: { type: Boolean, default: false },
        paused: { type: Boolean, default: false },
        warningTime: { type: Number, default: 60 },
        dangerTime: { type: Number, default: 30 },
        intervals: { type: Number, default: 1 }
    },
    data: function () {
        return {
            initialTime: this.time,
            timerInterval: null
        };
    },
    /**
     * Este hook es llamado antes que MOUNTED. Manipulación del DOM no disponible
     */
    created () {
        this.handleAutoinit(this.autoinit);
    },
    beforeDestroy () {
        clearInterval(this.timerInterval);
    },
    watch: {
        autoinit: function (newValue, oldValue) {
            this.handleAutoinit(newValue);
        },
        time: function (newValue, oldValue) {
            this.initialTime = newValue;
        },
        paused: function () {
            if (this.paused) {
                clearInterval(this.timerInterval);
            } else {
                this.initInterval();
            }
        }
    },
    methods: {
        handleAutoinit: function (autoinit) {
            if (autoinit) {
                this.initInterval();
            } else {
                clearInterval(this.timerInterval);
            }
        },
        initInterval: function () {
            this.timerInterval = setInterval(() => {
                this.initialTime--;
                this.$emit('updatedTime', this.initialTime);

                if (this.initialTime == 0) {
                    this.$emit('timeout');
                    clearInterval(this.timerInterval);
                    return;
                }
            }, this.intervals * 1000);
        }
    },
    computed: {
        classObject: function () {
            return {
                'yellow--text': this.initialTime <= this.warningTime && this.initialTime > this.dangerTime,
                'red--text': this.initialTime <= this.dangerTime,
                'blink': this.paused
            };
        }
    },
}
</script>

<style scoped>
@keyframes blink {
    50% {
        opacity: 0.0;
    }
}
@-webkit-keyframes blink {
    50% {
        opacity: 0.0;
    }
}
.blink {
    animation: blink 1s step-start 0s infinite;
    -webkit-animation: blink 1s step-start 0s infinite;
}
</style>
<template>
    <div :class="statusColor">
        {{ initialTime | formatTime }}
    </div>
</template>

<script>
export default {
    name: 'CountdownTimer',
    props: {
        time: { type: Number, required: true },
        autoinit: { type: Boolean, default: false },
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
        statusColor: function () {
            return {
                'text-yellow-500': this.initialTime <= this.warningTime && this.initialTime > this.dangerTime,
                'text-red-500': this.initialTime <= this.dangerTime
            };
        }
    },
}
</script>
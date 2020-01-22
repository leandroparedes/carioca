<template>
    <button v-on="mode == 'save' ? { click: save } : { click: load }">
        <font-awesome-icon icon="save"/>
    </button>
</template>

<script>
export default {
    props: {
        mode: { type: String, default: 'save' }
    },
    methods: {
        save: function () {
            const state = Object.assign({}, this.$store.state);
            const path = this.$router.currentRoute.path;

            localStorage.savegame = JSON.stringify({ state, path });

            this.$emit('saved');
        },
        load: function () {
            const savegame = JSON.parse(localStorage.savegame);

            this.$store.replaceState(savegame.state);

            this.$router.push(savegame.path);
        }
    }
}
</script>
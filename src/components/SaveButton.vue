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
            const store = Object.assign({}, this.$store.state);
            const path = this.$router.currentRoute.path;

            localStorage.savegame = JSON.stringify({ store, path });

            this.$emit('saved');
        },
        load: function () {
            const savegame = JSON.parse(localStorage.savegame);

            this.$store.replaceState(savegame.store);

            this.$router.push(savegame.path);
        }
    }
}
</script>
<template>
    <button v-on="mode == 'save' ? { click: save } : { click: load }">
        <font-awesome-icon icon="save"/>
    </button>
</template>

<script>
import shared from '@/shared';

export default {
    props: {
        mode: { type: String, default: 'save' }
    },
    created () {
        this.save = shared.save;
    },
    methods: {
        load: function () {
            const savegame = JSON.parse(localStorage.savegame);

            this.$store.replaceState(savegame.state);

            this.$router.push(savegame.path);
        }
    }
}
</script>
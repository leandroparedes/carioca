<template>
    <div class="flex justify-center pt-12">
        <div class="bg-gray-900 px-6 pt-4 pb-6 rounded shadow-lg">
            <h1 class="heading">Iniciar sesión</h1>

            <div v-if="message" class="text-red-500 font-semibold py-3">
                {{ message }}
            </div>

            <form @submit.prevent="submit">
                <div class="mb-2">
                    <label for="id-username" class="block">Nombre de usuario</label>
                    <input id="id-username" type="text" class="input w-full" v-model="username">
                </div>

                <div class="mb-4">
                    <label for="id-password" class="block">Contraseña</label>
                    <input id="id-password" type="password" class="input w-full" v-model="password">
                </div>

                <input type="submit" value="Login" class="btn btn-blue cursor-pointer">
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'auth',
    beforeRouteEnter (to, from, next) {
        const store = require('@/store').default;
        const router = require('@/router').default;

        if (store.state.isLoggedIn) {
            router.push('/admin');
        } else {
            next();
        }
    },
    data: function () {
        return {
            username: '',
            password: '',
            message: ''
        };
    },
    methods: {
        submit: function () {
            if (this.username && this.password) {
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                }).then(response => {
                    if (response.ok) {
                        this.$store.commit('is_logged_in', true);
                        this.$router.push('/admin');
                    } else {
                        this.message = 'Usuario o contraseña incorrecta';
                    }
                });
            }
        }
    }
}
</script>
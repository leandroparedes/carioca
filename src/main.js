import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// vue modal setup
import VModal from 'vue-js-modal';
Vue.use(VModal);

// fontawesome setup
import { library } from '@fortawesome/fontawesome-svg-core';

import {
    faPause,
    faPlay,
    faCheck,
    faPlus,
    faCrown,
    faCannabis,faSave,
    faTrophy,
    faClock,
    faCalculator,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
    faPause,
    faPlay,
    faCheck,
    faPlus,
    faCrown,
    faCannabis,faSave,
    faTrophy,
    faClock,
    faCalculator,
    faTimes
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

// tailwind css file
import '@/assets/css/main.css'

import './registerServiceWorker'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.filter('formatTime', function (value) {
    return(value-(value%=60))/60+(9<value?':':':0')+value;
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')

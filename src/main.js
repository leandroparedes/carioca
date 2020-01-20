import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/css/main.css'

Vue.config.productionTip = false

Vue.filter('formatTime', function (value) {
    return(value-(value%=60))/60+(9<value?':':':0')+value;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

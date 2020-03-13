import Vue from 'vue';
import Logger from '@/plugins/logger';
import App from './App.vue';
import router from './router';

import store from './store';

Vue.use(Logger, { debug: false });
Vue.config.productionTip = false;

Vue.$log.info('vue-eslint launch...');
new Vue({
  router,
  store,
  render(h) { return h(App); },
}).$mount('#app');

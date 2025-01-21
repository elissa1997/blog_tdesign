import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// import '@/assets/style/index.scss';
import TDesign from 'tdesign-vue';
import 'tdesign-vue/es/style/index.css';
import { message } from 'tdesign-vue';
import dayjs from "dayjs";
import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

Vue.prototype.$dayjs = dayjs;
Vue.prototype.$message = message;




Vue.use(TDesign);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

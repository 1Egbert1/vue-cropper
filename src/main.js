import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCropper from "vue-cropper";
import "./assets/plugins/element";
Vue.use(VueCropper);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

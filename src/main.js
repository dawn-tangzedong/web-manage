// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题

Vue.use(ElementUI)
Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   router,
//   components: {App},
//   template: '<App/>'
// })
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios";
import tree from "vue-table-with-tree-grid";
// 基于 Quill、适用于 Vue 的富文本编辑器，支持服务端渲染和单页应用。
import VueQuillEditor from "vue-quill-editor";
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 安装VueQuillEditor
Vue.use(VueQuillEditor)
// 安装ElementUI
Vue.use(ElementUI)
// Vue原型链上配置axios
Vue.prototype.$http = axios
// 配置基础地址
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 定义树形表格组件
Vue.component('tree', tree)
// 全局注册过滤器
Vue.filter('getTime', function (time) {
  const datetime = new Date(time)

  const yy = datetime.getFullYear()
  const mm = (datetime.getMonth() + 1 + '').length === 1 ? ('0' + (datetime.getMonth() + 1)) : (datetime.getMonth() + 1)
  const dd = (datetime.getDate() + '').length === 1 ? ('0' + datetime.getDate()) : (datetime.getDate())

  const hh = (datetime.getHours() + '').length === 1 ? ('0' + datetime.getHours()) : (datetime.getHours())
  const ff = (datetime.getMinutes() + '').length === 1 ? ('0' + datetime.getMinutes()) : (datetime.getMinutes())
  const ss = (datetime.getSeconds() + '').length === 1 ? ('0' + datetime.getSeconds()) : (datetime.getSeconds())
  return `${yy}-${mm}-${dd} ${hh}:${ff}:${ss}`
})


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

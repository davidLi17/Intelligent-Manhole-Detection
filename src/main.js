import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as echarts from 'echarts'
import VueParticles from 'vue-particles'
import VueAMap from 'vue-amap'

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
document.title = '道路隐患检测管理系统';

Vue.use(ElementUI);
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'b3023bcf85b840ca50eaa626c546fd5f',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder'],
  v: '1.4.4',
  uiVersion: '1.0'
})
window._AMapSecurityConfig = {
  securityJsCode: 'cf04c0a96bf743325203cf91212b12fc' // 申请key对应的秘钥 -> 注意了，如果不搭配密钥使用，搜索将没有结果
}

Vue.use(VueParticles)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

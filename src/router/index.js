import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import DetialVue from '@/views/Detial.vue'
import MaintenanceVue from '../views/Maintenance.vue'
import UsermanagerVue from '@/views/Usermanager.vue'
import Amap from '@/views/Amap.vue'
import AboutView from '../views/AboutView.vue'
import ChatHome from '../views/chatHome/index.vue'
import Home from "@/views/home.vue";
import Divided from '@/views/Divided.vue'
Vue.use(VueRouter)
// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

const routes = [
  {
    path: '/',
    redirect: '/login',

  },
  {
    path: '/upload',
    name: 'upload',
    component: AboutView
  },
  {
    path: '/allocation',
    name: 'allocation',
    component: Divided
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      showIf: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView

  },
  {
    path: '/detial/:id',
    name: 'detial',
    component: DetialVue,
    meta: {
      showIf: true
    }
  },
  {
    path: '/records',
    name: 'records',
    component: MaintenanceVue
  },
  {
    path: '/trends',
    name: 'trends',
    component: UsermanagerVue
  },
  {
    path: '/Amap',
    name: 'Amap',
    component: Amap
  },
  {
    path: "/home",
    name: "home",
    redirect: "/support",
    component: Home,
    children: [
      {
        path: "/support",
        name: "support",
        component: ChatHome,
      },
    ]
  },
  
]

const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  console.log('导航到:', to.name);
  // 例如，检查用户是否已登录
  const isAuthenticated = localStorage.getItem('token'); // 这里应该是你的认证逻辑
  console.log(localStorage.getItem('token'));
  if (to.name !== 'login' && isAuthenticated == null) {
    // 如果用户未认证且尝试访问非 Home 页面，则重定向到 Home 页面
    next({ name: 'login' });
  } else {
    next(); // 允许导航
  }
});

export default router
// router.beforeEach 的参数
// router.beforeEach 是 Vue Router 提供的一个全局导航守卫，它接受一个回调函数，该回调函数有三个参数：to、from 和 next。
// **to**：
// to 是一个路由对象，表示即将要进入的目标路由。
// 主要属性：
// to.name：目标路由的名称。
// to.path：目标路由的路径。
// to.params：目标路由的路径参数。
// to.query：目标路由的查询参数。
// **from**：
// from 也是一个路由对象，表示当前导航正要离开的路由。
// 主要属性：
// from.name：当前路由的名称。
// from.path：当前路由的路径。
// from.params：当前路由的路径参数。
// from.query：当前路由的查询参数。
// **next**：
// next 是一个函数，必须调用它来resolve这个钩子。
// 具体用法：
// next()：继续当前导航。
// next(false)：中断当前导航。
// next('/') 或 next({ path: '/' })：跳转到一个不同的地址。
// next(error)：如果传入参数是一个 Error 实例，导航会被终止且该错误会被传递给 router.onError() 注册过的回调。

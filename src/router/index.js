import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Fix navigation duplicated error handling
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}
function AsyncView(component) {
  return () => ({
    component: import(/* webpackPrefetch: true */`@/views/${component}.vue`),
    loading: () => import('@/components/LoadingComponent.vue'),
    delay: 200
  })
}

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/upload',
    name: 'upload',
    component: AsyncView("AboutView"),
  },
  {
    path: '/allocation',
    name: 'allocation',
    // component: () => import(/* webpackPrefetch: true */ '@/views/Divided.vue')
    component: AsyncView("Divided"),
  },
  {
    path: '/login',
    name: 'login',
    // component: () => import('../views/Login.vue'),
    component: AsyncView("Login"),
    meta: {
      showIf: true
    }
  },
  {
    path: '/detial/:id',
    name: 'detial',
    // component: () => import(/* webpackPrefetch: true */ '@/views/Detial.vue'),
    component: AsyncView("Detial"),
    meta: {
      showIf: true
    }
  },
  {
    path: '/records',
    name: 'records',
    // component: () => import(/* webpackPrefetch: true */ '../views/Maintenance.vue')
    component: AsyncView("Maintenance"),
  },
  {
    path: '/trends',
    name: 'trends',
    // component: () => import(/* webpackPrefetch: true */ '@/views/Usermanager.vue')
    component: AsyncView("Usermanager"),
  },
  {
    path: '/Amap',
    name: 'Amap',
    // component: () => import(/* webpackPrefetch: true */ '@/views/Amap.vue')
    component: AsyncView("Amap"),
  },
  {
    path: "/home",
    name: "home",
    redirect: "/support",
    // component: () => import(/* webpackPrefetch: true */ "@/views/home.vue"),
    component: AsyncView("home"),
    children: [
      {
        path: "/support",
        name: "support",
        // component: () => import(/* webpackPrefetch: true */ '../views/chatHome/index.vue'),
        component: AsyncView("chatHome/index"),
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

// Navigation guards for preloading and authentication
router.beforeEach((to, from, next) => {
  console.log(`导航到:${to.name}组件`)
  const isAuthenticated = sessionStorage.getItem('token')

  // Preload related components based on current route
  if (to.name === 'upload') {
    // Preload pages likely to be navigated to from Login
    import('@/views/Detial.vue')
    import('@/views/Maintenance.vue')
    import('@/views/Usermanager.vue')
  }

  // Authentication check
  if (to.name !== 'login' && isAuthenticated == null) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
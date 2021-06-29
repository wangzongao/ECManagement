import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/welcome',
    component: () => import('@/views/Home'),
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/components/Welcome')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/components/user/Users')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('@/components/power/Roles')
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import('@/components/power/Rights')
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('@/components/goods/Goods')
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('@/components/goods/Goods')
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import('@/components/goods/Params')
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('@/components/goods/Categories')
      },
      {
        path: '/addGoods',
        name: 'AddGoods',
        component: () => import('@/components/goods/AddGoods')
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/components/order/Orders')
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('@/components/report/Reports')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 路由导航守卫
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next()
//   } else {
//     const token = window.sessionStorage.getItem('token');
//     if (!token) {
//       next('/login')
//     }else {
//       next()
//     }
//   }
// })
export default router

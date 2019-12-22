import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcom from '../components/Welcom.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/GoodsList.vue'
import Add from '../components/goods/Add.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/#', redirect: '/login' },
  { path: '/home', component: Home,
    redirect: '/welcom',
    children: [{ path: '/welcom', component: Welcom },
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/categories', component: Cate},
      {path: '/params', component: Params},
      {path: '/goods', component: GoodsList},
      {path: '/goods/add', component: Add}
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(
  (to, from, next) => {
    if(to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
  }
)
export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Login from '../components/Login.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Home from '../components/Home.vue'
const Welcom = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcom.vue')
// import Welcom from '../components/Welcom.vue'
//

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
// import Users from '../components/user/Users.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
// import Rights from '../components/power/Rights.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')
// import Roles from '../components/power/Roles.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
// import Cate from '../components/goods/Cate.vue'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')
// import Params from '../components/goods/Params.vue'
const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/GoodsList.vue')
// import GoodsList from '../components/goods/GoodsList.vue'
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')
// import Add from '../components/goods/Add.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
// import Order from '../components/order/Order.vue'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')
// import Report from '../components/report/Report.vue'

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
      {path: '/goods/add', component: Add},
      {path: '/orders', component: Order},
      {path: '/reports', component: Report}
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

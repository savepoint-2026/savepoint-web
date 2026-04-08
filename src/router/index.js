import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/pages/DashboardView.vue'
import LoginView from '@/pages/LoginView.vue'
import TransactionView from '@/pages/TransactionView.vue'
import TransactionAddView from '@/pages/TransactionAddView.vue'
import SummaryView from '@/pages/SummaryView.vue'
import GroupRaceView from '@/pages/GroupRaceView.vue'
import NotFoundView from '@/pages/NotFoundView.vue'
import UserProfileView from '@/pages/UserProfileView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/profile', name: 'Profile', component: UserProfileView },
  { path: '/transactions', name: 'Transactions', component: TransactionView },
  { path: '/add', name: 'TransactionAdd', component: TransactionAddView },
  { path: '/summary', name: 'Summary', component: SummaryView },
  { path: '/groups', name: 'GroupRace', component: GroupRaceView },
  // 404 페이지
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 로그인 여부 체크
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('userId')

//   if (to.path !== '/login' && !isAuthenticated) {
//     next('/login')
//   } else if (to.path === '/login' && isAuthenticated) {
//     next('/')
//   } else {
//     next()
//   }
// })

export default router

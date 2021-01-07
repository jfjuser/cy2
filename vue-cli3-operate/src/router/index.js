import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
Vue.use(Router)
export default new Router({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: '登录',
			meta: {
				title: '登录'
			},
			component: () => import('../components/login.vue')
		},
		{
			path: '/reset',
			name: '重置',
			meta: {
				title: '重置'
			},
			component: () => import('../components/reset.vue')
		}
	]
})
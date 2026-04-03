import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{
		path: '/',
		redirect: '/Login'
	},
	{
		path: '/Login',
		name: 'Login',
		component: () => import('@/views/Login.vue')
	},
	{
		path: '/UserList',
		name: 'UserList',
		component: () => import('@/views/UserList.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: '/Login'
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router 
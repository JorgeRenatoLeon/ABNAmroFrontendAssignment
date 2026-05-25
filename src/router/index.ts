import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import ShowDetailView from '@/views/ShowDetailView.vue'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'dashboard',
			component: DashboardView,
		},
		{
			path: '/show/:id',
			name: 'show-detail',
			component: ShowDetailView,
			props: true,
		},
		{
			path: '/test/components',
			name: 'components-dev',
			component: () => import('@/views/ComponentsView.vue'),
		},
	],
	scrollBehavior(_to, _from, savedPosition) {
		if (savedPosition) return savedPosition
		return { top: 0, behavior: 'smooth' }
	},
})

export default router
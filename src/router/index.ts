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
		{
			path: '/person/:id',
			name: 'person',
			component: () => import('@/views/PersonView.vue')
		},
		{
			path: '/timeline',
			name: 'timeline',
			component: () => import('@/views/TimelineView.vue')
		},
		{
			path: '/map',
			name: 'map',
			component: () => import('@/views/MapView.vue')
		},
	],
	scrollBehavior(_to, _from, savedPosition) {
		if (savedPosition) return savedPosition
		return { top: 0, behavior: 'smooth' }
	},
})

export default router
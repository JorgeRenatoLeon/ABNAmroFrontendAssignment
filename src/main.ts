import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from '@/plugins/i18n'
import App from './App.vue'
import router from './router'
import { useUIStore } from '@/stores/ui'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

const uiStore = useUIStore(pinia)
const theme = uiStore.theme
document.documentElement.setAttribute('data-theme', theme)
document.documentElement.classList.toggle('dark', theme === 'dark')

app.mount('#app')
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#2563EB',   // синий
          secondary: '#334155', // темно-серый
          accent: '#10B981',    // зеленый
          surface: '#1E293B',   // темно-синий фон
          background: '#0F172A', // очень темный фон
          error: '#EF4444',     // красный
          success: '#10B981',   // зеленый
          warning: '#F59E0B',   // оранжевый
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vuetify)

app.mount('#app')
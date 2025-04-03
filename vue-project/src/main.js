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

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#000000',         // Чисто чёрный фон
    surface: '#121212',            // Очень тёмный серый
    primary: '#2563EB',            // Синий
    secondary: '#1E293B',          // Тёмно-синий
    accent: '#10B981',             // Зелёный
    error: '#EF4444',              // Красный
    info: '#3B82F6',               // Светло-синий
    success: '#10B981',            // Зелёный
    warning: '#F59E0B',            // Оранжевый
    'on-background': '#FFFFFF',
    'on-surface': '#E2E8F0',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-accent': '#FFFFFF',
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#000000',
  },
  variables: {
    'border-color': '#2D3748',
    'border-opacity': 0.8,
    'high-emphasis-opacity': 0.9,
    'medium-emphasis-opacity': 0.7,
    'disabled-opacity': 0.4,
    'idle-opacity': 0.1,
    'hover-opacity': 0.05,
    'focus-opacity': 0.1,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.16,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212121',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#1E1E1E',
    'theme-on-code': '#CCCCCC',
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customDarkTheme',
    themes: {
      customDarkTheme,
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vuetify)

app.mount('#app')
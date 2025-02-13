import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { getThemeOverrides } from './stores/theme';

// Naive UI
import {
  // create naive ui
  create,
  // component
  NConfigProvider,
  NButton,
  NInput,
  NForm,
  NFormItem,
  NCard,
  NSpace,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NLayoutSider,
  NMenu,
  NSwitch,
  NIcon,
  NMessageProvider,
  NGradientText,
} from 'naive-ui'

import './style.css'

const naive = create({
  components: [
    NButton,
    NConfigProvider,
    NInput,
    NForm,
    NFormItem,
    NCard,
    NSpace,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NLayoutSider,
    NMenu,
    NSwitch,
    NIcon,
    NMessageProvider,
    NGradientText
  ]
})

const app = createApp(App)

app.use(naive)
app.use(createPinia())
app.use(router)

app.mount('#app')

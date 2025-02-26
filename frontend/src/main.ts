import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { getThemeOverrides } from './stores/theme'

// Naive UI
import {
  // create naive ui
  create,
  // component
  NConfigProvider,
  NButton,
  NInput,
  NInputNumber,
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
  NH1,
  NH2,
  NH3,
  NH4,
  NText,
  NP,
  NResult,
  NModal,
  NList,
  NListItem,
  NThing,
  NCollapse,
  NCollapseItem,
  NTag,
  NAlert,
  NStep,
  NSteps,
  NImage,
} from 'naive-ui'

import './style.css'

const naive = create({
  components: [
    NButton,
    NConfigProvider,
    NInput,
    NInputNumber,
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
    NH1,
    NH2,
    NH3,
    NH4,
    NText,
    NP,
    NResult,
    NModal,
    NList,
    NListItem,
    NThing,
    NCollapse,
    NCollapseItem,
    NTag,
    NAlert,
    NStep,
    NSteps,
    NImage,
  ],
})

const app = createApp(App)

app.use(naive)
app.use(createPinia())
app.use(router)

app.mount('#app')

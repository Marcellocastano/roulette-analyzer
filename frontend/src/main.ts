import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import router from './router'
import { i18n } from './i18n'

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
  NGrid,
  NGridItem,
  NDropdown,
  NDataTable
} from 'naive-ui'

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
    NGrid,
    NGridItem,
    NDropdown,
    NDataTable
  ],
})

const app = createApp(App)

app.use(naive)
app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')

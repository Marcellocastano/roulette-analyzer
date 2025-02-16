<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="sidebar-header">
      <h2 v-if="!isCollapsed">Roulette Analyzer</h2>
      <n-button class="sidebar-collapseBtn" round @click="toggleCollapse">
        <n-icon size="18">
          <SidebarCollapse />
        </n-icon>
      </n-button>
    </div>
    <nav class="sidebar-nav">
      <ul class="sidebar-list">
        <li v-for="route in routes" :key="route.path" class="sidebar-listItem">
          <router-link 
            :to="route.path" 
            class="sidebar-link"
            :class="{ 'active': isRouteActive(route.path) }"
          >
            <component :is="route.icon" class="sidebar-listIcon" />
            <n-gradient-text v-if="route.name === 'Play'" :size="18" type="success" class="sidebar-listItemText">
              <strong>Spin Lab</strong>
            </n-gradient-text>
            <span v-else class="sidebar-listItemText">{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <n-dropdown
        trigger="click"
        :options="options"
        @select="handleSelect"
      >
        <div class="sidebar-profileSection">
          <n-icon size="24">
            <UserCircle />
          </n-icon>
          <span class="sidebar-profileName">{{ authStore.user?.name || 'Utente' }}</span>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RouletteIcon from './icons/RouletteIcon.vue'
import { 
  LayoutSidebarLeftCollapse as SidebarCollapse, 
  UserCircle,
  Dashboard as DashboardIcon,
  Settings as EditIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Book as TutorialIcon,
} from '@vicons/tabler'
import { NIcon, NDropdown, NButton } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: DashboardIcon
  },
  {
    path: '/play',
    name: 'Play',
    icon: RouletteIcon
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    icon: TutorialIcon
  },
  {
    path: '/settings',
    name: 'Impostazioni',
    icon: SettingsIcon
  }
]

const isRouteActive = (path: string) => {
  return route.path === path
}

const options = [
  {
    label: 'Piano',
    key: 'plan',
  },
  {
    label: 'Account',
    key: 'account',
  },
  {
    label: 'Sviluppatori',
    key: 'developers',
  },
  {
    label: 'Impostazioni',
    key: 'settings',
  },
  {
    label: 'Logout',
    key: 'logout',
    style: 'color: #FF4D4F; border-top: 1px solid #eee; margin-top: 4px; padding-top: 4px;'
  }
]

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleSelect = (key: string) => {
  if (key === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--sidebar-bg);
  padding: 1rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;

  &-collapsed {
    width: 80px;
    .sidebar-listItemText,
    .sidebar-profileName,
    h2 {
      display: none;
    }
  }
}

:deep(.app-wrapper) {
  padding-left: 250px;
  transition: padding-left 0.3s ease;

  &.sidebar-collapsed {
    padding-left: 80px;
  }
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #2d2d2d;

  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
}

.sidebar-collapseBtn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #2d2d2d;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 16px;

  &:hover {
    background-color: #2d2d2d;
  }

  &.active {
    background-color: #ffd743;
    color: #1f1f1f;

    .sidebar-listIcon {
      color: #1f1f1f;
    }
  }
}

.sidebar-listIcon {
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #2d2d2d;
}

.sidebar-profileSection {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #2d2d2d;
  }
}

.sidebar-profileName {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}
</style>

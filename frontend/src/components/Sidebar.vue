<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <nav class="sidebar-nav">
      <ul class="sidebar-list">
        <li v-for="route in routes" :key="route.path" class="sidebar-listItem">
          <router-link
            :to="route.path"
            class="sidebar-link"
            :class="{ active: isRouteActive(route.path) }"
          >
            <component :is="route.icon" class="sidebar-listIcon" />
            <n-gradient-text
              v-if="route.name === 'Play'"
              :size="18"
              type="error"
              class="sidebar-listItemText"
            >
              <strong>Spin Lab</strong>
            </n-gradient-text>
            <span v-else class="sidebar-listItemText">{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <div class="sidebar-profileSection">
          <n-icon size="28" color="#fff">
            <UserCircle />
          </n-icon>
          <span class="sidebar-profileName">{{ authStore.user?.name || 'Utente' }}</span>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RouletteIcon from './icons/RouletteIcon.vue'
import {
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

defineProps<{
  isCollapsed: boolean
}>()

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    path: '/play',
    name: 'Play',
    icon: RouletteIcon,
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    icon: TutorialIcon,
  },
  {
    path: '/settings',
    name: 'Impostazioni',
    icon: SettingsIcon,
  },
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
    style: 'color: #FF4D4F; border-top: 1px solid #eee; margin-top: 4px; padding-top: 4px;',
  },
]

const handleSelect = (key: string) => {
  if (key === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 220px;
  height: calc(100vh - 60px);
  position: fixed;
  top: 60px;
  left: 0;
  background-color: var(--sidebar-bg);
  padding: 1rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 999;

  &-collapsed {
    width: 0;
    padding: 0;
    overflow: hidden;
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

.sidebar-listItem {
  margin-bottom: 0.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-color-light);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--highlight-orange-color);
  }

  &.active {
    background-color: var(--highlight-orange-color);
  }
}

.sidebar-listIcon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
}

.sidebar-listItemText {
  font-size: 18px;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--highlight-orange-color);
}

.sidebar-profileSection {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--highlight-orange-color);
  }
}

.sidebar-profileName {
  font-size: 18px;
  color: var(--text-color-light);
}
</style>

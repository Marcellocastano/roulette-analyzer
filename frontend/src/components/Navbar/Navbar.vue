<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="logo">
        <img src="/assets/images/logo.png" alt="Roulette Analyzer Logo" />
      </div>
    </div>

    <div class="navbar-center hidden md:flex">
      <ul class="nav-list">
        <li v-for="route in routes" :key="route.path" class="nav-item">
          <router-link
            :to="route.path"
            class="nav-link"
            :class="{ active: isRouteActive(route.path) }"
          >
            <component :is="route.icon" class="nav-icon" />
            <n-gradient-text v-if="route.name === 'Play'" :size="17" type="error">
              <strong>Spin Lab</strong>
            </n-gradient-text>
            <span v-else>{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="navbar-right">
      <n-button class="flex md:hidden menu-toggle" @click="toggleMobileMenu">
        <n-icon size="24">
          <Menu v-if="!isMobileMenuOpen" />
          <X v-else />
        </n-icon>
      </n-button>

      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <div class="user-profile">
          <n-icon size="32" color="#fff">
            <UserCircle />
          </n-icon>
        </div>
      </n-dropdown>
    </div>

    <!-- Menu Mobile -->
    <div
      v-show="isMobileMenuOpen"
      class="mobile-menu md:hidden"
      :class="{ 'mobile-menu-open': isMobileMenuOpen }"
    >
      <ul class="nav-list">
        <li v-for="route in routes" :key="route.path" class="nav-item">
          <router-link
            :to="route.path"
            class="nav-link"
            :class="{ active: isRouteActive(route.path) }"
            @click="closeMobileMenu"
          >
            <component :is="route.icon" class="nav-icon" />
            <n-gradient-text v-if="route.name === 'Play'" :size="18" type="error">
              <strong>Spin Lab</strong>
            </n-gradient-text>
            <span v-else>{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RouletteIcon from '../icons/RouletteIcon.vue'
import {
  UserCircle,
  Menu,
  X,
  Dashboard as DashboardIcon,
  Settings as EditIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Book as TutorialIcon,
} from '@vicons/tabler'
import { NIcon, NDropdown, NButton, NGradientText } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

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
    type: 'divider',
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogoutIcon) }),
  },
]

const isRouteActive = (path: string) => {
  return route.path === path
}

const handleSelect = (key: string) => {
  if (key === 'logout') {
    authStore.logout()
    router.push('/login')
  } else {
    router.push(`/${key}`)
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 85px;
  width: 100%;
  background: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;

  &-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &-center {
    flex: 1;
    justify-content: center;
    height: 100%;
    align-items: center;
  }

  &-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    img {
      height: 75px;
      width: auto;
      object-fit: contain;
    }
  }

  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 1.1rem;
    height: 100%;
    padding-top: 20px;
  }

  .nav-item {
    position: relative;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: var(--text-color-light);
    text-decoration: none;
    border-radius: 1rem 1rem 0 0;
    height: 100%;
    transition: all 0.5s ease;

    &:hover {
      background-color: var(--primary-color);
      transition: all 0.5s ease;
    }

    &.active {
      background-color: var(--primary-color);

      &::after {
        content: '';
        position: absolute;
        background-color: transparent;
        bottom: 0px;
        height: 45px;
        width: 25px;
        border-top-left-radius: 25px;
        box-shadow: 0 -25px 0 0 var(--primary-color);
        right: -25px;
        transform: rotateX(180deg);
      }

      &::before {
        content: '';
        position: absolute;
        background-color: transparent;
        bottom: 0px;
        height: 45px;
        width: 25px;
        border-top-left-radius: 25px;
        box-shadow: 0 -25px 0 0 var(--primary-color);
        left: -25px;
        transform: rotateZ(180deg);
      }
    }
  }

  .nav-icon {
    width: 20px;
    height: 20px;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    color: var(--text-color-light);
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--primary-color);
    }
  }

  .menu-toggle {
    background: none;
    border: none;
    color: var(--text-color-light);
    cursor: pointer;
    padding: 0.5rem;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--primary-color);
    }
  }

  .mobile-menu {
    position: fixed;
    top: 85px;
    left: 0;
    right: 0;
    background-color: var(--secondary-color);
    padding: 1rem;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
    z-index: 999;

    &-open {
      transform: translateY(0);
    }

    .nav-list {
      flex-direction: column;
    }

    .nav-link {
      padding: 1rem;
      border-radius: 0.5rem;
    }

    .active {
      &::after,
      &::before {
        display: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 0.5rem;

    .logo img {
      height: 60px;
    }
  }
}
</style>

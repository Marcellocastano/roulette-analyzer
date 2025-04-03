<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="logo">
        <img src="/assets/images/logo.png" alt="Roulette Pro Logo" />
      </div>
    </div>

    <div class="navbar-center hidden lg:flex">
      <ul class="nav-list">
        <li v-for="route in routes" :key="route.path" class="nav-item">
          <router-link
            :to="route.path"
            class="nav-link"
            :class="{ active: isRouteActive(route.path), 'premium-item': route.premium && !authStore.isPremiumUser }"
            @click="checkPremiumAccess($event, route.path)"
          >
            <span class="flex items-center gap-2">
              <component :is="route.icon" class="nav-icon" />
              {{ route.name }}
              <premium-badge v-if="route.premium" />
            </span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="navbar-right">
      <LanguageSelector class="mr-4" />
      <ThemeToggle class="mr-4" />

      <n-button class="flex lg:hidden menu-toggle" @click="toggleMobileMenu">
        <n-icon size="24">
          <Menu v-if="!isMobileMenuOpen" />
          <X v-else />
        </n-icon>
      </n-button>

      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <div class="user-profile">
          <n-icon size="32">
            <UserCircle />
          </n-icon>
        </div>
      </n-dropdown>
    </div>

    <!-- Menu Mobile -->
    <div
      v-show="isMobileMenuOpen"
      class="mobile-menu lg:hidden"
      :class="{ 'mobile-menu-open': isMobileMenuOpen }"
    >
      <ul class="nav-list">
        <li v-for="route in routes" :key="route.path" class="nav-item">
          <router-link
            :to="route.path"
            class="nav-link"
            :class="{ active: isRouteActive(route.path), 'premium-item': route.premium && !authStore.isPremiumUser }"
            @click="closeMobileMenu"
          >
            <component :is="route.icon" class="nav-icon" />
            <span>{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMessage } from 'naive-ui'
import RouletteIcon from '../icons/RouletteIcon.vue'
import PremiumBadge from '../PremiumBadge.vue'
import LanguageSelector from '../LanguageSelector.vue'
import ThemeToggle from '../ThemeToggle/ThemeToggle.vue'
import {
  UserCircle,
  Menu,
  X,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Book as TutorialIcon,
  CreditCard as PianoIcon,
  Sitemap,
  MessageCircle
} from '@vicons/tabler'
import { NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const message = useMessage()
const isMobileMenuOpen = ref(false)

const routes = computed(() => [
  {
    path: '/dashboard',
    name: t('navbar.dashboard'),
    icon: DashboardIcon,
    premium: false
  },
  {
    path: '/tutorial',
    name: t('navbar.tutorial'),
    icon: TutorialIcon,
    premium: true
  },
  {
    path: '/play',
    name: 'Play',
    icon: RouletteIcon,
    premium: true
  },
  {
    path: '/pricing',
    name: t('navbar.pricing'),
    icon: PianoIcon,
    premium: false
  },
])

const options = computed(() => [
  {
    label: t('navbar.account'),
    key: 'account',
    icon: () => h(NIcon, null, { default: () => h(UserCircle) }),
  },
  {
    label: t('navbar.contact'),
    key: 'contact',
    icon: () => h(NIcon, null, { default: () => h(MessageCircle) }),
  },
  {
    type: 'divider',
  },
  // Mostra la voce Admin solo se l'utente è amministratore
  ...(authStore.isAuthAdmin ? [{
    label: t('navbar.admin'),
    key: 'admin',
    icon: () => h(NIcon, null, { default: () => h(Sitemap) }),
  }] : []),
  {
    label: t('navbar.logout'),
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogoutIcon) }),
  },
])

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

const checkPremiumAccess = (e: any, routePath: string) => {
  const routeInfo = routes.value.find(r => r.path === routePath);

  if (routeInfo?.premium && !authStore.isPremiumUser) {
    e.preventDefault();
    message.warning(t('navbar.premium_access'));
    router.push('/pricing');
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 85px;
  width: 100%;
  background: var(--navbar-bg);
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
      height: 35px;
      width: 200px;
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

    @media (min-width: 768px) {
      span {
        margin-top: -15px;
      }
    }
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: var(--navbar-text);
    text-decoration: none;
    border-radius: 1rem 1rem 0 0;
    height: 100%;
    transition: all 0.1s ease;
    
    &:hover {
      background-color: var(--navbar-button-active);
      color: var(--navbar-text-active);
      transition: all 0.1s ease;
    }
    
    &.active {
      background-color: var(--navbar-button-active);
      color: var(--navbar-text-active);
      
      &::after {
        content: '';
        position: absolute;
        transition: all 0.1s ease;
        background-color: transparent;
        bottom: 0px;
        height: 45px;
        width: 25px;
        border-top-left-radius: 25px;
        box-shadow: 0 -25px 0 0 var(--navbar-button-active);
        right: -25px;
        transform: rotateX(180deg);
      }
      
      &::before {
        content: '';
        position: absolute;
        transition: all 0.1s ease;
        background-color: transparent;
        bottom: 0px;
        height: 45px;
        width: 25px;
        border-top-left-radius: 25px;
        box-shadow: 0 -25px 0 0 var(--navbar-button-active);
        left: -25px;
        transform: rotateZ(180deg);
      }
    }

    &.premium-item {
      opacity: 0.7;
      position: relative;

      &:hover {
        opacity: 1;
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
    color: var(--navbar-text);
    cursor: pointer;
    border-radius: 0.5rem;
    
    &:hover {
      background-color: var(--navbar-button-active);
      color: var(--navbar-text-active);
    }
  }
  
  .menu-toggle {
    background: none;
    border: none;
    color: var(--navbar-text);
    cursor: pointer;
    padding: 0.5rem;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: var(--navbar-button-active);
      color: var(--navbar-text-active);
    }
  }

  .mobile-menu {
    position: fixed;
    top: 85px;
    left: 0;
    right: 0;
    background-color: var(--navbar-bg);
    padding: 1rem;
    transform: translateY(-100%);
    transition: transform 0.1s ease;
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

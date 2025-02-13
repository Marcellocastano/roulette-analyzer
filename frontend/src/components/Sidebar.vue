<template>
  <div :class="['sidebar-container', { shrink: isShrinkView }]">
    <n-button
      tertiary
      circle
      type="info"
      class="sidebar-viewButton"
      @click="handleSidebarView"
    >
      <template #icon>
        <n-icon><SidebarCollapse /></n-icon>
      </template>
    </n-button>
    <div class="sidebar-wrapper">
      <ul class="sidebar-list">
        <li class="sidebar-listItem active">
          <a>
            <DashboardIcon class="sidebar-listIcon" />
            <span class="sidebar-listItemText">Dashboard</span>
          </a>
        </li>
        <li class="sidebar-listItem">
          <a>
            <StatsIcon class="sidebar-listIcon" />
            <span class="sidebar-listItemText">Statistiche</span>
          </a>
        </li>
        <li class="sidebar-listItem">
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="sidebar-listIcon"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span class="sidebar-listItemText">Analisi</span>
          </a>
        </li>
        <li class="sidebar-listItem">
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="sidebar-listIcon"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            <span class="sidebar-listItemText">Impostazioni</span>
          </a>
        </li>
      </ul>
      <n-dropdown
        :options="options"
        trigger="click"
        size="large"
        @select="handleSelect"
      >
        <n-button round class="sidebar-profileSection">
          <n-icon color="#f3aa14">
            <UserCircle />
          </n-icon>
          <span class="sidebar-profileName">User profile</span>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import StatsIcon from './icons/StatsIcon.vue'
import DashboardIcon from './icons/DashboardIcon.vue'
import { 
  LayoutSidebarLeftCollapse as SidebarCollapse, 
  UserCircle,
  Settings as EditIcon,
  Logout as LogoutIcon 
} from '@vicons/tabler'
import { NIcon, NDropdown, NButton } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()
const isShrinkView = ref(false)

const handleSidebarView = () => {
  isShrinkView.value = !isShrinkView.value
}

const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const options = [
  {
    label: 'Profilo',
    key: 'profile',
    icon: renderIcon(UserCircle)
  },
  {
    label: 'Impostazioni',
    key: 'settings',
    icon: renderIcon(EditIcon)
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: renderIcon(LogoutIcon)
  }
]

const handleSelect = (key: string) => {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      authStore.logout()
      break
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');

.sidebar {
  &-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    
    @media screen and (max-height: 520px) {
       overflow-y: auto;
       overflow-x: hidden;
    }
  }
  
  &-container {
    background-color: var(--main-container-bg);
    box-shadow: var(--container-shadow);
    border-radius: 10px;
    padding: 0 16px;
    transition: width .3s ease-in-out;
    position: relative;
    width: 210px;
    height: 100vh;
  
    &.shrink {
      width: 60px;
    }
  }
  
  &-viewButton {
    position: absolute;
    right: -10px;
    top: 32px;
    transition: .3s ease-in-out;
    color: #fff;
    z-index: 999;
    background-color: var(--secondary-bg);
    
    &:hover { opacity: 0.8; }
    .shrink & { transform: rotatey(-180deg); }
  }
  
  &-list {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
  }
  
  &-listItem {
    color: var(--text-color);
    display: flex;
    align-items: center;
    animation: fadeInItem .6s forwards;
    transition: background .2s ease-in;
    transform: translatex(-16px);
    opacity: 0;
    padding: 8px 0;
    position: relative;
 
    .shrink & span { visibility: hidden; }
    &.active a { background-color: var(--main-bg); }
    &:not(.active) a:hover {
      background-color: var(--item-hover);
    }
    &:hover .sidebar-listItemText {
      display: inline-block;
      opacity: 1;
      left: calc(100% + 8px);
      visibility: visible;
    }
    + li {
      border-top: 1px solid var(--item-hover);
    } 
    a {
      width: 100%;
      padding: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
  
  &-listIcon {
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-right: 8px;
    flex-shrink: 0;
    
    .shrink & { margin-right: 0; }
  }
  
  &-profileSection {
    height: 60px;
    transition: background .3s ease-in-out;
    margin-bottom: 15px;
    
    &:hover { background-color: var(--item-hover); }

    i {
      margin-right: 8px;
      font-size: 40px;
    }
    
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-color);
    }
    
    .shrink & .sidebar-profileName { display: none; }
    .shrink & i { font-size: 30px; }
    .shrink & { border-radius: 50%; padding: 15px; }
  }
  
  &-listItemText {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
  }
}

.shrink .sidebar-listItemText {
  position: absolute;
  padding: 8px;
  left: 100%;
  opacity: 0;
  background-color: var(--secondary-bg);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  transition: left .3s ease-in-out, opacity .3s ease-in-out;
}

@for $i from 0 through 5 {
  .sidebar-listItem:nth-child(n + #{$i}) {
    animation-delay: #{$i * 0.2}s;
  }
}

@keyframes fadeInItem {
  100% {
    transform: translatex(0px);
    opacity: 1;
  }
}
</style>

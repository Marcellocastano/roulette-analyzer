<!-- GlassCard.vue -->
<template>
  <div class="glass-card" :class="{ 'image-left': imagePosition === 'left' }">
    <div class="card-header">
      <slot name="title">
        <n-h2 class="card-title">{{ title }}</n-h2>
      </slot>
    </div>
    <div class="card-body">
      <div class="image-container" v-if="hasImageSlot">
        <slot name="image"></slot>
      </div>
      <div class="content-container">
        <slot name="content"></slot>
      </div>
    </div>
    <div class="card-actions" v-if="hasActionsSlot">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'

interface Props {
  title?: string
  imagePosition?: 'left' | 'right'
}

// Define props with TypeScript
const props = withDefaults(defineProps<Props>(), {
  title: '',
  imagePosition: 'right',
})

// Define emits
const emit = defineEmits<{
  (e: 'click'): void
  (e: 'action', action: string): void
}>()

// Access slots
const slots: any = useSlots()

// Computed properties
const hasImageSlot = computed(() => !!slots.image)
const hasActionsSlot = computed(() => !!slots.actions)
</script>

<style scoped>
.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  transition: all 0.3s ease;
}

.glass-card:hover {
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.5);
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  color: var(--text-color-dark);
  margin: 0;
}

.card-body {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.image-left .card-body {
  flex-direction: row-reverse;
}

.image-container {
  flex: 0 0 auto;
  max-width: 200px;
}

.image-container img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.content-container {
  flex: 1;
  color: var(--text-color-dark);
  font-size: 1rem;
  line-height: 1.5;
}

.card-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Per bottoni nelle actions */
:deep(.action-button) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.action-button:hover) {
  background: rgba(255, 255, 255, 0.2);
}
</style>

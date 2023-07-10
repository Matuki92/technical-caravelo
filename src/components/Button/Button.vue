<script setup lang="ts">
const emit = defineEmits(['click']);
withDefaults(defineProps<{
  style?: string,
  size?: string,
  disabled?: boolean,
}>(), {
  style: 'default',
  size: 'md',
  disabled: false,
});
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'app-button border rounded-lg flex items-center justify-center font-medium',
      style,
      size,
      { disabled },
    ]"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  transition: background-color .3s;
}
.app-button.default {
  @apply bg-base-500 hover:bg-base-400 text-neutral-100;
}
.app-button.disabled {
  @apply bg-gray-300 pointer-events-none;
}
.app-button.sm {
  @apply text-base px-2 py-1;
}
.app-button.md {
  @apply text-lg px-4 py-2;
}
</style>
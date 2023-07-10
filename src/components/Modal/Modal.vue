<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'close']);
defineProps<{
  modelValue: boolean,
}>();

function close() {
  emit('update:modelValue', false);
};
</script>

<template>
  <Teleport to="body">
    <section
      v-if="modelValue"
      @click.self="close"
      class="fixed top-0 z-50 flex items-center justify-center w-screen h-screen bg-black/50"
      aria-label="modal-background"
    >
      <div
        class="absolute w-full p-8 bg-white rounded-lg md:w-auto"
        role="modal"
      >
        <div class="flex justify-between text-2xl">
          <slot name="title" />
          
          <button
            @click="close"
          >
            &#x2715;
          </button>
        </div>

        <div class="mt-4">
          <slot />
        </div>
      </div>
    </section>
  </Teleport>
</template>
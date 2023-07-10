<script setup lang="ts">
import Header from '@/components/Header/Header.vue';
import Main from '@/views/Main/Main.vue';
</script>

<template>
  <div class="w-full h-screen">
    <Header />

    <div class="flex items-center justify-center w-full h-full pt-20">
      <Main />
    </div>
  </div>
</template>
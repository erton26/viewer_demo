<script setup lang="ts">
  import { defineProps } from 'vue';
  import type { Chapter } from './types';

  const props = defineProps<{
    exampleChapter: Chapter;
    currentPage: number;
  }>();

  function getPages() {
    return [props.exampleChapter.pages[props.currentPage-1]]
  }
</script>

<template>
  <div class="page">
    <img v-for="page in getPages()" :src="page.content_url" alt="test">
  </div>
</template>

<style scoped>
.page {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.page img {
  height: 100vh;
  width: auto;
  object-fit: contain;
}
</style>
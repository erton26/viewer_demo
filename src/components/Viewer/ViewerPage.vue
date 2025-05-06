<script setup lang="ts">
  import { computed, defineProps } from 'vue';
  import type { Chapter, Page } from './types';

  const props = defineProps<{
    exampleChapter: Chapter;
    currentPageNum: number;
    showDoublePage: boolean;
  }>();

  const currentPages = computed((): Page[] => {
    const currentPageNumHalved: number = Math.floor(props.currentPageNum / 2);
    if (props.showDoublePage) {
      return [props.exampleChapter.pages[currentPageNumHalved*2], props.exampleChapter.pages[currentPageNumHalved*2-1]];
    }
    else {
      return [props.exampleChapter.pages[props.currentPageNum-1]];
    }
  });
</script>

<template>
  <div class="pages-container">
    <img class="page-view" 
      :class="{ 'double-page-view': showDoublePage, 'single-page-view': !showDoublePage }" 
      v-for="page in currentPages"
      :key="page.page_number"
      :src="page.content_url"
      alt="page"
    >
  </div>
</template>

<style scoped>
.pages-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: auto;
  max-width: 100%;
}

.page-view {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.double-page-view{
  max-width: 50%;
}

.single-page-view{
  max-width: 100%;
}
</style>
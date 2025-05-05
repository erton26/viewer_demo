<script setup lang="ts">
  import ViewerPage from './ViewerPage.vue'
  import ViewerControl from './ViewerControl.vue'
  import { ref, computed } from 'vue';
  import exampleChapterJson from '../../../public/assets/chapter/example_chapter.json';
  import type { Chapter } from './types';

  const exampleChapter = exampleChapterJson as unknown as Chapter;
  const totalPageNum: number = exampleChapter.pages.length;
  const currentPageDefault = ref<number>(1);
  const currentPage = computed({
    get: (): number => currentPageDefault.value,
    set: (currentPageDefault_value: number) => {
      // currentPageDefaultの値が1以上、totalPageNum以下収まるように
      currentPageDefault.value = Math.min(Math.max(currentPageDefault_value, 1), totalPageNum);
    }
  });
</script>

<template>
  <div class="viewer-container">
    <ViewerPage :exampleChapter="exampleChapter" :currentPage="currentPage" />
    <ViewerControl :totalPageNum="totalPageNum" v-model:currentPage="currentPage" />
  </div>
</template>

<style scoped>
.viewer_container {
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
}
</style>
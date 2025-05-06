<script setup lang="ts">
  import ViewerPage from './ViewerPage.vue';
  import ViewerControl from './ViewerControl.vue';
  import ViewerMenu from './ViewerMenu.vue';

  import { ref, computed, onMounted } from 'vue';
  import exampleChapterJson from '../../../public/assets/chapter/example_chapter.json';
  import type { Chapter } from './types';

  const exampleChapter = exampleChapterJson as unknown as Chapter;
  const totalPageNum: number = exampleChapter.pages.length;
  const currentPageNumDefault = ref<number>(1);
  const currentPageNum = computed({
    get: (): number => currentPageNumDefault.value,
    set: (currentPageNumDefaultValue: number) => {
      // currentPageNumDefaultの値が1より小さい、totalPageNumより大きい場合、読み込まれるページがない
      // currentPageNumDefaultの値が1以上、totalPageNum以下収まるように
      currentPageNumDefault.value = Math.min(Math.max(currentPageNumDefaultValue, 1), totalPageNum);
    }
  });

  const showMenu = ref<boolean>(false);

  const viewerDiv = ref<HTMLElement | null>(null);
  const clientWidth = ref<number>(0);
  const showDoublePage = computed((): boolean => {
    const currentPageNumHalved: number = Math.floor(currentPageNum.value / 2);
    const doublePageWidthThreshold: number = 800;
    if (clientWidth.value < doublePageWidthThreshold) {
      return false;
    }
    else if (currentPageNumHalved === 0) {
      return false;
    }
    else if (currentPageNumHalved === Math.floor(totalPageNum / 2) && totalPageNum % 2 === 0) {
      return false;
    }
    else {
      return true;
    }
  });
  
  // viewer-containerの幅により表示するページ数が変わるように
  const resizeObserver = ref<ResizeObserver | null>(null);
  onMounted(() => {
    if (!viewerDiv.value) return;
    
    resizeObserver.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        clientWidth.value = entry.contentRect.width;
      }
    });
    
    resizeObserver.value.observe(viewerDiv.value);
  });
</script>

<template>
  <div class="viewer-container" ref="viewerDiv">
    <ViewerPage :exampleChapter="exampleChapter" :currentPageNum="currentPageNum" :showDoublePage="showDoublePage" />
    <ViewerControl :totalPageNum="totalPageNum" :showDoublePage="showDoublePage" v-model:currentPageNum="currentPageNum" v-model:showMenu="showMenu" />
    <ViewerMenu :totalPageNum="totalPageNum" :showMenu="showMenu" v-model:currentPageNum="currentPageNum" />
  </div>
</template>

<style scoped>
.viewer-container {
  position: fixed;
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
}
</style>
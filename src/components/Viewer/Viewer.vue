<script setup lang="ts">
  /**
   * ビュアー全体のコンポネント
   */

  // 子コンポネント
  import ViewerPage from './ViewerPage.vue';
  import ViewerControl from './ViewerControl.vue';
  import ViewerMenu from './ViewerMenu.vue';
  import ViewerGuide from './ViewerGuide.vue';
  
  // vue
  import { ref, computed, onMounted, onUnmounted } from 'vue';

  // データ・型
  import exampleChapterJson from '../../../public/assets/chapter/example_chapter.json';
  import type { Chapter } from './types';

  // UIの状況
  const showMenu = ref<boolean>(false);
  const sliderOn = ref<boolean>(false);

  // 話のデータ
  const exampleChapter = exampleChapterJson as unknown as Chapter;
  const totalPageNum: number = exampleChapter.pages.length;

  //　現在ページ数の管理
  const currentPageNumDefault = ref<number>(1);
  const currentPageNum = computed({
    get: (): number => currentPageNumDefault.value,
    set: (currentPageNumDefaultValue: number) => {
      // currentPageNumDefaultの値が1より小さい、totalPageNumより大きい場合、読み込まれるページがない
      // currentPageNumDefaultの値が1以上、totalPageNum以下収まるように
      currentPageNumDefault.value = Math.min(Math.max(currentPageNumDefaultValue, 1), totalPageNum);
    }
  });

  // viewer-container参照・監視
  const viewerContainerDiv = ref<HTMLElement | null>(null);
  const clientWidth = ref<number>(0);
  const resizeObserver = ref<ResizeObserver | null>(null);

  function observeClientWidth() {
    /**
     * viewer-container監視、clientWidthを更新
     * clientWidthは表示するページの枚数を決めるために使用
     */
    if (!viewerContainerDiv.value) return;
    
    resizeObserver.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        clientWidth.value = entry.contentRect.width;
      }
    });
    
    resizeObserver.value.observe(viewerContainerDiv.value);
  }

  onMounted(() => {
    observeClientWidth();
  });

  onUnmounted(() => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect();
    }
  });

  // 表示するページ枚数の管理
  const showDoublePage = computed((): boolean => {
    const currentPageNumHalved: number = Math.floor(currentPageNum.value / 2);
    const doublePageWidthThreshold: number = 800;
    if (clientWidth.value < doublePageWidthThreshold) {
      // viewer-containerの幅が狭い場合１枚のみ表示するように
      return false;
    }
    else if (currentPageNumHalved === 0) {
      // 最初のページは１枚のみ表示されるように
      return false;
    }
    else if (currentPageNumHalved === Math.floor(totalPageNum / 2) && totalPageNum % 2 === 0) {
      // 総ページ数が偶数の場合、1ページのみ読み込まれる
      // 最後のページが正しく表示されるように
      return false;
    }
    else {
      return true;
    }
  });
</script>

<template>
  <!-- ビュアー全体 -->
  <div class="viewer-container" ref="viewerContainerDiv">
    <ViewerPage
      :exampleChapter="exampleChapter"
      :currentPageNum="currentPageNum"
      :showDoublePage="showDoublePage"
    />
    <ViewerControl
      :totalPageNum="totalPageNum" 
      :showDoublePage="showDoublePage"
      v-model:currentPageNum="currentPageNum"
      v-model:showMenu="showMenu"
    />
    <ViewerMenu
      :totalPageNum="totalPageNum"
      :showMenu="showMenu"
      v-model:currentPageNum="currentPageNum"
      v-model:sliderOn="sliderOn"
    />
    <ViewerGuide />
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
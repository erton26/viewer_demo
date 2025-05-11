<script setup lang="ts">
  /**
   * ビュアーのページ移動操作の処理を行うコンポネント
   */

  // vue
  import { ref, defineProps, defineModel, computed } from 'vue';

  // 親からのプロパティ
  const props = defineProps<{
    totalPageNum: number; // 総ページ数
    showDoublePage: boolean; // ページ２枚示すフラグ
  }>();

  // v-model双方向バインディング
  const currentPageNum = defineModel<number>("currentPageNum", { required: true });
  const showMenu = defineModel<boolean>("showMenu", { required: true });

  // カーソルスタイルの状態管理用
  const cursorClass = ref<string>("default-cursor");

  // 操作領域control-container参照
  const controlDiv = ref<HTMLElement | null>(null);
  
  function updateCursor(event: { clientX: number; }) {
    /**
     * カーソル移動に応じてカーソルを変更
     * - メニュー表示状態・カーソル位置・control-containerの幅に応じて変更
     */
    if (!controlDiv.value) return;

    const menuAreaWidth = 300;
    const { clientWidth } = controlDiv.value;
    const nextPageXBoundary = (clientWidth - menuAreaWidth) / 2;
    const previousPageXBoundary = (clientWidth + menuAreaWidth) / 2;

    if (showMenu.value) {
      cursorClass.value = "menu-opened-cursor";
    }
    else if (event.clientX < nextPageXBoundary) {
      cursorClass.value = currentPageNum.value < props.totalPageNum ? "next-page-cursor" : "stop-cursor";
    }
    else if (event.clientX > previousPageXBoundary) {
      cursorClass.value = currentPageNum.value > 1 ? "previous-page-cursor" : "stop-cursor";
    }
    else {
      cursorClass.value = "menu-closed-cursor";
    }
  };

  const pageChange = computed((): number => {
    // 画面に２枚のページが表示される場合、表示が変わるためにpageChangeが-2か2であることが必要
    // 画面に表示されるページ数により、ページ移動の幅が変わるように
    return props.showDoublePage ? 2 : 1;
  });
  
  function handleMouseClick(event: MouseEvent) {
    /**
     * カーソル位置によってクリック操作を処理
     * - ページ移動
     * - メニュー開閉
     */
    switch(cursorClass.value) {
      case "next-page-cursor":
        currentPageNum.value += pageChange.value;
        break;
      case "previous-page-cursor":
        currentPageNum.value -= pageChange.value;
        break;
      case "menu-opened-cursor":
      case "menu-closed-cursor":
        // クリックされる後にmenu表示がすぐ変わるように
        const newShowMenuValue: boolean = !showMenu.value;
        showMenu.value = newShowMenuValue;

        cursorClass.value = newShowMenuValue ? "menu-opened-cursor" : "menu-closed-cursor";
        break;
    };
  };

  function handleMouseScroll(event: { deltaY: number; }) {
  /**
   * マウスホイールでのページ移動を処理
   * - 上スクロールで前ページ、下スクロールで次ページへ移動
   */
    const isScrollingUp: boolean = event.deltaY < 0;
    currentPageNum.value = isScrollingUp ? currentPageNum.value - pageChange.value : currentPageNum.value + pageChange.value;
  };
</script>

<template>
  <!-- ページ移動操作 -->
  <div class="control-container"
    :class="cursorClass"
    @mousemove="updateCursor"
    @click="handleMouseClick"
    @wheel="handleMouseScroll"
    ref="controlDiv"
  >
  </div>
</template>

<style scoped>
.control-container {
  position: fixed;
  height: 100vh;
  width: 100vw;
}

.default-cursor {
  cursor: default;
}

.next-page-cursor {
  cursor: url(../../assets/viewer_cursors/arrow_left.png) 16 16, auto;
} 

.menu-closed-cursor {
  cursor: url(../../assets/viewer_cursors/setting.png) 16 16, auto;
}

.menu-opened-cursor {
  cursor: default;
}

.previous-page-cursor {
  cursor: url(../../assets/viewer_cursors/arrow_right.png) 16 16, auto;
}

.stop-cursor {
  cursor: url(../../assets/viewer_cursors/stop.png) 16 16, auto;
}
</style>
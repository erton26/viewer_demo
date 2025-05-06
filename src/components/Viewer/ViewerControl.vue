<script setup lang="ts">
  import { ref, defineProps, defineModel, computed } from 'vue';

  const props = defineProps<{
    totalPageNum: number;
    showDoublePage: boolean;
    sliderOn: boolean;
  }>();

  const currentPageNum = defineModel<number>("currentPageNum", { required: true });
  const showMenu = defineModel<boolean>("showMenu", { required: true });

  const controlDiv = ref<HTMLElement | null>(null);
  const cursorClass = ref<string>("default");
  function updateCursor(event: { clientX: number; }) {
    if (!controlDiv.value) return;

    const menuAreaWidth = 300;
    const { clientWidth } = controlDiv.value;
    const nextPageXBoundary = (clientWidth - menuAreaWidth) / 2;
    const previousPageXBoundary = (clientWidth + menuAreaWidth) / 2;

    if (showMenu.value === true) {
      cursorClass.value = "menuOpened";
    }
    else if (event.clientX < nextPageXBoundary) {
      cursorClass.value = currentPageNum.value < props.totalPageNum ? "next" : "stop";
    }
    else if (event.clientX > previousPageXBoundary) {
      cursorClass.value = currentPageNum.value > 1 ? "previous" : "stop";
    }
    else {
      cursorClass.value = "menuClosed";
    }
  };

  const pageChange = computed((): number => {
    // 画面に２枚のページが表示される場合、表示が変わるためにpageChangeが-2か2であることが必要
    // 画面に表示されるページ数により、ページ移動の幅が変わるように
    return props.showDoublePage ? 2 : 1;
  });
  
  function handleMouseClick(event: MouseEvent) {
    switch(cursorClass.value) {
      case "next":
        currentPageNum.value += pageChange.value;
        break;
      case "previous":
        currentPageNum.value -= pageChange.value;
        break;
      case "menuOpened":
      case "menuClosed":
        // クリックされる後にmenu表示がすぐ変わるように
        const newShowMenuValue: boolean = !showMenu.value;
        showMenu.value = newShowMenuValue;

        cursorClass.value = newShowMenuValue ? "menuOpened" : "menuClosed";
        break;
    };
  };

  function handleMouseScroll(event: { deltaY: number; }) {
    const isScrollingUp: boolean = event.deltaY < 0;

    if (isScrollingUp) {
      currentPageNum.value -= pageChange.value;
    }
    else {
      currentPageNum.value += pageChange.value;
    }
  };
</script>

<template>
  <div class="control"
    :class="{ 
      'default-cursor': cursorClass === 'default',
      'next-page-cursor': cursorClass === 'next',
      'menu-closed-cursor': cursorClass === 'menuClosed',
      'menu-opened-cursor': cursorClass === 'menuOpened',
      'previous-page-cursor': cursorClass === 'previous',
      'stop-cursor': cursorClass === 'stop'
    }"
    @mousemove="updateCursor"
    @click="handleMouseClick"
    @wheel="handleMouseScroll"
    ref="controlDiv"
  >
  </div>
</template>

<style scoped>
.control {
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
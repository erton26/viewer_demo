<script setup lang="ts">
  import { ref, defineProps, defineModel } from 'vue';

  const props = defineProps<{
    totalPageNum: number;
  }>();

  const currentPage = defineModel<number>('currentPage', { required: true });
  const showMenu = defineModel<boolean>('showMenu', { required: true });

  const controlDiv = ref<HTMLElement | null>(null);
  const cursorClass = ref<string>("menuClosed");

  function updateCursor(event: { clientX: number; }) {
    if (!controlDiv.value) return;

    const menuAreaWidth = 400;

    if (showMenu.value === true) {
      cursorClass.value = "menuOpened";
    }
    else if (event.clientX < controlDiv.value.clientWidth / 2 - menuAreaWidth / 2) {
      if (currentPage.value < props.totalPageNum) {
        cursorClass.value = "next";
      }
      else {
        cursorClass.value = "stop";
      }
    }
    else if (event.clientX > controlDiv.value.clientWidth / 2 + menuAreaWidth / 2) {
      if (currentPage.value > 1) {
        cursorClass.value = "before";
      }
      else {
        cursorClass.value = "stop";
      }
    }
    else {
      cursorClass.value = "menuClosed";
    }
  };

  function handleMouseClick(event: any) {
    if (cursorClass.value === "next") {
      currentPage.value += 1;
    }
    else if (cursorClass.value === "before") {
      currentPage.value -= 1;
    }
    if (cursorClass.value === "menuOpened" || cursorClass.value === "menuClosed") {
      const newShowMenuValue = !showMenu.value;
      showMenu.value = newShowMenuValue;
      cursorClass.value = newShowMenuValue ? "menuOpened" : "menuClosed";
    }
  };
</script>

<template>
  <div 
    class="control"
    :class="{ 
      'next-page-cursor': cursorClass === 'next',
      'menu-closed-cursor': cursorClass === 'menuClosed',
      'menu-opened-cursor': cursorClass === 'menuOpened',
      'before-page-cursor': cursorClass === 'before',
      'stop-cursor': cursorClass === 'stop'
    }"
    @mousemove="updateCursor"
    @click="handleMouseClick"
    ref="controlDiv"
  >
  </div>
</template>

<style scoped>
.control {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

.next-page-cursor {
  cursor: url(../../assets/viewer_cursors/arrow_left.png), auto;
}

.menu-closed-cursor {
  cursor: url(../../assets/viewer_cursors/menu.png), auto;
}

.menu-opened-cursor {
  cursor: default;
}

.before-page-cursor {
  cursor: url(../../assets/viewer_cursors/arrow_right.png), auto;
}

.stop-cursor {
  cursor: url(../../assets/viewer_cursors/stop.png), auto;
}
</style>
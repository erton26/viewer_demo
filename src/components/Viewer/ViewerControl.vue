<script setup lang="ts">
  import { ref } from 'vue';
  import { defineProps, defineModel } from 'vue';

  const props = defineProps<{
    totalPageNum: number;
  }>();

  const currentPage = defineModel<number>('currentPage', { required: true });

  const controlDiv = ref<HTMLElement | null>(null);
  const cursorClass = ref<string>("setting");

  function updateCursor(event: { clientX: number; }) {
    if (!controlDiv.value) return;

    const setting_width = 400;

    if (event.clientX < controlDiv.value.clientWidth / 2 - setting_width / 2) {
      if (currentPage.value < props.totalPageNum) {
        cursorClass.value = "next";
      }
      else {
        cursorClass.value = "stop";
      }
    }
    else if (event.clientX > controlDiv.value.clientWidth / 2 + setting_width / 2) {
      if (currentPage.value > 1) {
        cursorClass.value = "before";
      }
      else {
        cursorClass.value = "stop";
      }
    }
    else {
      cursorClass.value = "setting";
    }
  }

  function handleMouseClick(event: any) {
    if(cursorClass.value === "next") {
      currentPage.value += 1;
    }
    else if(cursorClass.value === "before") {
      currentPage.value -= 1;
    }
  }
</script>

<template>
  <div 
    class="control"
    :class="{ 'next-page-cursor': cursorClass === 'next' , 'setting-cursor': cursorClass === 'setting', 'before-page-cursor': cursorClass === 'before', 'stop-cursor': cursorClass === 'stop' }"
    @mousemove="updateCursor"
    @click="handleMouseClick"
    ref="controlDiv">
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

.setting-cursor {
  cursor: url(../../assets/viewer_cursors/setting.png), auto;
}

.before-page-cursor {
  cursor: url(../../assets/viewer_cursors/arrow_right.png), auto;
}

.stop-cursor {
  cursor: url(../../assets/viewer_cursors/stop.png), auto;
}
</style>
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import example_chapter from '../../../public/assets/chapter/example_chapter.json';
  
  const total_page_num = example_chapter.pages.length;
  const current_page = ref<number>(1);
  const currentPage = computed({
    get: () => current_page.value,
    set: (current_page_value: number) => {
      // current_pageの値が1以上、total_page_num以下収まるように
      current_page.value = Math.min(Math.max(current_page_value, 1), total_page_num);
    }
  });

  const controlDiv = ref<HTMLElement | null>(null);
  const cursor_class = ref<string>("setting");

  function get_pages() {
    return [example_chapter.pages[currentPage.value-1]]
  }

  function updateCursor(event) {
    const setting_width = 400
    if (event.clientX < controlDiv.value.clientWidth / 2 - setting_width / 2) {
      if (currentPage.value < total_page_num) {
        cursor_class.value = "next";
      }
      else {
        cursor_class.value = "stop";
      }
    }
    else if (event.clientX > controlDiv.value.clientWidth / 2 + setting_width / 2) {
      if (currentPage.value > 1) {
        cursor_class.value = "before";
      }
      else {
        cursor_class.value = "stop";
      }
    }
    else {
      cursor_class.value = "setting";
    }
  }

  function handleMouseClick(event) {
    if(cursor_class.value === "next") {
      currentPage.value += 1;
    }
    else if(cursor_class.value === "before") {
      currentPage.value -= 1;
    }
  }
</script>

<template>
  <div class="page-container">
    <div class="page">
      <img v-for="page in get_pages()" :src="page.content_url" alt="test">
    </div>

    <div 
      class="control"
      :class="{ 'next-page-cursor': cursor_class === 'next' , 'setting-cursor': cursor_class === 'setting', 'before-page-cursor': cursor_class === 'before', 'stop-cursor': cursor_class === 'stop' }"
      @mousemove="updateCursor"
      @click="handleMouseClick"
      ref="controlDiv">
    </div>
  </div>
</template>

<style scoped>
.page_container {
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
}

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
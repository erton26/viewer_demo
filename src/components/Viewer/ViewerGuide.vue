<script setup lang="ts">
  import { ref } from 'vue';

  const pointerDown = ref<boolean>(false);
  function handlePointerDown(event: PointerEvent) {
    pointerDown.value = true;
  };
</script>

<template>
  <div class="guide-container" :class="{ 'hidden': pointerDown }" @pointerdown="handlePointerDown">
    <div class="guide-view menu-background">
      <div class="guide-text">
        <span>左ページへ移動：左側をクリック / 下にスクロール</span>
      </div>
      <div class="guide-text">
        <span>右ページへ移動：右側をクリック / 上にスクロール</span>
      </div>
      <div class="guide-text">
        <span>メニューを表示：中央をクリック</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-container {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.guide-view {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 500px;
  background-color: black;
  opacity: 90%;
}

.guide-text {
  font-size: 1.1rem;
  color: white;
  padding: 10px;
}

.hidden {
  display: none;
}
</style>
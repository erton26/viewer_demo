<script setup lang="ts">
  import { ref, defineProps, watch } from 'vue';

  const props = defineProps<{
    totalPageNum: number;
    showMenu: boolean;
  }>();

  const emit = defineEmits(['pointer-down-event']);

  const currentPageNum = defineModel<number>("currentPageNum", { required: true });
  const sliderOn = defineModel<boolean>("sliderOn" , { required: true });
  const sliderValueTmp = ref<number>(currentPageNum.value);

  // @change="handleSliderChange"で、input sliderを離す時にページ移動させるように
  function handleSliderChange() {
    currentPageNum.value = sliderValueTmp.value;
  };

  // input sliderの状況がcurrentPageNum値の変化を反映させるように
  watch(currentPageNum, (currentPageNumValue: number) => {
    sliderValueTmp.value = currentPageNumValue;
  }, { immediate: true });
</script>

<template>
  <div class="menu-header-footer menu-background menu-header" :class="{ 'hidden': showMenu === false }">

  </div>
    
  <div class="page-number-view menu-background" :class="{ 'hidden': sliderOn === false }">
    <div class = "slider-page-number page-number">
      <span>{{ sliderValueTmp }}</span>
    </div>
    <hr>
    <div class = "total-page-number page-number">
      <span>{{ totalPageNum }}</span>
    </div>
  </div>

  <div class="menu-header-footer menu-background menu-footer" :class="{ 'hidden': showMenu === false }">
    <div class="page-slider-container">
      <input class="page-slider-bar"
        type="range"
        v-model="sliderValueTmp"
        :min="1"
        :max="props.totalPageNum"
        @change="handleSliderChange"
        @mousedown="sliderOn = true"
        @touchstart="sliderOn = true"
        @mouseup="sliderOn = false"
        @touchend="sliderOn = false"
        @mouseleave="sliderOn = false"
      >
    </div>
  </div>
</template>

<style scoped>
.menu-background {
  background-color: black;
  opacity: 90%;
}

.menu-header-footer {
  position: absolute;
  width: 100vw;
}

.menu-header {
  top: 0px;
  height: 75px;
}

.menu-footer {
  bottom: 0px; 
  height: 100px;
}

.page-number-view {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
}

.page-number {
  display: flex;
  width: 100%;
  text-align: center;
  color: white;
  justify-content: center;
}

.slider-page-number {
  height: 50%;
  font-size: 2.2rem;
  align-items: flex-end;
}

.total-page-number {
  height: 25%;
  font-size: 1.1rem;
  align-items: flex-start;
}

.page-slider-container {
  height: 50%;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
}

.page-slider-bar {
  height: 100%;
  width: 100%;
  direction: rtl;
}

hr {
  height: 2px;
  width: 20%;
  color: white;
}

.hidden {
  display: none;
}
</style>
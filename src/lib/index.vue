<template>
  <div class="vue-layer-switch">
    <div 
      class="layer-switch-panels"
      @touchstart="doTouchStart"
      @touchmove="doTouchMove"
      @touchend="doTouchEnd"
    >
      <slot>这里放置panels数据</slot>
    </div>
  </div>
</template>

<script>
  import defineModel from './defineModel'
  import props from './props'
  import methods from './methods/index'
  import utils from './utils/index'

  export default {
    data: defineModel,
    props,
    methods,
    mounted() {
      this.clientWidth = utils.getPropertySize(this.$el, 'width')
      this.panelWrapEl = this.$el.querySelector('.layer-switch-panels')
      this.relayout()
    }
  }
</script>

<style lang="scss" scoped src="./index.scss"></style>

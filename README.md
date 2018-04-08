# vue-layer-switch
> 该组件要做的事情就是 切换 在一个三维空间内的所有面板（一个面板作为三维空间垂直方向的平面层）

## Installation
```
npm i vue-layer-switch --save
```

### Usage
```html
  <div class="example">
    <layer-switch
      class="switch-component"
      ref="layerSwitch"
      :change="change"
      :total-count="list.length"
    >
      <div
        v-for="(item, i) in list"
        :key="i"
        v-if="Math.abs(index - i) < 2"
      >
        <img :src="item">
        <span>第{{i + 1}}个面板</span><br>
        <span>共有<em class="total-count">{{list.length}}</em>个面板</span>
      </div>
    </layer-switch>

    <div class="buttons-wrap">
      <div class="buttons">
        <span class="btn" @click="switchNext">切换下一面板</span>
        <span class="btn" @click="switchPrev">切换上一面板</span>
        <span class="btn" @click="switchTo(0)">切换到第一个面板</span>
        <span class="btn" @click="switchTo(list.length - 1)">切换到最后个面板</span>
      </div>

      <div class="buttons">
        <span class="btn" @click="deleteCurrent(index)">删除当前面板</span>
        <span class="btn" @click="switchTo(3)">切换到第四个面板</span>
        <span class="btn" @click="switchTo(4)">切换到第五个面板</span>
        <span class="btn" @click="switchTo(5)">切换到第六个面板</span>
      </div>
    </div>
  </div>
```

```javascript
  import 'vue-layer-switch/dist/component.css';
  import layerSwitch from 'vue-layer-switch';

  export default {
    data() {
      return {
        list: [
          imgUrl1, imgUrl2, imgUrl3, ...
        ]
      }
    },
    methods: {
      change(index) {
        this.index = index
      },
      switchNext() {
        this.$refs['layerSwitch'].switchNext()
      },
      switchPrev() {
        this.$refs['layerSwitch'].switchPrev()
      },
      switchTo(index) {
        this.index = index
        this.$refs['layerSwitch'].switchTo(index)
      },
      deleteCurrent(index) {
        this.list.splice(index, 1)
        this.$refs['layerSwitch'].deleteAfterRelayout(index)
      }
    },
    components: {
      layerSwitch
    }
  }
```

## 业务背景
公司（教育行业）需要做一个错题本项目，需要保持三年之内的数据，错题数据庞大，可能上千甚至上万道错题，每道题（题型：单选，多选，填空，英语听口；来源：多种自有题库，第三方题库...）作为一屏展现，支持左右滑动切换，点击答题卡序号切换，支持删除错题

## 技术难点
项目采用h5技术实现，唯一且最难解决的问题就是dom节点越多，所占手机内存就越大，页面交互响应、滑动切换的过渡动画就越卡，如不能解决，项目便不能进行...

## 解决方案
- 把成千上万道错题 想象为一个阶梯，使用css属性z-index去实现
- 显示当前错题，当前错题的上一道错题，当前错题的下一道错题，其他的都隐藏，解决内存问题
- 因为交互触屏滑动切换依赖当前错题面板，因此当错题面板切换完成、删除错题后都需要实时更新错题面板层级z-index，当前错题面板

## 组件的特点
用户向左滑动再向右小距离移动，可以取消当前面板的切换

## 组件实现遇到的问题
- touchmove 事件绑定的回调 会执行很多次（不可预估），有可能在其他异步（如：transitionend绑定的）回调执行之前也有可能之后，如果有逻辑交叉时需特别注意
- touchmove 事件回调设置 元素的translateX 不太可能为0，会有偏差，可能为0.1123，-0.23434，当设置translateX的元素改变时，上一个被设置过translateX的元素需要校正

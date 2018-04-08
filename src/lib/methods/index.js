import utils from '../utils/index'
import touchHandler from './touchHandler'

export default {
  ...touchHandler,

  /**
   * switchTo 切换面板
   * @param  {Number} index 切换动作索引
   */
  switchTo(index) {
    if (this.index === index) return
    this.index = index
    this.change(index)

    this.$nextTick(() => {
      this.relayout()
    })
  },

  /**
   * deleteAfterRelayout 删除后重排，该方法供父组件调用
   * @param {Number} index 要删除面板在数据列表中的索引
   */
  deleteAfterRelayout(index) {
    const lastIndex = this.totalCount - 1

    if (this.totalCount === 0 || this.index > lastIndex) return

    if (this.index !== index) {
      console.log('删除面板索引与当前面板页索引不一致')
      return
    }

    // 删除的不是最后一个面板
    if (this.index !== lastIndex) {
      this.$nextTick(() => {
        this.relayout()
      })
    } else {
      this.switchTo(lastIndex - 1)
    }
  },

  /**
   * relayout 重新渲染面板层级，指定当前面板
   * @param {Array} childs 面板集合
   * 应用场景 切换完面板之后
   */
  relayout(childs) {
    let children = childs || this.panelWrapEl.children
    children = [].slice.call(children, 0, 3)

    if (children.length === 0) return

    const fn = (...args) => {
      const pos = [-this.clientWidth, 0, 0]
      children.forEach((panel, i) => {
        if (panel) {
          panel.style.zIndex = args[i]
          utils.setTranslateX(panel, pos[i])
        }
      })
    }

    if (this.ifFirst() && children.length <= 2) {
      children.unshift(null)
    }

    fn(3, 2, 1)
    this.currentPanel = children[1]
  },

  /**
   * switchPrev 切换到上一个面板
   */
  switchPrev() {
    if (this.ifFirst()) return
    this.prevTransition(true)
  },

  /**
   * switchNext 切换到下一个面板
   */
  switchNext() {
    if (this.ifLast()) return
    this.nextTransition()
  },

  /**
   * ifFirst 判断当前面板是否为第一个面板
   */
  ifFirst() {
    return this.index === 0
  },

  /**
   * ifLast 判断当前面板是否为最后一个面板
   */
  ifLast() {
    return this.index === this.totalCount - 1
  }
}

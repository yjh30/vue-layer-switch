export default function() {
  /**
   * @property { Number } clientWidth 适口宽度
   * @property { Number } index 当前面板索引
   * @property { HTMLElement } panelWrapEl 面板父容器
   * @property { HTMLElement } currentPanel 当前面板element
   */
  return {
    clientWidth: 0,
    index: 0,
    panelWrapEl: null,
    currentPanel: null
  }
}

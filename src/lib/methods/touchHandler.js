import utils from '../utils/index'

let startPos = { x: 0, y: 0 }
let detal = { x: 0, lastX: 0, turnX: 0 }
let transitioning = false
let movePos = { lastX: 0 }

const reset = function() {
  detal = { x: 0, lastX: 0, turnX: 0 }
  transitioning = false
  movePos = { lastX: 0 }
}

let stopMove = false

export default {
  updateTurnX(touch) {
    if (movePos.lastX === 0) return

    if (detal.x > 0) {
      if (touch.pageX < movePos.lastX) {
        detal.turnX = detal.x
      } else {
        detal.turnX = 0
      }
    } else if (detal.x < 0) {
      if (touch.pageX > movePos.lastX) {
        detal.turnX = detal.x
      } else {
        detal.turnX = 0
      }
    }

    if (detal.turnX < 0 && detal.x > 0 ||
      detal.turnX > 0 && detal.x < 0) {
      detal.turnX = 0
    }
  },

  handleMovingPanelChange() {
    let previousEl
    if (detal.lastX === 0) return

    if (detal.lastX < 0 && detal.x > 0) {
      utils.setTranslateX(this.currentPanel, 0)
    } else if (detal.lastX > 0 && detal.x < 0 && (previousEl = this.currentPanel.previousElementSibling)) {
      utils.setTranslateX(previousEl, -this.clientWidth)
    }
  },

  resetScroll() {
    if (this.totalCount === 0) {
      return
    }
    const prevEl = this.currentPanel.previousElementSibling
    const nextEl = this.currentPanel.nextElementSibling

    prevEl && (prevEl.scrollTop = 0)
    nextEl && (nextEl.scrollTop = 0)
  },

  doTouchStart(event) {
    if (transitioning) return
    const touch = event.targetTouches[0]
    startPos.x = touch.pageX
    startPos.y = touch.pageY
    stopMove = false

    this.resetScroll()
  },

  doTouchMove(event) {
    if (transitioning || stopMove) return

    const touch = event.targetTouches[0]

    const diffX = touch.pageX - startPos.x
    const diffY = touch.pageY - startPos.y

    if (Math.abs(diffX) < Math.abs(diffY)) {
      stopMove = true
      return
    } else {
      event.preventDefault()
    }

    detal.x = diffX
    this.move(detal.x)

    this.updateTurnX(touch)
    movePos.lastX = touch.pageX

    this.handleMovingPanelChange()
    detal.lastX = detal.x
  },

  move(detalX) {
    if (detalX > 0) {
      this.prevMove(detalX)
    } else if (detalX < 0) {
      this.nextMove(detalX)
    }
  },

  prevMove(detalX) {
    const el = this.currentPanel.previousElementSibling
    if (!el) {
      // utils.setTranslateX(this.currentPanel, 0)
      // reset()
      utils.setTranslateX(this.panelWrapEl, detalX / (Math.abs(detalX) / this.clientWidth + 2))
      return
    }
    utils.setTranslateX(el, -this.clientWidth + detalX)
  },

  nextMove(detalX) {
    const nextElementSibling = this.currentPanel.nextElementSibling
    if (!nextElementSibling) {
      // utils.setTranslateX(this.currentPanel.previousElementSibling, -this.clientWidth)
      // reset()
      utils.setTranslateX(this.panelWrapEl, detalX / (Math.abs(detalX) / this.clientWidth + 2))
      return
    }
    utils.setTranslateX(this.currentPanel, detalX)
  },

  doTouchEnd() {
    if (detal.x === 0 || transitioning) return
    if (detal.turnX && !(detal.x > 0 && this.ifFirst()) && !(detal.x < 0 && this.ifLast())) {
      this.turnTransition(detal.turnX)
      return
    }

    if (detal.x > 0) {
      if (!this.ifFirst()) {
        this.prevTransition()
      } else {
        this.runTransition(this.panelWrapEl, 0)
      }
    } else if (detal.x < 0) {
      if (!this.ifLast()) {
        this.nextTransition()
      } else {
        this.runTransition(this.panelWrapEl, 0)
      }
    }
  },

  prevTransition(fromClick) {
    const el = this.currentPanel.previousElementSibling
    if (fromClick) {
      if (transitioning) return
      el.style.zIndex = 3
      utils.setTranslateX(el, -this.clientWidth)
    }

    this.runTransition(el, 0, () => {
      this.change(--this.index)
      this.$nextTick(() => {
        this.relayout([el.previousElementSibling, el, el.nextElementSibling])
      })
    })
  },

  nextTransition() {
    const el = this.currentPanel

    this.runTransition(el, -this.clientWidth, () => {
      this.change(++this.index)
      this.$nextTick(() => {
        this.relayout([el, el.nextElementSibling, el.nextElementSibling.nextElementSibling])
      })
    })
  },

  turnTransition(turnX) {
    if (turnX > 0) {
      this.runTransition(this.currentPanel.previousElementSibling, -this.clientWidth)
    } else {
      this.runTransition(this.currentPanel, 0)
    }
  },

  runTransition(el, translateX, callback) {
    if (transitioning) return
    transitioning = true

    utils.requestAnimationFrame(() => {
      utils.setTranslateX(el, translateX)
      el.style.transition = 'transform 0.25s ease-out'
    })

    const endCallback = () => {
      el.removeEventListener('webkitTransitionEnd', endCallback)
      el.removeEventListener('transitionend', endCallback)
      el.style.transition = ''
      reset()
      callback && callback()
    }
    el.addEventListener('webkitTransitionEnd', endCallback)
    el.addEventListener('transitionend', endCallback)
  }
}

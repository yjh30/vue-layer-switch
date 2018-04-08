let raf, nativeRaf

if (typeof window !== 'undefined') {
  nativeRaf = window.requestAnimationFrame || window.webkitRequestAnimationFrame

  if (nativeRaf) {
    raf = nativeRaf
  } else {
    raf = callback => {
      window.setTimeout(callback, 16)
    }
  }
}

export default callback => {
  raf(callback)
}

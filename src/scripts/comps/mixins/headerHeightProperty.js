function setHeaderHeightProperty() {
  document.documentElement.style.setProperty('--header-height', document.querySelector('.header').clientHeight + 'px')
}
setHeaderHeightProperty()
window.addEventListener('resize', setHeaderHeightProperty)


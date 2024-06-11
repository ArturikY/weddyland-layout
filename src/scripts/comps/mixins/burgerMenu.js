const burger = document.querySelector('.burger')
const burgerOpen = document.querySelector('.header__burger');
const burgerClose = document.querySelector('.burger__close')

burgerOpen.addEventListener('click', function(e) {
  burger.classList.add('open')
})
burgerClose.addEventListener('click', function(e) {
  burger.classList.remove('open')
})
window.addEventListener('resize', function(e) {
  if (window.innerWidth > 750 && burger.classList.contains('open')) {
    console.log(1)
    burger.classList.remove('open')
  }
})
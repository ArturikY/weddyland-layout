const forgot = document.querySelector('.login-forgot')
const forgotOpen = document.querySelector('.login__forgot-link');
const forgotClose = document.querySelector('.login-forgot__close')

forgotOpen.addEventListener('click', function(e) {
  forgot.classList.add('open')
  e.preventDefault()
})
forgotClose.addEventListener('click', function(e) {
  forgot.classList.remove('open')
})
window.addEventListener('resize', function(e) {
  if (window.innerWidth > 750 && burger.classList.contains('open')) {
    forgot.classList.remove('open')
  }
})
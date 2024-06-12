const forgot = document.querySelector('.login-forgot')
const forgotOpen = document.querySelector('.login__forgot-link');
const forgotClose = document.querySelector('.login-forgot__close')
const forgotSuccessClose = document.querySelector('.login-forgot__success-close')

forgotOpen.addEventListener('click', function(e) {
  forgot.classList.add('open')
  e.preventDefault()
})
forgotClose.addEventListener('click', function(e) {
  forgot.classList.remove('open')
})
forgotSuccessClose.addEventListener('click', function(e) {
  forgot.classList.remove('open')
})
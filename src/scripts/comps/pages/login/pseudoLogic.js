const forgot = document.querySelector('.login-forgot');
const forgotSubmit = forgot.querySelector('.auth-form__submit');
const forgotField = forgot.querySelector('.auth-form__field')

  forgotSubmit.addEventListener('click', function(e) {
    e.preventDefault()
    if (!forgotField.classList.contains('error') && !forgot.classList.contains('success')) {
      forgotField.classList.add('error');
    } else if (forgotField.classList.contains('error')) {
      forgotField.classList.remove('error');
      forgot.classList.add('success');
    } else {
      forgot.classList.remove('success');
    }
  });


  const loginSubmit = document.querySelector('.login__content .auth-form__submit');
  const loginField = document.querySelector('.login__content .auth-form__field');
  loginSubmit.addEventListener('click', function(e) {
    e.preventDefault()
    if (loginField.classList.contains('error')) {
      loginField.classList.remove('error')
    } else {
      loginField.classList.add('error')
    }
  })
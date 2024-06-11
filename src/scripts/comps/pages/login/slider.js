import Swiper from "swiper/bundle";

const loginSlider = new Swiper('.login-slider', {
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  loop: true,
  grabCursor: true,
  slidesPerView: 1,
  spaceBetween: 0,
  pagination: {
    el: '.login-slider__pagination',
    clickable: true,
    bulletActiveClass: 'target',
  }
});
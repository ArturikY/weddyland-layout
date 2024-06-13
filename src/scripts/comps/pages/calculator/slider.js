import Swiper from "swiper/bundle";


const calcInspSlider = new Swiper('.calc-insp-slider', {
  grabCursor: true,
  slidesPerView: 1.5,
  spaceBetween: 15,
  scrollbar: {
    el: '.calc-insp-slider__scrollbar',
    draggable: true,
    dragSize: 'auto',
  },
  breakpoints: {
    530: {
      slidesPerView: 2,
    },
    830: {
      slidesPerView: 3,
    }
  }
});
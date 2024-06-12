import { gsap } from "gsap";

const header = document.querySelector('.header');
let headerStyles = getComputedStyle(header);

const headerProfileIcon = document.querySelector('#header-profile-icon');
headerProfileIcon.addEventListener('mouseenter', function(e) {
  gsap.to(headerProfileIcon.querySelector('path:nth-child(1)'), {duration: headerStyles.getPropertyValue('--link-transition-duration'), stroke: headerStyles.getPropertyValue('--brown')})
  gsap.to(headerProfileIcon.querySelector('path:nth-child(2)'), {duration: headerStyles.getPropertyValue('--link-transition-duration'), stroke: headerStyles.getPropertyValue('--brown')})
})
headerProfileIcon.addEventListener('mouseleave', function(e) {
  gsap.to(headerProfileIcon.querySelector('path:nth-child(1)'), {duration: headerStyles.getPropertyValue('--link-transition-duration'), stroke: headerStyles.getPropertyValue('--black')})
  gsap.to(headerProfileIcon.querySelector('path:nth-child(2)'), {duration: headerStyles.getPropertyValue('--link-transition-duration'), stroke: headerStyles.getPropertyValue('--black')})
})
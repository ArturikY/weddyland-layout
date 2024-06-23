function handlerScrollBlock(e) {
  e.preventDefault()
  let scrollBlock = e.target.closest('.scroll-block');
  let scrollContainer = e.target.closest(`.scroll-container[data-scroll-id=${scrollBlock.dataset.scrollId}]`);
  let scrollbar = document.querySelector(`.scrollbar[data-scroll-id=${scrollBlock.dataset.scrollId}]`);
  let scrollbarToddler = scrollbar.querySelector(`.scrollbar__toddler`);
  let nowScroll = Number(scrollBlock.style.translate.slice(4, -2)) + -e.deltaY / 6;
  console.log(nowScroll, 'NowScroll', Number(scrollBlock.style.translate.slice(4, -2)), -e.deltaY / 6, scrollBlock.scrollHeight, scrollbar.clientHeight, scrollContainer.clientHeight)
  scrollbarToddler.style.height = `${scrollContainer.clientHeight * scrollbar.clientHeight / scrollBlock.scrollHeight}px`
  if (nowScroll + scrollBlock.offsetHeight < scrollContainer.clientHeight) {
    console.log(1, nowScroll + scrollBlock.offsetHeight, scrollContainer.clientHeight)
    scrollBlock.style.translate = `0px ${scrollContainer.clientHeight - scrollBlock.offsetHeight}px`;
    scrollbarToddler.style.top = `${scrollbar.clientHeight - scrollbarToddler.offsetHeight}px`
  } else if (nowScroll > 0) {
    console.log(2)
    scrollBlock.style.translate = `0px ${0}px`;
    scrollbarToddler.style.top = `${0}px`

  } else {
    console.log(3, Number(scrollBlock.style.translate.slice(4, -2)), e.deltaY / 6, scrollbar.style.height)
    scrollBlock.style.translate = `0px ${Number(scrollBlock.style.translate.slice(4, -2)) + -e.deltaY / 6}px`;
    scrollbarToddler.style.top = `${(Math.abs(nowScroll) / (Math.abs(nowScroll) + (nowScroll + scrollBlock.offsetHeight - scrollContainer.clientHeight))) * (scrollbar.clientHeight - scrollbarToddler.offsetHeight)}px`
  }
}
document.querySelectorAll('.scroll-block').forEach((scrollBlock) => {
  scrollBlock.addEventListener('wheel', handlerScrollBlock);
  console.log('XXXXXXXXXXXXX')
  let scrollbar = document.querySelector(`.scrollbar[data-scroll-id=${scrollBlock.dataset.scrollId}]`);
  let scrollContainer = document.querySelector(`.scroll-container[data-scroll-id=${scrollBlock.dataset.scrollId}]`);
  let scrollbarToddler = scrollbar.querySelector(`.scrollbar__toddler`);
  scrollbarToddler.style.height = `${scrollContainer.clientHeight * scrollbar.clientHeight / scrollBlock.scrollHeight}px`

})
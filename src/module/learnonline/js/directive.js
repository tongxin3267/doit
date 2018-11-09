import Vue from 'vue';

// 图片等比例缩放居中指令，必须有一个父级元素，以父级元素的宽高为可视区域宽高
Vue.directive('picfix', {
  inserted: picCenter,
  componentUpdated: picCenter
});

// 图片等比例缩放并居中，舍弃边缘，el：图片dom
function picCenter(el) {
  // 已经修改过位置则不需要再做修改
  if (el.getAttribute('picfixed') === '1') {
    return false;
  }
  // 初始化图片样式
  el.removeAttribute('width');
  el.removeAttribute('height');
  el.style.top = '';
  el.style.left = '';
  el.style.width = '';
  el.style.height = '';
  let imgDom = document.createElement('img');
  let picWidth;
  let picHeight;

  // 获取父级元素的宽高
  let parent = el.parentNode ;
  let w = parent.offsetWidth;
  let h = parent.offsetHeight;
  el.style.position = 'relative';
  // 获取图片原宽高比例
  imgDom.onload = function() {
    picWidth = this.width;
    picHeight = this.height;

    // 如果图片原比例的高度比较大
    if(picWidth / picHeight < w / h) {
      el.style.width = w + 'px';
      el.style.height = 'auto';
      el.style.top = -(picHeight * w / picWidth - h) / 2 + 'px';

    // 如果图片原比例的宽度比较大
    } else {
      el.style.height = h + 'px';
      el.style.width = 'auto';
      el.style.maxWidth = 'none';
      el.style.left = -(picWidth * h / picHeight - w ) / 2 + 'px';
    }
    // 如果父级容器有宽高，居中了位置后做标记，无需重复居中
    (w > 0 || h > 0) && el.setAttribute('picfixed', '1');
  }
  imgDom.setAttribute('src', el.src);
}

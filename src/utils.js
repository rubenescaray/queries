import Uuid from 'uuid/v4';

const Utils = {
  getNewId: () => {
    return Uuid();
  },
  getScrollBarWidth: () => {
    const inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';
    const outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);
    document.body.appendChild(outer);
    const w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let w2 = inner.offsetWidth;
    if (w1 === w2) w2 = outer.clientWidth;
    document.body.removeChild(outer);
    return (w1 - w2);
  },
  isMobile: () => {
    const isAndroid = navigator.userAgent.match(/Android/i);
    const isBlackBerry = navigator.userAgent.match(/BlackBerry/i);
    const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
    const isOpera = navigator.userAgent.match(/Opera Mini/i);
    const isWindows = navigator.userAgent.match(/IEMobile/i);
    const any = isAndroid || isBlackBerry || isIOS || isOpera || isWindows;
    return any;
  },
  screenWidth: () => {
    const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    return width;
  }
};

export default Utils;

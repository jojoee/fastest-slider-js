// prefix: fasl

var FastestSlider = function(option) {
  // element
  this.group = '';
  this.items = '';
  this.prevArrow = '';
  this.nextArrow = '';

  this.prefix = 'fasl';
  this.option = {};
  this.currentItemIndex = 0;
  this.userOption = option;
  this.defaultOption = {
    // required
    selector: '',

    // non-required
    autoSlide: false,
    slideSpeed: 2000,
    isDebug: false,
    prevArrow: '',
    nextArrow: '',
  };

  // callback
  this.callback = {
    beforeChange: [],
    afterChange: [],
  };

  // interval
  this.interval = null;

  /*================================================================ Util
   */
  
  this.isIe = function() {
    var myNav = navigator.userAgent.toLowerCase();

    return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
  };

  // https://developer.mozilla.org/en/docs/Web/API/Element/setAttribute
  this.setAttr = function(ele, attrName, value) {
    return ele.setAttribute('data-' + this.prefix + '-' + attrName, value);
  };

  this.getAttr = function(ele, attrName) {
    return ele.getAttribute('data-' + this.prefix + '-' + attrName);
  };

  /*================================================================ Plugin util
   */
  
  this.showElement = function(ele) {
    ele.classList.remove('fasl-hide');
    ele.classList.add('fasl-show');

    return ele;
  };

  this.hideElement = function(ele) {
    ele.classList.remove('fasl-show');
    ele.classList.add('fasl-hide');

    return ele;
  };

  this.initPrevArrow = function() {
    var self = this;

    if (this.option.prevArrow) {
      this.prevArrow = document.querySelector(this.option.prevArrow);

      if (this.prevArrow) {
        this.prevArrow.onclick = function(event) {
          event.preventDefault();

          self.slideToPrevItem();
        };

      } else {
        this.log('invalid prevArrow');
      }
    }
  };

  this.initNextArrow = function() {
    var self = this;

    if (this.option.nextArrow) {
      this.nextArrow = document.querySelector(this.option.nextArrow);

      if (this.nextArrow) {
        this.nextArrow.onclick = function(event) {
          event.preventDefault();

          self.slideToNextItem();
        };

      } else {
        this.log('invalid nextArrow');
      }
    }
  };

  this.initSlider = function() {
    this.items = this.group.children;

    if (this.items && this.items.length > 1) {

      // hide all
      for (var i = 0; i < this.items.length; i++) {
        var ele = this.items[i];

        this.setAttr(ele, 'index', i);
        this.hideElement(ele);
      }

      // show the first
      this.showElement(this.items[0]);
      this.currentItemIndex = 0;

      // set interval
      if (this.option.autoSlide) {
        this.startInterval(this.option.slideSpeed);
      }

      // set prev arrow
      this.initPrevArrow();

      // set next arrow
      this.initNextArrow();

    } else {
      this.log('one item found');
    }
  };

  this.log = function(title, data) {
    if (typeof data === 'undefined') { data = ''; }
    if (this.option.isDebug) { console.log(this.option.selector + ' ' + title, data); }
  };

  /*================================================================ API
   */
  
  this.startInterval = function(ms) {
    if (typeof ms === 'undefined') { ms = this.option.slideSpeed; }
    var self = this;
    
    this.stopInterval();
    this.interval = setInterval(function() {
      self.slideToNextItem();

    }, ms);
  };

  this.stopInterval = function() {
    clearInterval(this.interval);
  };

  /*================================================================ Custom event
   */

  // TODO: refactor, eventName validatiion
  this.on = function(eventName, callback) {
    if (typeof callback === 'function') {
      switch (eventName) {
        case 'beforeChange':
          this.callback.beforeChange.push(callback);
          break;
        case 'afterChange':
          this.callback.afterChange.push(callback);
          break;
        default:
          break;
      }
    }
  };

  this.releaseBeforeChangeEvent = function() {
    this.releaseEvent('beforeChange');
  };

  this.releaseAfterChangeEvent = function() {
    this.releaseEvent('afterChange');
  };

  this.releaseEvent = function(eventName) {
    if (this.callback[eventName]) {
      var nEvents = this.callback[eventName].length,
        i = 0;

      for (i = 0; i < nEvents; i++) {
        this.callback[eventName][i]();
      }
    }
  };

  /*================================================================ Others
   */
  
  this.getPrevItemIndex = function() {
    var result = (this.currentItemIndex <= 0) ? this.items.length - 1 : this.currentItemIndex - 1;

    return result;
  };
  
  this.getNextItemIndex = function() {
    var result = (this.currentItemIndex >= this.items.length - 1) ? 0 : this.currentItemIndex + 1;

    return result;
  };
  
  this.slideToNextItem = function() {
    var currentIndex = this.currentItemIndex;
    var nextIndex = this.getNextItemIndex();

    this.slideItem(currentIndex, nextIndex);
  };

  this.slideToPrevItem = function() {
    var currentIndex = this.currentItemIndex;
    var prevIndex = this.getPrevItemIndex();

    this.slideItem(currentIndex, prevIndex);
  };

  this.slideItem = function(currentIndex, slideToIndex) {
    // dispatch
    this.releaseBeforeChangeEvent();
    
    this.hideElement(this.items[currentIndex]);
    this.showElement(this.items[slideToIndex]);
    this.currentItemIndex = slideToIndex;

    // dispatch
    this.releaseAfterChangeEvent();
  };

  // validate data, and initialize it 
  this.init = function() {
    this.option = Object.assign(this.defaultOption, this.userOption);

    if (this.option.selector) {
      try {
        this.group = document.querySelector(this.option.selector);
        this.initSlider();

      } catch (e) {
        this.log('error', e);
      }

    } else {
      this.log('invalid selector');
    }
  };

  // start
  this.init();
};

if (typeof module !== 'undefined' && module.exports != null) {
  exports = FastestSlider;
}

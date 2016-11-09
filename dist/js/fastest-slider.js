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
  
  /**
   * Returns ture if browser if IE
   * 
   * @return {boolean}
   */
  this.isIe = function() {
    var myNav = navigator.userAgent.toLowerCase();

    return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
  };

  /**
   * Set element's data attribute
   *
   * @see https://developer.mozilla.org/en/docs/Web/API/Element/setAttribute
   * 
   * @param {Object} ele
   * @param {string} attrName
   * @param {string} value
   * 
   * @return {Object} ele
   */
  this.setAttr = function(ele, attrName, value) {
    return ele.setAttribute('data-' + this.prefix + '-' + attrName, value);
  };

  /**
   * Get element's data attribute
   *
   * @see https://developer.mozilla.org/en/docs/Web/API/Element/setAttribute
   * 
   * @param {Object} ele
   * @param {string} attrName
   * 
   * @return {Object} ele
   */
  this.getAttr = function(ele, attrName) {
    return ele.getAttribute('data-' + this.prefix + '-' + attrName);
  };

  /**
   * Check number is in a range ?
   * 
   * @see http://stackoverflow.com/questions/12806304/shortest-code-to-check-if-a-number-is-in-a-range-in-javascript
   * @see http://stackoverflow.com/questions/6454198/check-a-range-of-numbers-in-an-if-condition
   * 
   * @param {number} x
   * @param {number} min
   * @param {number} max
   * @return {boolean}
   */
  this.isBetween = function(x, min, max) {
    return x >= min && x <= max;
  };

  /*================================================================ Plugin util
   */
  
  /**
   * Show element
   * remove css class that hide the element
   * 
   * @param {Object} ele
   * @return {Object} ele
   */
  this.showElement = function(ele) {
    ele.classList.remove('fasl-hide');

    return ele;
  };

  /**
   * Hide element
   * add css class that hide the element
   * 
   * @param {Object} ele
   * @return {Object} ele
   */
  this.hideElement = function(ele) {
    ele.classList.add('fasl-hide');

    return ele;
  };

  /**
   * Initialize prev arrow 
   */
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

  /**
   * Initialize next arrow
   */
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

  /**
   * Initialize slider
   */
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

  /**
   * Log
   */
  this.log = function(title, data) {
    if (typeof data === 'undefined') { data = ''; }
    if (this.option.isDebug) { console.log(this.option.selector + ' ' + title, data); }
  };

  /**
   * Check the goToIndex is valid or not
   * 
   * @param {number} index - integer number
   * @return {boolean}
   */
  this.isValidGoToIndex = function(index) {
    return this.isBetween(index, 0, this.items.length);
  };

  /*================================================================ API
   */
  
  /**
   * Set interval
   * - auto slide
   */
  this.startInterval = function(ms) {
    if (typeof ms === 'undefined') { ms = this.option.slideSpeed; }
    var self = this;
    
    this.stopInterval();
    this.interval = setInterval(function() {
      self.slideToNextItem();

    }, ms);
  };

  /**
   * Stop interval
   */
  this.stopInterval = function() {
    clearInterval(this.interval);
  };

  /**
   * Slide to next slide
   * caller
   */
  this.goToNext = function() {
    this.slideToNextItem();
  };

  /**
   * Slide to prev slide
   * caller
   */
  this.goToPrev = function() {
    this.slideToPrevItem();
  };

  /**
   * Slide to slide by slide's index
   * caller 
   * 
   * @param {string|number} goToIndex
   */
  this.goTo = function(goToIndex) {
    if (goToIndex === '-1') {
      this.slideToPrevItem();

    } else if (goToIndex === '+1') {
      this.slideToNextItem();
      
    } else {
      goToIndex = parseInt(goToIndex);

      if (this.isValidGoToIndex(goToIndex)) {
        this.slideTo(goToIndex);

      } else {
        this.log('invalid goToIndex')
      }
    }
  };

  /*================================================================ API - Custom event
   */
  
  /**
   * Adding callback event
   * TODO: refactor, eventName validatiion
   * 
   * @param {string} eventName
   * @param {function} callback
   */
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

  /**
   * Release beforeChange event
   */
  this.releaseBeforeChangeEvent = function() {
    this.releaseEvent('beforeChange');
  };

  /**
   * Release afterChange event
   */
  this.releaseAfterChangeEvent = function() {
    this.releaseEvent('afterChange');
  };

  /**
   * Release event by event name
   * 
   * @param {string} eventName - plugin's event name
   */
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
  
  /**
   * Get prev-slide's index
   */
  this.getPrevItemIndex = function() {
    var result = (this.currentItemIndex <= 0) ? this.items.length - 1 : this.currentItemIndex - 1;

    return result;
  };
  
  /**
   * Get next-slide's index
   */
  this.getNextItemIndex = function() {
    var result = (this.currentItemIndex >= this.items.length - 1) ? 0 : this.currentItemIndex + 1;

    return result;
  };
  
  /**
   * Slide to next slide
   */
  this.slideToNextItem = function() {
    var nextIndex = this.getNextItemIndex();

    this.slideTo(nextIndex);
  };

  /**
   * Slide to prev slide
   */
  this.slideToPrevItem = function() {
    var prevIndex = this.getPrevItemIndex();

    this.slideTo(prevIndex);
  };

  /**
   * Slide to slide by slide's index 
   * 
   * @param {number} slideToIndex
   */
  this.slideTo = function(slideToIndex) {
    var currentIndex = this.currentItemIndex;

    // dispatch
    this.releaseBeforeChangeEvent();
    
    this.hideElement(this.items[currentIndex]);
    this.showElement(this.items[slideToIndex]);
    this.currentItemIndex = slideToIndex;

    // dispatch
    this.releaseAfterChangeEvent();
  };

  /**
   * Initialize plugin
   * - validate data
   * - initialize
   */
  this.init = function() {
    // this.option = Object.assign(this.defaultOption, this.userOption);

    // TODO: improve it
    this.option.selector = this.userOption.selector || this.defaultOption.selector;
    this.option.autoSlide = this.userOption.autoSlide || this.defaultOption.autoSlide;
    this.option.slideSpeed = this.userOption.slideSpeed || this.defaultOption.slideSpeed;
    this.option.isDebug = this.userOption.isDebug || this.defaultOption.isDebug;
    this.option.prevArrow = this.userOption.prevArrow || this.defaultOption.prevArrow;
    this.option.nextArrow = this.userOption.nextArrow || this.defaultOption.nextArrow;

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

//# sourceMappingURL=fastest-slider.js.map

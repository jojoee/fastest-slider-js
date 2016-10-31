/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-12-13
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}


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

# FastestSlider (fastest-slider-js)
[![Bower Version](https://img.shields.io/bower/v/fastest-slider-js.svg)](https://bower.io/search/?q=fastest-slider-js) [![Npm Version](https://img.shields.io/npm/v/fastest-slider-js.svg)](https://www.npmjs.com/package/fastest-slider-js) [![Release Version](https://img.shields.io/github/release/jojoee/fastest-slider-js.svg)](https://github.com/jojoee/fastest-slider-js/releases) [![Downloads](https://img.shields.io/npm/dt/fastest-slider-js.svg)](https://github.com/jojoee/fastest-slider-js/archive/master.zip)

Another fastest slider

[![screenshot 1](https://raw.githubusercontent.com/jojoee/fastest-slider-js/master/screenshot/screenshot-1.gif "screenshot 1")](http://jojoee.github.io/fastest-slider-js/)

## Install
1: npm
```
1.1 Install npm
1.2 Install package: `npm install --save fastest-slider-js`
```
2: bower
```
2.1 Install npm
2.2 Install bower: `npm install -g bower`
2.3 Install package: `bower install --save fastest-slider-js`
```

## Normal usage
```
1. Html structure

<div class="wrap normal-slide">
  <div class="title">Normal</div>

  <div class="items">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
  </div>

  <div class="pagi">
    <div class="pagi-arrow arrow-prev">&lt;</div>
    <div class="pagi-arrow arrow-next">&gt;</div>
  </div>
</div><!-- .normal-slide -->

2. Javascript

var normal = new FastestSlider({
  // required
  selector: '.normal-slide .items',

  // non-required
  autoSlide: false,
  slideSpeed: 2000,
  isDebug: true,
  prevArrow: '.normal-slide .arrow-prev',
  nextArrow: '.normal-slide .arrow-next',
});

/* default non-required option */
autoSlide: false,
slideSpeed: 2000,
isDebug: false,
prevArrow: '',
nextArrow: '',
```

## Note
- 2 spaces for indent
- Compatible with all browsers:
  - [Google Chrome](https://www.google.com/chrome/) 19+
  - [Mozilla Firefox](https://www.mozilla.org/firefox/) 3.5+
  - [Safari](http://www.apple.com/safari/) 6+
  - [Internet Explorer](https://www.microsoft.com/en-us/download/internet-explorer.aspx) 8+
  - [Opera](http://www.opera.com/) 11.5

## Getting Started for dev
1. Install [Node.js](https://nodejs.org/en/)
2. Set path (e.g. `cd C:\xampp\htdocs\jojoee.com\fastest-slider-js`)
3. Install global: `npm install -g gulp bower browser-sync`
4. Install dependencies: `bower install && npm install`
5. Start: `gulp` to build and `gulp watch` to dev

# TODO
- [ ] Implement JSHint into task runner
- [ ] Complete DocBlockr
- [ ] Unit test
- [ ] Add `.min` file (`uglify`)
- [ ] Inject compliled `css` without refresh (`gulpfile.js`)
- [ ] Fix `Travis CI`
- [ ] Support ES6
- [ ] Separate utilities function into another files
- [ ] Add [.npmignore](https://docs.npmjs.com/misc/developers)
- [ ] Implement [ci.testling.com](https://ci.testling.com/)
- [ ] Add E2E testing script by [Nightwatch.js](http://nightwatchjs.org/)
- [ ] Localization

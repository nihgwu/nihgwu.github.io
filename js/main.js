;
/* Slideshow */
(function() {
  'use strict';

  var support = {
      animations: Modernizr.cssanimations
    },
    animEndEventNames = {
      'WebkitAnimation': 'webkitAnimationEnd',
      'OAnimation': 'oAnimationEnd',
      'msAnimation': 'MSAnimationEnd',
      'animation': 'animationend'
    },
    animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];

  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function onEndAnimation(el, callback) {
    var onEndCallbackFn = function(ev) {
      if (support.animations) {
        if (ev.target != this) return;
        this.removeEventListener(animEndEventName, onEndCallbackFn);
      }
      if (callback && typeof callback === 'function') {
        callback.call();
      }
    };

    if (support.animations) {
      el.addEventListener(animEndEventName, onEndCallbackFn);
    } else {
      onEndCallbackFn();
    }
  }

  function Slideshow(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this.items = [].slice.call(this.el.children);
    this.itemsCount = this.items.length;
    this.current = this.options.start >= 0 || this.options.start < this.itemsCount ? this.options.start : 0,
      this._setCurrent();
    this._startSlideshow();
  }

  Slideshow.prototype.options = {
    start: 0,
    interval: 3500
  }

  Slideshow.prototype._startSlideshow = function() {
    if (this.slideshowtime) {
      clearTimeout(this.slideshowtime);
    }
    var self = this;
    this.slideshowtime = setTimeout(function() {
      self._navigate('next');
      self._startSlideshow();
    }, this.options.interval);
  }

  Slideshow.prototype._navigate = function(direction) {
    var self = this,
      // current item
      oldItem = this.items[this.current];

    if (direction === 'next') {
      this.current = this.current < this.itemsCount - 1 ? ++this.current : 0;
    } else {
      this.current = this.current > 0 ? --this.current : this.itemsCount - 1;
    }

    // new item
    var newItem = this.items[this.current];

    classie.add(oldItem, direction === 'next' ? 'out--next' : 'out--prev');
    classie.add(newItem, direction === 'next' ? 'in--next' : 'in--prev');

    onEndAnimation(newItem, function() {
      self._setCurrent(oldItem);
      classie.remove(oldItem, direction === 'next' ? 'out--next' : 'out--prev');
      classie.remove(newItem, direction === 'next' ? 'in--next' : 'in--prev');
    });
  }

  Slideshow.prototype._setCurrent = function(old) {
    if (old) {
      classie.remove(old, 'current');
    }
    classie.add(this.items[this.current], 'current');
  }

  window.Slideshow = Slideshow;

})();

/* mockup */
(function() {
  new Slideshow(document.getElementById('slideshow-1'));
  setTimeout(function() {
    new Slideshow(document.getElementById('slideshow-2'));
  }, 1750);

  /* Mockup responsiveness */
  var body = docElem = window.document.documentElement,
    wrap = document.getElementById('wrap'),
    mockup = wrap.querySelector('.mockup'),
    mockupWidth = mockup.offsetWidth;

  scaleMockup();

  function scaleMockup() {
    var wrapWidth = wrap.offsetWidth,
      val = wrapWidth / mockupWidth;

    mockup.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
  }

  window.addEventListener('resize', resizeHandler);

  function resizeHandler() {
    function delayed() {
      resize();
      resizeTimeout = null;
    }
    if (typeof resizeTimeout != 'undefined') {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(delayed, 50);
  }

  function resize() {
    scaleMockup();
  }
})();

/* menu */
(function() {

  var button = document.getElementById('cn-button'),
    wrapper = document.getElementById('cn-wrapper');

  //open and close menu when the button is clicked
  var open = false;
  button.addEventListener('click', handler, false);

  function handler() {
    if (!open) {
      classie.add(wrapper, 'opened-nav');
    } else {
      classie.remove(wrapper, 'opened-nav');
    }
    open = !open;
  }

  function closeWrapper() {
    classie.remove(wrapper, 'opened-nav');
  }

})();

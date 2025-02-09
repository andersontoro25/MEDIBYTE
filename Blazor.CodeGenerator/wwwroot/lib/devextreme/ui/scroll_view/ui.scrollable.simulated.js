/**
 * DevExtreme (ui/scroll_view/ui.scrollable.simulated.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _dom_adapter = require("../../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _inflector = require("../../core/utils/inflector");
var _extend = require("../../core/utils/extend");
var _window = require("../../core/utils/window");
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
var _translator = require("../../animation/translator");
var _translator2 = _interopRequireDefault(_translator);
var _class = require("../../core/class");
var _class2 = _interopRequireDefault(_class);
var _animator = require("./animator");
var _animator2 = _interopRequireDefault(_animator);
var _devices = require("../../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _utils = require("../../events/utils");
var _common = require("../../core/utils/common");
var _ui = require("./ui.scrollbar");
var _ui2 = _interopRequireDefault(_ui);
var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var realDevice = _devices2.default.real;
var isSluggishPlatform = "win" === realDevice.platform || "android" === realDevice.platform;
var SCROLLABLE_SIMULATED = "dxSimulatedScrollable";
var SCROLLABLE_STRATEGY = "dxScrollableStrategy";
var SCROLLABLE_SIMULATED_CURSOR = SCROLLABLE_SIMULATED + "Cursor";
var SCROLLABLE_SIMULATED_KEYBOARD = SCROLLABLE_SIMULATED + "Keyboard";
var SCROLLABLE_SIMULATED_CLASS = "dx-scrollable-simulated";
var SCROLLABLE_SCROLLBARS_HIDDEN = "dx-scrollable-scrollbars-hidden";
var SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = "dx-scrollable-scrollbars-alwaysvisible";
var SCROLLABLE_SCROLLBAR_CLASS = "dx-scrollable-scrollbar";
var VERTICAL = "vertical";
var HORIZONTAL = "horizontal";
var ACCELERATION = isSluggishPlatform ? .95 : .92;
var OUT_BOUNDS_ACCELERATION = .5;
var MIN_VELOCITY_LIMIT = 1;
var FRAME_DURATION = Math.round(1e3 / 60);
var SCROLL_LINE_HEIGHT = 20;
var VALIDATE_WHEEL_TIMEOUT = 500;
var BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;
var BOUNCE_DURATION = isSluggishPlatform ? 300 : 400;
var BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
var BOUNCE_ACCELERATION_SUM = (1 - Math.pow(ACCELERATION, BOUNCE_FRAMES)) / (1 - ACCELERATION);
var KEY_CODES = {
    PAGE_UP: "pageUp",
    PAGE_DOWN: "pageDown",
    END: "end",
    HOME: "home",
    LEFT: "leftArrow",
    UP: "upArrow",
    RIGHT: "rightArrow",
    DOWN: "downArrow",
    TAB: "tab"
};
var InertiaAnimator = _animator2.default.inherit({
    ctor: function(scroller) {
        this.callBase();
        this.scroller = scroller
    },
    VELOCITY_LIMIT: MIN_VELOCITY_LIMIT,
    _isFinished: function() {
        return Math.abs(this.scroller._velocity) <= this.VELOCITY_LIMIT
    },
    _step: function() {
        this.scroller._scrollStep(this.scroller._velocity);
        this.scroller._velocity *= this._acceleration()
    },
    _acceleration: function() {
        return this.scroller._inBounds() ? ACCELERATION : OUT_BOUNDS_ACCELERATION
    },
    _complete: function() {
        this.scroller._scrollComplete()
    },
    _stop: function() {
        this.scroller._stopComplete()
    }
});
var BounceAnimator = InertiaAnimator.inherit({
    VELOCITY_LIMIT: BOUNCE_MIN_VELOCITY_LIMIT,
    _isFinished: function() {
        return this.scroller._crossBoundOnNextStep() || this.callBase()
    },
    _acceleration: function() {
        return ACCELERATION
    },
    _complete: function() {
        this.scroller._move(this.scroller._bounceLocation);
        this.callBase()
    }
});
var Scroller = _class2.default.inherit({
    ctor: function(options) {
        this._initOptions(options);
        this._initAnimators();
        this._initScrollbar()
    },
    _initOptions: function(options) {
        var _this = this;
        this._location = 0;
        this._topReached = false;
        this._bottomReached = false;
        this._axis = options.direction === HORIZONTAL ? "x" : "y";
        this._prop = options.direction === HORIZONTAL ? "left" : "top";
        this._dimension = options.direction === HORIZONTAL ? "width" : "height";
        this._scrollProp = options.direction === HORIZONTAL ? "scrollLeft" : "scrollTop";
        (0, _iterator.each)(options, function(optionName, optionValue) {
            _this["_" + optionName] = optionValue
        })
    },
    _initAnimators: function() {
        this._inertiaAnimator = new InertiaAnimator(this);
        this._bounceAnimator = new BounceAnimator(this)
    },
    _initScrollbar: function() {
        this._scrollbar = new _ui2.default((0, _renderer2.default)("<div>").appendTo(this._$container), {
            direction: this._direction,
            visible: this._scrollByThumb,
            visibilityMode: this._visibilityModeNormalize(this._scrollbarVisible),
            expandable: this._scrollByThumb
        });
        this._$scrollbar = this._scrollbar.$element()
    },
    _visibilityModeNormalize: function(mode) {
        return true === mode ? "onScroll" : false === mode ? "never" : mode
    },
    _scrollStep: function(delta) {
        var prevLocation = this._location;
        this._location += delta;
        this._suppressBounce();
        this._move();
        if (Math.abs(prevLocation - this._location) < 1) {
            return
        }
        _events_engine2.default.triggerHandler(this._$container, {
            type: "scroll"
        })
    },
    _suppressBounce: function() {
        if (this._bounceEnabled || this._inBounds(this._location)) {
            return
        }
        this._velocity = 0;
        this._location = this._boundLocation()
    },
    _boundLocation: function(location) {
        location = void 0 !== location ? location : this._location;
        return Math.max(Math.min(location, this._maxOffset), this._minOffset)
    },
    _move: function(location) {
        this._location = void 0 !== location ? location * this._getScaleRatio() : this._location;
        this._moveContent();
        this._moveScrollbar()
    },
    _moveContent: function() {
        var location = this._location;
        this._$container[this._scrollProp](-location / this._getScaleRatio());
        this._moveContentByTranslator(location)
    },
    _getScaleRatio: function() {
        if ((0, _window.hasWindow)() && !this._scaleRatio) {
            var element = this._$element.get(0);
            var realDimension = this._getRealDimension(element, this._dimension);
            var baseDimension = this._getBaseDimension(element, this._dimension);
            this._scaleRatio = Math.round(realDimension / baseDimension * 100) / 100
        }
        return this._scaleRatio || 1
    },
    _getRealDimension: function(element, dimension) {
        return Math.round(element.getBoundingClientRect()[dimension])
    },
    _getBaseDimension: function(element, dimension) {
        var dimensionName = "offset" + (0, _inflector.titleize)(dimension);
        return element[dimensionName]
    },
    _moveContentByTranslator: function(location) {
        var translateOffset = void 0;
        var minOffset = -this._maxScrollPropValue;
        if (location > 0) {
            translateOffset = location
        } else {
            if (location <= minOffset) {
                translateOffset = location - minOffset
            } else {
                translateOffset = location % 1
            }
        }
        if (this._translateOffset === translateOffset) {
            return
        }
        var targetLocation = {};
        targetLocation[this._prop] = translateOffset;
        this._translateOffset = translateOffset;
        if (0 === translateOffset) {
            _translator2.default.resetPosition(this._$content);
            return
        }
        _translator2.default.move(this._$content, targetLocation)
    },
    _moveScrollbar: function() {
        this._scrollbar.moveTo(this._location)
    },
    _scrollComplete: function() {
        if (this._inBounds()) {
            this._hideScrollbar();
            if (this._completeDeferred) {
                this._completeDeferred.resolve()
            }
        }
        this._scrollToBounds()
    },
    _scrollToBounds: function() {
        if (this._inBounds()) {
            return
        }
        this._bounceAction();
        this._setupBounce();
        this._bounceAnimator.start()
    },
    _setupBounce: function() {
        var boundLocation = this._bounceLocation = this._boundLocation();
        var bounceDistance = boundLocation - this._location;
        this._velocity = bounceDistance / BOUNCE_ACCELERATION_SUM
    },
    _inBounds: function(location) {
        location = void 0 !== location ? location : this._location;
        return this._boundLocation(location) === location
    },
    _crossBoundOnNextStep: function() {
        var location = this._location;
        var nextLocation = location + this._velocity;
        return location < this._minOffset && nextLocation >= this._minOffset || location > this._maxOffset && nextLocation <= this._maxOffset
    },
    _initHandler: function(e) {
        this._stopDeferred = new _deferred.Deferred;
        this._stopScrolling();
        this._prepareThumbScrolling(e);
        return this._stopDeferred.promise()
    },
    _stopScrolling: (0, _common.deferRenderer)(function() {
        this._hideScrollbar();
        this._inertiaAnimator.stop();
        this._bounceAnimator.stop()
    }),
    _prepareThumbScrolling: function(e) {
        if ((0, _utils.isDxMouseWheelEvent)(e.originalEvent)) {
            return
        }
        var $target = (0, _renderer2.default)(e.originalEvent.target);
        var scrollbarClicked = this._isScrollbar($target);
        if (scrollbarClicked) {
            this._moveToMouseLocation(e)
        }
        this._thumbScrolling = scrollbarClicked || this._isThumb($target);
        this._crossThumbScrolling = !this._thumbScrolling && this._isAnyThumbScrolling($target);
        if (this._thumbScrolling) {
            this._scrollbar.feedbackOn()
        }
    },
    _isThumbScrollingHandler: function($target) {
        return this._isThumb($target)
    },
    _moveToMouseLocation: function(e) {
        var mouseLocation = e["page" + this._axis.toUpperCase()] - this._$element.offset()[this._prop];
        var location = this._location + mouseLocation / this._containerToContentRatio() - this._$container.height() / 2;
        this._scrollStep(-Math.round(location))
    },
    _stopComplete: function() {
        if (this._stopDeferred) {
            this._stopDeferred.resolve()
        }
    },
    _startHandler: function() {
        this._showScrollbar()
    },
    _moveHandler: function(delta) {
        if (this._crossThumbScrolling) {
            return
        }
        if (this._thumbScrolling) {
            delta[this._axis] = -Math.round(delta[this._axis] / this._containerToContentRatio())
        }
        this._scrollBy(delta)
    },
    _scrollBy: function(delta) {
        delta = delta[this._axis];
        if (!this._inBounds()) {
            delta *= OUT_BOUNDS_ACCELERATION
        }
        this._scrollStep(delta)
    },
    _scrollByHandler: function(delta) {
        this._scrollBy(delta);
        this._scrollComplete()
    },
    _containerToContentRatio: function() {
        return this._scrollbar.containerToContentRatio()
    },
    _endHandler: function(velocity) {
        this._completeDeferred = new _deferred.Deferred;
        this._velocity = velocity[this._axis];
        this._inertiaHandler();
        this._resetThumbScrolling();
        return this._completeDeferred.promise()
    },
    _inertiaHandler: function() {
        this._suppressInertia();
        this._inertiaAnimator.start()
    },
    _suppressInertia: function() {
        if (!this._inertiaEnabled || this._thumbScrolling) {
            this._velocity = 0
        }
    },
    _resetThumbScrolling: function() {
        this._thumbScrolling = false;
        this._crossThumbScrolling = false
    },
    _stopHandler: function() {
        if (this._thumbScrolling) {
            this._scrollComplete()
        }
        this._resetThumbScrolling();
        this._scrollToBounds()
    },
    _disposeHandler: function() {
        this._stopScrolling();
        this._$scrollbar.remove()
    },
    _updateHandler: function() {
        this._update();
        this._moveToBounds()
    },
    _update: function() {
        var _this2 = this;
        this._stopScrolling();
        return (0, _common.deferUpdate)(function() {
            _this2._resetScaleRatio();
            _this2._updateLocation();
            _this2._updateBounds();
            _this2._updateScrollbar();
            (0, _common.deferRender)(function() {
                _this2._moveScrollbar();
                _this2._scrollbar.update()
            })
        })
    },
    _resetScaleRatio: function() {
        this._scaleRatio = null
    },
    _updateLocation: function() {
        this._location = (_translator2.default.locate(this._$content)[this._prop] - this._$container[this._scrollProp]()) * this._getScaleRatio()
    },
    _updateBounds: function() {
        this._maxOffset = Math.round(this._getMaxOffset());
        this._minOffset = Math.round(this._getMinOffset())
    },
    _getMaxOffset: function() {
        return 0
    },
    _getMinOffset: function() {
        this._maxScrollPropValue = Math.max(this._contentSize() - this._containerSize(), 0);
        return -this._maxScrollPropValue
    },
    _updateScrollbar: (0, _common.deferUpdater)(function() {
        var _this3 = this;
        var containerSize = this._containerSize();
        var contentSize = this._contentSize();
        var baseContainerSize = this._getBaseDimension(this._$container.get(0), this._dimension);
        var baseContentSize = this._getBaseDimension(this._$content.get(0), this._dimension);
        (0, _common.deferRender)(function() {
            _this3._scrollbar.option({
                containerSize: containerSize,
                contentSize: contentSize,
                baseContainerSize: baseContainerSize,
                baseContentSize: baseContentSize,
                scaleRatio: _this3._getScaleRatio()
            })
        })
    }),
    _moveToBounds: (0, _common.deferRenderer)((0, _common.deferUpdater)((0, _common.deferRenderer)(function() {
        var location = this._boundLocation();
        var locationChanged = location !== this._location;
        this._location = location;
        this._move();
        if (locationChanged) {
            this._scrollAction()
        }
    }))),
    _createActionsHandler: function(actions) {
        this._scrollAction = actions.scroll;
        this._bounceAction = actions.bounce
    },
    _showScrollbar: function() {
        this._scrollbar.option("visible", true)
    },
    _hideScrollbar: function() {
        this._scrollbar.option("visible", false)
    },
    _containerSize: function() {
        return this._getRealDimension(this._$container.get(0), this._dimension)
    },
    _contentSize: function() {
        var isOverflowHidden = "hidden" === this._$content.css("overflow" + this._axis.toUpperCase());
        var contentSize = this._getRealDimension(this._$content.get(0), this._dimension);
        if (!isOverflowHidden) {
            var containerScrollSize = this._$content[0]["scroll" + (0, _inflector.titleize)(this._dimension)] * this._getScaleRatio();
            contentSize = Math.max(containerScrollSize, contentSize)
        }
        return contentSize
    },
    _validateEvent: function(e) {
        var $target = (0, _renderer2.default)(e.originalEvent.target);
        return this._isThumb($target) || this._isScrollbar($target) || this._isContent($target)
    },
    _isThumb: function($element) {
        return this._scrollByThumb && this._scrollbar.isThumb($element)
    },
    _isScrollbar: function($element) {
        return this._scrollByThumb && $element && $element.is(this._$scrollbar)
    },
    _isContent: function($element) {
        return this._scrollByContent && !!$element.closest(this._$element).length
    },
    _reachedMin: function() {
        return this._location <= this._minOffset
    },
    _reachedMax: function() {
        return this._location >= this._maxOffset
    },
    _cursorEnterHandler: function() {
        this._scrollbar.cursorEnter()
    },
    _cursorLeaveHandler: function() {
        this._scrollbar.cursorLeave()
    },
    dispose: _common.noop
});
var hoveredScrollable, activeScrollable;
var SimulatedStrategy = _class2.default.inherit({
    ctor: function(scrollable) {
        this._init(scrollable)
    },
    _init: function(scrollable) {
        this._component = scrollable;
        this._$element = scrollable.$element();
        this._$container = scrollable._$container;
        this._$wrapper = scrollable._$wrapper;
        this._$content = scrollable._$content;
        this.option = scrollable.option.bind(scrollable);
        this._createActionByOption = scrollable._createActionByOption.bind(scrollable);
        this._isLocked = scrollable._isLocked.bind(scrollable);
        this._isDirection = scrollable._isDirection.bind(scrollable);
        this._allowedDirection = scrollable._allowedDirection.bind(scrollable)
    },
    render: function() {
        this._$element.addClass(SCROLLABLE_SIMULATED_CLASS);
        this._createScrollers();
        if (this.option("useKeyboard")) {
            this._$container.prop("tabIndex", 0)
        }
        this._attachKeyboardHandler();
        this._attachCursorHandlers()
    },
    _createScrollers: function() {
        this._scrollers = {};
        if (this._isDirection(HORIZONTAL)) {
            this._createScroller(HORIZONTAL)
        }
        if (this._isDirection(VERTICAL)) {
            this._createScroller(VERTICAL)
        }
        this._$element.toggleClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE, "always" === this.option("showScrollbar"));
        this._$element.toggleClass(SCROLLABLE_SCROLLBARS_HIDDEN, !this.option("showScrollbar"))
    },
    _createScroller: function(direction) {
        this._scrollers[direction] = new Scroller(this._scrollerOptions(direction))
    },
    _scrollerOptions: function(direction) {
        return {
            direction: direction,
            $content: this._$content,
            $container: this._$container,
            $wrapper: this._$wrapper,
            $element: this._$element,
            scrollByContent: this.option("scrollByContent"),
            scrollByThumb: this.option("scrollByThumb"),
            scrollbarVisible: this.option("showScrollbar"),
            bounceEnabled: this.option("bounceEnabled"),
            inertiaEnabled: this.option("inertiaEnabled"),
            isAnyThumbScrolling: this._isAnyThumbScrolling.bind(this)
        }
    },
    _applyScaleRatio: function(targetLocation) {
        for (var direction in this._scrollers) {
            var prop = this._getPropByDirection(direction);
            if ((0, _type.isDefined)(targetLocation[prop])) {
                var scroller = this._scrollers[direction];
                targetLocation[prop] *= scroller._getScaleRatio()
            }
        }
        return targetLocation
    },
    _isAnyThumbScrolling: function($target) {
        var result = false;
        this._eventHandler("isThumbScrolling", $target).done(function(isThumbScrollingVertical, isThumbScrollingHorizontal) {
            result = isThumbScrollingVertical || isThumbScrollingHorizontal
        });
        return result
    },
    handleInit: function(e) {
        this._suppressDirections(e);
        this._eventForUserAction = e;
        this._eventHandler("init", e).done(this._stopAction)
    },
    _suppressDirections: function(e) {
        if ((0, _utils.isDxMouseWheelEvent)(e.originalEvent)) {
            this._prepareDirections(true);
            return
        }
        this._prepareDirections();
        this._eachScroller(function(scroller, direction) {
            var isValid = scroller._validateEvent(e);
            this._validDirections[direction] = isValid
        })
    },
    _prepareDirections: function(value) {
        value = value || false;
        this._validDirections = {};
        this._validDirections[HORIZONTAL] = value;
        this._validDirections[VERTICAL] = value
    },
    _eachScroller: function(callback) {
        callback = callback.bind(this);
        (0, _iterator.each)(this._scrollers, function(direction, scroller) {
            callback(scroller, direction)
        })
    },
    handleStart: function(e) {
        this._eventForUserAction = e;
        this._eventHandler("start").done(this._startAction)
    },
    _saveActive: function() {
        activeScrollable = this
    },
    _resetActive: function() {
        if (activeScrollable === this) {
            activeScrollable = null
        }
    },
    handleMove: function(e) {
        if (this._isLocked()) {
            e.cancel = true;
            this._resetActive();
            return
        }
        this._saveActive();
        e.preventDefault && e.preventDefault();
        this._adjustDistance(e.delta);
        this._eventForUserAction = e;
        this._eventHandler("move", e.delta)
    },
    _adjustDistance: function(distance) {
        distance.x *= this._validDirections[HORIZONTAL];
        distance.y *= this._validDirections[VERTICAL]
    },
    handleEnd: function(e) {
        this._resetActive();
        this._refreshCursorState(e.originalEvent && e.originalEvent.target);
        this._adjustDistance(e.velocity);
        this._eventForUserAction = e;
        return this._eventHandler("end", e.velocity).done(this._endAction)
    },
    handleCancel: function(e) {
        this._resetActive();
        this._eventForUserAction = e;
        return this._eventHandler("end", {
            x: 0,
            y: 0
        })
    },
    handleStop: function() {
        this._resetActive();
        this._eventHandler("stop")
    },
    handleScroll: function() {
        this._scrollAction()
    },
    _attachKeyboardHandler: function() {
        _events_engine2.default.off(this._$element, "." + SCROLLABLE_SIMULATED_KEYBOARD);
        if (!this.option("disabled") && this.option("useKeyboard")) {
            _events_engine2.default.on(this._$element, (0, _utils.addNamespace)("keydown", SCROLLABLE_SIMULATED_KEYBOARD), this._keyDownHandler.bind(this))
        }
    },
    _keyDownHandler: function(e) {
        var _this4 = this;
        clearTimeout(this._updateHandlerTimeout);
        this._updateHandlerTimeout = setTimeout(function() {
            if ((0, _utils.normalizeKeyName)(e) === KEY_CODES.TAB) {
                _this4._eachScroller(function(scroller) {
                    scroller._updateHandler()
                })
            }
        });
        if (!this._$container.is(_dom_adapter2.default.getActiveElement())) {
            return
        }
        var handled = true;
        switch ((0, _utils.normalizeKeyName)(e)) {
            case KEY_CODES.DOWN:
                this._scrollByLine({
                    y: 1
                });
                break;
            case KEY_CODES.UP:
                this._scrollByLine({
                    y: -1
                });
                break;
            case KEY_CODES.RIGHT:
                this._scrollByLine({
                    x: 1
                });
                break;
            case KEY_CODES.LEFT:
                this._scrollByLine({
                    x: -1
                });
                break;
            case KEY_CODES.PAGE_DOWN:
                this._scrollByPage(1);
                break;
            case KEY_CODES.PAGE_UP:
                this._scrollByPage(-1);
                break;
            case KEY_CODES.HOME:
                this._scrollToHome();
                break;
            case KEY_CODES.END:
                this._scrollToEnd();
                break;
            default:
                handled = false
        }
        if (handled) {
            e.stopPropagation();
            e.preventDefault()
        }
    },
    _scrollByLine: function(lines) {
        this.scrollBy({
            top: (lines.y || 0) * -SCROLL_LINE_HEIGHT,
            left: (lines.x || 0) * -SCROLL_LINE_HEIGHT
        })
    },
    _scrollByPage: function(page) {
        var prop = this._wheelProp();
        var dimension = this._dimensionByProp(prop);
        var distance = {};
        distance[prop] = page * -this._$container[dimension]();
        this.scrollBy(distance)
    },
    _dimensionByProp: function(prop) {
        return "left" === prop ? "width" : "height"
    },
    _getPropByDirection: function(direction) {
        return direction === HORIZONTAL ? "left" : "top"
    },
    _scrollToHome: function() {
        var prop = this._wheelProp();
        var distance = {};
        distance[prop] = 0;
        this._component.scrollTo(distance)
    },
    _scrollToEnd: function() {
        var prop = this._wheelProp();
        var dimension = this._dimensionByProp(prop);
        var distance = {};
        distance[prop] = this._$content[dimension]() - this._$container[dimension]();
        this._component.scrollTo(distance)
    },
    createActions: function() {
        this._startAction = this._createActionHandler("onStart");
        this._stopAction = this._createActionHandler("onStop");
        this._endAction = this._createActionHandler("onEnd");
        this._updateAction = this._createActionHandler("onUpdated");
        this._createScrollerActions()
    },
    _createScrollerActions: function() {
        this._scrollAction = this._createActionHandler("onScroll");
        this._bounceAction = this._createActionHandler("onBounce");
        this._eventHandler("createActions", {
            scroll: this._scrollAction,
            bounce: this._bounceAction
        })
    },
    _createActionHandler: function(optionName) {
        var _this5 = this,
            _arguments = arguments;
        var actionHandler = this._createActionByOption(optionName);
        return function() {
            actionHandler((0, _extend.extend)(_this5._createActionArgs(), _arguments))
        }
    },
    _createActionArgs: function() {
        var scrollerX = this._scrollers[HORIZONTAL];
        var scrollerY = this._scrollers[VERTICAL];
        var location = this.location();
        this._scrollOffset = {
            top: scrollerY && -location.top,
            left: scrollerX && -location.left
        };
        return {
            event: this._eventForUserAction,
            scrollOffset: this._scrollOffset,
            reachedLeft: scrollerX && scrollerX._reachedMax(),
            reachedRight: scrollerX && scrollerX._reachedMin(),
            reachedTop: scrollerY && scrollerY._reachedMax(),
            reachedBottom: scrollerY && scrollerY._reachedMin()
        }
    },
    _eventHandler: function(eventName) {
        var args = [].slice.call(arguments).slice(1);
        var deferreds = (0, _iterator.map)(this._scrollers, function(scroller) {
            return scroller["_" + eventName + "Handler"].apply(scroller, args)
        });
        return _deferred.when.apply(_renderer2.default, deferreds).promise()
    },
    location: function location() {
        var location = _translator2.default.locate(this._$content);
        location.top -= this._$container.scrollTop();
        location.left -= this._$container.scrollLeft();
        return location
    },
    disabledChanged: function() {
        this._attachCursorHandlers()
    },
    _attachCursorHandlers: function() {
        _events_engine2.default.off(this._$element, "." + SCROLLABLE_SIMULATED_CURSOR);
        if (!this.option("disabled") && this._isHoverMode()) {
            _events_engine2.default.on(this._$element, (0, _utils.addNamespace)("mouseenter", SCROLLABLE_SIMULATED_CURSOR), this._cursorEnterHandler.bind(this));
            _events_engine2.default.on(this._$element, (0, _utils.addNamespace)("mouseleave", SCROLLABLE_SIMULATED_CURSOR), this._cursorLeaveHandler.bind(this))
        }
    },
    _isHoverMode: function() {
        return "onHover" === this.option("showScrollbar")
    },
    _cursorEnterHandler: function(e) {
        e = e || {};
        e.originalEvent = e.originalEvent || {};
        if (activeScrollable || e.originalEvent._hoverHandled) {
            return
        }
        if (hoveredScrollable) {
            hoveredScrollable._cursorLeaveHandler()
        }
        hoveredScrollable = this;
        this._eventHandler("cursorEnter");
        e.originalEvent._hoverHandled = true
    },
    _cursorLeaveHandler: function(e) {
        if (hoveredScrollable !== this || activeScrollable === hoveredScrollable) {
            return
        }
        this._eventHandler("cursorLeave");
        hoveredScrollable = null;
        this._refreshCursorState(e && e.relatedTarget)
    },
    _refreshCursorState: function(target) {
        if (!this._isHoverMode() && (!target || activeScrollable)) {
            return
        }
        var $target = (0, _renderer2.default)(target);
        var $scrollable = $target.closest("." + SCROLLABLE_SIMULATED_CLASS + ":not(.dx-state-disabled)");
        var targetScrollable = $scrollable.length && $scrollable.data(SCROLLABLE_STRATEGY);
        if (hoveredScrollable && hoveredScrollable !== targetScrollable) {
            hoveredScrollable._cursorLeaveHandler()
        }
        if (targetScrollable) {
            targetScrollable._cursorEnterHandler()
        }
    },
    update: function() {
        var _this6 = this;
        var result = this._eventHandler("update").done(this._updateAction);
        return (0, _deferred.when)(result, (0, _common.deferUpdate)(function() {
            var allowedDirections = _this6._allowedDirections();
            (0, _common.deferRender)(function() {
                var touchDirection = allowedDirections.vertical ? "pan-x" : "";
                touchDirection = allowedDirections.horizontal ? "pan-y" : touchDirection;
                touchDirection = allowedDirections.vertical && allowedDirections.horizontal ? "none" : touchDirection;
                _this6._$container.css("touchAction", touchDirection)
            });
            return (0, _deferred.when)().promise()
        }))
    },
    _allowedDirections: function() {
        var bounceEnabled = this.option("bounceEnabled");
        var verticalScroller = this._scrollers[VERTICAL];
        var horizontalScroller = this._scrollers[HORIZONTAL];
        return {
            vertical: verticalScroller && (verticalScroller._minOffset < 0 || bounceEnabled),
            horizontal: horizontalScroller && (horizontalScroller._minOffset < 0 || bounceEnabled)
        }
    },
    updateBounds: function() {
        this._scrollers[HORIZONTAL] && this._scrollers[HORIZONTAL]._updateBounds()
    },
    scrollBy: function(distance) {
        var verticalScroller = this._scrollers[VERTICAL];
        var horizontalScroller = this._scrollers[HORIZONTAL];
        if (verticalScroller) {
            distance.top = verticalScroller._boundLocation(distance.top + verticalScroller._location) - verticalScroller._location
        }
        if (horizontalScroller) {
            distance.left = horizontalScroller._boundLocation(distance.left + horizontalScroller._location) - horizontalScroller._location
        }
        this._prepareDirections(true);
        this._startAction();
        this._eventHandler("scrollBy", {
            x: distance.left,
            y: distance.top
        });
        this._endAction()
    },
    validate: function(e) {
        if (this.option("disabled")) {
            return false
        }
        if (this.option("bounceEnabled")) {
            return true
        }
        return (0, _utils.isDxMouseWheelEvent)(e) ? this._validateWheel(e) : this._validateMove(e)
    },
    _validateWheel: function(e) {
        var _this7 = this;
        var scroller = this._scrollers[this._wheelDirection(e)];
        var reachedMin = scroller._reachedMin();
        var reachedMax = scroller._reachedMax();
        var contentGreaterThanContainer = !reachedMin || !reachedMax;
        var locatedNotAtBound = !reachedMin && !reachedMax;
        var scrollFromMin = reachedMin && e.delta > 0;
        var scrollFromMax = reachedMax && e.delta < 0;
        var validated = contentGreaterThanContainer && (locatedNotAtBound || scrollFromMin || scrollFromMax);
        validated = validated || void 0 !== this._validateWheelTimer;
        if (validated) {
            clearTimeout(this._validateWheelTimer);
            this._validateWheelTimer = setTimeout(function() {
                _this7._validateWheelTimer = void 0
            }, VALIDATE_WHEEL_TIMEOUT)
        }
        return validated
    },
    _validateMove: function(e) {
        if (!this.option("scrollByContent") && !(0, _renderer2.default)(e.target).closest("." + SCROLLABLE_SCROLLBAR_CLASS).length) {
            return false
        }
        return this._allowedDirection()
    },
    getDirection: function(e) {
        return (0, _utils.isDxMouseWheelEvent)(e) ? this._wheelDirection(e) : this._allowedDirection()
    },
    _wheelProp: function() {
        return this._wheelDirection() === HORIZONTAL ? "left" : "top"
    },
    _wheelDirection: function(e) {
        switch (this.option("direction")) {
            case HORIZONTAL:
                return HORIZONTAL;
            case VERTICAL:
                return VERTICAL;
            default:
                return e && e.shiftKey ? HORIZONTAL : VERTICAL
        }
    },
    verticalOffset: function() {
        return 0
    },
    dispose: function() {
        this._resetActive();
        if (hoveredScrollable === this) {
            hoveredScrollable = null
        }
        this._eventHandler("dispose");
        this._detachEventHandlers();
        this._$element.removeClass(SCROLLABLE_SIMULATED_CLASS);
        this._eventForUserAction = null;
        clearTimeout(this._validateWheelTimer);
        clearTimeout(this._updateHandlerTimeout)
    },
    _detachEventHandlers: function() {
        _events_engine2.default.off(this._$element, "." + SCROLLABLE_SIMULATED_CURSOR);
        _events_engine2.default.off(this._$container, "." + SCROLLABLE_SIMULATED_KEYBOARD)
    }
});
exports.SimulatedStrategy = SimulatedStrategy;
exports.Scroller = Scroller;

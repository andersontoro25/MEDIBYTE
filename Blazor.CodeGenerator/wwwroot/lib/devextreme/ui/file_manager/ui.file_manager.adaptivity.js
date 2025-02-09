/**
 * DevExtreme (ui/file_manager/ui.file_manager.adaptivity.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) {
                descriptor.writable = true
            }
            Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) {
            defineProperties(Constructor.prototype, protoProps)
        }
        if (staticProps) {
            defineProperties(Constructor, staticProps)
        }
        return Constructor
    }
}();
var _get = function get(object, property, receiver) {
    if (null === object) {
        object = Function.prototype
    }
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);
        if (null === parent) {
            return
        } else {
            return get(parent, property, receiver)
        }
    } else {
        if ("value" in desc) {
            return desc.value
        } else {
            var getter = desc.get;
            if (void 0 === getter) {
                return
            }
            return getter.call(receiver)
        }
    }
};
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _ui3 = require("../drawer/ui.drawer");
var _ui4 = _interopRequireDefault(_ui3);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return call && ("object" === typeof call || "function" === typeof call) ? call : self
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass)
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
    }
}
var window = (0, _window.getWindow)();
var ADAPTIVE_STATE_SCREEN_WIDTH = 573;
var FileManagerAdaptivityControl = function(_Widget) {
    _inherits(FileManagerAdaptivityControl, _Widget);

    function FileManagerAdaptivityControl() {
        _classCallCheck(this, FileManagerAdaptivityControl);
        return _possibleConstructorReturn(this, (FileManagerAdaptivityControl.__proto__ || Object.getPrototypeOf(FileManagerAdaptivityControl)).apply(this, arguments))
    }
    _createClass(FileManagerAdaptivityControl, [{
        key: "_initMarkup",
        value: function() {
            _get(FileManagerAdaptivityControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerAdaptivityControl.prototype), "_initMarkup", this).call(this);
            this._initActions();
            this._isInAdaptiveState = false;
            var $drawer = (0, _renderer2.default)("<div>").appendTo(this.$element());
            var contentRenderer = this.option("contentTemplate");
            if ((0, _type.isFunction)(contentRenderer)) {
                contentRenderer($drawer)
            }
            this._drawer = this._createComponent($drawer, _ui4.default, {
                opened: true,
                template: this.option("drawerTemplate")
            })
        }
    }, {
        key: "_render",
        value: function() {
            _get(FileManagerAdaptivityControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerAdaptivityControl.prototype), "_render", this).call(this);
            this._checkAdaptiveState()
        }
    }, {
        key: "_dimensionChanged",
        value: function(dimension) {
            if (!dimension || "height" !== dimension) {
                this._checkAdaptiveState()
            }
        }
    }, {
        key: "_checkAdaptiveState",
        value: function() {
            var oldState = this._isInAdaptiveState;
            this._isInAdaptiveState = this._isSmallScreen();
            if (oldState !== this._isInAdaptiveState) {
                this.toggleDrawer(!this._isInAdaptiveState, true);
                this._raiseAdaptiveStateChanged(this._isInAdaptiveState)
            }
        }
    }, {
        key: "_isSmallScreen",
        value: function() {
            return (0, _renderer2.default)(window).width() <= ADAPTIVE_STATE_SCREEN_WIDTH
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onAdaptiveStateChanged: this._createActionByOption("onAdaptiveStateChanged")
            }
        }
    }, {
        key: "_raiseAdaptiveStateChanged",
        value: function(enabled) {
            this._actions.onAdaptiveStateChanged({
                enabled: enabled
            })
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerAdaptivityControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerAdaptivityControl.prototype), "_getDefaultOptions", this).call(this), {
                drawerTemplate: null,
                contentTemplate: null,
                onAdaptiveStateChanged: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "drawerTemplate":
                case "contentTemplate":
                    this.repaint();
                    break;
                case "onAdaptiveStateChanged":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerAdaptivityControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerAdaptivityControl.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "isInAdaptiveState",
        value: function() {
            return this._isInAdaptiveState
        }
    }, {
        key: "toggleDrawer",
        value: function(showing, skipAnimation) {
            this._drawer.option("animationEnabled", !skipAnimation);
            this._drawer.toggle(showing)
        }
    }]);
    return FileManagerAdaptivityControl
}(_ui2.default);
module.exports = FileManagerAdaptivityControl;

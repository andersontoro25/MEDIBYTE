/**
 * DevExtreme (ui/diagram/diagram.panel.js)
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
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _utils = require("../../events/utils");
var _utils2 = _interopRequireDefault(_utils);
var _pointer = require("../../events/pointer");
var _pointer2 = _interopRequireDefault(_pointer);

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
var POINTERUP_EVENT_NAME = _utils2.default.addNamespace(_pointer2.default.up, "dxDiagramPanel");
var PREVENT_REFOCUS_SELECTOR = ".dx-textbox";
var DiagramPanel = function(_Widget) {
    _inherits(DiagramPanel, _Widget);

    function DiagramPanel() {
        _classCallCheck(this, DiagramPanel);
        return _possibleConstructorReturn(this, (DiagramPanel.__proto__ || Object.getPrototypeOf(DiagramPanel)).apply(this, arguments))
    }
    _createClass(DiagramPanel, [{
        key: "_init",
        value: function() {
            _get(DiagramPanel.prototype.__proto__ || Object.getPrototypeOf(DiagramPanel.prototype), "_init", this).call(this);
            this._createOnPointerUpAction()
        }
    }, {
        key: "_render",
        value: function() {
            _get(DiagramPanel.prototype.__proto__ || Object.getPrototypeOf(DiagramPanel.prototype), "_render", this).call(this);
            this._attachPointerUpEvent()
        }
    }, {
        key: "_attachPointerUpEvent",
        value: function() {
            var _this2 = this;
            _events_engine2.default.off(this.$element(), POINTERUP_EVENT_NAME);
            _events_engine2.default.on(this.$element(), POINTERUP_EVENT_NAME, function(e) {
                if (!(0, _renderer2.default)(e.target).closest(PREVENT_REFOCUS_SELECTOR).length) {
                    _this2._onPointerUpAction()
                }
            })
        }
    }, {
        key: "_createOnPointerUpAction",
        value: function() {
            this._onPointerUpAction = this._createActionByOption("onPointerUp")
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "onPointerUp":
                    this._createOnPointerUpAction();
                    break;
                default:
                    _get(DiagramPanel.prototype.__proto__ || Object.getPrototypeOf(DiagramPanel.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return DiagramPanel
}(_ui2.default);
module.exports = DiagramPanel;

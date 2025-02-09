/**
 * DevExtreme (ui/context_menu/ui.menu_base.edit.strategy.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
    return typeof obj
} : function(obj) {
    return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
};
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
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _iterator = require("../../core/utils/iterator");
var _uiCollection_widgetEditStrategy = require("../collection/ui.collection_widget.edit.strategy.plain");
var _uiCollection_widgetEditStrategy2 = _interopRequireDefault(_uiCollection_widgetEditStrategy);

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
var MenuBaseEditStrategy = function(_PlainEditStrategy) {
    _inherits(MenuBaseEditStrategy, _PlainEditStrategy);

    function MenuBaseEditStrategy() {
        _classCallCheck(this, MenuBaseEditStrategy);
        return _possibleConstructorReturn(this, (MenuBaseEditStrategy.__proto__ || Object.getPrototypeOf(MenuBaseEditStrategy)).apply(this, arguments))
    }
    _createClass(MenuBaseEditStrategy, [{
        key: "_getPlainItems",
        value: function() {
            return (0, _iterator.map)(this._collectionWidget.option("items"), function getMenuItems(item) {
                return item.items ? [item].concat((0, _iterator.map)(item.items, getMenuItems)) : item
            })
        }
    }, {
        key: "_stringifyItem",
        value: function(item) {
            var _this2 = this;
            return JSON.stringify(item, function(key, value) {
                if ("template" === key) {
                    return _this2._getTemplateString(value)
                }
                return value
            })
        }
    }, {
        key: "_getTemplateString",
        value: function(template) {
            var result = void 0;
            if ("object" === ("undefined" === typeof template ? "undefined" : _typeof(template))) {
                result = (0, _renderer2.default)(template).text()
            } else {
                result = template.toString()
            }
            return result
        }
    }]);
    return MenuBaseEditStrategy
}(_uiCollection_widgetEditStrategy2.default);
module.exports = MenuBaseEditStrategy;

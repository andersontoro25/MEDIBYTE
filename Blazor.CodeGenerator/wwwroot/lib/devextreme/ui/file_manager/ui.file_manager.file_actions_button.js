/**
 * DevExtreme (ui/file_manager/ui.file_manager.file_actions_button.js)
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
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _button = require("../button");
var _button2 = _interopRequireDefault(_button);

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
var FILE_MANAGER_FILE_ACTIONS_BUTTON = "dx-filemanager-file-actions-button";
var FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED = "dx-filemanager-file-actions-button-activated";
var ACTIVE_STATE_CLASS = "dx-state-active";
var FileManagerFileActionsButton = function(_Widget) {
    _inherits(FileManagerFileActionsButton, _Widget);

    function FileManagerFileActionsButton() {
        _classCallCheck(this, FileManagerFileActionsButton);
        return _possibleConstructorReturn(this, (FileManagerFileActionsButton.__proto__ || Object.getPrototypeOf(FileManagerFileActionsButton)).apply(this, arguments))
    }
    _createClass(FileManagerFileActionsButton, [{
        key: "_initMarkup",
        value: function() {
            var _this2 = this;
            this._createClickAction();
            var $button = (0, _renderer2.default)("<div>");
            this.$element().append($button).addClass(FILE_MANAGER_FILE_ACTIONS_BUTTON);
            this._button = this._createComponent($button, _button2.default, {
                text: "&vellip;",
                stylingMode: "text",
                onClick: function(e) {
                    return _this2._raiseClick(e)
                },
                template: function() {
                    return (0, _renderer2.default)("<i>").html("&vellip;")
                }
            });
            _get(FileManagerFileActionsButton.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileActionsButton.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "_createClickAction",
        value: function() {
            this._clickAction = this._createActionByOption("onClick")
        }
    }, {
        key: "_raiseClick",
        value: function(e) {
            this._clickAction(e)
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerFileActionsButton.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileActionsButton.prototype), "_getDefaultOptions", this).call(this), {
                cssClass: "",
                onClick: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "cssClass":
                    this.repaint();
                    break;
                case "onClick":
                    this._createClickAction();
                    break;
                default:
                    _get(FileManagerFileActionsButton.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileActionsButton.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "setActive",
        value: function(active) {
            var _this3 = this;
            this.$element().toggleClass(FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED, active);
            setTimeout(function() {
                return _this3._button.$element().toggleClass(ACTIVE_STATE_CLASS, active)
            })
        }
    }]);
    return FileManagerFileActionsButton
}(_ui2.default);
module.exports = FileManagerFileActionsButton;

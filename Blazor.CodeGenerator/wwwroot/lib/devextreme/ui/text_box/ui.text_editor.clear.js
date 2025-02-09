/**
 * DevExtreme (ui/text_box/ui.text_editor.clear.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
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
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _button = require("./texteditor_button_collection/button");
var _button2 = _interopRequireDefault(_button);
var _utils = require("../../events/utils");
var _pointer = require("../../events/pointer");
var _click = require("../../events/click");

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
var STATE_INVISIBLE_CLASS = "dx-state-invisible";
var TEXTEDITOR_CLEAR_BUTTON_CLASS = "dx-clear-button-area";
var TEXTEDITOR_CLEAR_ICON_CLASS = "dx-icon-clear";
var TEXTEDITOR_ICON_CLASS = "dx-icon";
var TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS = "dx-show-clear-button";
var ClearButton = function(_TextEditorButton) {
    _inherits(ClearButton, _TextEditorButton);

    function ClearButton() {
        _classCallCheck(this, ClearButton);
        return _possibleConstructorReturn(this, (ClearButton.__proto__ || Object.getPrototypeOf(ClearButton)).apply(this, arguments))
    }
    _createClass(ClearButton, [{
        key: "_create",
        value: function() {
            var $element = (0, _renderer2.default)("<span>").addClass(TEXTEDITOR_CLEAR_BUTTON_CLASS).append((0, _renderer2.default)("<span>").addClass(TEXTEDITOR_ICON_CLASS).addClass(TEXTEDITOR_CLEAR_ICON_CLASS));
            this._addToContainer($element);
            this.update(true);
            return {
                instance: $element,
                $element: $element
            }
        }
    }, {
        key: "_isVisible",
        value: function() {
            var editor = this.editor;
            return editor._isClearButtonVisible()
        }
    }, {
        key: "_attachEvents",
        value: function(instance, $button) {
            var editor = this.editor;
            var editorName = editor.NAME;
            _events_engine2.default.on($button, (0, _utils.addNamespace)(_pointer.down, editorName), function(e) {
                "mouse" === e.pointerType && e.preventDefault()
            });
            _events_engine2.default.on($button, (0, _utils.addNamespace)(_click.name, editorName), function(e) {
                return editor._clearValueHandler(e)
            })
        }
    }, {
        key: "_legacyRender",
        value: function($editor, isVisible) {
            $editor.toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, isVisible)
        }
    }, {
        key: "update",
        value: function() {
            var rendered = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : false;
            !rendered && _get(ClearButton.prototype.__proto__ || Object.getPrototypeOf(ClearButton.prototype), "update", this).call(this);
            var editor = this.editor,
                instance = this.instance;
            var $editor = editor.$element();
            var isVisible = this._isVisible();
            instance && instance.toggleClass(STATE_INVISIBLE_CLASS, !isVisible);
            this._legacyRender($editor, isVisible)
        }
    }]);
    return ClearButton
}(_button2.default);
exports.default = ClearButton;

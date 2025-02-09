/**
 * DevExtreme (ui/text_box/ui.text_editor.mask.strategy.android.js)
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
var _uiText_editorMaskStrategy = require("./ui.text_editor.mask.strategy.base");
var _uiText_editorMaskStrategy2 = _interopRequireDefault(_uiText_editorMaskStrategy);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i]
        }
        return arr2
    } else {
        return Array.from(arr)
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
var DELETE_INPUT_TYPE = "deleteContentBackward";
var AndroidMaskStrategy = function(_BaseMaskStrategy) {
    _inherits(AndroidMaskStrategy, _BaseMaskStrategy);

    function AndroidMaskStrategy() {
        _classCallCheck(this, AndroidMaskStrategy);
        return _possibleConstructorReturn(this, (AndroidMaskStrategy.__proto__ || Object.getPrototypeOf(AndroidMaskStrategy)).apply(this, arguments))
    }
    _createClass(AndroidMaskStrategy, [{
        key: "_getStrategyName",
        value: function() {
            return "android"
        }
    }, {
        key: "getHandleEventNames",
        value: function() {
            return [].concat(_toConsumableArray(_get(AndroidMaskStrategy.prototype.__proto__ || Object.getPrototypeOf(AndroidMaskStrategy.prototype), "getHandleEventNames", this).call(this)), ["beforeInput"])
        }
    }, {
        key: "_beforeInputHandler",
        value: function() {
            this._prevCaret = this.editorCaret()
        }
    }, {
        key: "_keyDownHandler",
        value: function() {
            this._keyPressHandled = false
        }
    }, {
        key: "_inputHandler",
        value: function(_ref) {
            var originalEvent = _ref.originalEvent;
            if (!originalEvent) {
                return
            }
            var inputType = originalEvent.inputType,
                data = originalEvent.data;
            var currentCaret = this.editorCaret();
            if (inputType === DELETE_INPUT_TYPE) {
                var length = this._prevCaret.end - this._prevCaret.start || 1;
                this.editor.setBackwardDirection();
                this._updateEditorMask({
                    start: currentCaret.start,
                    length: length,
                    text: this._getEmptyString(length)
                })
            } else {
                if (!currentCaret.end) {
                    return
                }
                this.editorCaret(currentCaret);
                var _length = this._prevCaret.end - this._prevCaret.start;
                var newData = data + (_length ? this._getEmptyString(_length - data.length) : "");
                this.editor.setForwardDirection();
                var hasValidChars = this._updateEditorMask({
                    start: this._prevCaret.start,
                    length: _length || newData.length,
                    text: newData
                });
                if (!hasValidChars) {
                    this.editorCaret(this._prevCaret)
                }
            }
        }
    }, {
        key: "_getEmptyString",
        value: function(length) {
            return Array(length + 1).join(" ")
        }
    }, {
        key: "_updateEditorMask",
        value: function(args) {
            var textLength = args.text.length;
            var updatedCharsCount = this.editor._handleChain(args);
            if (this.editor.isForwardDirection()) {
                var _editorCaret = this.editorCaret(),
                    start = _editorCaret.start,
                    end = _editorCaret.end;
                var correction = updatedCharsCount - textLength;
                if (start <= updatedCharsCount && updatedCharsCount > 1) {
                    this.editorCaret({
                        start: start + correction,
                        end: end + correction
                    })
                }
                this.editor.isForwardDirection() && this.editor._adjustCaret()
            }
            this.editor._displayMask();
            return !!updatedCharsCount
        }
    }]);
    return AndroidMaskStrategy
}(_uiText_editorMaskStrategy2.default);
exports.default = AndroidMaskStrategy;
